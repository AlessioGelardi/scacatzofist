import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningpackComponent } from './openingpack.component';

describe('OpeningpackComponent', () => {
  let component: OpeningpackComponent;
  let fixture: ComponentFixture<OpeningpackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpeningpackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpeningpackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
