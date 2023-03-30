import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketButtonsComponent } from './market-buttons.component';

describe('MarketButtonComponent', () => {
  let component: MarketButtonsComponent;
  let fixture: ComponentFixture<MarketButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketButtonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
