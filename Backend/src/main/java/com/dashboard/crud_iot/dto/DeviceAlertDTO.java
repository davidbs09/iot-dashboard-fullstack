package com.dashboard.crud_iot.dto;

import com.dashboard.crud_iot.enums.DeviceStatus;
import com.dashboard.crud_iot.enums.DeviceType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para alertas do sistema IoT.
 * Representa dispositivos que requerem atenção ou estão em situação crítica.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Alerta de dispositivo IoT")
public class DeviceAlertDTO {
    
    @Schema(description = "ID único do dispositivo", example = "1")
    private Long deviceId;
    
    @Schema(description = "Nome do dispositivo", example = "Sensor Temperatura - Sala A1")
    private String deviceName;
    
    @Schema(description = "Tipo do dispositivo", example = "SENSOR")
    private DeviceType deviceType;
    
    @Schema(description = "Status atual do dispositivo", example = "ERROR")
    private DeviceStatus deviceStatus;
    
    @Schema(description = "Tipo do alerta", example = "DEVICE_OFFLINE")
    private AlertType alertType;
    
    @Schema(description = "Nível de severidade", example = "HIGH")
    private AlertSeverity severity;
    
    @Schema(description = "Descrição do alerta", 
            example = "Dispositivo não responde há mais de 30 minutos")
    private String alertMessage;
    
    @Schema(description = "Localização do dispositivo", example = "Prédio A - Andar 2 - Sala A1")
    private String location;
    
    @Schema(description = "Última comunicação do dispositivo", example = "2024-01-15T13:45:00")
    private LocalDateTime lastCommunication;
    
    @Schema(description = "Tempo desde a última comunicação em minutos", example = "45")
    private Long minutesSinceLastCommunication;
    
    @Schema(description = "Timestamp do alerta", example = "2024-01-15T14:30:00")
    private LocalDateTime alertTimestamp;
    
    @Schema(description = "Indica se o alerta é crítico", example = "true")
    private Boolean isCritical;
    
    // Enums para tipos de alerta e severidade
    public enum AlertType {
        DEVICE_OFFLINE,
        COMMUNICATION_LOST,
        DEVICE_ERROR,
        MAINTENANCE_REQUIRED,
        BATTERY_LOW,
        CONFIGURATION_ISSUE,
        NETWORK_ISSUE
    }
    
    public enum AlertSeverity {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }
}
