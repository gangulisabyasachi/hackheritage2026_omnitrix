const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('smriti_token');
    }
  }

  public setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('smriti_token', token);
      } else {
        localStorage.removeItem('smriti_token');
      }
    }
  }

  public getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('smriti_token');
    }
    return this.token;
  }

  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }
      return data as T;
    } catch (error: any) {
      console.warn(`API Request error [${endpoint}]:`, error.message);
      throw error;
    }
  }

  // Auth
  async login(email: string, password: string) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.token) {
      this.setToken(res.token);
    }
    return res;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // Patients
  async getPatients() {
    return this.request('/patients');
  }

  async getPatientById(id: string) {
    // Try authenticated endpoint first; fallback to public patient endpoint
    try {
      return await this.request(`/patients/${id}`);
    } catch {
      return await this.request(`/public/patient/${id}`);
    }
  }

  async createPatient(patientData: any) {
    return this.request('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  }

  async updatePatient(id: string, updateData: any) {
    return this.request(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // Games
  async getGames() {
    return this.request('/games');
  }

  async submitGameSession(gameId: string, sessionData: any) {
    return this.request(`/games/${gameId}/session`, {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async getPatientGameSessions(patientId: string, limit: number = 20) {
    return this.request(`/patients/${patientId}/game-sessions?limit=${limit}`);
  }

  // Analytics
  async getPatientAnalytics(patientId: string) {
    return this.request(`/patients/${patientId}/analytics`);
  }

  // Family Members
  async getFamilyMembers(patientId: string) {
    return this.request(`/patients/${patientId}/family`);
  }

  async createFamilyMember(patientId: string, data: any) {
    return this.request(`/patients/${patientId}/family`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteFamilyMember(familyId: string) {
    return this.request(`/family/${familyId}`, {
      method: 'DELETE',
    });
  }

  // Memories
  async getMemories(patientId: string) {
    return this.request(`/patients/${patientId}/memories`);
  }

  async createMemory(patientId: string, data: any) {
    return this.request(`/patients/${patientId}/memories`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteMemory(memoryId: string) {
    return this.request(`/memories/${memoryId}`, {
      method: 'DELETE',
    });
  }

  // Routines, Medications, Appointments
  async getRoutines(patientId: string) {
    return this.request(`/patients/${patientId}/routines`);
  }

  async createRoutine(patientId: string, data: any) {
    return this.request(`/patients/${patientId}/routines`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMedications(patientId: string) {
    return this.request(`/patients/${patientId}/medications`);
  }

  async createMedication(patientId: string, data: any) {
    return this.request(`/patients/${patientId}/medications`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAppointments(patientId: string) {
    return this.request(`/patients/${patientId}/appointments`);
  }

  async createAppointment(patientId: string, data: any) {
    return this.request(`/patients/${patientId}/appointments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Reminders & Mood
  async getReminders(patientId: string) {
    return this.request(`/patients/${patientId}/reminders`);
  }

  async updateReminderStatus(reminderId: string, status: string) {
    return this.request(`/reminders/${reminderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async submitMood(patientId: string, mood: string, optionalNote?: string) {
    return this.request(`/patients/${patientId}/mood`, {
      method: 'POST',
      body: JSON.stringify({ mood, optionalNote }),
    });
  }

  async getNotifications(patientId: string) {
    return this.request(`/patients/${patientId}/notifications`);
  }

  // AI Assistant
  async askMemoryAssistant(patientId: string, query: string, language: string = 'en') {
    return this.request('/ai/memory-assistant', {
      method: 'POST',
      body: JSON.stringify({ patientId, query, language }),
    });
  }

  async generateCaregiverSummary(patientId: string) {
    return this.request('/ai/caregiver-summary', {
      method: 'POST',
      body: JSON.stringify({ patientId }),
    });
  }
}

export const api = new ApiService();
