import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetsComponent } from './fleets.component';

describe('FleetsComponent', () => {
  let component: FleetsComponent;
  let fixture: ComponentFixture<FleetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FleetsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FleetsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
