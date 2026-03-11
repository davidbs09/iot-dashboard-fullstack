import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Device, DeviceCreateDTO, DeviceUpdateDTO } from '../models/device.model';
import { 
    DashboardStats, 
    StatusDistribution, 
    TypeDistribution, 
    ConnectivityStats, 
    DeviceAlert 
} from '../models/dashboard.model';

/**
 * Serviço responsável pela comunicação com a API de dispositivos IoT
 * Implementa todas as operações CRUD necessárias + Endpoints de Dashboard (Fase 2)
 */
@Injectable({
    providedIn: 'root'
})
export class DeviceService {
    // URLs da API - configurar conforme o ambiente
    private readonly apiUrl = 'http://localhost:8080/api/devices';
    private readonly dashboardApiUrl = 'http://localhost:8080/api/dashboard';

    constructor(private http: HttpClient) { }

    // ========================================
    // MÉTODOS DA FASE 1 - CRUD BÁSICO
    // ========================================

    /**
     * Busca todos os dispositivos
     * @returns Observable com array de dispositivos
     */
    getAllDevices(): Observable<Device[]> {
        return this.http.get<Device[]>(this.apiUrl).pipe(
            catchError((error) => {
                console.error('Erro ao buscar dispositivos:', error);
                // Retorna array vazio se o backend não estiver disponível
                return of([]);
            })
        );
    }

    /**
     * Busca um dispositivo por ID
     * @param id ID do dispositivo
     * @returns Observable com o dispositivo encontrado
     */
    getDeviceById(id: number): Observable<Device> {
        return this.http.get<Device>(`${this.apiUrl}/${id}`).pipe(
            catchError((error) => {
                console.error('Erro ao buscar dispositivo:', error);
                throw error;
            })
        );
    }

    /**
     * Cria um novo dispositivo
     * @param device Dados do dispositivo para criação
     * @returns Observable com o dispositivo criado
     */
    createDevice(device: DeviceCreateDTO): Observable<Device> {
        return this.http.post<Device>(this.apiUrl, device).pipe(
            catchError((error) => {
                console.error('Erro ao criar dispositivo:', error);
                throw error;
            })
        );
    }

    /**
     * Atualiza um dispositivo existente
     * @param id ID do dispositivo a ser atualizado
     * @param device Dados atualizados do dispositivo
     * @returns Observable com o dispositivo atualizado
     */
    updateDevice(id: number, device: DeviceUpdateDTO): Observable<Device> {
        return this.http.put<Device>(`${this.apiUrl}/${id}`, device).pipe(
            catchError((error) => {
                console.error('Erro ao atualizar dispositivo:', error);
                throw error;
            })
        );
    }

    /**
     * Remove um dispositivo do sistema
     * @param id ID do dispositivo a ser removido
     * @returns Observable da operação de remoção
     */
    deleteDevice(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            catchError((error) => {
                console.error('Erro ao deletar dispositivo:', error);
                throw error;
            })
        );
    }

    /**
     * Busca dispositivos por tipo
     * @param type Tipo do dispositivo (SENSOR, ACTUATOR, etc.)
     * @returns Observable com dispositivos filtrados
     */
    getDevicesByType(type: string): Observable<Device[]> {
        return this.http.get<Device[]>(`${this.apiUrl}/type/${type}`).pipe(
            catchError((error) => {
                console.error('Erro ao buscar dispositivos por tipo:', error);
                return of([]);
            })
        );
    }

    /**
     * Busca dispositivos por status
     * @param status Status do dispositivo (ONLINE, OFFLINE, etc.)
     * @returns Observable com dispositivos filtrados
     */
    getDevicesByStatus(status: string): Observable<Device[]> {
        return this.http.get<Device[]>(`${this.apiUrl}/status/${status}`).pipe(
            catchError((error) => {
                console.error('Erro ao buscar dispositivos por status:', error);
                return of([]);
            })
        );
    }

    /**
     * Busca apenas dispositivos online
     * @returns Observable com dispositivos online
     */
    getOnlineDevices(): Observable<Device[]> {
        return this.http.get<Device[]>(`${this.apiUrl}/online`).pipe(
            catchError((error) => {
                console.error('Erro ao buscar dispositivos online:', error);
                return of([]);
            })
        );
    }

    /**
     * Busca apenas dispositivos offline
     * @returns Observable com dispositivos offline
     */
    getOfflineDevices(): Observable<Device[]> {
        return this.http.get<Device[]>(`${this.apiUrl}/offline`).pipe(
            catchError((error) => {
                console.error('Erro ao buscar dispositivos offline:', error);
                return of([]);
            })
        );
    }

    // ========================================
    // MÉTODOS DA FASE 2 - DASHBOARD
    // ========================================

    /**
     * Busca estatísticas gerais do dashboard
     * @returns Observable com métricas principais do sistema
     */
    getDashboardStats(): Observable<DashboardStats> {
        return this.http.get<DashboardStats>(`${this.dashboardApiUrl}/stats/general`).pipe(
            catchError((error) => {
                console.error('Erro ao buscar estatísticas do dashboard:', error);
                // Retorna dados mock em caso de erro para demonstração
                return of(this.getMockDashboardStats());
            })
        );
    }

    /**
     * Busca distribuição de dispositivos por status
     * @returns Observable com distribuição para gráficos
     */
    getStatusDistribution(): Observable<StatusDistribution[]> {
        return this.http.get<StatusDistribution[]>(`${this.dashboardApiUrl}/stats/by-status`).pipe(
            catchError((error) => {
                console.error('Erro ao buscar distribuição por status:', error);
                return of(this.getMockStatusDistribution());
            })
        );
    }

    /**
     * Busca distribuição de dispositivos por tipo
     * @returns Observable com distribuição para análises
     */
    getTypeDistribution(): Observable<TypeDistribution[]> {
        return this.http.get<TypeDistribution[]>(`${this.dashboardApiUrl}/stats/by-type`).pipe(
            catchError((error) => {
                console.error('Erro ao buscar distribuição por tipo:', error);
                return of(this.getMockTypeDistribution());
            })
        );
    }

    /**
     * Busca estatísticas de conectividade IoT
     * @returns Observable com métricas de comunicação
     */
    getConnectivityStats(): Observable<ConnectivityStats> {
        return this.http.get<ConnectivityStats>(`${this.dashboardApiUrl}/stats/connectivity`).pipe(
            catchError((error) => {
                console.error('Erro ao buscar estatísticas de conectividade:', error);
                return of(this.getMockConnectivityStats());
            })
        );
    }

    /**
     * Busca alertas ativos do sistema
     * @returns Observable com lista de alertas prioritários
     */
    getActiveAlerts(): Observable<DeviceAlert[]> {
        return this.http.get<DeviceAlert[]>(`${this.dashboardApiUrl}/alerts`).pipe(
            catchError((error) => {
                console.error('Erro ao buscar alertas:', error);
                return of(this.getMockAlerts());
            })
        );
    }

    // ========================================
    // MÉTODOS MOCK PARA DESENVOLVIMENTO
    // ========================================

    /**
     * Dados mock para demonstração quando backend não estiver disponível
     * Simula as estatísticas gerais do dashboard
     */
    private getMockDashboardStats(): DashboardStats {
        return {
            totalDevices: 45,
            onlineDevices: 38,
            offlineDevices: 7,
            maintenanceDevices: 2,
            errorDevices: 3,
            onlinePercentage: 84.4,
            offlinePercentage: 15.6,
            errorPercentage: 6.7,
            uptimePercentage: 84.4,
            systemStatus: 'HEALTHY',
            lastUpdate: new Date().toISOString()
        };
    }

    /**
     * Mock para distribuição por status
     */
    private getMockStatusDistribution(): StatusDistribution[] {
        return [
            { status: 'ONLINE', count: 38, percentage: 84.4, description: 'Dispositivos conectados e funcionais' },
            { status: 'OFFLINE', count: 5, percentage: 11.1, description: 'Dispositivos sem comunicação' },
            { status: 'ERROR', count: 2, percentage: 4.5, description: 'Dispositivos com falhas detectadas' }
        ];
    }

    /**
     * Mock para distribuição por tipo
     */
    private getMockTypeDistribution(): TypeDistribution[] {
        return [
            { type: 'SENSOR', count: 20, percentage: 44.4, description: 'Sensores de monitoramento' },
            { type: 'ACTUATOR', count: 15, percentage: 33.3, description: 'Atuadores de controle' },
            { type: 'TRACKER', count: 8, percentage: 17.8, description: 'Rastreadores GPS' },
            { type: 'METER', count: 2, percentage: 4.5, description: 'Medidores especializados' }
        ];
    }

    /**
     * Mock para estatísticas de conectividade
     */
    private getMockConnectivityStats(): ConnectivityStats {
        return {
            onlineLast5Min: 38,
            onlineLast1Hour: 42,
            onlineToday: 45,
            averageUptimePercentage: 94.2,
            networkConnectivityRate: 89.7,
            totalCommunicationAttempts: 1247,
            peakOnlineHour: 14,
            lastNetworkUpdate: new Date().toISOString()
        };
    }

    /**
     * Mock para alertas do sistema
     */
    private getMockAlerts(): DeviceAlert[] {
        return [
            {
                id: 1,
                deviceId: 23,
                deviceName: 'Sensor Temperatura - Sala A',
                alertType: 'OFFLINE',
                severity: 'HIGH',
                message: 'Dispositivo sem comunicação há 15 minutos',
                description: 'Sensor crítico de temperatura não responde desde 14:30',
                timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
                durationMinutes: 15,
                recommendedAction: 'Verificar conexão de rede e alimentação',
                isAcknowledged: false
            },
            {
                id: 2,
                deviceId: 31,
                deviceName: 'Atuador Ventilação - B02',
                alertType: 'ERROR',
                severity: 'MEDIUM',
                message: 'Falha na execução de comando',
                description: 'Atuador não conseguiu executar comando de abertura',
                timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
                durationMinutes: 5,
                recommendedAction: 'Reiniciar dispositivo remotamente',
                isAcknowledged: false
            },
            {
                id: 3,
                deviceId: 12,
                deviceName: 'Medidor Energia - Prédio C',
                alertType: 'CONFIGURATION',
                severity: 'LOW',
                message: 'Configuração desatualizada detectada',
                description: 'Firmware do medidor está 2 versões atrás',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                durationMinutes: 120,
                recommendedAction: 'Agendar atualização de firmware',
                isAcknowledged: true
            }
        ];
    }
}
