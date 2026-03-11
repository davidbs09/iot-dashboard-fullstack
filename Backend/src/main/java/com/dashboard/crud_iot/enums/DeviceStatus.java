package com.dashboard.crud_iot.enums;

/**
 * Enum que representa o status atual de um dispositivo IoT.
 * Usado para controle de estado e monitoramento em tempo real.
 */
public enum DeviceStatus {
    
    /**
     * Dispositivo está ativo e funcionando normalmente
     */
    ACTIVE("Ativo"),
    
    /**
     * Dispositivo está inativo/desligado
     */
    INACTIVE("Inativo"),
    
    /**
     * Dispositivo está em manutenção
     */
    MAINTENANCE("Em Manutenção"),
    
    /**
     * Dispositivo apresenta erro ou falha
     */
    ERROR("Com Erro"),
    
    /**
     * Dispositivo perdeu conexão com a rede
     */
    OFFLINE("Offline"),
    
    /**
     * Dispositivo está em modo de configuração
     */
    CONFIGURING("Configurando");
    
    private final String displayName;
    
    DeviceStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    /**
     * Busca um DeviceStatus pelo nome de exibição
     * @param displayName Nome de exibição do status
     * @return DeviceStatus correspondente ou null se não encontrado
     */
    public static DeviceStatus fromDisplayName(String displayName) {
        for (DeviceStatus status : values()) {
            if (status.displayName.equalsIgnoreCase(displayName)) {
                return status;
            }
        }
        return null;
    }
}
