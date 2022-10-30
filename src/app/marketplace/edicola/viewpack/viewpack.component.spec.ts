import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketPlaceViewpackComponent } from './viewpack.component';

describe('MarketPlaceViewpackComponent', () => {
  let component: MarketPlaceViewpackComponent;
  let fixture: ComponentFixture<MarketPlaceViewpackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketPlaceViewpackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketPlaceViewpackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
