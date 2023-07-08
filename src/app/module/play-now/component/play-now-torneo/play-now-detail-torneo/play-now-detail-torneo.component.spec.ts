import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayNowDetailTorneoComponent } from './play-now-detail-torneo.component';

describe('PlayNowDetailTorneoComponent', () => {
  let component: PlayNowDetailTorneoComponent;
  let fixture: ComponentFixture<PlayNowDetailTorneoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayNowDetailTorneoComponent]
    });
    fixture = TestBed.createComponent(PlayNowDetailTorneoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
