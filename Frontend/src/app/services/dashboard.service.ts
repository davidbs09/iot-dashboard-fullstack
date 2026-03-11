import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval, combineLatest, of } from 'rxjs';
import { map, switchMap, startWith, shareReplay, catchError } from 'rxjs/operators';
import { 
    DashboardStats, 
    StatusDistribution, 
    TypeDistribution, 
    ConnectivityStats, 
    DeviceAlert,
    DashboardCard,
    DashboardState,
    ChartData
} from '../models/dashboard.model';
import { DeviceService } from './device.service';
import { Device, DeviceStatus } from '../models/device.model';

/**
 * Serviço dedicado para gerenciar dados do Dashboard IoT
 * Calcula estatísticas baseado nos dispositivos reais cadastrados
 */
@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    
    private readonly API_URL = 'http://localhost:8080/api';
    
    // Estado do dashboard
    private dashboardState$ = new BehaviorSubject<DashboardState>({
        isLoading: false,
        lastUpdate: new Date(),
        hasError: false,
        autoRefresh: true,
        refreshInterval: 30 // 30 segundos
    });

    // Cache de dados com auto-refresh
    private refreshTrigger$ = interval(30000).pipe(startWith(0)); // Atualiza a cada 30s

    constructor(
        private http: HttpClient,
        private deviceService: DeviceService
    ) { }

    // ========================================
    // ESTATÍSTICAS BASEADAS EM DADOS REAIS
    // ========================================

    /**
     * Busca estatísticas gerais do dashboard baseado nos dispositivos reais
     */
    getDashboardStats(): Observable<DashboardStats> {
        return this.deviceService.getAllDevices().pipe(
            map(devices => {
                const totalDevices = devices.length;
                
                // Contagem baseada em IS_ACTIVE (igual ao DevicesPageComponent)
                let onlineDevices = 0;
                let offlineDevices = 0;
                let maintenanceDevices = 0;
                let errorDevices = 0;
                
                devices.forEach(device => {
                    const status = String(device.status).toUpperCase();
                    const isActive = device.isActive;
                    
                    // CONEXÃO baseada em IS_ACTIVE (igual ao DevicesPageComponent)
                    if (isActive === true) {
                        onlineDevices++;
                    } else {
                        offlineDevices++;
                    }
                    
                    // STATUS (para outras métricas)
                    if (status === 'MAINTENANCE' || status === 'MANUTENCAO') {
                        maintenanceDevices++;
                    } else if (status === 'ERROR' || status === 'ERRO') {
                        errorDevices++;
                    }
                });

                const stats: DashboardStats = {
                    totalDevices,
                    onlineDevices,
                    offlineDevices,
                    maintenanceDevices,
                    errorDevices,
                    systemStatus: this.calculateSystemStatus(onlineDevices, totalDevices, errorDevices),
                    uptimePercentage: totalDevices > 0 ? Math.round((onlineDevices / totalDevices) * 100) : 0,
                    lastUpdate: new Date().toISOString()
                };

                return stats;
            }),
            catchError(error => {
                console.error('❌ Erro ao calcular estatísticas:', error);
                return of(this.createFallbackStats());
            })
        );
    }

    /**
     * Busca distribuição por tipo baseado nos dispositivos reais
     */
    getTypeDistribution(): Observable<TypeDistribution[]> {
        return this.deviceService.getAllDevices().pipe(
            map(devices => {
                // Conta dispositivos por tipo
                const typeCount: {[key: string]: number} = {};
                devices.forEach(device => {
                    typeCount[device.deviceType] = (typeCount[device.deviceType] || 0) + 1;
                });

                const typeArray: TypeDistribution[] = Object.entries(typeCount).map(([type, count]) => ({
                    type: type as any,
                    count: count,
                    description: this.getTypeDescription(type),
                    percentage: devices.length > 0 ? Math.round((count / devices.length) * 100) : 0
                }));
                
                return typeArray;
            }),
            catchError(error => {
                console.error('❌ Erro ao calcular distribuição por tipo:', error);
                return of([]);
            })
        );
    }

    /**
     * Busca distribuição por status baseado nos dispositivos reais
     */
    getStatusDistribution(): Observable<StatusDistribution[]> {
        return this.deviceService.getAllDevices().pipe(
            map(devices => {
                // Conta dispositivos por status
                const statusCount: {[key: string]: number} = {};
                devices.forEach(device => {
                    const status = device.status || 'UNKNOWN';
                    statusCount[status] = (statusCount[status] || 0) + 1;
                });

                const statusArray: StatusDistribution[] = Object.entries(statusCount).map(([status, count]) => ({
                    status: status as any,
                    count: count,
                    description: this.getStatusDescription(status),
                    percentage: devices.length > 0 ? Math.round((count / devices.length) * 100) : 0
                }));
                
                return statusArray;
            }),
            catchError(error => {
                console.error('❌ Erro ao calcular distribuição por status:', error);
                return of([]);
            })
        );
    }

    /**
     * Busca alertas ativos (mock por enquanto)
     */
    getActiveAlerts(): Observable<DeviceAlert[]> {
        return of([
            {
                id: 1,
                deviceId: 1,
                deviceName: 'Sensor Temperatura',
                alertType: 'OFFLINE',
                severity: 'HIGH',
                message: 'Dispositivo offline há 5 minutos',
                description: 'Sensor crítico não responde',
                timestamp: new Date().toISOString(),
                durationMinutes: 5,
                recommendedAction: 'Verificar conexão',
                isAcknowledged: false
            }
        ]);
    }

    // ========================================
    // MÉTODOS DE DASHBOARD PRINCIPAL
    // ========================================

    /**
     * Busca todos os dados do dashboard de uma vez
     */
    getDashboardData(): Observable<any> {
        return combineLatest([
            this.getDashboardStats(),
            this.getTypeDistribution(),
            this.getStatusDistribution(),
            this.getActiveAlerts()
        ]).pipe(
            map(([stats, typeDistribution, statusDistribution, alerts]) => {
                const cards = this.createDashboardCards(stats);
                const typeChart = this.createTypeChart(typeDistribution);
                const statusChart = this.createStatusChart(statusDistribution);

                return {
                    stats,
                    typeDistribution,
                    statusDistribution,
                    alerts,
                    cards,
                    typeChart,
                    statusChart
                };
            }),
            shareReplay(1)
        );
    }

    /**
     * Busca dados com auto-refresh
     */
    getDashboardDataWithRefresh(): Observable<any> {
        return this.refreshTrigger$.pipe(
            switchMap(() => this.getDashboardData()),
            shareReplay(1)
        );
    }

    // ========================================
    // MÉTODOS AUXILIARES
    // ========================================

    /**
     * Calcula o status do sistema baseado nas métricas
     */
    private calculateSystemStatus(onlineDevices: number, totalDevices: number, errorDevices: number): 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'ERROR' {
        if (totalDevices === 0) return 'WARNING';
        
        const onlinePercentage = (onlineDevices / totalDevices) * 100;
        const errorPercentage = (errorDevices / totalDevices) * 100;
        
        if (errorPercentage > 30) return 'ERROR';
        if (onlinePercentage >= 80) return 'HEALTHY';
        if (onlinePercentage >= 60) return 'WARNING';
        return 'CRITICAL';
    }

    /**
     * Cria cards do dashboard baseado nas estatísticas
     */
    private createDashboardCards(stats: DashboardStats): DashboardCard[] {
        return [
            {
                title: 'Total de Dispositivos',
                value: stats.totalDevices.toString(),
                icon: 'devices',
                color: 'primary',
                trend: {
                    percentage: 0,
                    direction: 'stable',
                    description: 'Cadastrados no sistema'
                }
            },
            {
                title: 'Dispositivos Online',
                value: stats.onlineDevices.toString(),
                icon: 'wifi',
                color: 'success',
                trend: {
                    percentage: stats.uptimePercentage,
                    direction: stats.onlineDevices > 0 ? 'up' : 'down',
                    description: `${stats.uptimePercentage}% de uptime`
                }
            },
            {
                title: 'Dispositivos Offline',
                value: stats.offlineDevices.toString(),
                icon: 'wifi_off',
                color: 'warning',
                trend: {
                    percentage: Math.round((stats.offlineDevices / Math.max(stats.totalDevices, 1)) * 100),
                    direction: stats.offlineDevices > 0 ? 'down' : 'stable',
                    description: 'Precisam de atenção'
                }
            },
            {
                title: 'Em Manutenção',
                value: stats.maintenanceDevices.toString(),
                icon: 'build',
                color: 'info',
                trend: {
                    percentage: 0,
                    direction: 'stable',
                    description: 'Programada'
                }
            },
            {
                title: 'Com Erro',
                value: stats.errorDevices.toString(),
                icon: 'error',
                color: 'danger',
                trend: {
                    percentage: Math.round((stats.errorDevices / Math.max(stats.totalDevices, 1)) * 100),
                    direction: stats.errorDevices > 0 ? 'down' : 'stable',
                    description: 'Requerem intervenção'
                }
            },
            {
                title: 'Status do Sistema',
                value: this.getSystemStatusText(stats.systemStatus),
                icon: this.getSystemStatusIcon(stats.systemStatus),
                color: this.getSystemStatusColor(stats.systemStatus),
                trend: {
                    percentage: stats.uptimePercentage,
                    direction: stats.systemStatus === 'HEALTHY' ? 'up' : 'down',
                    description: `${stats.uptimePercentage}% operacional`
                }
            }
        ];
    }

    /**
     * Cria dados do gráfico de tipos
     */
    private createTypeChart(typeDistribution: TypeDistribution[]): ChartData {
        return {
            labels: typeDistribution.map(t => this.getTypeDescription(t.type)),
            datasets: [{
                data: typeDistribution.map(t => t.count),
                backgroundColor: [
                    '#007bff',  // Azul vibrante
                    '#28a745',  // Verde
                    '#fd7e14',  // Laranja
                    '#dc3545',  // Vermelho
                    '#6f42c1',  // Roxo
                    '#e83e8c',  // Rosa
                    '#20c997',  // Verde água/Teal
                    '#ffc107',  // Amarelo dourado
                    '#6c757d',  // Cinza
                    '#17a2b8'   // Azul água/Cyan
                ],
                borderWidth: 2,
                borderColor: ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff']
            }]
        };
    }

    /**
     * Cria dados do gráfico de status
     */
    private createStatusChart(statusDistribution: StatusDistribution[]): ChartData {
        return {
            labels: statusDistribution.map(s => this.getStatusDescription(s.status)),
            datasets: [{
                data: statusDistribution.map(s => s.count),
                backgroundColor: statusDistribution.map(s => this.getStatusColor(s.status)),
                borderWidth: 2,
                borderColor: statusDistribution.map(() => '#fff')
            }]
        };
    }

    // ========================================
    // MÉTODOS DE UTILIDADE
    // ========================================

    /**
     * Obtém descrição do tipo de dispositivo
     */
    private getTypeDescription(type: string): string {
        const descriptions: {[key: string]: string} = {
            'SENSOR': 'Sensores',
            'ACTUATOR': 'Atuadores',
            'GATEWAY': 'Gateways',
            'TRACKER': 'Rastreadores',
            'MONITOR': 'Monitores',
            'CONTROLLER': 'Controladores'
        };
        return descriptions[type] || type;
    }

    /**
     * Obtém descrição do status
     */
    private getStatusDescription(status: string): string {
        const descriptions: {[key: string]: string} = {
            'ACTIVE': 'Ativo',
            'ATIVO': 'Ativo',
            'INACTIVE': 'Inativo',
            'INATIVO': 'Inativo',
            'OFFLINE': 'Offline',
            'MAINTENANCE': 'Manutenção',
            'MANUTENCAO': 'Manutenção',
            'ERROR': 'Erro',
            'ERRO': 'Erro'
        };
        return descriptions[status] || status;
    }

    /**
     * Obtém cor do status
     */
    private getStatusColor(status: string): string {
        const colors: {[key: string]: string} = {
            'ACTIVE': '#28a745',        // Verde vibrante
            'ATIVO': '#28a745',         // Verde vibrante
            'INACTIVE': '#6c757d',      // Cinza escuro
            'INATIVO': '#6c757d',       // Cinza escuro
            'OFFLINE': '#fd7e14',       // Laranja vibrante
            'MAINTENANCE': '#007bff',   // Azul
            'MANUTENCAO': '#007bff',    // Azul
            'ERROR': '#dc3545',         // Vermelho
            'ERRO': '#dc3545',          // Vermelho
            'CONFIGURING': '#6f42c1',   // Roxo
            'CONFIGURANDO': '#6f42c1',  // Roxo
            'PENDING': '#e83e8c',       // Rosa
            'PENDENTE': '#e83e8c',      // Rosa
            'TESTING': '#20c997',       // Verde água
            'TESTANDO': '#20c997',      // Verde água
            'DISABLED': '#adb5bd',      // Cinza claro
            'DESABILITADO': '#adb5bd'   // Cinza claro
        };
        return colors[status] || '#6c757d';
    }

    /**
     * Obtém texto do status do sistema
     */
    private getSystemStatusText(status: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'ERROR'): string {
        const texts = {
            'HEALTHY': 'Saudável',
            'WARNING': 'Atenção',
            'CRITICAL': 'Crítico',
            'ERROR': 'Erro'
        };
        return texts[status];
    }

    /**
     * Obtém ícone do status do sistema
     */
    private getSystemStatusIcon(status: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'ERROR'): string {
        const icons = {
            'HEALTHY': 'check_circle',
            'WARNING': 'warning',
            'CRITICAL': 'error',
            'ERROR': 'cancel'
        };
        return icons[status];
    }

    /**
     * Obtém cor do status do sistema
     */
    private getSystemStatusColor(status: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'ERROR'): 'primary' | 'success' | 'warning' | 'danger' {
        const colors = {
            'HEALTHY': 'success' as const,
            'WARNING': 'warning' as const,
            'CRITICAL': 'danger' as const,
            'ERROR': 'danger' as const
        };
        return colors[status];
    }

    /**
     * Cria estatísticas de fallback em caso de erro
     */
    private createFallbackStats(): DashboardStats {
        return {
            totalDevices: 0,
            onlineDevices: 0,
            offlineDevices: 0,
            maintenanceDevices: 0,
            errorDevices: 0,
            systemStatus: 'WARNING',
            uptimePercentage: 0,
            lastUpdate: new Date().toISOString()
        };
    }

    // ========================================
    // GESTÃO DE ESTADO
    // ========================================

    /**
     * Obtém estado atual do dashboard
     */
    getDashboardState(): Observable<DashboardState> {
        return this.dashboardState$.asObservable();
    }

    /**
     * Atualiza estado do dashboard
     */
    updateDashboardState(state: Partial<DashboardState>): void {
        const currentState = this.dashboardState$.value;
        this.dashboardState$.next({
            ...currentState,
            ...state,
            lastUpdate: new Date()
        });
    }

    /**
     * Define loading
     */
    setLoading(isLoading: boolean): void {
        this.updateDashboardState({ isLoading });
    }

    /**
     * Define erro
     */
    setError(hasError: boolean): void {
        this.updateDashboardState({ hasError });
    }

    /**
     * Toggle auto-refresh
     */
    toggleAutoRefresh(): void {
        const currentState = this.dashboardState$.value;
        this.updateDashboardState({ autoRefresh: !currentState.autoRefresh });
    }

    /**
     * Força refresh manual do dashboard
     */
    refreshDashboard(): void {
        this.setLoading(true);
        // Força um novo carregamento dos dados
        this.getDashboardData().subscribe({
            next: () => {
                this.setLoading(false);
                this.updateDashboardState({ lastUpdate: new Date() });
            },
            error: () => {
                this.setLoading(false);
                this.setError(true);
            }
        });
    }

    /**
     * Define auto-refresh
     */
    setAutoRefresh(enabled: boolean): void {
        this.updateDashboardState({ autoRefresh: enabled });
    }
}
