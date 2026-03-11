import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { DeviceListComponent } from '../../components/device-list/device-list.component';
import { Device } from '../../models/device.model';
import { DeviceService } from '../../services/device.service';
import { Subject, takeUntil } from 'rxjs';

/**
 * Página principal de gerenciamento de dispositivos IoT
 * Contém o componente de listagem e coordena as ações
 */
@Component({
  selector: 'app-devices-page',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatChipsModule,
    DeviceListComponent
  ],
  templateUrl: './devices-page.component.html',
  styleUrls: ['./devices-page.component.scss']
})
export class DevicesPageComponent implements OnInit, OnDestroy {
  
  // Estatísticas dos dispositivos
  totalDevices = 0;
  onlineDevices = 0;
  offlineDevices = 0;
  
  // Loading state
  isLoadingStats = true;
  
  // Subject para destruição de subscriptions
  private destroy$ = new Subject<void>();

  constructor(private deviceService: DeviceService) {}

  ngOnInit(): void {
    this.loadDeviceStats();
    // Recarrega as estatísticas a cada 30 segundos
    setInterval(() => {
      this.loadDeviceStats();
    }, 30000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carrega as estatísticas dos dispositivos
   */
  loadDeviceStats(): void {
    this.isLoadingStats = true;
    
    this.deviceService.getAllDevices()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (devices: Device[]) => {
          this.totalDevices = devices.length;
          this.onlineDevices = devices.filter(device => device.isActive).length;
          this.offlineDevices = devices.filter(device => !device.isActive).length;
          this.isLoadingStats = false;
        },
        error: (error) => {
          console.error('Erro ao carregar estatísticas:', error);
          this.isLoadingStats = false;
        }
      });
  }

  /**
   * Método para atualizar estatísticas quando a lista for modificada
   */
  onDeviceListChanged(): void {
    this.loadDeviceStats();
  }
}
