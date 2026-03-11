package com.dashboard.crud_iot.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Configuração do OpenAPI/Swagger para documentação automática da API.
 * Fornece uma interface visual para testar e entender os endpoints.
 */
@Configuration
public class OpenApiConfig {

        @Bean
        public OpenAPI customOpenAPI() {
                return new OpenAPI()
                                .info(new Info()
                                                .title("CRUD IoT Dashboard API")
                                                .version("1.0.0")
                                                .description("""
                                                                API REST para gerenciamento de dispositivos IoT.

                                                                ## Funcionalidades
                                                                - ✅ **CRUD Completo** de dispositivos IoT
                                                                - ✅ **Gestão de Status** (Ativo, Inativo, Manutenção, Erro)
                                                                - ✅ **Tipos de Dispositivos** (Rastreadores, Sensores, Medidores)
                                                                - ✅ **Monitoramento** de comunicação e localização
                                                                - ✅ **Filtros Avançados** por tipo, status e conectividade
                                                                - ✅ **Validações Robustas** com tratamento de erros

                                                                ## Contexto
                                                                Esta API simula a base de um sistema de monitoramento IoT para empresas
                                                                que precisam gerenciar múltiplos tipos de dispositivos conectados.
                                                                """)
                                                .contact(new Contact()
                                                                .name("David Silva")
                                                                .email("davidbs09@gmail.com")
                                                                .url("https://github.com/davidbs09"))
                                                .license(new License()
                                                                .name("MIT License")
                                                                .url("https://opensource.org/licenses/MIT")))
                                .servers(List.of(
                                                new Server()
                                                                .url("http://localhost:8080")
                                                                .description("Servidor de Desenvolvimento")));
        }
}
