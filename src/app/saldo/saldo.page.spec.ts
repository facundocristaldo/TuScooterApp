import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldoPage } from './saldo.page';

describe('SaldoPage', () => {
  let component: SaldoPage;
  let fixture: ComponentFixture<SaldoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaldoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaldoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
 