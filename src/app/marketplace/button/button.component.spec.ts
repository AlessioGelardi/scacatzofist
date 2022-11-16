import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceButtonComponent } from './button.component';

describe('MarketplaceButtonComponent', () => {
  let component: MarketplaceButtonComponent;
  let fixture: ComponentFixture<MarketplaceButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketplaceButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketplaceButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
