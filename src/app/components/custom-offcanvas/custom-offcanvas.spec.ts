import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomOffcanvas } from './custom-offcanvas';

describe('CustomOffcanvas', () => {
  let component: CustomOffcanvas;
  let fixture: ComponentFixture<CustomOffcanvas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomOffcanvas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomOffcanvas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
