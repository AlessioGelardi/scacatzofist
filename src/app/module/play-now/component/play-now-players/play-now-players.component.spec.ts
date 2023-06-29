import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayNowPlayersComponent } from './play-now-players.component';

describe('PlayNowPlayersComponent', () => {
  let component: PlayNowPlayersComponent;
  let fixture: ComponentFixture<PlayNowPlayersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayNowPlayersComponent]
    });
    fixture = TestBed.createComponent(PlayNowPlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
