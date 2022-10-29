import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketPlaceEdicolaComponent } from './edicola.component';

describe('MarketPlaceEdicolaComponent', () => {
  let component: MarketPlaceEdicolaComponent;
  let fixture: ComponentFixture<MarketPlaceEdicolaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketPlaceEdicolaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketPlaceEdicolaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
