import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { GeometrisPacketService } from '../../../../core/services/geometris-packet.service'
import { GeometrisRawPacket } from '../../../../shared/models/geometris-packet.models';

@Component({
  selector: 'app-geometris-packets',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './geometris-packets.html',
  styleUrl: './geometris-packets.css'
})
export class GeometrisPackets {
  private readonly geometrisPacketService = inject(GeometrisPacketService);

  packets = signal<GeometrisRawPacket[]>([]);
  failedOnly = signal(false);
  loading = signal(false);

  ngOnInit(): void {
    this.loadLatest();
  }

  loadLatest(): void {
    this.failedOnly.set(false);
    this.loading.set(true);

    this.geometrisPacketService.getLatestPackets().subscribe({
      next: packets => {
        this.packets.set(packets);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadFailed(): void {
    this.failedOnly.set(true);
    this.loading.set(true);

    this.geometrisPacketService.getFailedPackets().subscribe({
      next: packets => {
        this.packets.set(packets);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
