import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentroFormComponent } from './centro-form.component';

describe('CentroFormComponent', () => {
  let component: CentroFormComponent;
  let fixture: ComponentFixture<CentroFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentroFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentroFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
