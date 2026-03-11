import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceAlert } from '../../../models/dashboard.model';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Componente para exibir alertas do sistema IoT
 * Mostra alertas com diferentes níveis de severidade e ações recomendadas
 */
@Component({
  selector: 'app-dashboard-alerts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-alerts.component.html',
  styleUrls: ['./dashboard-alerts.component.scss']
})
export class DashboardAlertsComponent {
  @Input() alerts: DeviceAlert[] = [];
  @Input() maxAlertsToShow: number = 5;

  /**
   * Retorna a classe CSS baseada na severidade do alerta
   */
  getSeverityClass(severity: string): string {
    switch (severity) {
      case 'CRITICAL': return 'severity-critical';
      case 'HIGH': return 'severity-high';
      case 'MEDIUM': return 'severity-medium';
      case 'LOW': return 'severity-low';
      default: return 'severity-low';
    }
  }

  /**
   * Retorna o ícone baseado no tipo de alerta
   */
  getAlertIcon(alertType: string): string {
    switch (alertType) {
      case 'OFFLINE': return 'fas fa-wifi';
      case 'ERROR': return 'fas fa-exclamation-circle';
      case 'MAINTENANCE': return 'fas fa-tools';
      case 'CONFIGURATION': return 'fas fa-cog';
      default: return 'fas fa-bell';
    }
  }

  /**
   * Formata o tempo relativo desde o alerta
   */
  getTimeAgo(timestamp: string): string {
    try {
      return formatDistanceToNow(new Date(timestamp), { 
        locale: ptBR, 
        addSuffix: true 
      });
    } catch {
      return 'Agora';
    }
  }

  /**
   * Retorna os alertas limitados para exibição
   */
  getDisplayAlerts(): DeviceAlert[] {
    return this.alerts
      .filter(alert => !alert.isAcknowledged) // Só mostra não confirmados
      .sort((a, b) => {
        // Ordena por severidade primeiro, depois por timestamp
        const severityOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
        const aSeverity = severityOrder[a.severity as keyof typeof severityOrder] || 0;
        const bSeverity = severityOrder[b.severity as keyof typeof severityOrder] || 0;
        
        if (aSeverity !== bSeverity) {
          return bSeverity - aSeverity; // Severidade decrescente
        }
        
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(); // Mais recente primeiro
      })
      .slice(0, this.maxAlertsToShow);
  }

  /**
   * Marca um alerta como reconhecido
   */
  acknowledgeAlert(alert: DeviceAlert): void {
    alert.isAcknowledged = true;
    // Aqui você poderia fazer uma chamada para a API para persistir a mudança
    console.log('Alerta reconhecido:', alert.id);
  }

  /**
   * Abre detalhes do dispositivo (navegação)
   */
  viewDeviceDetails(deviceId: number): void {
    // Implementar navegação para página do dispositivo
    console.log('Navegar para dispositivo:', deviceId);
  }

  /**
   * TrackBy function para otimizar performance da lista
   */
  trackByAlertId(index: number, alert: DeviceAlert): number {
    return alert.id;
  }

  /**
   * Formata a duração em texto legível
   */
  getDurationText(minutes: number): string {
    if (minutes < 60) {
      return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours < 24) {
      return `há ${hours} hora${hours > 1 ? 's' : ''}${remainingMinutes > 0 ? ` e ${remainingMinutes} min` : ''}`;
    }
    
    const days = Math.floor(hours / 24);
    return `há ${days} dia${days > 1 ? 's' : ''}`;
  }
}
