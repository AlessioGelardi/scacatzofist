import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketSkinComponent } from './market-skin.component';

describe('MarketSkinComponent', () => {
  let component: MarketSkinComponent;
  let fixture: ComponentFixture<MarketSkinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarketSkinComponent]
    });
    fixture = TestBed.createComponent(MarketSkinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
