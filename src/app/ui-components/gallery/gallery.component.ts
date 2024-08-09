import { Component } from '@angular/core';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [ImageViewerComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.sass',
})
export class GalleryComponent {}
