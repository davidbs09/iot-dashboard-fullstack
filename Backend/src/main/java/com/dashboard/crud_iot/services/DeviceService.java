package com.dashboard.crud_iot.services;

import com.dashboard.crud_iot.dto.DeviceCreateDTO;
import com.dashboard.crud_iot.dto.DeviceResponseDTO;
import com.dashboard.crud_iot.dto.DeviceUpdateDTO;
import com.dashboard.crud_iot.entities.Device;
import com.dashboard.crud_iot.enums.DeviceStatus;
import com.dashboard.crud_iot.enums.DeviceType;
import com.dashboard.crud_iot.repositories.DeviceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service responsável pela lógica de negócio dos dispositivos IoT.
 * Contém todas as operações CRUD e regras de negócio relacionadas aos dispositivos.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DeviceService {
    
    private final DeviceRepository deviceRepository;
    
    /**
     * Cria um novo dispositivo IoT
     * @param createDTO Dados para criação do dispositivo
     * @return DTO com os dados do dispositivo criado
     * @throws IllegalArgumentException se o identificador ou nome já existir
     */
    @Transactional
    public DeviceResponseDTO createDevice(DeviceCreateDTO createDTO) {
        log.info("Criando novo dispositivo: {}", createDTO.getDeviceName());
        
        // Validar se o identificador já existe
        if (deviceRepository.existsByDeviceIdentifier(createDTO.getDeviceIdentifier())) {
            throw new IllegalArgumentException("Já existe um dispositivo com o identificador: " + createDTO.getDeviceIdentifier());
        }
        
        // Validar se o nome já existe
        if (deviceRepository.existsByDeviceName(createDTO.getDeviceName())) {
            throw new IllegalArgumentException("Já existe um dispositivo com o nome: " + createDTO.getDeviceName());
        }
        
        Device device = Device.builder()
                .deviceName(createDTO.getDeviceName())
                .deviceIdentifier(createDTO.getDeviceIdentifier())
                .deviceType(createDTO.getDeviceType())
                .description(createDTO.getDescription())
                .location(createDTO.getLocation())
                .latitude(createDTO.getLatitude())
                .longitude(createDTO.getLongitude())
                .status(DeviceStatus.INACTIVE) // Dispositivo criado como inativo por padrão
                .isActive(true)
                .build();
        
        Device savedDevice = deviceRepository.save(device);
        log.info("Dispositivo criado com sucesso: ID {}", savedDevice.getId());
        
        return convertToResponseDTO(savedDevice);
    }
    
    /**
     * Busca todos os dispositivos
     * @return Lista de DTOs com todos os dispositivos
     */
    @Transactional(readOnly = true)
    public List<DeviceResponseDTO> getAllDevices() {
        log.info("Buscando todos os dispositivos");
        return deviceRepository.findAll()
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Busca um dispositivo por ID
     * @param id ID do dispositivo
     * @return Optional com o DTO do dispositivo
     */
    @Transactional(readOnly = true)
    public Optional<DeviceResponseDTO> getDeviceById(Long id) {
        log.info("Buscando dispositivo por ID: {}", id);
        return deviceRepository.findById(id)
                .map(this::convertToResponseDTO);
    }
    
    /**
     * Busca dispositivos por tipo
     * @param deviceType Tipo do dispositivo
     * @return Lista de DTOs dos dispositivos do tipo especificado
     */
    @Transactional(readOnly = true)
    public List<DeviceResponseDTO> getDevicesByType(DeviceType deviceType) {
        log.info("Buscando dispositivos por tipo: {}", deviceType);
        return deviceRepository.findByDeviceType(deviceType)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Busca dispositivos por status
     * @param status Status do dispositivo
     * @return Lista de DTOs dos dispositivos com o status especificado
     */
    @Transactional(readOnly = true)
    public List<DeviceResponseDTO> getDevicesByStatus(DeviceStatus status) {
        log.info("Buscando dispositivos por status: {}", status);
        return deviceRepository.findByStatus(status)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Atualiza um dispositivo existente
     * @param id ID do dispositivo a ser atualizado
     * @param updateDTO Dados para atualização
     * @return DTO com os dados atualizados do dispositivo
     * @throws IllegalArgumentException se o dispositivo não for encontrado
     */
    @Transactional
    public DeviceResponseDTO updateDevice(Long id, DeviceUpdateDTO updateDTO) {
        log.info("Atualizando dispositivo ID: {}", id);
        
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Dispositivo não encontrado com ID: " + id));
        
        // Verificar se o novo nome não conflita com outro dispositivo
        if (!device.getDeviceName().equals(updateDTO.getDeviceName()) 
            && deviceRepository.existsByDeviceName(updateDTO.getDeviceName())) {
            throw new IllegalArgumentException("Já existe um dispositivo com o nome: " + updateDTO.getDeviceName());
        }
        
        // Atualizar campos
        device.setDeviceName(updateDTO.getDeviceName());
        device.setDeviceType(updateDTO.getDeviceType());
        device.setStatus(updateDTO.getStatus());
        device.setDescription(updateDTO.getDescription());
        device.setLocation(updateDTO.getLocation());
        device.setLatitude(updateDTO.getLatitude());
        device.setLongitude(updateDTO.getLongitude());
        device.setLastReading(updateDTO.getLastReading());
        device.setIsActive(updateDTO.getIsActive());
        
        Device updatedDevice = deviceRepository.save(device);
        log.info("Dispositivo atualizado com sucesso: ID {}", updatedDevice.getId());
        
        return convertToResponseDTO(updatedDevice);
    }
    
    /**
     * Remove um dispositivo
     * @param id ID do dispositivo a ser removido
     * @throws IllegalArgumentException se o dispositivo não for encontrado
     */
    @Transactional
    public void deleteDevice(Long id) {
        log.info("Removendo dispositivo ID: {}", id);
        
        if (!deviceRepository.existsById(id)) {
            throw new IllegalArgumentException("Dispositivo não encontrado com ID: " + id);
        }
        
        deviceRepository.deleteById(id);
        log.info("Dispositivo removido com sucesso: ID {}", id);
    }
    
    /**
     * Atualiza a última comunicação de um dispositivo
     * @param id ID do dispositivo
     * @param reading Última leitura do dispositivo (opcional)
     * @return DTO com os dados atualizados
     */
    @Transactional
    public DeviceResponseDTO updateLastCommunication(Long id, String reading) {
        log.info("Atualizando última comunicação do dispositivo ID: {}", id);
        
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Dispositivo não encontrado com ID: " + id));
        
        device.updateLastCommunication();
        if (reading != null && !reading.trim().isEmpty()) {
            device.setLastReading(reading);
        }
        
        Device updatedDevice = deviceRepository.save(device);
        log.info("Última comunicação atualizada para dispositivo ID: {}", id);
        
        return convertToResponseDTO(updatedDevice);
    }
    
    /**
     * Busca dispositivos online (comunicaram nos últimos 5 minutos)
     * @return Lista de DTOs dos dispositivos online
     */
    @Transactional(readOnly = true)
    public List<DeviceResponseDTO> getOnlineDevices() {
        log.info("Buscando dispositivos online");
        LocalDateTime fiveMinutesAgo = LocalDateTime.now().minusMinutes(5);
        return deviceRepository.findDevicesOnlineSince(fiveMinutesAgo)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Busca dispositivos offline (não se comunicam há mais de 5 minutos)
     * @return Lista de DTOs dos dispositivos offline
     */
    @Transactional(readOnly = true)
    public List<DeviceResponseDTO> getOfflineDevices() {
        log.info("Buscando dispositivos offline");
        LocalDateTime fiveMinutesAgo = LocalDateTime.now().minusMinutes(5);
        return deviceRepository.findDevicesOfflineSince(fiveMinutesAgo)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Converte uma entidade Device para DeviceResponseDTO
     * @param device Entidade a ser convertida
     * @return DTO correspondente
     */
    private DeviceResponseDTO convertToResponseDTO(Device device) {
        return DeviceResponseDTO.builder()
                .id(device.getId())
                .deviceName(device.getDeviceName())
                .deviceIdentifier(device.getDeviceIdentifier())
                .deviceType(device.getDeviceType())
                .status(device.getStatus())
                .description(device.getDescription())
                .location(device.getLocation())
                .latitude(device.getLatitude())
                .longitude(device.getLongitude())
                .lastReading(device.getLastReading())
                .lastCommunication(device.getLastCommunication())
                .isActive(device.getIsActive())
                .createdAt(device.getCreatedAt())
                .updatedAt(device.getUpdatedAt())
                .isOnline(device.isOnline())
                .build();
    }
}
