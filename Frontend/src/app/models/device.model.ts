// Modelo principal do dispositivo IoT (baseado nos dados reais do backend)
// Representa a estrutura completa de um dispositivo como retornado pela API
export interface Device {
  id: number;
  deviceName: string;  // Backend usa deviceName ao invés de name
  deviceIdentifier: string;  // Backend usa deviceIdentifier ao invés de serialNumber
  deviceType: string;  // Backend usa string ao invés de enum
  status: string;  // Backend usa string ao invés de enum
  location: string;
  description: string;  // Novo campo do backend
  lastReading: string | null;  // Novo campo do backend
  lastCommunication: string | null;  // Backend retorna string ISO ou null
  isActive: boolean;  // Backend usa isActive ao invés de isOnline
  latitude: number | null;  // Novo campo do backend
  longitude: number | null;  // Novo campo do backend
  createdAt: string;  // Backend retorna string ISO
  updatedAt: string;  // Backend retorna string ISO
}

// DTO para criação de dispositivo (campos necessários para criação)
export interface DeviceCreateDTO {
  deviceName: string;
  deviceIdentifier: string;
  deviceType: string;
  status: string;
  location: string;
  description: string;
  latitude?: number;
  longitude?: number;
}

// DTO para atualização de dispositivo (campos opcionais)
export interface DeviceUpdateDTO {
  deviceName?: string;
  deviceIdentifier?: string;
  deviceType?: string;
  status?: string;
  location?: string;
  description?: string;
  isActive?: boolean;
  latitude?: number;
  longitude?: number;
}

// Enum para tipos de dispositivos IoT (baseado nos dados reais)
export enum DeviceType {
  TRACKER = 'TRACKER',
  TEMPERATURE_SENSOR = 'TEMPERATURE_SENSOR',
  VIBRATION_SENSOR = 'VIBRATION_SENSOR',
  OXYGEN_METER = 'OXYGEN_METER',
  HUMIDITY_SENSOR = 'HUMIDITY_SENSOR',
  PRESSURE_SENSOR = 'PRESSURE_SENSOR',
  GENERIC = 'GENERIC'
}

// Enum para status dos dispositivos (baseado nos dados reais)
export enum DeviceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  ERROR = 'ERROR',
  OFFLINE = 'OFFLINE',
  CONFIGURING = 'CONFIGURING'
}

// Interface para filtros de busca (atualizada para novos campos)
export interface DeviceFilters {
  deviceType?: string;
  status?: string;
  isActive?: boolean;
  searchTerm?: string;
}

// Interface para resposta paginada (para futuro uso)
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
