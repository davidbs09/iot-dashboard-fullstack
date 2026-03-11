package com.dashboard.crud_iot.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para estatísticas gerais do dashboard IoT.
 * Contém todos os dados necessários para os cards principais do dashboard.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Estatísticas gerais do dashboard IoT")
public class DashboardStatsDTO {
    
    @Schema(description = "Total de dispositivos cadastrados", example = "125")
    private Long totalDevices;
    
    @Schema(description = "Dispositivos online (comunicaram nos últimos 5 minutos)", example = "98")
    private Long onlineDevices;
    
    @Schema(description = "Dispositivos offline (sem comunicação recente)", example = "27")
    private Long offlineDevices;
    
    @Schema(description = "Dispositivos ativos", example = "112")
    private Long activeDevices;
    
    @Schema(description = "Dispositivos inativos", example = "13")
    private Long inactiveDevices;
    
    @Schema(description = "Dispositivos com erro", example = "3")
    private Long errorDevices;
    
    @Schema(description = "Dispositivos em manutenção", example = "5")
    private Long maintenanceDevices;
    
    @Schema(description = "Dispositivos em configuração", example = "2")
    private Long configuringDevices;
    
    @Schema(description = "Percentual de dispositivos online", example = "78.4")
    private Double onlinePercentage;
    
    @Schema(description = "Percentual de disponibilidade geral", example = "89.6")
    private Double availabilityPercentage;
    
    @Schema(description = "Total de tipos de dispositivos diferentes", example = "7")
    private Long totalDeviceTypes;
    
    @Schema(description = "Data e hora da última atualização", example = "2024-01-15T14:30:00")
    private LocalDateTime lastUpdated;
    
    @Schema(description = "Status geral do sistema", example = "HEALTHY")
    private String systemStatus;
    
    @Schema(description = "Indica se há alertas críticos", example = "true")
    private Boolean hasCriticalAlerts;
    
    @Schema(description = "Número de alertas ativos", example = "8")
    private Long activeAlerts;
}
