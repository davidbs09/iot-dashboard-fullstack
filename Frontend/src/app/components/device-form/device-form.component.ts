import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Device, DeviceCreateDTO, DeviceUpdateDTO, DeviceType, DeviceStatus } from '../../models/device.model';
import { DeviceService } from '../../services/device.service';

/**
 * Interface para dados passados para o modal
 */
export interface DeviceFormData {
    device?: Device; // Se fornecido, está editando. Se não, está criando
    isEdit: boolean;
}

/**
 * Componente de formulário para criar e editar dispositivos IoT
 * Pode ser usado tanto para criação quanto para edição
 */
@Component({
    selector: 'app-device-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './device-form.component.html',
    styleUrls: ['./device-form.component.scss']
})
export class DeviceFormComponent implements OnInit {
    // Formulário reativo
    deviceForm: FormGroup;

    // Controle de loading
    isLoading = false;

    // Enums para o template
    deviceTypes = Object.values(DeviceType);
    deviceStatuses = Object.values(DeviceStatus);

    // Flags de controle
    isEditMode: boolean;
    modalTitle: string;
    submitButtonText: string;

    constructor(
        private fb: FormBuilder,
        private deviceService: DeviceService,
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<DeviceFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DeviceFormData
    ) {
        this.isEditMode = data?.isEdit || false;
        this.modalTitle = this.isEditMode ? 'Editar Dispositivo' : 'Novo Dispositivo';
        this.submitButtonText = this.isEditMode ? 'Atualizar' : 'Criar';

        // Inicializa o formulário
        this.deviceForm = this.createForm();
    }

    ngOnInit(): void {
        // Se está editando, preenche o formulário com os dados existentes
        if (this.isEditMode && this.data.device) {
            this.populateForm(this.data.device);
        }
    }

    /**
     * Cria o formulário reativo com validações
     */
    private createForm(): FormGroup {
        return this.fb.group({
            deviceName: ['', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(100)
            ]],
            deviceType: ['', Validators.required],
            status: ['ACTIVE'], // Status padrão para novos dispositivos
            location: ['', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(200)
            ]],
            deviceIdentifier: ['', [
                Validators.required,
                Validators.pattern(/^[A-Z0-9-]+$/) // Formato de serial number
            ]],
            description: ['', [
                Validators.maxLength(500)
            ]],
            latitude: [null, [
                Validators.min(-90),
                Validators.max(90)
            ]],
            longitude: [null, [
                Validators.min(-180),
                Validators.max(180)
            ]],
            isActive: [true], // Campo para ativar/desativar dispositivo
            lastReading: [''] // Campo para última leitura (opcional)
        });
    }

    /**
     * Preenche o formulário com dados do dispositivo para edição
     */
    private populateForm(device: Device): void {
        this.deviceForm.patchValue({
            deviceName: device.deviceName,
            deviceType: device.deviceType,
            status: device.status,
            location: device.location,
            deviceIdentifier: device.deviceIdentifier,
            description: device.description,
            latitude: device.latitude,
            longitude: device.longitude,
            isActive: device.isActive,
            lastReading: device.lastReading || ''
        });
    }

    /**
     * Submete o formulário
     */
    onSubmit(): void {
        if (this.deviceForm.valid) {
            this.isLoading = true;

            if (this.isEditMode) {
                this.updateDevice();
            } else {
                this.createDevice();
            }
        } else {
            this.markFormGroupTouched();
            this.showMessage('Por favor, corrija os erros no formulário');
        }
    }

    /**
     * Cria um novo dispositivo
     */
    private createDevice(): void {
        const deviceData: DeviceCreateDTO = this.deviceForm.value;

        this.deviceService.createDevice(deviceData).subscribe({
            next: (createdDevice) => {
                this.showMessage('Dispositivo criado com sucesso!');
                this.dialogRef.close(createdDevice); // Retorna o dispositivo criado
            },
            error: (error) => {
                console.error('Erro ao criar dispositivo:', error);
                this.showMessage('Erro ao criar dispositivo. Tente novamente.');
                this.isLoading = false;
            }
        });
    }

    /**
     * Atualiza um dispositivo existente
     */
    private updateDevice(): void {
        const deviceData: DeviceUpdateDTO = this.deviceForm.value;

        this.deviceService.updateDevice(this.data.device!.id, deviceData).subscribe({
            next: (updatedDevice) => {
                this.showMessage('Dispositivo atualizado com sucesso!');
                this.dialogRef.close(updatedDevice); // Retorna o dispositivo atualizado
            },
            error: (error) => {
                console.error('Erro ao atualizar dispositivo:', error);
                this.showMessage('Erro ao atualizar dispositivo. Tente novamente.');
                this.isLoading = false;
            }
        });
    }

    /**
     * Cancela a operação e fecha o modal
     */
    onCancel(): void {
        this.dialogRef.close();
    }

    /**
     * Marca todos os campos como tocados para exibir validações
     */
    private markFormGroupTouched(): void {
        Object.keys(this.deviceForm.controls).forEach(key => {
            const control = this.deviceForm.get(key);
            control?.markAsTouched();
        });
    }

    /**
     * Verifica se um campo tem erro
     */
    hasError(fieldName: string, errorType: string): boolean {
        const field = this.deviceForm.get(fieldName);
        return field ? field.hasError(errorType) && field.touched : false;
    }

    /**
     * Retorna a mensagem de erro para um campo
     */
    getErrorMessage(fieldName: string): string {
        const field = this.deviceForm.get(fieldName);

        if (!field || !field.errors || !field.touched) {
            return '';
        }

        const errors = field.errors;

        // Mensagens de erro personalizadas por campo
        const errorMessages: { [key: string]: { [key: string]: string } } = {
            deviceName: {
                required: 'Nome do dispositivo é obrigatório',
                minlength: 'Nome deve ter pelo menos 3 caracteres',
                maxlength: 'Nome não pode ter mais que 100 caracteres'
            },
            deviceType: {
                required: 'Tipo do dispositivo é obrigatório'
            },
            location: {
                required: 'Localização é obrigatória',
                minlength: 'Localização deve ter pelo menos 3 caracteres',
                maxlength: 'Localização não pode ter mais que 200 caracteres'
            },
            deviceIdentifier: {
                required: 'Identificador do dispositivo é obrigatório',
                pattern: 'Formato inválido. Use apenas letras maiúsculas, números e hífens'
            },
            description: {
                maxlength: 'Descrição não pode ter mais que 500 caracteres'
            }
        };

        // Retorna a primeira mensagem de erro encontrada
        for (const errorType in errors) {
            if (errorMessages[fieldName] && errorMessages[fieldName][errorType]) {
                return errorMessages[fieldName][errorType];
            }
        }

        return 'Campo inválido';
    }

    /**
     * Gera um identificador automaticamente
     */
    generateSerialNumber(): void {
        const prefix = 'IOT';
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.random().toString(36).substring(2, 5).toUpperCase();
        const identifier = `${prefix}-${timestamp}-${random}`;

        this.deviceForm.patchValue({ deviceIdentifier: identifier });
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

    /**
     * Formata a data para exibição
     */
    formatDate(date: Date | string): string {
        if (!date) return 'N/A';
        return new Date(date).toLocaleString('pt-BR');
    }

    /**
     * Retorna o display amigável para o tipo de dispositivo
     */
    getDeviceTypeDisplay(type: string): string {
        const typeMap: { [key: string]: string } = {
            'TEMPERATURE_SENSOR': 'Sensor de Temperatura',
            'HUMIDITY_SENSOR': 'Sensor de Umidade', 
            'PRESSURE_SENSOR': 'Sensor de Pressão',
            'VIBRATION_SENSOR': 'Sensor de Vibração',
            'GPS_TRACKER': 'Rastreador GPS',
            'CAMERA': 'Câmera',
            'GENERIC': 'Genérico',
            'ACTUATOR': 'Atuador',
            'GATEWAY': 'Gateway',
            'OXYGEN_METER': 'Medidor de Oxigênio'
        };
        return typeMap[type] || type;
    }

    /**
     * Retorna o display amigável para o status
     */
    getStatusDisplay(status: string): string {
        const statusMap: { [key: string]: string } = {
            'ACTIVE': 'Ativo',
            'INACTIVE': 'Inativo',
            'MAINTENANCE': 'Manutenção',
            'ERROR': 'Erro',
            'OFFLINE': 'Offline',
            'CONFIGURING': 'Configurando'
        };
        return statusMap[status] || status;
    }

    /**
     * Retorna o ícone para o status
     */
    getStatusIcon(status: string): string {
        const iconMap: { [key: string]: string } = {
            'ACTIVE': 'check_circle',
            'INACTIVE': 'pause_circle',
            'MAINTENANCE': 'build',
            'ERROR': 'error',
            'OFFLINE': 'wifi_off',
            'CONFIGURING': 'settings'
        };
        return iconMap[status] || 'help';
    }
}
