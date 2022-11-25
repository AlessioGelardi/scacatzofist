import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaynowScontroComponent } from './scontro.component';

describe('PlaynowScontroComponent', () => {
  let component: PlaynowScontroComponent;
  let fixture: ComponentFixture<PlaynowScontroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaynowScontroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaynowScontroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
