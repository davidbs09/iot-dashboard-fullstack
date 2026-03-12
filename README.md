# 🌐 IoT Dashboard — Fullstack

Sistema fullstack para **gerenciamento e monitoramento de dispositivos IoT**, com dashboard em tempo real, CRUD completo e visualização de métricas. O projeto é composto por dois módulos independentes que trabalham em conjunto: uma API REST em Java e uma interface moderna em Angular.

---

## 📦 Projetos

### 🔧 [Backend](./Backend)
API REST desenvolvida em **Java 21** com **Spring Boot 3.5.4**, responsável por toda a lógica de negócio, persistência de dados e exposição dos endpoints consumidos pelo frontend.

**Principais tecnologias:** Java 21 · Spring Boot · Spring Data JPA · H2 Database · Swagger/OpenAPI · Maven

**Destaques:**
- CRUD completo de dispositivos IoT
- Dashboard com estatísticas gerais, por status, por tipo, conectividade e alertas automáticos
- Documentação interativa via Swagger UI em `/swagger-ui/index.html`
- Arquitetura MVC com camadas bem definidas (Controller → Service → Repository)

---

### 🎨 [Frontend](./Frontend)
Interface responsiva desenvolvida em **Angular 18** com **TypeScript** e **Angular Material**, consumindo a API do backend para exibir e gerenciar os dispositivos IoT.

**Principais tecnologias:** Angular 18 · TypeScript · Angular Material · Chart.js · Bootstrap · RxJS · SCSS

**Destaques:**
- Dashboard com cards de métricas, gráficos interativos e auto-refresh
- Listagem de dispositivos com filtros dinâmicos e busca em tempo real
- Formulário de criação e edição com validação
- Design responsivo (desktop, tablet e mobile)
- Performance otimizada com lazy loading e OnPush change detection

---

## 🚀 Como executar

### Backend
```bash
cd Backend
./mvnw spring-boot:run
# Disponível em http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui/index.html
```

### Frontend
```bash
cd Frontend
npm install
ng serve
# Disponível em http://localhost:4200
```

> O frontend se conecta ao backend na porta `8080` por padrão.

---

## 🏗️ Arquitetura

```
iot-dashboard-fullstack/
├── Backend/     # API REST — Java 21 + Spring Boot
└── Frontend/    # SPA — Angular 18
```

A comunicação entre os módulos ocorre via **HTTP REST**. O backend expõe os endpoints e o frontend os consome através de serviços Angular com `HttpClient`.

---

## 👨‍💻 Autor

**David Bissaco da Silva**
- [LinkedIn](https://www.linkedin.com/in/david-bissaco-da-silva/)
