import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  signal,
  effect,
} from '@angular/core';
import {
  ReactiveFormsModule,
  ControlContainer,
  FormGroup,
} from '@angular/forms';
import { ImagesService } from '../../services';
import { catchError, forkJoin, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './image-uploader.component.html',
  styleUrl: './image-uploader.component.sass',
})
export class ImageUploaderComponent implements OnInit, OnDestroy {
  public isUploading = false;
  public formGroup!: FormGroup;
  public imageField = 'images';
  public imageQueue: {
    filename: string;
    status: 'PENDING' | 'SUCCESS' | 'ERROR';
  }[] = [];
  public acceptedTypes = 'image/jpg, image/jpeg, image/png';

  @ViewChild('fileUpload') fileUpload!: ElementRef;

  private _files: File[] = [];
  private _triggerCount = signal(0);
  private readonly unsubscribe$: Subject<void> = new Subject();

  constructor(
    private _imagesService: ImagesService,
    private _controlContainer: ControlContainer
  ) {
    effect(() => {
      const value = this._triggerCount();
      if (value > 0) {
        if (value === this.imageQueue.length) {
          setTimeout(() => {
            this.isUploading = false;
          }, 2000);
        }
      }
    });
  }

  ngOnInit(): void {
    this.formGroup = this._controlContainer.control as FormGroup;
  }

  onClick(): void {
    if (this.fileUpload) this.fileUpload.nativeElement.click();
  }

  async onFileSelected(event: any): Promise<void> {
    this._files = [];
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
      this._files.push(files[i]);
    }

    this.isUploading = true;
    this._files.map((file, index) => {
      this.imageQueue.push({
        filename: file.name,
        status: 'PENDING',
      });

      this._imagesService
        .getSignedUrl(file.name)
        .pipe(
          takeUntil(this.unsubscribe$),
          catchError((error) => {
            this.imageQueue[index] = {
              filename: file.name,
              status: 'ERROR',
            };

            throw error;
          })
        )
        .subscribe((response) => {
          if (response.isSuccess) {
            this._imagesService
              .putS3Object(response.upload_url, file)
              .subscribe(() => {
                this.imageQueue[index] = {
                  filename: file.name,
                  status: 'SUCCESS',
                };
                this._triggerCount.update((value) => value + 1);
              });
          }
        });
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
