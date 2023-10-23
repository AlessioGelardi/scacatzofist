import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlberoNataleComponent } from './albero-natale.component';

describe('AlberoNataleComponent', () => {
  let component: AlberoNataleComponent;
  let fixture: ComponentFixture<AlberoNataleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlberoNataleComponent]
    });
    fixture = TestBed.createComponent(AlberoNataleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
