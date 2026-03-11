package com.dashboard.crud_iot.dto;

import com.dashboard.crud_iot.enums.DeviceType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para criação de um novo dispositivo IoT.
 * Contém apenas os campos necessários para criar um dispositivo.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Dados para criação de um novo dispositivo IoT")
public class DeviceCreateDTO {
    
    @Schema(description = "Nome único do dispositivo", example = "Sensor Temperatura Lab A", required = true)
    @NotBlank(message = "Nome do dispositivo é obrigatório")
    @Size(min = 3, max = 100, message = "Nome deve ter entre 3 e 100 caracteres")
    private String deviceName;
    
    @Schema(description = "Identificador único do dispositivo (MAC, IMEI, etc.)", example = "TEMP001", required = true)
    @NotBlank(message = "Identificador do dispositivo é obrigatório")
    @Size(max = 50, message = "Identificador deve ter no máximo 50 caracteres")
    private String deviceIdentifier;
    
    @Schema(description = "Tipo do dispositivo IoT", example = "TEMPERATURE_SENSOR", required = true)
    @NotNull(message = "Tipo do dispositivo é obrigatório")
    private DeviceType deviceType;
    
    @Schema(description = "Descrição detalhada do dispositivo", example = "Sensor de temperatura para monitoramento do laboratório")
    @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres")
    private String description;
    
    @Schema(description = "Localização física do dispositivo", example = "Laboratório - Bloco A")
    @Size(max = 200, message = "Localização deve ter no máximo 200 caracteres")
    private String location;
    
    @Schema(description = "Latitude da localização do dispositivo", example = "-23.5505")
    private Double latitude;
    
    @Schema(description = "Longitude da localização do dispositivo", example = "-46.6333")
    private Double longitude;
    
    // Status será definido como INACTIVE por padrão na entidade
    // isActive será definido como true por padrão na entidade
}
