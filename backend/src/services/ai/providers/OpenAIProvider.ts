import { IAIProvider, PatientAIContext } from '../IAIProvider';
import { RuleBasedFallbackProvider } from './RuleBasedFallbackProvider';

export class OpenAIProvider implements IAIProvider {
  public name = 'openai';
  private apiKey: string;
  private fallback: RuleBasedFallbackProvider;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
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

    const systemPrompt = `You are a warm, gentle, and respectful cognitive memory assistant for an elderly patient named ${context.patientName || 'the patient'}.
CRITICAL SAFETY & MEDICAL RULES:
1. You must ONLY answer using the supplied patient context below.
2. If the user asks about a family member, routine item, medicine, or appointment that is NOT in the context, explicitly say: "I don't have that information yet. Your caregiver can add it to your memory profile."
3. NEVER fabricate or guess any medical detail, family member, medication, or appointment.
4. NEVER provide medical diagnosis, clinical opinions, or say whether they have dementia or Alzheimer's.
5. Keep answers short, friendly, reassuring, and very easy to read. Maximum 2-3 sentences.
6. Preferred language for response: ${language || 'English'}.

PATIENT CONTEXT:
${JSON.stringify(context, null, 2)}`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query },
          ],
          max_tokens: 250,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        console.warn(`OpenAI API returned status ${response.status}. Falling back to rule engine.`);
        return this.fallback.generateAssistantResponse(query, context, language);
      }

      const data: any = await response.json();
      return data.choices?.[0]?.message?.content?.trim() || this.fallback.generateAssistantResponse(query, context, language);
    } catch (err: any) {
      console.warn(`OpenAI request error: ${err.message}. Falling back.`);
      return this.fallback.generateAssistantResponse(query, context, language);
    }
  }

  public async generateCaregiverSummary(
    patientName: string,
    metrics: Record<string, any>,
    recentSessions: Array<any>
  ): Promise<string> {
    if (!this.isAvailable()) {
      return this.fallback.generateCaregiverSummary(patientName, metrics, recentSessions);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'You are an empathetic healthcare & caregiver summary assistant. Provide a 3-bullet concise summary of cognitive engagement trends. Do not provide clinical diagnosis.',
            },
            {
              role: 'user',
              content: `Summarize cognitive activity for patient ${patientName}: Metrics: ${JSON.stringify(
                metrics
              )}, Recent ${recentSessions.length} sessions.`,
            },
          ],
          max_tokens: 300,
        }),
      });

      const data: any = await response.json();
      return data.choices?.[0]?.message?.content?.trim() || this.fallback.generateCaregiverSummary(patientName, metrics, recentSessions);
    } catch {
      return this.fallback.generateCaregiverSummary(patientName, metrics, recentSessions);
    }
  }

  public async generateActivityRecommendation(
    patientName: string,
    performanceTrends: Record<string, any>
  ): Promise<string> {
    return this.fallback.generateActivityRecommendation(patientName, performanceTrends);
  }
}
