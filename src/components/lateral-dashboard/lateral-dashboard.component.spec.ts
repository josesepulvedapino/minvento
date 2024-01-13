import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LateralDashboardComponent } from './lateral-dashboard.component';

describe('LateralDashboardComponent', () => {
  let component: LateralDashboardComponent;
  let fixture: ComponentFixture<LateralDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LateralDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LateralDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
