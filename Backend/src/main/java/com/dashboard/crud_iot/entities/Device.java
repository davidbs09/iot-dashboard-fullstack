package com.dashboard.crud_iot.entities;

import com.dashboard.crud_iot.enums.DeviceStatus;
import com.dashboard.crud_iot.enums.DeviceType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entidade que representa um dispositivo IoT no sistema.
 * Contém todas as informações necessárias para gerenciar dispositivos
 * em uma plataforma de monitoramento e rastreamento.
 */
@Entity
@Table(name = "devices")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Device {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Nome único do dispositivo para identificação
     */
    @Column(name = "device_name", nullable = false, unique = true)
    @NotBlank(message = "Nome do dispositivo é obrigatório")
    @Size(min = 3, max = 100, message = "Nome deve ter entre 3 e 100 caracteres")
    private String deviceName;
    
    /**
     * Identificador único do dispositivo (MAC, IMEI, etc.)
     */
    @Column(name = "device_identifier", nullable = false, unique = true)
    @NotBlank(message = "Identificador do dispositivo é obrigatório")
    @Size(max = 50, message = "Identificador deve ter no máximo 50 caracteres")
    private String deviceIdentifier;
    
    /**
     * Tipo do dispositivo (sensor, rastreador, etc.)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "device_type", nullable = false)
    @NotNull(message = "Tipo do dispositivo é obrigatório")
    private DeviceType deviceType;
    
    /**
     * Status atual do dispositivo
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @NotNull(message = "Status do dispositivo é obrigatório")
    @Builder.Default
    private DeviceStatus status = DeviceStatus.INACTIVE;
    
    /**
     * Descrição opcional do dispositivo
     */
    @Column(name = "description", length = 500)
    @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres")
    private String description;
    
    /**
     * Localização do dispositivo (endereço ou coordenadas)
     */
    @Column(name = "location")
    @Size(max = 200, message = "Localização deve ter no máximo 200 caracteres")
    private String location;
    
    /**
     * Latitude para dispositivos com GPS
     */
    @Column(name = "latitude")
    private Double latitude;
    
    /**
     * Longitude para dispositivos com GPS
     */
    @Column(name = "longitude")
    private Double longitude;
    
    /**
     * Última leitura/valor capturado pelo dispositivo
     */
    @Column(name = "last_reading")
    private String lastReading;
    
    /**
     * Data e hora da última comunicação com o dispositivo
     */
    @Column(name = "last_communication")
    private LocalDateTime lastCommunication;
    
    /**
     * Indica se o dispositivo está ativo no sistema
     */
    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
    
    /**
     * Data de criação do registro
     */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    /**
     * Data da última atualização do registro
     */
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    /**
     * Método utilitário para verificar se o dispositivo está online
     * Considera online se a última comunicação foi há menos de 5 minutos
     */
    public boolean isOnline() {
        if (lastCommunication == null) {
            return false;
        }
        return lastCommunication.isAfter(LocalDateTime.now().minusMinutes(5));
    }
    
    /**
     * Método utilitário para atualizar a última comunicação para agora
     */
    public void updateLastCommunication() {
        this.lastCommunication = LocalDateTime.now();
    }
}
