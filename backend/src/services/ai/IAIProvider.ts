export interface PatientAIContext {
  patientName: string;
  age: number;
  preferredLanguage: string;
  routines: Array<{ time: string; activity: string; description?: string }>;
  medications: Array<{ name: string; dosage: string; schedule: string[]; instructions?: string }>;
  appointments: Array<{ title: string; provider: string; date: string; time: string; location: string }>;
  familyMembers: Array<{ name: string; relationship: string; trivia?: string }>;
  memories: Array<{ title: string; description: string; category?: string }>;
  preferences: Record<string, any>;
}

export interface IAIProvider {
  name: string;
  isAvailable(): boolean;
  generateAssistantResponse(
    query: string,
    context: PatientAIContext,
    language?: string
  ): Promise<string>;
  generateCaregiverSummary(
    patientName: string,
    metrics: Record<string, any>,
    recentSessions: Array<any>
  ): Promise<string>;
  generateActivityRecommendation(
    patientName: string,
    performanceTrends: Record<string, any>
  ): Promise<string>;
}
