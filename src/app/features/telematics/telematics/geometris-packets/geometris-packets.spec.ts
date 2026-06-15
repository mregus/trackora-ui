import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeometrisPackets } from './geometris-packets';

describe('GeometrisPackets', () => {
  let component: GeometrisPackets;
  let fixture: ComponentFixture<GeometrisPackets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeometrisPackets],
    }).compileComponents();

    fixture = TestBed.createComponent(GeometrisPackets);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
