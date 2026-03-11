import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of, Subject } from 'rxjs';
import { map, takeUntil, finalize } from 'rxjs/operators';

// Import das interfaces do dashboard
import {
  DashboardStats,
  StatusDistribution,
  TypeDistribution,
  DeviceAlert,
  DashboardCard,
  ChartData,
  DashboardState
} from '../../models/dashboard.model';

// Import dos componentes do dashboard
import { DashboardCardComponent } from '../../components/dashboard/dashboard-card/dashboard-card.component';
import { DashboardChartComponent } from '../../components/dashboard/dashboard-chart/dashboard-chart.component';
import { DashboardAlertsComponent } from '../../components/dashboard/dashboard-alerts/dashboard-alerts.component';

// Import dos serviços
import { DashboardService } from '../../services/dashboard.service';

interface DashboardData {
  stats: DashboardStats;
  cards: DashboardCard[];
  statusChart: ChartData;
  typeChart: ChartData;
  alerts: DeviceAlert[];
}

interface LoadingStates {
  dashboard: boolean;
  stats: boolean;
  charts: boolean;
  alerts: boolean;
}

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    DashboardCardComponent,
    DashboardChartComponent,
    DashboardAlertsComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  // Observables principais
  data$: Observable<DashboardData> = new Observable();
  dashboardState$: Observable<DashboardState> = new Observable();

  // Estado de carregamento
  loadingStates: LoadingStates = {
    dashboard: false,
    stats: false,
    charts: false,
    alerts: false
  };

  private destroy$ = new Subject<void>();

  // Injeção de dependências usando o novo padrão do Angular 18
  private readonly dashboardService = inject(DashboardService);

  ngOnInit(): void {
    // Ativa auto-refresh automaticamente para atualização contínua
    this.dashboardService.setAutoRefresh(true);
    this.loadDashboard();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDashboard(): void {
    // Carrega dados em tempo real do backend
    this.data$ = this.dashboardService.getDashboardData();
    this.dashboardState$ = this.dashboardService.getDashboardState();
  }

  formatLastUpdate(isoString: string | Date): string {
    if (!isoString) return 'Nunca';
    
    const date = typeof isoString === 'string' ? new Date(isoString) : isoString;
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    return date.toLocaleDateString('pt-BR');
  }

  getSystemStatusText(status: string): string {
    switch (status) {
      case 'HEALTHY': return 'Operacional';
      case 'WARNING': return 'Atenção';
      case 'CRITICAL': return 'Crítico';
      case 'ERROR': return 'Erro';
      default: return 'Desconhecido';
    }
  }

  getSystemStatusClass(status: string): string {
    switch (status) {
      case 'HEALTHY': return 'status-healthy';
      case 'WARNING': return 'status-warning';
      case 'CRITICAL': return 'status-critical';
      case 'ERROR': return 'status-error';
      default: return 'status-unknown';
    }
  }

  trackByCardTitle(index: number, card: DashboardCard): string {
    return card.title;
  }
}
