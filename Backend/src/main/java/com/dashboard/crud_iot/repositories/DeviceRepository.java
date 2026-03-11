package com.dashboard.crud_iot.repositories;

import com.dashboard.crud_iot.entities.Device;
import com.dashboard.crud_iot.enums.DeviceStatus;
import com.dashboard.crud_iot.enums.DeviceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository para operações de banco de dados da entidade Device.
 * Estende JpaRepository para operações CRUD básicas e adiciona consultas customizadas.
 */
@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {
    
    /**
     * Busca um dispositivo pelo identificador único
     * @param deviceIdentifier Identificador do dispositivo
     * @return Optional com o dispositivo encontrado
     */
    Optional<Device> findByDeviceIdentifier(String deviceIdentifier);
    
    /**
     * Busca um dispositivo pelo nome
     * @param deviceName Nome do dispositivo
     * @return Optional com o dispositivo encontrado
     */
    Optional<Device> findByDeviceName(String deviceName);
    
    /**
     * Busca dispositivos por tipo
     * @param deviceType Tipo do dispositivo
     * @return Lista de dispositivos do tipo especificado
     */
    List<Device> findByDeviceType(DeviceType deviceType);
    
    /**
     * Busca dispositivos por status
     * @param status Status do dispositivo
     * @return Lista de dispositivos com o status especificado
     */
    List<Device> findByStatus(DeviceStatus status);
    
    /**
     * Busca dispositivos ativos
     * @param isActive Status de ativação
     * @return Lista de dispositivos ativos ou inativos
     */
    List<Device> findByIsActive(Boolean isActive);
    
    /**
     * Busca dispositivos por tipo e status
     * @param deviceType Tipo do dispositivo
     * @param status Status do dispositivo
     * @return Lista de dispositivos filtrados
     */
    List<Device> findByDeviceTypeAndStatus(DeviceType deviceType, DeviceStatus status);
    
    /**
     * Busca dispositivos que não se comunicam há um determinado tempo
     * @param since Data limite para considerar offline
     * @return Lista de dispositivos offline
     */
    @Query("SELECT d FROM Device d WHERE d.lastCommunication IS NULL OR d.lastCommunication < :since")
    List<Device> findDevicesOfflineSince(@Param("since") LocalDateTime since);
    
    /**
     * Busca dispositivos online (comunicaram nos últimos 5 minutos)
     * @param since Data limite para considerar online
     * @return Lista de dispositivos online
     */
    @Query("SELECT d FROM Device d WHERE d.lastCommunication >= :since")
    List<Device> findDevicesOnlineSince(@Param("since") LocalDateTime since);
    
    /**
     * Conta dispositivos por status
     * @param status Status para contar
     * @return Número de dispositivos com o status especificado
     */
    long countByStatus(DeviceStatus status);
    
    /**
     * Conta dispositivos por tipo
     * @param deviceType Tipo para contar
     * @return Número de dispositivos do tipo especificado
     */
    long countByDeviceType(DeviceType deviceType);
    
    /**
     * Verifica se existe um dispositivo com o identificador especificado
     * @param deviceIdentifier Identificador para verificar
     * @return true se existe, false caso contrário
     */
    boolean existsByDeviceIdentifier(String deviceIdentifier);
    
    /**
     * Verifica se existe um dispositivo com o nome especificado
     * @param deviceName Nome para verificar
     * @return true se existe, false caso contrário
     */
    boolean existsByDeviceName(String deviceName);
}
