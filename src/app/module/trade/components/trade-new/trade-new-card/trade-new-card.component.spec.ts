import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeNewCardComponent } from './trade-new-card.component';

describe('TradeNewCardComponent', () => {
  let component: TradeNewCardComponent;
  let fixture: ComponentFixture<TradeNewCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TradeNewCardComponent]
    });
    fixture = TestBed.createComponent(TradeNewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
