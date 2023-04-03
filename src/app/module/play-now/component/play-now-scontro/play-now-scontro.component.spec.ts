import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayNowScontroComponent } from './play-now-scontro.component';

describe('PlayNowScontroComponent', () => {
  let component: PlayNowScontroComponent;
  let fixture: ComponentFixture<PlayNowScontroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayNowScontroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayNowScontroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
