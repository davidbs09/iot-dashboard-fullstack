import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Device, DeviceType, DeviceStatus } from '../../models/device.model';
import { DeviceService } from '../../services/device.service';
import { DeviceFormComponent, DeviceFormData } from '../device-form/device-form.component';

/**
 * Componente responsável pela listagem de dispositivos IoT
 * Exibe tabela com todos os dispositivos e permite ações de CRUD
 */
@Component({
    selector: 'app-device-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatSnackBarModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTableModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        MatTooltipModule
    ],
    templateUrl: './device-list.component.html',
    styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit, OnDestroy {
    // Array com todos os dispositivos
    devices: Device[] = [];

    // Array com dispositivos filtrados para exibição
    filteredDevices: Device[] = [];

    // DataSource para a tabela
    dataSource = new MatTableDataSource<Device>([]);

    // Controle de loading
    isLoading = false;

    // Filtros aplicados
    selectedType: string = '';
    selectedStatus: string = '';
    searchTerm = '';

    // Enum para template - usando string para compatibilidade com backend
    deviceTypes = Object.values(DeviceType);
    deviceStatuses = Object.values(DeviceStatus);

    // Colunas da tabela
    displayedColumns: string[] = [
        'id',
        'name',
        'type',
        'status',
        'location',
        'isOnline',
        'lastCommunication',
        'actions'
    ];

    // Subject para destruição de subscriptions
    private destroy$ = new Subject<void>();

    // Output para notificar mudanças na lista
    @Output() deviceListChanged = new EventEmitter<void>();

    constructor(
        private deviceService: DeviceService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.loadDevices();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Carrega todos os dispositivos da API
     */
    loadDevices(): void {
        this.isLoading = true;

        this.deviceService.getAllDevices()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (devices) => {
                    this.devices = devices;
                    this.applyFilters();
                    this.isLoading = false;
                    this.deviceListChanged.emit(); // Notifica mudanças
                },
                error: (error) => {
                    console.error('Erro ao carregar dispositivos:', error);
                    this.showMessage('Erro ao carregar dispositivos');
                    this.isLoading = false;
                    // Fallback: carrega dados locais direto
                    this.loadFallbackData();
                }
            });
    }

    /**
     * Carrega dados de fallback em caso de falha
     */
    loadFallbackData(): void {
        this.devices = []; // Dados vazios por enquanto - esperando dados reais do backend
        this.applyFilters();
        this.deviceListChanged.emit();
    }

    /**
     * Aplica filtros na lista de dispositivos
     */
    applyFilters(): void {
        this.filteredDevices = this.devices.filter(device => {
            // Filtro por tipo
            const typeMatch = !this.selectedType || device.deviceType === this.selectedType;

            // Filtro por status
            const statusMatch = !this.selectedStatus || device.status === this.selectedStatus;

            // Filtro por termo de busca (nome ou localização)
            const searchMatch = !this.searchTerm ||
                device.deviceName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                device.location.toLowerCase().includes(this.searchTerm.toLowerCase());

            return typeMatch && statusMatch && searchMatch;
        });

        // Atualiza o dataSource da tabela
        this.dataSource.data = this.filteredDevices;
    }

    /**
     * Limpa todos os filtros
     */
    clearFilters(): void {
        this.selectedType = '';
        this.selectedStatus = '';
        this.searchTerm = '';
        this.applyFilters();
    }

    /**
     * Abre modal para criar novo dispositivo
     */
    openCreateDialog(): void {
        const dialogRef = this.dialog.open(DeviceFormComponent, {
            width: '800px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            disableClose: true,
            data: {
                isEdit: false
            } as DeviceFormData
        });

        dialogRef.afterClosed()
            .pipe(takeUntil(this.destroy$))
            .subscribe(result => {
                if (result) {
                    this.showMessage(`Dispositivo "${result.name}" criado com sucesso`);
                    this.loadDevices(); // Recarrega a lista
                }
            });
    }

    /**
     * Abre modal para editar dispositivo
     */
    openEditDialog(device: Device): void {
        const dialogRef = this.dialog.open(DeviceFormComponent, {
            width: '800px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            disableClose: true,
            data: {
                device: device,
                isEdit: true
            } as DeviceFormData
        });

        dialogRef.afterClosed()
            .pipe(takeUntil(this.destroy$))
            .subscribe(result => {
                if (result) {
                    this.showMessage(`Dispositivo "${result.name}" atualizado com sucesso`);
                    this.loadDevices(); // Recarrega a lista
                }
            });
    }

    /**
     * Confirma e deleta um dispositivo
     */
    deleteDevice(device: Device): void {
        const confirmMessage = `Tem certeza que deseja excluir o dispositivo "${device.deviceName}"?`;

        if (confirm(confirmMessage)) {
            this.deviceService.deleteDevice(device.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: () => {
                        this.showMessage(`Dispositivo "${device.deviceName}" excluído com sucesso`);
                        this.loadDevices(); // Recarrega a lista
                    },
                    error: (error) => {
                        console.error('Erro ao excluir dispositivo:', error);
                        this.showMessage('Erro ao excluir dispositivo');
                    }
                });
        }
    }

    /**
     * Formata a data para exibição
     */
    formatDate(date: Date): string {
        return new Date(date).toLocaleString('pt-BR');
    }

    /**
     * Retorna classe CSS baseada no status
     */
    getStatusClass(status: string): string {
        const statusClasses: { [key: string]: string } = {
            'ACTIVE': 'status-active',
            'INACTIVE': 'status-inactive',
            'MAINTENANCE': 'status-maintenance',
            'ERROR': 'status-error',
            'OFFLINE': 'status-offline',
            'CONFIGURING': 'status-configuring'
        };

        return statusClasses[status] || 'status-unknown';
    }

    /**
     * Retorna classe CSS baseada no status online
     */
    getOnlineClass(isOnline: boolean): string {
        return isOnline ? 'online' : 'offline';
    }

    /**
     * Exibe mensagem para o usuário
     */
    private showMessage(message: string): void {
        this.snackBar.open(message, 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
        });
    }
}
