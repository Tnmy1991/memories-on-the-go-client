import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  ControlContainer,
  FormGroup,
} from '@angular/forms';
import { ImagesService } from '../../services';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './image-uploader.component.html',
  styleUrl: './image-uploader.component.sass',
})
export class ImageUploaderComponent implements OnInit {
  public formGroup!: FormGroup;
  public imageField = 'images';
  public acceptedTypes = 'image/jpg, image/jpeg, image/png';

  @ViewChild('fileUpload') fileUpload!: ElementRef;

  private _files: File[] = [];

  constructor(
    private _imagesService: ImagesService,
    private _controlContainer: ControlContainer
  ) {}

  ngOnInit(): void {
    this.formGroup = this._controlContainer.control as FormGroup;
  }

  onClick(): void {
    if (this.fileUpload) this.fileUpload.nativeElement.click();
  }

  onFileSelected(event: any): void {
    let filesName: string[] = [];
    const files = event.target.files;

    this._files = [];
    for (let i = 0; i < files.length; i++) {
      this._files.push(files[i]);
      filesName.push(files[i].name);
    }

    this._imagesService
      .getSignedUrl(filesName)
      .pipe()
      .subscribe((response) => {
        if (response.length) {
          response.forEach((data) => {
            const file = <File>(
              this._files.find((file) => file.name === data.filename)
            );
            this._imagesService.putS3Object(data.upload_url, file).subscribe();
          });
        }
      });
  }

  validate(file: File) {
    for (const f of this._files) {
      if (
        f.name === file.name &&
        f.lastModified === file.lastModified &&
        f.size === f.size &&
        f.type === f.type
      ) {
        return false;
      }
    }
    return true;
  }
}
