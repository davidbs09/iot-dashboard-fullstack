package com.dashboard.crud_iot.dto;

import com.dashboard.crud_iot.enums.DeviceStatus;
import com.dashboard.crud_iot.enums.DeviceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para resposta com informações de um dispositivo IoT.
 * Usado para retornar dados do dispositivo nas APIs.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceResponseDTO {
    
    private Long id;
    private String deviceName;
    private String deviceIdentifier;
    private DeviceType deviceType;
    private DeviceStatus status;
    private String description;
    private String location;
    private Double latitude;
    private Double longitude;
    private String lastReading;
    private LocalDateTime lastCommunication;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Campo calculado para indicar se o dispositivo está online
    private Boolean isOnline;
}
