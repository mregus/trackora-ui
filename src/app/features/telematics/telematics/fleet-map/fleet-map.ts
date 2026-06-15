import {ActivatedRoute} from '@angular/router';
import { Subject, timer, takeUntil } from 'rxjs';

import {
  AfterViewInit,
  OnDestroy,
  Component,
  inject,
  signal
} from '@angular/core';

import * as L from 'leaflet';

import { TelematicsService } from '../../../../core/services/telematics.service';
import { FleetTelematicsLocation } from '../../../../shared/models/fleet-map.models';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'assets/leaflet/marker-icon-2x.png',
  iconUrl:
    'assets/leaflet/marker-icon.png',
  shadowUrl:
    'assets/leaflet/marker-shadow.png'
});

@Component({
  selector: 'app-fleet-map',
  standalone: true,
  templateUrl: './fleet-map.html',
  styleUrl: './fleet-map.css'
})
export class FleetMapComponent implements AfterViewInit {

  private readonly telematicsService = inject(TelematicsService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroy$ = new Subject<void>();
  private markersLayer = L.layerGroup();

  map!: L.Map;

  locations = signal<FleetTelematicsLocation[]>([]);

  fleetId = '';

  ngAfterViewInit(): void {
    this.initializeMap();

    const fleetId = this.route.snapshot.paramMap.get('fleetId');

    if (fleetId) {
      this.fleetId = fleetId;

      timer(0, 30000)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.loadFleet(this.fleetId));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadFleet(fleetId: string): void {
    this.fleetId = fleetId;

    this.telematicsService
      .getFleetLocations(fleetId)
      .subscribe(locations => {

        this.locations.set(locations);

        this.renderMarkers(locations);
      });
  }

  private initializeMap(): void {
    this.map = L.map('fleet-map').setView([28.5383, -81.3792], 8);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.map);

    this.markersLayer.addTo(this.map);
  }

  private renderMarkers(locations: FleetTelematicsLocation[]): void {
    this.markersLayer.clearLayers();

    locations.forEach(location => {
      L.marker(
        [location.latitude, location.longitude],
        { icon: this.createVehicleIcon(location) }
      )
        .bindPopup(`
        <strong>${location.label}</strong><br/>
        Plate: ${location.licensePlate ?? 'N/A'}<br/>
        Speed: ${location.speedMph ?? 0} mph<br/>
        Fuel: ${location.fuelLevelPercent ?? 0}%<br/>
        Last Seen: ${new Date(location.recordedAt).toLocaleString()}
      `)
        .addTo(this.markersLayer);
    });

    if (locations.length > 0) {
      const bounds = L.latLngBounds(
        locations.map(location => [location.latitude, location.longitude])
      );

      this.map.fitBounds(bounds, { padding: [40, 40] });
    }
  }

  private getMarkerColor(location: FleetTelematicsLocation): string {

    if (location.checkEngine) {
      return '#dc2626';
    }

    if ((location.fuelLevelPercent ?? 100) < 15) {
      return '#f59e0b';
    }

    if ((location.speedMph ?? 0) > 0) {
      return '#2563eb';
    }

    return '#64748b';
  }

  private createVehicleIcon(location: FleetTelematicsLocation): L.DivIcon {
    const color = this.getMarkerColor(location);
    const heading = location.headingDegrees ?? 0;

    return L.divIcon({
      className: 'vehicle-marker',
      html: `
      <span
        class="material-icons vehicle-icon"
        style="color:${color}; transform: rotate(${heading}deg);">
        navigation
      </span>
    `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -12]
    });
  }
}
