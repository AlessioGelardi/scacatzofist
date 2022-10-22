import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckDetailComponent } from './detail.component';

describe('DetailComponent', () => {
  let component: DeckDetailComponent;
  let fixture: ComponentFixture<DeckDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeckDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeckDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});