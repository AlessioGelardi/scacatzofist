import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketSellComponent } from './market-sell.component';

describe('MarketSellComponent', () => {
  let component: MarketSellComponent;
  let fixture: ComponentFixture<MarketSellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketSellComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
