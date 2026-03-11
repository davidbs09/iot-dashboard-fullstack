package com.dashboard.crud_iot.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * DTO para distribuição de status dos dispositivos.
 * Mostra quantos dispositivos estão em cada status específico.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Distribuição de dispositivos por status")
public class StatusDistributionDTO {
    
    @Schema(description = "Mapa com status e quantidade de dispositivos", 
            example = "{\"ACTIVE\": 112, \"INACTIVE\": 13, \"ERROR\": 3, \"MAINTENANCE\": 5, \"CONFIGURING\": 2}")
    private Map<String, Long> statusCounts;
    
    @Schema(description = "Total de dispositivos", example = "135")
    private Long totalDevices;
    
    @Schema(description = "Status mais comum", example = "ACTIVE")
    private String mostCommonStatus;
    
    @Schema(description = "Quantidade do status mais comum", example = "112")
    private Long mostCommonCount;
}
