import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckeditComponent } from './deckedit.component';

describe('DeckeditComponent', () => {
  let component: DeckeditComponent;
  let fixture: ComponentFixture<DeckeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeckeditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeckeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
