import { Component, OnInit } from '@angular/core';
import { ImageObject, ImagesService } from '../../services';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [ImageViewerComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.sass',
})
export class GalleryComponent implements OnInit {
  imageGroupArray: { create_year: string; images: ImageObject[] }[] = [];

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

        this.imageGroupArray = Object.values(groupedByColor);
      });
  }
}
