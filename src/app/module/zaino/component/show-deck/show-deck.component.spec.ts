import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDeckComponent } from './show-deck.component';

describe('ShowDeckComponent', () => {
  let component: ShowDeckComponent;
  let fixture: ComponentFixture<ShowDeckComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowDeckComponent]
    });
    fixture = TestBed.createComponent(ShowDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
