import { Component, Input, OnInit } from '@angular/core';
import { ImageObject } from '../../services';

@Component({
  selector: 'app-image-viewer',
  standalone: true,
  imports: [],
  templateUrl: './image-viewer.component.html',
  styleUrl: './image-viewer.component.sass',
})
export class ImageViewerComponent {
  @Input() image!: ImageObject;
}
