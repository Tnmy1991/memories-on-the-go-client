import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthorizeService, ImagesService } from '../../services';
import { Subject, takeUntil } from 'rxjs';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ImageUploaderComponent } from '../image-uploader/image-uploader.component';

@Component({
  selector: 'app-action-sidebar',
  standalone: true,
  imports: [ReactiveFormsModule, ImageUploaderComponent],
  templateUrl: './action-sidebar.component.html',
  styleUrl: './action-sidebar.component.sass',
})
export class ActionSidebarComponent implements OnInit, OnDestroy {
  public displayname = '';
  public uploaderForm!: FormGroup;

  private readonly unsubscribe$: Subject<void> = new Subject();

  constructor(private _authorizeService: AuthorizeService) {}

  ngOnInit(): void {
    this.uploaderForm = new FormGroup({
      images: new FormControl('', [Validators.required]),
    });
    this.displayname = this._authorizeService.getName();
  }

  logout(): void {
    this._authorizeService
      .logout()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        if (response) {
          location.reload();
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
