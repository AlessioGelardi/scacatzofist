import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoruseyeComponent } from './horuseye.component';

describe('HoruseyeComponent', () => {
  let component: HoruseyeComponent;
  let fixture: ComponentFixture<HoruseyeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HoruseyeComponent]
    });
    fixture = TestBed.createComponent(HoruseyeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
