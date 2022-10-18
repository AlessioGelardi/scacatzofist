import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckEditComponent } from './edit.component';

describe('EditComponent', () => {
  let component: DeckEditComponent;
  let fixture: ComponentFixture<DeckEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeckEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeckEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
