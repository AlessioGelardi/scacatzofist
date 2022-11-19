import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaynowReqsComponent } from './reqs.component';

describe('PlaynowReqsComponent', () => {
  let component: PlaynowReqsComponent;
  let fixture: ComponentFixture<PlaynowReqsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaynowReqsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaynowReqsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
