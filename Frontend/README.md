
# IoT Dashboard Frontend

Interface moderna para gerenciamento de dispositivos IoT, desenvolvida em **Angular 18** com **TypeScript** e **Angular Material**. O projeto oferece dashboard em tempo real, CRUD completo e visualização intuitiva de métricas dos dispositivos.


## Funcionalidades

- CRUD completo de dispositivos IoT (listar, criar, editar, excluir)
- Filtros dinâmicos e busca em tempo real
- Dashboard com métricas, gráficos e auto-refresh
- Design responsivo (desktop, tablet, mobile)
- Performance otimizada (lazy loading, OnPush, debounced search)


## Tecnologias

- Angular 18, TypeScript, Angular Material
- Chart.js, ng2-charts, Bootstrap, Font Awesome
- RxJS, SASS/SCSS, Angular CLI


## Estrutura

```
src/app/
├── 📁 components/                # Componentes reutilizáveis
│   ├── 📁 device-form/              # Formulário de dispositivos
│   │   ├── device-form.component.ts
│   │   ├── device-form.component.html
│   │   └── device-form.component.scss
│   ├── 📁 device-list/              # Lista de dispositivos
│   │   ├── device-list.component.ts
│   │   ├── device-list.component.html
│   │   └── device-list.component.scss
│   └── 📁 dashboard/                # Componentes do dashboard
│       ├── 📁 dashboard-card/           # Cards de métricas
│       ├── 📁 dashboard-chart/          # Gráficos interativos
│       └── 📁 dashboard-alerts/         # Sistema de alertas
├── 📁 pages/                     # Páginas principais
│   ├── 📁 dashboard-page/           # Página do dashboard
│   └── 📁 devices/                  # Página de dispositivos
├── 📁 services/                  # Serviços e lógica de negócio
│   ├── device.service.ts            # Comunicação com API de dispositivos
│   └── dashboard.service.ts         # Lógica do dashboard e métricas
├── 📁 models/                    # Interfaces e tipos TypeScript
│   ├── device.model.ts              # Modelo de dispositivos
│   └── dashboard.model.ts           # Modelos do dashboard
├── 📁 shared/                    # Componentes e utilitários compartilhados
└── 📁 assets/                    # Recursos estáticos (imagens, fontes)
```


## Como Executar


**Pré-requisitos:**
- Node.js 18+, npm 9+ ou yarn, Angular CLI 18


Clone o repositório:
```bash
git clone https://github.com/davidbs09/iot-dashboard-frontend.git
cd crud-Iot__frontend
```


Instale as dependências:
```bash
npm install
# ou
yarn install
```


Execute a aplicação:
```bash
ng serve
# ou
npm start
```


Acesse em: http://localhost:4200


Para build de produção:
```bash
ng build --configuration production
```


## Integração

Consome API do backend [IoT Dashboard Backend](https://github.com/davidbs09/iot-dashboard-backend).
Configuração da API:
```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```


## Autor

**David Bissaco da Silva**
- [LinkedIn](https://www.linkedin.com/in/david-bissaco-da-silva/)
- [GitHub](https://github.com/davidbs09)
- Email: davidbissacodasilva@gmail.com

## Licença

Projeto disponível para fins educacionais e demonstração técnica.
