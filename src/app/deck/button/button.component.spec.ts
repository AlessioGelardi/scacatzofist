import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: DeckButtonComponent;
  let fixture: ComponentFixture<DeckButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeckButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeckButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
