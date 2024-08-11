import { Component, OnInit } from '@angular/core';
import { ImageObject, ImagesService } from '../../services';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { catchError } from 'rxjs';
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
  imagesArray: ImageObject[] = [];
  imagesGroupArray: { create_year: string; images: ImageObject[] }[] = [];

  constructor(private _imageService: ImagesService) {}

  ngOnInit(): void {
    this._imageService
      .getAllImages()
      .pipe(
        catchError((error) => {
          throw error;
        })
      )
      .subscribe((response) => {
        const groupedByColor: {
          [x: string]: { create_year: string; images: ImageObject[] };
        } = {};

        for (const image of response) {
          const year = new Date(image.created_at).getFullYear().toString();
          if (!groupedByColor[year]) {
            groupedByColor[year] = {
              create_year: year,
              images: [image],
            };
          } else {
            groupedByColor[year].images.push(image);
          }
        }
        this.imagesArray = [...response];
        this.imagesGroupArray = Object.values(groupedByColor);
      });
  }

  imageViewer(targetImage: ImageObject) {
    if (this.imagesArray.length) {
      const targetindex = this.imagesArray.findIndex(
        (image) => image.image_id === targetImage.image_id
      );

      if (targetindex === 0) {
        this.nextImageIndex = targetindex + 1;
        this.prevImageIndex = -1;
      } else if (targetindex === this.imagesArray.length - 1) {
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
        this.viewerObject = { ...this.imagesArray[this.prevImageIndex] };
        this.prevImageIndex =
          this.prevImageIndex === 0 ? -1 : this.prevImageIndex - 1;
        this.nextImageIndex = this.prevImageIndex + 2;
        break;

      case 'NEXT':
        this.viewerObject = { ...this.imagesArray[this.nextImageIndex] };
        this.nextImageIndex =
          this.nextImageIndex < this.imagesArray.length - 1
            ? this.nextImageIndex + 1
            : -1;
        this.prevImageIndex =
          this.nextImageIndex === -1
            ? this.imagesArray.length - 2
            : this.nextImageIndex - 2;
        break;
    }
  }

  closeViewer(): void {
    this.isImageViewerActive = false;
  }
}
