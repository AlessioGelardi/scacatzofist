import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayNowPuntataComponent } from './play-now-puntata.component';

describe('PlayNowPuntataComponent', () => {
  let component: PlayNowPuntataComponent;
  let fixture: ComponentFixture<PlayNowPuntataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayNowPuntataComponent]
    });
    fixture = TestBed.createComponent(PlayNowPuntataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
