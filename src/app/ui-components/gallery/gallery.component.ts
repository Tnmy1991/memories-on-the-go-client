import { Component, OnInit } from '@angular/core';
import { ImageObject, ImagesService } from '../../services';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { catchError, forkJoin, map, Subject, takeUntil } from 'rxjs';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [ImageViewerComponent, DialogBoxComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.sass',
})
export class GalleryComponent implements OnInit {
  nextImageIndex!: number;
  prevImageIndex!: number;
  viewerObject!: ImageObject;
  isImageViewerActive = false;
  imagesGroupArray: { create_year: string; images: ImageObject[] }[] = [];

  private _refreshTrigger = false;
  private _imagesArray: ImageObject[] = [];
  private readonly unsubscribe$: Subject<void> = new Subject();

  constructor(private _imageService: ImagesService) {}

  ngOnInit(): void {
    this._getAllUploadedImages();
    this._imageService.observeTrigger
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((trigger) => {
        this._refreshTrigger = trigger;
        if (trigger) this._getAllUploadedImages();
      });
  }

  imageViewer(targetImage: ImageObject) {
    if (this._imagesArray.length) {
      const targetindex = this._imagesArray.findIndex(
        (image) => image.image_id === targetImage.image_id
      );

      if (targetindex === 0) {
        this.nextImageIndex = targetindex + 1;
        this.prevImageIndex = -1;
      } else if (targetindex === this._imagesArray.length - 1) {
        this.nextImageIndex = -1;
        this.prevImageIndex = targetindex - 1;
      } else {
        this.nextImageIndex = targetindex + 1;
        this.prevImageIndex = targetindex - 1;
      }
      this.viewerObject = { ...targetImage };
      this.isImageViewerActive = true;
    }
  }

  switchImage(mode: 'PREV' | 'NEXT'): void {
    switch (mode) {
      case 'PREV':
        this.viewerObject = { ...this._imagesArray[this.prevImageIndex] };
        this.prevImageIndex =
          this.prevImageIndex === 0 ? -1 : this.prevImageIndex - 1;
        this.nextImageIndex = this.prevImageIndex + 2;
        break;

      case 'NEXT':
        this.viewerObject = { ...this._imagesArray[this.nextImageIndex] };
        this.nextImageIndex =
          this.nextImageIndex < this._imagesArray.length - 1
            ? this.nextImageIndex + 1
            : -1;
        this.prevImageIndex =
          this.nextImageIndex === -1
            ? this._imagesArray.length - 2
            : this.nextImageIndex - 2;
        break;
    }
  }

  closeViewer(): void {
    this.isImageViewerActive = false;
  }

  private _getAllUploadedImages(): void {
    this._imageService
      .getAllImages()
      .pipe(
        takeUntil(this.unsubscribe$),
        catchError((error) => {
          this._imagesArray = [];
          this.imagesGroupArray = [];

          throw error;
        })
      )
      .subscribe((images) => {
        this._getS3PresignedUrls(images);
      });
  }

  private _getS3PresignedUrls(images: ImageObject[]): void {
    if (this._refreshTrigger) {
      const temp = images.filter(
        ({ image_id: obj_1 }) =>
          !this._imagesArray.some(({ image_id: obj_2 }) => obj_1 === obj_2)
      );
      images = [...temp];
    }

    const allS3Requests = images.map((image) => {
      return this._imageService
        .getS3Object({
          s3_key: image.s3_key,
          s3_key_thumbnail: image.s3_key_thumbnail,
        })
        .pipe(
          map((s3PresignedUrls) => ({
            ...image,
            ...s3PresignedUrls,
          }))
        );
    });

    forkJoin(allS3Requests).subscribe((requestObservers) => {
      this._imagesArray = this._refreshTrigger
        ? [...this._imagesArray, ...requestObservers]
        : [...requestObservers];
      this._groupByCreatedYear();
      this._imageService.initiateTrigger(false);
    });
  }

  private _groupByCreatedYear(): void {
    const groupedByYear: {
      [x: string]: { create_year: string; images: ImageObject[] };
    } = {};
    for (const image of this._imagesArray) {
      const year = new Date(image.created_at).getFullYear().toString();
      if (!groupedByYear[year]) {
        groupedByYear[year] = {
          create_year: year,
          images: [image],
        };
      } else {
        groupedByYear[year].images.push(image);
      }
    }

    this.imagesGroupArray = Object.values(groupedByYear);
  }
}
