import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { ChartData } from '../../../models/dashboard.model';

// Registra todos os componentes do Chart.js
Chart.register(...registerables);

/**
 * Componente para exibir gráficos de pizza do dashboard
 * Utiliza Chart.js para renderização de gráficos interativos
 */
@Component({
  selector: 'app-dashboard-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-chart.component.html',
  styleUrls: ['./dashboard-chart.component.scss']
})
export class DashboardChartComponent implements OnInit {
  @Input() chartData!: ChartData;
  @Input() title: string = '';
  @Input() chartType: ChartType = 'doughnut';
  @Input() height: number = 300;

  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;

  ngOnInit(): void {
    if (this.chartData) {
      this.createChart();
    }
  }

  ngOnChanges(): void {
    if (this.chart && this.chartData) {
      this.updateChart();
    } else if (this.chartData) {
      this.createChart();
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  /**
   * Cria o gráfico Chart.js
   */
  private createChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: this.chartType,
      data: this.chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              font: {
                size: 12,
                family: 'Inter, sans-serif'
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  /**
   * Atualiza os dados do gráfico existente
   */
  private updateChart(): void {
    if (!this.chart) return;

    this.chart.data = this.chartData;
    this.chart.update('active');
  }
}
