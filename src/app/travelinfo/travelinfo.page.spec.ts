import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelinfoPage } from './travelinfo.page';

describe('TravelinfoPage', () => {
  let component: TravelinfoPage;
  let fixture: ComponentFixture<TravelinfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelinfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelinfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
 