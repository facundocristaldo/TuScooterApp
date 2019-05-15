import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeipPage } from './changeip.page';

describe('ChangeipPage', () => {
  let component: ChangeipPage;
  let fixture: ComponentFixture<ChangeipPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeipPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeipPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
 