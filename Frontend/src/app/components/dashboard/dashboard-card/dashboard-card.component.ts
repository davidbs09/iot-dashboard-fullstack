import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardCard } from '../../../models/dashboard.model';

/**
 * Componente para exibir cards de estatísticas no dashboard
 * Mostra métricas principais com indicadores visuais e trends
 */
@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss']
})
export class DashboardCardComponent {
  @Input() card!: DashboardCard;
}
