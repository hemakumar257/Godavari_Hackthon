const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export interface HealthCheckResponse {
  status: string;
  service: string;
  version: string;
  database: {
    connected: boolean;
    type: string;
    message: string;
  };
  timestamp: string;
}

export const apiService = {
  async getHealth(): Promise<HealthCheckResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      return {
        status: 'degraded',
        service: 'godavari-pushkaralu-backend',
        version: '1.0.0',
        database: {
          connected: false,
          type: 'MongoDB',
          message: error instanceof Error ? error.message : 'Backend unreachable or starting',
        },
        timestamp: new Date().toISOString(),
      };
    }
  },
};
