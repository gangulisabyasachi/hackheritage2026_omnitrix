import { IAIProvider, PatientAIContext } from '../IAIProvider';
import { RuleBasedFallbackProvider } from './RuleBasedFallbackProvider';

export class HuggingFaceProvider implements IAIProvider {
  public name = 'huggingface';
  private apiKey: string;
  private fallback: RuleBasedFallbackProvider;

  constructor() {
    this.apiKey = process.env.HUGGINGFACE_API_KEY || '';
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

    try {
      const model = 'meta-llama/Llama-3.2-3B-Instruct';
      const prompt = `Context: ${JSON.stringify(context)}\nQuestion: ${query}\nAnswer gently in 2 sentences strictly based on context:`;

      const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 150 } }),
      });

      if (!response.ok) {
        return this.fallback.generateAssistantResponse(query, context, language);
      }

      const data: any = await response.json();
      const output = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text;
      return output?.trim() || this.fallback.generateAssistantResponse(query, context, language);
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
