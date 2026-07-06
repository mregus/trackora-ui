import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicebusDeadlettersComponent } from './servicebus-deadletters.component';

describe('ServicebusDeadlettersComponent', () => {
  let component: ServicebusDeadlettersComponent;
  let fixture: ComponentFixture<ServicebusDeadlettersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicebusDeadlettersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ServicebusDeadlettersComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
