import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayNowButtonsComponent } from './play-now-buttons.component';

describe('PlayNowButtonsComponent', () => {
  let component: PlayNowButtonsComponent;
  let fixture: ComponentFixture<PlayNowButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayNowButtonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayNowButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
