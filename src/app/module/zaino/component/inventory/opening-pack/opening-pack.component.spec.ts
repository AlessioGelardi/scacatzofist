import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningPackComponent } from './opening-pack.component';

describe('OpeningPackComponent', () => {
  let component: OpeningPackComponent;
  let fixture: ComponentFixture<OpeningPackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpeningPackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpeningPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
