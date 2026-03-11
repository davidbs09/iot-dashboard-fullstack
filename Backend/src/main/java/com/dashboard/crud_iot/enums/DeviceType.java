package com.dashboard.crud_iot.enums;

/**
 * Enum que representa os diferentes tipos de dispositivos IoT suportados pela plataforma.
 * Cada tipo tem características específicas e pode ter diferentes sensores/funcionalidades.
 */
public enum DeviceType {
    
    /**
     * Dispositivos de rastreamento GPS/GNSS para monitoramento de localização
     */
    TRACKER("Rastreador"),
    
    /**
     * Sensores de temperatura para monitoramento térmico
     */
    TEMPERATURE_SENSOR("Sensor de Temperatura"),
    
    /**
     * Sensores de vibração para monitoramento de máquinas e equipamentos
     */
    VIBRATION_SENSOR("Sensor de Vibração"),
    
    /**
     * Medidores de oxigênio para controle de qualidade do ar
     */
    OXYGEN_METER("Medidor de Oxigênio"),
    
    /**
     * Sensores de umidade para controle ambiental
     */
    HUMIDITY_SENSOR("Sensor de Umidade"),
    
    /**
     * Sensores de pressão para monitoramento de sistemas
     */
    PRESSURE_SENSOR("Sensor de Pressão"),
    
    /**
     * Dispositivos genéricos ou personalizados
     */
    GENERIC("Dispositivo Genérico");
    
    private final String displayName;
    
    DeviceType(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    /**
     * Busca um DeviceType pelo nome de exibição
     * @param displayName Nome de exibição do tipo
     * @return DeviceType correspondente ou null se não encontrado
     */
    public static DeviceType fromDisplayName(String displayName) {
        for (DeviceType type : values()) {
            if (type.displayName.equalsIgnoreCase(displayName)) {
                return type;
            }
        }
        return null;
    }
}
