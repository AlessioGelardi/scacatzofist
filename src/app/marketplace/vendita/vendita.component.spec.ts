import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketPlaceVenditaComponent } from './vendita.component';

describe('MarketPlaceVenditaComponent', () => {
  let component: MarketPlaceVenditaComponent;
  let fixture: ComponentFixture<MarketPlaceVenditaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketPlaceVenditaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketPlaceVenditaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
