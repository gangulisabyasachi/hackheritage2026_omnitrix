import { IAIProvider, PatientAIContext } from '../IAIProvider';
import { RuleBasedFallbackProvider } from './RuleBasedFallbackProvider';

export class GeminiProvider implements IAIProvider {
  public name = 'gemini';
  private apiKey: string;
  private fallback: RuleBasedFallbackProvider;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    this.fallback = new RuleBasedFallbackProvider();
  }

  public isAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  public async generateAssistantResponse(
    query: string,
    context: PatientAIContext,
    language: string = 'en'
  ): Promise<string> {
    if (!this.isAvailable()) {
      return this.fallback.generateAssistantResponse(query, context, language);
    }

    const systemInstruction = `You are a respectful cognitive memory assistant for elderly patient ${context.patientName}.
STRICT RULES:
1. ONLY answer using provided context.
2. If requested info is missing from context, reply: "I don't have that information yet. Your caregiver can add it to your memory profile."
3. NEVER make up family, medicines, appointments, or medical advice.
4. Keep response to 2 friendly sentences. Language: ${language || 'English'}.
Context: ${JSON.stringify(context)}`;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemInstruction}\n\nPatient Query: ${query}` }],
            },
          ],
        }),
      });

      if (!response.ok) {
        return this.fallback.generateAssistantResponse(query, context, language);
      }

      const data: any = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return text?.trim() || this.fallback.generateAssistantResponse(query, context, language);
    } catch {
      return this.fallback.generateAssistantResponse(query, context, language);
    }
  }

  public async generateCaregiverSummary(
    patientName: string,
    metrics: Record<string, any>,
    recentSessions: Array<any>
  ): Promise<string> {
    return this.fallback.generateCaregiverSummary(patientName, metrics, recentSessions);
  }

  public async generateActivityRecommendation(
    patientName: string,
    performanceTrends: Record<string, any>
  ): Promise<string> {
    return this.fallback.generateActivityRecommendation(patientName, performanceTrends);
  }
}
