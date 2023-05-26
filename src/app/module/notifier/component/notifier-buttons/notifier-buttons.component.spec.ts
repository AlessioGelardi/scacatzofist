import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifierButtonsComponent } from './notifier-buttons.component';

describe('NotifierButtonsComponent', () => {
  let component: NotifierButtonsComponent;
  let fixture: ComponentFixture<NotifierButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotifierButtonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotifierButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
