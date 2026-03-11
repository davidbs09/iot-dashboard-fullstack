package com.dashboard.crud_iot.controllers;

import com.dashboard.crud_iot.dto.*;
import com.dashboard.crud_iot.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller REST para funcionalidades do dashboard IoT.
 * Fornece endpoints para estatísticas, métricas e dados para visualização em tempo real.
 */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
@Tag(name = "Dashboard IoT", description = "APIs para estatísticas e métricas do dashboard em tempo real")
public class DashboardController {
    
    private final DashboardService dashboardService;
    
    /**
     * Retorna estatísticas gerais do sistema
     * @return Estatísticas completas para o dashboard
     */
    @GetMapping("/stats")
    @Operation(
        summary = "Estatísticas gerais do sistema",
        description = "Retorna contadores e métricas principais para cards do dashboard"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Estatísticas retornadas com sucesso",
        content = @Content(schema = @Schema(implementation = DashboardStatsDTO.class))
    )
    public ResponseEntity<DashboardStatsDTO> getGeneralStats() {
        log.info("Requisição para estatísticas gerais do dashboard");
        DashboardStatsDTO stats = dashboardService.getGeneralStats();
        return ResponseEntity.ok(stats);
    }
    
    /**
     * Retorna distribuição de dispositivos por status
     * @return Map com contagem por cada status
     */
    @GetMapping("/stats/by-status")
    @Operation(
        summary = "Distribuição por status",
        description = "Retorna contagem de dispositivos agrupados por status para gráficos"
    )
    public ResponseEntity<Map<String, Long>> getDevicesByStatus() {
        log.info("Requisição para distribuição de dispositivos por status");
        StatusDistributionDTO statusDistribution = dashboardService.getStatusDistribution();
        return ResponseEntity.ok(statusDistribution.getStatusCounts());
    }
    
    /**
     * Retorna distribuição de dispositivos por tipo
     * @return Map com contagem por cada tipo
     */
    @GetMapping("/stats/by-type")
    @Operation(
        summary = "Distribuição por tipo",
        description = "Retorna contagem de dispositivos agrupados por tipo para gráficos"
    )
    public ResponseEntity<Map<String, Long>> getDevicesByType() {
        log.info("Requisição para distribuição de dispositivos por tipo");
        TypeDistributionDTO typeDistribution = dashboardService.getTypeDistribution();
        return ResponseEntity.ok(typeDistribution.getTypeCounts());
    }
    
    /**
     * Retorna métricas de conectividade (online vs offline)
     * @return Map com contagem de dispositivos online e offline
     */
    @GetMapping("/stats/connectivity")
    @Operation(
        summary = "Métricas de conectividade",
        description = "Retorna contagem de dispositivos online vs offline"
    )
    public ResponseEntity<ConnectivityStatsDTO> getConnectivityStats() {
        log.info("Requisição para métricas de conectividade");
        ConnectivityStatsDTO connectivity = dashboardService.getConnectivityStats();
        return ResponseEntity.ok(connectivity);
    }
    
    /**
     * Retorna alertas ativos do sistema
     * @return Lista de dispositivos que precisam de atenção
     */
    @GetMapping("/alerts")
    @Operation(
        summary = "Alertas ativos",
        description = "Retorna dispositivos com status de erro, manutenção ou offline há muito tempo"
    )
    public ResponseEntity<List<DeviceAlertDTO>> getActiveAlerts() {
        log.info("Requisição para alertas ativos do sistema");
        List<DeviceAlertDTO> alerts = dashboardService.getActiveAlerts();
        return ResponseEntity.ok(alerts);
    }
    
    /**
     * Health check específico do dashboard
     * @return Status do dashboard
     */
    @GetMapping("/health")
    @Operation(
        summary = "Health check do dashboard",
        description = "Verifica se todos os serviços do dashboard estão funcionando"
    )
    public ResponseEntity<Map<String, String>> dashboardHealth() {
        log.info("Health check do dashboard solicitado");
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "Dashboard IoT",
            "timestamp", java.time.LocalDateTime.now().toString()
        ));
    }
}
