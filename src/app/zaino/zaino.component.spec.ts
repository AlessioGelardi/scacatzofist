import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZainoComponent } from './zaino.component';

describe('ZainoComponent', () => {
  let component: ZainoComponent;
  let fixture: ComponentFixture<ZainoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZainoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZainoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
