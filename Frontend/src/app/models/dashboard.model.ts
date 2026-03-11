/**
 * Modelos de dados para o Dashboard IoT
 * Correspondem aos DTOs do backend para estatísticas e métricas
 */

/**
 * Estatísticas gerais do dashboard
 * Contém métricas principais e status do sistema
 */
export interface DashboardStats {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  activeDevices?: number;
  maintenanceDevices: number;
  errorDevices: number;
  
  // Percentuais calculados
  onlinePercentage?: number;
  offlinePercentage?: number;
  errorPercentage?: number;
  uptimePercentage: number;
  
  // Status geral do sistema
  systemStatus: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'ERROR';
  lastUpdate: string; // ISO format
  lastUpdateTime?: string; // ISO format (para compatibilidade)
}

/**
 * Distribuição de dispositivos por status
 * Para gráficos de pizza e análises detalhadas
 */
export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
  description: string;
}

/**
 * Distribuição de dispositivos por tipo
 * Para análises de categorias de hardware IoT
 */
export interface TypeDistribution {
  type: string;
  count: number;
  percentage: number;
  description: string;
}

/**
 * Estatísticas de conectividade IoT
 * Métricas de comunicação e uptime da rede
 */
export interface ConnectivityStats {
  // Comunicação por períodos
  onlineLast5Min: number;
  onlineLast1Hour: number;
  onlineToday: number;
  
  // Métricas de performance
  averageUptimePercentage: number;
  networkConnectivityRate: number;
  totalCommunicationAttempts: number;
  
  // Análise temporal
  peakOnlineHour: number; // hora do dia com mais dispositivos online
  lastNetworkUpdate: string; // ISO format
}

/**
 * Alertas do sistema IoT
 * Sistema inteligente de detecção de problemas
 */
export interface DeviceAlert {
  id: number;
  deviceId: number;
  deviceName: string;
  alertType: 'OFFLINE' | 'ERROR' | 'MAINTENANCE' | 'CONFIGURATION';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  description: string;
  timestamp: string; // ISO format
  
  // Detalhes adicionais
  durationMinutes?: number; // tempo desde o problema
  recommendedAction?: string;
  isAcknowledged: boolean;
}

/**
 * Configuração para gráficos Chart.js
 * Facilita a integração com ng2-charts
 */
export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
}

/**
 * Métricas em tempo real para cards do dashboard
 * Layout responsivo com dados atualizados
 */
export interface DashboardCard {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: string; // FontAwesome class
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  trend?: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
    description: string;
  };
}

/**
 * Estado do dashboard para gerenciamento de loading
 * Controla a experiência do usuário durante carregamento
 */
export interface DashboardState {
  isLoading: boolean;
  lastUpdate: Date;
  hasError: boolean;
  errorMessage?: string;
  autoRefresh: boolean;
  refreshInterval: number; // segundos
}
