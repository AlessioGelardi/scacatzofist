import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaynowButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: PlaynowButtonComponent;
  let fixture: ComponentFixture<PlaynowButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaynowButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaynowButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
