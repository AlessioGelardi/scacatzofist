import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayNowTorneoComponent } from './play-now-torneo.component';

describe('PlayNowTorneoComponent', () => {
  let component: PlayNowTorneoComponent;
  let fixture: ComponentFixture<PlayNowTorneoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayNowTorneoComponent]
    });
    fixture = TestBed.createComponent(PlayNowTorneoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
