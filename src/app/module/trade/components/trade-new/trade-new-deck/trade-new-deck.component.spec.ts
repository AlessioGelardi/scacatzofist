import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeNewDeckComponent } from './trade-new-deck.component';

describe('TradeNewDeckComponent', () => {
  let component: TradeNewDeckComponent;
  let fixture: ComponentFixture<TradeNewDeckComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TradeNewDeckComponent]
    });
    fixture = TestBed.createComponent(TradeNewDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
