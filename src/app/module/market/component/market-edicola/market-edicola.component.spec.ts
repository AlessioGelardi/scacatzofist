import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketEdicolaComponent } from './market-edicola.component';

describe('MarketEdicolaComponent', () => {
  let component: MarketEdicolaComponent;
  let fixture: ComponentFixture<MarketEdicolaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketEdicolaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketEdicolaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
