import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetCopilotComponent } from './fleet-copilot.component';

describe('FleetCopilotComponent', () => {
  let component: FleetCopilotComponent;
  let fixture: ComponentFixture<FleetCopilotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FleetCopilotComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FleetCopilotComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
