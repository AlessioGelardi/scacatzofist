import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeNewComponent } from './trade-new.component';

describe('TradeNewComponent', () => {
  let component: TradeNewComponent;
  let fixture: ComponentFixture<TradeNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TradeNewComponent]
    });
    fixture = TestBed.createComponent(TradeNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
