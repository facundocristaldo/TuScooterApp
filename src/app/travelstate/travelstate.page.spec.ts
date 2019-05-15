import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelstatePage } from './travelstate.page';

describe('TravelstatePage', () => {
  let component: TravelstatePage;
  let fixture: ComponentFixture<TravelstatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelstatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelstatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
 