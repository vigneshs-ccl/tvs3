import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachFlag } from './coach-flag';

describe('CoachFlag', () => {
  let component: CoachFlag;
  let fixture: ComponentFixture<CoachFlag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachFlag]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachFlag);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
