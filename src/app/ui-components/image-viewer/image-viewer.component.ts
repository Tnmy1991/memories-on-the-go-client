import { Component, Input, OnInit } from '@angular/core';
import { ImageObject } from '../../services';
import Viewer from 'viewerjs';

@Component({
  selector: 'app-image-viewer',
  standalone: true,
  imports: [],
  templateUrl: './image-viewer.component.html',
  styleUrl: './image-viewer.component.sass',
})
export class ImageViewerComponent {
  @Input() image!: ImageObject;

  openViewer(): void {
    const image = document.createElement('img');
    image.src = this.image?.original_image;
    const viewer = new Viewer(image, {
      inline: true,
      viewed() {
        viewer.zoomTo(1);
      },
    });
  }
}
