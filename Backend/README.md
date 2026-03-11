
# 🚀 IoT Dashboard Backend

Backend em **Java 21** e **Spring Boot 3.5.4** para gerenciamento de dispositivos IoT, com dashboard de estatísticas em tempo real e CRUD completo.


## ✨ Principais Funcionalidades
- CRUD completo de dispositivos IoT
- Dashboard com estatísticas (status, tipos, conectividade, alertas)
- Validação robusta, arquitetura MVC, documentação Swagger/OpenAPI
- Banco H2 para desenvolvimento


## 🛠️ Tecnologias
- Java 21, Spring Boot 3.5.4, Spring Data JPA, Bean Validation, Lombok
- SpringDoc OpenAPI, Swagger UI
- H2 Database, Maven

src/main/java/com/dashboard/crud_iot/

## 📁 Estrutura
```
src/main/java/com/dashboard/crud_iot/
├── controllers/           # REST
├── dto/                   # Transferência de dados
├── entities/              # Entidades JPA
├── enums/                 # Enumerações
├── repositories/          # Dados
├── services/              # Lógica de negócio
├── config/                # Configurações
└── CrudLotApplication.java   # Principal
```


## 🚀 Execução
Pré-requisitos: Java 21, Maven 3.8+

Swagger: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)<br>
H2 Console: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)<br>
JDBC URL: `jdbc:h2:mem:testdb` | Username: `sa` | Password: *(vazio)*


## 📡 Endpoints Principais

Dispositivos:
- `GET /api/devices` - Lista todos
- `GET /api/devices/{id}` - Busca por ID
- `POST /api/devices` - Cria
- `PUT /api/devices/{id}` - Atualiza
- `DELETE /api/devices/{id}` - Remove

Dashboard:
- `GET /api/dashboard/stats/general` - Estatísticas gerais
- `GET /api/dashboard/stats/by-status` - Por status
- `GET /api/dashboard/stats/by-type` - Por tipo
- `GET /api/dashboard/stats/connectivity` - Conectividade
- `GET /api/dashboard/alerts` - Alertas

## 📋 Exemplos

Criar dispositivo:
```json
POST /api/devices
{
  "deviceName": "Sensor Temperatura - Sala A1",
  "deviceIdentifier": "TEMP-001-A1",
  "deviceType": "TEMPERATURE_SENSOR"
}
```

Dashboard:
```json
GET /api/dashboard/stats/general
{
  "totalDevices": 125,
  "onlineDevices": 98
}
```


## 🎯 Dashboard
- Métricas principais: total, online/offline, status, disponibilidade
- Alertas automáticos e classificação por severidade
- Análises: distribuição por tipo, conectividade, performance


## 🏗️ Arquitetura
- MVC, DTO, Repository, Service Layer
- Validação, tratamento de exceções, logs, documentação automática
- CORS, profiles, configurações externalizadas


## 🚀 Melhorias Futuras
- Autenticação, Docker, PostgreSQL, WebSocket, notificações, métricas, logging centralizado
- Cache, paginação avançada, rate limiting, monitoramento


## 👨‍💻 Autor
**David Bissaco da Silva**
- [LinkedIn](https://www.linkedin.com/in/david-bissaco-da-silva/)
- [GitHub](https://github.com/davidbs09)
- Email: davidbissacodasilva@gmail.com


## 📄 Licença
Projeto disponível para fins educacionais e demonstração técnica.
