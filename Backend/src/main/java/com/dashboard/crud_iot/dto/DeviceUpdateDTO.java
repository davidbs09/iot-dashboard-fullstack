package com.dashboard.crud_iot.dto;

import com.dashboard.crud_iot.enums.DeviceStatus;
import com.dashboard.crud_iot.enums.DeviceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para atualização de um dispositivo IoT existente.
 * Permite atualizar todos os campos modificáveis de um dispositivo.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceUpdateDTO {
    
    @NotBlank(message = "Nome do dispositivo é obrigatório")
    @Size(min = 3, max = 100, message = "Nome deve ter entre 3 e 100 caracteres")
    private String deviceName;
    
    @NotNull(message = "Tipo do dispositivo é obrigatório")
    private DeviceType deviceType;
    
    @NotNull(message = "Status do dispositivo é obrigatório")
    private DeviceStatus status;
    
    @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres")
    private String description;
    
    @Size(max = 200, message = "Localização deve ter no máximo 200 caracteres")
    private String location;
    
    private Double latitude;
    
    private Double longitude;
    
    private String lastReading;
    
    @NotNull(message = "Campo isActive é obrigatório")
    private Boolean isActive;
}
