import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedFieldComponent } from './extended-field.component';

describe('ExtendedFieldComponent', () => {
  let component: ExtendedFieldComponent;
  let fixture: ComponentFixture<ExtendedFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtendedFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtendedFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
