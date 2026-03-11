package com.dashboard.crud_iot.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * DTO para distribuição de tipos de dispositivos.
 * Mostra quantos dispositivos existem de cada tipo específico.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Distribuição de dispositivos por tipo")
public class TypeDistributionDTO {
    
    @Schema(description = "Mapa com tipos e quantidade de dispositivos", 
            example = "{\"SENSOR\": 45, \"ACTUATOR\": 32, \"GATEWAY\": 8, \"TRACKER\": 25, \"METER\": 15, \"CAMERA\": 6, \"CONTROLLER\": 4}")
    private Map<String, Long> typeCounts;
    
    @Schema(description = "Total de dispositivos", example = "135")
    private Long totalDevices;
    
    @Schema(description = "Tipo mais comum", example = "SENSOR")
    private String mostCommonType;
    
    @Schema(description = "Quantidade do tipo mais comum", example = "45")
    private Long mostCommonCount;
    
    @Schema(description = "Número de tipos diferentes", example = "7")
    private Long totalTypes;
}
