import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckButtonsComponent } from './deck-buttons.component';

describe('DeckButtonsComponent', () => {
  let component: DeckButtonsComponent;
  let fixture: ComponentFixture<DeckButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeckButtonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeckButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
