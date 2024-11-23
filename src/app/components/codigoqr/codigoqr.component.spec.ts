import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CodigoqrComponent } from './codigoqr.component';

describe('CodigoqrComponent', () => {
  let component: CodigoqrComponent;
  let fixture: ComponentFixture<CodigoqrComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CodigoqrComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CodigoqrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
