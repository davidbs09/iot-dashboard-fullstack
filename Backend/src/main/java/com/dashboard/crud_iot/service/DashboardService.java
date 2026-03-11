package com.dashboard.crud_iot.service;

import com.dashboard.crud_iot.dto.*;
import com.dashboard.crud_iot.entities.Device;
import com.dashboard.crud_iot.enums.DeviceStatus;
import com.dashboard.crud_iot.repositories.DeviceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service responsável por fornecer estatísticas e dados do dashboard IoT.
 * 
 * Este service centraliza toda a lógica de cálculo de métricas, estatísticas
 * e alertas para o dashboard em tempo real.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {
    
    private final DeviceRepository deviceRepository;
    
    // Constantes para cálculos de conectividade
    private static final int ONLINE_THRESHOLD_MINUTES = 5;
    private static final int IRREGULAR_COMMUNICATION_THRESHOLD_MINUTES = 30;
    
    /**
     * Calcula as estatísticas gerais do dashboard.
     * 
     * @return DashboardStatsDTO com todas as métricas principais
     */
    public DashboardStatsDTO getGeneralStats() {
        log.info("Calculando estatísticas gerais do dashboard");
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime onlineThreshold = now.minusMinutes(ONLINE_THRESHOLD_MINUTES);
        
        // Busca todos os dispositivos para cálculos
        List<Device> allDevices = deviceRepository.findAll();
        
        if (allDevices.isEmpty()) {
            return createEmptyStats(now);
        }
        
        // Cálculos básicos
        long totalDevices = allDevices.size();
        long onlineDevices = countDevicesOnlineSince(allDevices, onlineThreshold);
        long offlineDevices = totalDevices - onlineDevices;
        
        // Contagem por status
        Map<DeviceStatus, Long> statusCounts = allDevices.stream()
                .collect(Collectors.groupingBy(Device::getStatus, Collectors.counting()));
        
        long activeDevices = statusCounts.getOrDefault(DeviceStatus.ACTIVE, 0L);
        long inactiveDevices = statusCounts.getOrDefault(DeviceStatus.INACTIVE, 0L);
        long errorDevices = statusCounts.getOrDefault(DeviceStatus.ERROR, 0L);
        long maintenanceDevices = statusCounts.getOrDefault(DeviceStatus.MAINTENANCE, 0L);
        long configuringDevices = statusCounts.getOrDefault(DeviceStatus.CONFIGURING, 0L);
        
        // Cálculos de percentuais
        double onlinePercentage = calculatePercentage(onlineDevices, totalDevices);
        double availabilityPercentage = calculatePercentage(activeDevices, totalDevices);
        
        // Contagem de tipos diferentes
        long totalDeviceTypes = allDevices.stream()
                .map(Device::getDeviceType)
                .distinct()
                .count();
        
        // Verificação de alertas críticos
        List<DeviceAlertDTO> alerts = getActiveAlerts();
        boolean hasCriticalAlerts = alerts.stream()
                .anyMatch(alert -> alert.getSeverity() == DeviceAlertDTO.AlertSeverity.CRITICAL);
        
        // Status geral do sistema
        String systemStatus = determineSystemStatus(onlinePercentage, errorDevices, totalDevices);
        
        return DashboardStatsDTO.builder()
                .totalDevices(totalDevices)
                .onlineDevices(onlineDevices)
                .offlineDevices(offlineDevices)
                .activeDevices(activeDevices)
                .inactiveDevices(inactiveDevices)
                .errorDevices(errorDevices)
                .maintenanceDevices(maintenanceDevices)
                .configuringDevices(configuringDevices)
                .onlinePercentage(onlinePercentage)
                .availabilityPercentage(availabilityPercentage)
                .totalDeviceTypes(totalDeviceTypes)
                .lastUpdated(now)
                .systemStatus(systemStatus)
                .hasCriticalAlerts(hasCriticalAlerts)
                .activeAlerts((long) alerts.size())
                .build();
    }
    
    /**
     * Calcula a distribuição de dispositivos por status.
     * 
     * @return StatusDistributionDTO com contagem por cada status
     */
    public StatusDistributionDTO getStatusDistribution() {
        log.info("Calculando distribuição por status");
        
        List<Device> allDevices = deviceRepository.findAll();
        
        Map<String, Long> statusCounts = allDevices.stream()
                .collect(Collectors.groupingBy(
                        device -> device.getStatus().name(),
                        Collectors.counting()
                ));
        
        // Encontra o status mais comum
        Optional<Map.Entry<String, Long>> mostCommon = statusCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue());
        
        return StatusDistributionDTO.builder()
                .statusCounts(statusCounts)
                .totalDevices((long) allDevices.size())
                .mostCommonStatus(mostCommon.map(Map.Entry::getKey).orElse("N/A"))
                .mostCommonCount(mostCommon.map(Map.Entry::getValue).orElse(0L))
                .build();
    }
    
    /**
     * Calcula a distribuição de dispositivos por tipo.
     * 
     * @return TypeDistributionDTO com contagem por cada tipo
     */
    public TypeDistributionDTO getTypeDistribution() {
        log.info("Calculando distribuição por tipo");
        
        List<Device> allDevices = deviceRepository.findAll();
        
        Map<String, Long> typeCounts = allDevices.stream()
                .collect(Collectors.groupingBy(
                        device -> device.getDeviceType().name(),
                        Collectors.counting()
                ));
        
        // Encontra o tipo mais comum
        Optional<Map.Entry<String, Long>> mostCommon = typeCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue());
        
        return TypeDistributionDTO.builder()
                .typeCounts(typeCounts)
                .totalDevices((long) allDevices.size())
                .mostCommonType(mostCommon.map(Map.Entry::getKey).orElse("N/A"))
                .mostCommonCount(mostCommon.map(Map.Entry::getValue).orElse(0L))
                .totalTypes((long) typeCounts.size())
                .build();
    }
    
    /**
     * Calcula estatísticas de conectividade dos dispositivos.
     * 
     * @return ConnectivityStatsDTO com métricas de comunicação
     */
    public ConnectivityStatsDTO getConnectivityStats() {
        log.info("Calculando estatísticas de conectividade");
        
        LocalDateTime now = LocalDateTime.now();
        List<Device> allDevices = deviceRepository.findAll();
        
        if (allDevices.isEmpty()) {
            return createEmptyConnectivityStats(now);
        }
        
        // Dispositivos online em diferentes períodos
        long onlineLast5Min = countDevicesOnlineSince(allDevices, now.minusMinutes(5));
        long onlineLastHour = countDevicesOnlineSince(allDevices, now.minusHours(1));
        long onlineToday = countDevicesOnlineSince(allDevices, now.toLocalDate().atStartOfDay());
        
        // Dispositivos que nunca se comunicaram
        long neverCommunicated = allDevices.stream()
                .mapToLong(device -> device.getLastCommunication() == null ? 1 : 0)
                .sum();
        
        // Tempo médio desde última comunicação
        double avgTimeSinceLastCommunication = calculateAverageTimeSinceLastCommunication(allDevices, now);
        
        // Cálculo de uptime e conectividade
        double uptimePercentage = calculateUptimePercentage(allDevices);
        double connectivityRate = calculatePercentage(onlineLast5Min, allDevices.size());
        
        // Dispositivos com comunicação irregular
        long irregularCommunication = countDevicesWithIrregularCommunication(allDevices, now);
        
        return ConnectivityStatsDTO.builder()
                .devicesOnlineLast5Min(onlineLast5Min)
                .devicesOnlineLastHour(onlineLastHour)
                .devicesOnlineToday(onlineToday)
                .devicesNeverCommunicated(neverCommunicated)
                .averageTimeSinceLastCommunication(avgTimeSinceLastCommunication)
                .overallUptimePercentage(uptimePercentage)
                .connectivityRate(connectivityRate)
                .devicesWithIrregularCommunication(irregularCommunication)
                .lastCheckTime(now)
                .build();
    }
    
    /**
     * Gera lista de alertas ativos do sistema.
     * 
     * @return Lista de DeviceAlertDTO com dispositivos que requerem atenção
     */
    public List<DeviceAlertDTO> getActiveAlerts() {
        log.info("Gerando alertas ativos");
        
        LocalDateTime now = LocalDateTime.now();
        List<Device> allDevices = deviceRepository.findAll();
        List<DeviceAlertDTO> alerts = new ArrayList<>();
        
        for (Device device : allDevices) {
            DeviceAlertDTO alert = generateAlertForDevice(device, now);
            if (alert != null) {
                alerts.add(alert);
            }
        }
        
        // Ordena por severidade (críticos primeiro) e depois por tempo
        alerts.sort((a, b) -> {
            int severityCompare = b.getSeverity().ordinal() - a.getSeverity().ordinal();
            if (severityCompare != 0) return severityCompare;
            return b.getAlertTimestamp().compareTo(a.getAlertTimestamp());
        });
        
        return alerts;
    }
    
    // ==================== MÉTODOS AUXILIARES ====================
    
    /**
     * Conta dispositivos online desde um determinado momento.
     */
    private long countDevicesOnlineSince(List<Device> devices, LocalDateTime since) {
        return devices.stream()
                .filter(device -> device.getLastCommunication() != null)
                .filter(device -> device.getLastCommunication().isAfter(since))
                .count();
    }
    
    /**
     * Calcula percentual com tratamento de divisão por zero.
     */
    private double calculatePercentage(long numerator, long denominator) {
        if (denominator == 0) return 0.0;
        return Math.round((numerator * 100.0 / denominator) * 10.0) / 10.0;
    }
    
    /**
     * Determina o status geral do sistema baseado nas métricas.
     */
    private String determineSystemStatus(double onlinePercentage, long errorDevices, long totalDevices) {
        if (errorDevices > totalDevices * 0.1) { // Mais de 10% com erro
            return "CRITICAL";
        } else if (onlinePercentage < 70) {
            return "WARNING";
        } else if (onlinePercentage >= 90) {
            return "EXCELLENT";
        } else {
            return "HEALTHY";
        }
    }
    
    /**
     * Calcula tempo médio desde a última comunicação.
     */
    private double calculateAverageTimeSinceLastCommunication(List<Device> devices, LocalDateTime now) {
        List<Long> communicationTimes = devices.stream()
                .filter(device -> device.getLastCommunication() != null)
                .map(device -> ChronoUnit.MINUTES.between(device.getLastCommunication(), now))
                .collect(Collectors.toList());
        
        if (communicationTimes.isEmpty()) return 0.0;
        
        return communicationTimes.stream()
                .mapToLong(Long::longValue)
                .average()
                .orElse(0.0);
    }
    
    /**
     * Calcula percentual de uptime baseado no status dos dispositivos.
     */
    private double calculateUptimePercentage(List<Device> devices) {
        long activeDevices = devices.stream()
                .filter(device -> device.getStatus() == DeviceStatus.ACTIVE)
                .count();
        
        return calculatePercentage(activeDevices, devices.size());
    }
    
    /**
     * Conta dispositivos com comunicação irregular.
     */
    private long countDevicesWithIrregularCommunication(List<Device> devices, LocalDateTime now) {
        LocalDateTime threshold = now.minusMinutes(IRREGULAR_COMMUNICATION_THRESHOLD_MINUTES);
        
        return devices.stream()
                .filter(device -> device.getStatus() == DeviceStatus.ACTIVE) // Apenas ativos
                .filter(device -> device.getLastCommunication() != null)
                .filter(device -> device.getLastCommunication().isBefore(threshold))
                .count();
    }
    
    /**
     * Gera alerta para um dispositivo específico se necessário.
     */
    private DeviceAlertDTO generateAlertForDevice(Device device, LocalDateTime now) {
        DeviceAlertDTO.AlertType alertType = null;
        DeviceAlertDTO.AlertSeverity severity = null;
        String message = null;
        boolean isCritical = false;
        
        // Verifica se dispositivo tem erro
        if (device.getStatus() == DeviceStatus.ERROR) {
            alertType = DeviceAlertDTO.AlertType.DEVICE_ERROR;
            severity = DeviceAlertDTO.AlertSeverity.HIGH;
            message = "Dispositivo apresenta status de erro";
            isCritical = true;
        }
        // Verifica se precisa de manutenção
        else if (device.getStatus() == DeviceStatus.MAINTENANCE) {
            alertType = DeviceAlertDTO.AlertType.MAINTENANCE_REQUIRED;
            severity = DeviceAlertDTO.AlertSeverity.MEDIUM;
            message = "Dispositivo requer manutenção";
        }
        // Verifica comunicação offline
        else if (device.getLastCommunication() == null) {
            alertType = DeviceAlertDTO.AlertType.DEVICE_OFFLINE;
            severity = DeviceAlertDTO.AlertSeverity.CRITICAL;
            message = "Dispositivo nunca se comunicou";
            isCritical = true;
        }
        else if (device.getLastCommunication().isBefore(now.minusMinutes(ONLINE_THRESHOLD_MINUTES * 6))) { // 30 min
            alertType = DeviceAlertDTO.AlertType.COMMUNICATION_LOST;
            severity = DeviceAlertDTO.AlertSeverity.HIGH;
            message = "Dispositivo não responde há mais de 30 minutos";
            isCritical = true;
        }
        else if (device.getLastCommunication().isBefore(now.minusMinutes(IRREGULAR_COMMUNICATION_THRESHOLD_MINUTES))) {
            alertType = DeviceAlertDTO.AlertType.COMMUNICATION_LOST;
            severity = DeviceAlertDTO.AlertSeverity.MEDIUM;
            message = "Comunicação irregular detectada";
        }
        
        // Se não há alerta, retorna null
        if (alertType == null) {
            return null;
        }
        
        // Calcula tempo desde última comunicação
        Long minutesSinceLastCommunication = device.getLastCommunication() != null 
            ? ChronoUnit.MINUTES.between(device.getLastCommunication(), now)
            : null;
        
        return DeviceAlertDTO.builder()
                .deviceId(device.getId())
                .deviceName(device.getDeviceName())
                .deviceType(device.getDeviceType())
                .deviceStatus(device.getStatus())
                .alertType(alertType)
                .severity(severity)
                .alertMessage(message)
                .location(device.getLocation())
                .lastCommunication(device.getLastCommunication())
                .minutesSinceLastCommunication(minutesSinceLastCommunication)
                .alertTimestamp(now)
                .isCritical(isCritical)
                .build();
    }
    
    /**
     * Cria estatísticas vazias quando não há dispositivos.
     */
    private DashboardStatsDTO createEmptyStats(LocalDateTime now) {
        return DashboardStatsDTO.builder()
                .totalDevices(0L)
                .onlineDevices(0L)
                .offlineDevices(0L)
                .activeDevices(0L)
                .inactiveDevices(0L)
                .errorDevices(0L)
                .maintenanceDevices(0L)
                .configuringDevices(0L)
                .onlinePercentage(0.0)
                .availabilityPercentage(0.0)
                .totalDeviceTypes(0L)
                .lastUpdated(now)
                .systemStatus("NO_DATA")
                .hasCriticalAlerts(false)
                .activeAlerts(0L)
                .build();
    }
    
    /**
     * Cria estatísticas de conectividade vazias.
     */
    private ConnectivityStatsDTO createEmptyConnectivityStats(LocalDateTime now) {
        return ConnectivityStatsDTO.builder()
                .devicesOnlineLast5Min(0L)
                .devicesOnlineLastHour(0L)
                .devicesOnlineToday(0L)
                .devicesNeverCommunicated(0L)
                .averageTimeSinceLastCommunication(0.0)
                .overallUptimePercentage(0.0)
                .connectivityRate(0.0)
                .devicesWithIrregularCommunication(0L)
                .lastCheckTime(now)
                .build();
    }
}
