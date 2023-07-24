import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeButtonsComponent } from './trade-buttons.component';

describe('TradeButtonsComponent', () => {
  let component: TradeButtonsComponent;
  let fixture: ComponentFixture<TradeButtonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TradeButtonsComponent]
    });
    fixture = TestBed.createComponent(TradeButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
