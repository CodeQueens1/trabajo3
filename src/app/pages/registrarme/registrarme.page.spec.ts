import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarmePage } from './registrarme.page';

describe('RegistrarmePage', () => {
  let component: RegistrarmePage;
  let fixture: ComponentFixture<RegistrarmePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarmePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
