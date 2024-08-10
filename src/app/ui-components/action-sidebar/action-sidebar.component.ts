import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthorizeService } from '../../services';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-action-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './action-sidebar.component.html',
  styleUrl: './action-sidebar.component.sass',
})
export class ActionSidebarComponent implements OnInit, OnDestroy {
  public displayname = '';
  private readonly unsubscribe$: Subject<void> = new Subject();

  constructor(private _authorizeService: AuthorizeService) {}

  ngOnInit(): void {
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
