package com.dashboard.crud_iot.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
// import org.springframework.web.bind.annotation.RestControllerAdvice; // Comentado temporariamente

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Configuração global para tratamento de exceções da aplicação.
 * Captura exceções lançadas pelos controllers e retorna respostas padronizadas.
 * 
 * TEMPORARIAMENTE COMENTADO PARA RESOLVER CONFLITO COM SWAGGER
 */
//@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    /**
     * Trata exceções de validação dos DTOs
     * @param ex Exceção de validação
     * @return ResponseEntity com detalhes dos erros de validação
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, Object> response = new HashMap<>();
        Map<String, String> errors = new HashMap<>();
        
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("error", "Erro de Validação");
        response.put("message", "Dados inválidos fornecidos");
        response.put("errors", errors);
        
        log.error("Erro de validação: {}", errors);
        return ResponseEntity.badRequest().body(response);
    }
    
    /**
     * Trata exceções de argumentos ilegais (regras de negócio)
     * @param ex Exceção de argumento ilegal
     * @return ResponseEntity com detalhes do erro
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(IllegalArgumentException ex) {
        Map<String, Object> response = new HashMap<>();
        
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("error", "Erro de Regra de Negócio");
        response.put("message", ex.getMessage());
        
        log.error("Erro de regra de negócio: {}", ex.getMessage());
        return ResponseEntity.badRequest().body(response);
    }
    
    /**
     * Trata exceções genéricas não tratadas especificamente
     * @param ex Exceção genérica
     * @return ResponseEntity com erro interno
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        Map<String, Object> response = new HashMap<>();
        
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.put("error", "Erro Interno do Servidor");
        response.put("message", "Ocorreu um erro inesperado. Tente novamente mais tarde.");
        
        log.error("Erro inesperado: ", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
