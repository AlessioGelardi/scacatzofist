import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayNowTrainingComponent } from './play-now-training.component';

describe('PlayNowTrainingComponent', () => {
  let component: PlayNowTrainingComponent;
  let fixture: ComponentFixture<PlayNowTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayNowTrainingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayNowTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
