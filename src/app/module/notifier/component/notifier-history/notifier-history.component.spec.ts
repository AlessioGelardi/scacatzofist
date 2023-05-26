import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifierHistoryComponent } from './notifier-history.component';

describe('NotifierHistoryComponent', () => {
  let component: NotifierHistoryComponent;
  let fixture: ComponentFixture<NotifierHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotifierHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotifierHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
