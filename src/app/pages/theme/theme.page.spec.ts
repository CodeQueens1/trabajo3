import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemePage } from './theme.page';

describe('ThemeExamplePage', () => {
  let component: ThemePage;
  let fixture: ComponentFixture<ThemePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
