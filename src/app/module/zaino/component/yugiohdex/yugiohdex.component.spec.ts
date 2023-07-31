import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YugiohdexComponent } from './yugiohdex.component';

describe('YugiohdexComponent', () => {
  let component: YugiohdexComponent;
  let fixture: ComponentFixture<YugiohdexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [YugiohdexComponent]
    });
    fixture = TestBed.createComponent(YugiohdexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
