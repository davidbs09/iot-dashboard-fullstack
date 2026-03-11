package com.dashboard.crud_iot.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para estatísticas de conectividade dos dispositivos.
 * Fornece métricas sobre comunicação e performance da rede IoT.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Estatísticas de conectividade dos dispositivos IoT")
public class ConnectivityStatsDTO {
    
    @Schema(description = "Dispositivos online nos últimos 5 minutos", example = "98")
    private Long devicesOnlineLast5Min;
    
    @Schema(description = "Dispositivos online na última hora", example = "115")
    private Long devicesOnlineLastHour;
    
    @Schema(description = "Dispositivos online hoje", example = "128")
    private Long devicesOnlineToday;
    
    @Schema(description = "Dispositivos que nunca se comunicaram", example = "2")
    private Long devicesNeverCommunicated;
    
    @Schema(description = "Tempo médio desde última comunicação (em minutos)", example = "45")
    private Double averageTimeSinceLastCommunication;
    
    @Schema(description = "Percentual de uptime geral", example = "94.5")
    private Double overallUptimePercentage;
    
    @Schema(description = "Taxa de conectividade (0-100)", example = "87.2")
    private Double connectivityRate;
    
    @Schema(description = "Dispositivos com comunicação irregular", example = "12")
    private Long devicesWithIrregularCommunication;
    
    @Schema(description = "Horário da última verificação", example = "2024-01-15T14:30:00")
    private LocalDateTime lastCheckTime;
}
