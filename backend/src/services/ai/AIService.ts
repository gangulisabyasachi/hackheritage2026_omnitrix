import { IAIProvider, PatientAIContext } from './IAIProvider';
import { RuleBasedFallbackProvider } from './providers/RuleBasedFallbackProvider';
import { OpenAIProvider } from './providers/OpenAIProvider';
import { GeminiProvider } from './providers/GeminiProvider';
import { HuggingFaceProvider } from './providers/HuggingFaceProvider';
import { Patient, Routine, Medication, Appointment, FamilyMember, Memory } from '../../models';
import mongoose from 'mongoose';

export class AIService {
  private activeProvider: IAIProvider;
  private fallbackProvider: RuleBasedFallbackProvider;

  constructor() {
    this.fallbackProvider = new RuleBasedFallbackProvider();
    const providerName = (process.env.AI_PROVIDER || 'rule_fallback').toLowerCase();

    switch (providerName) {
      case 'openai':
        this.activeProvider = new OpenAIProvider();
        break;
      case 'gemini':
        this.activeProvider = new GeminiProvider();
        break;
      case 'huggingface':
        this.activeProvider = new HuggingFaceProvider();
        break;
      default:
        this.activeProvider = this.fallbackProvider;
        break;
    }

    console.log(`🤖 AI Service initialized with provider: ${this.activeProvider.name}`);
  }

  /**
   * Builds grounded structured context from MongoDB for a given patient.
   * Never sends the raw database or unrelated data.
   */
  public async buildPatientContext(patientId: string | mongoose.Types.ObjectId): Promise<PatientAIContext> {
    const pId = new mongoose.Types.ObjectId(patientId.toString());

    const patient = await Patient.findById(pId).lean();
    const routines = await Routine.find({ patientId: pId, active: true }).sort({ order: 1 }).lean();
    const medications = await Medication.find({ patientId: pId, active: true }).lean();
    const appointments = await Appointment.find({ patientId: pId, completed: false }).lean();
    const familyMembers = await FamilyMember.find({ patientId: pId }).lean();
    const memories = await Memory.find({ patientId: pId }).limit(5).lean();

    return {
      patientName: patient?.name || 'Patient',
      age: patient?.age || 70,
      preferredLanguage: patient?.preferredLanguage || 'en',
      routines: routines.map((r) => ({
        time: r.time,
        activity: r.activity,
        description: r.description,
      })),
      medications: medications.map((m) => ({
        name: m.name,
        dosage: m.dosage,
        schedule: m.schedule,
        instructions: m.instructions,
      })),
      appointments: appointments.map((a) => ({
        title: a.title,
        provider: a.provider,
        date: a.date,
        time: a.time,
        location: a.location,
      })),
      familyMembers: familyMembers.map((f) => ({
        name: f.name,
        relationship: f.relationship,
        trivia: f.trivia,
      })),
      memories: memories.map((m) => ({
        title: m.title,
        description: m.description,
        category: m.category,
      })),
      preferences: patient?.preferences || {},
    };
  }

  public async askMemoryAssistant(
    patientId: string,
    query: string,
    language?: string
  ): Promise<{ response: string; provider: string }> {
    try {
      const context = await this.buildPatientContext(patientId);
      const providerToUse = this.activeProvider.isAvailable()
        ? this.activeProvider
        : this.fallbackProvider;

      const response = await providerToUse.generateAssistantResponse(query, context, language);
      return {
        response,
        provider: providerToUse.name,
      };
    } catch (err: any) {
      console.error('Error in AIService.askMemoryAssistant:', err.message);
      const fallbackResp = await this.fallbackProvider.generateAssistantResponse(query, {
        patientName: 'there',
        age: 70,
        preferredLanguage: 'en',
        routines: [],
        medications: [],
        appointments: [],
        familyMembers: [],
        memories: [],
        preferences: {},
      });
      return {
        response: fallbackResp,
        provider: 'rule_fallback',
      };
    }
  }

  public async generateCaregiverSummary(
    patientName: string,
    metrics: Record<string, any>,
    recentSessions: Array<any>
  ): Promise<string> {
    const providerToUse = this.activeProvider.isAvailable()
      ? this.activeProvider
      : this.fallbackProvider;
    return providerToUse.generateCaregiverSummary(patientName, metrics, recentSessions);
  }

  public async generateActivityRecommendation(
    patientName: string,
    performanceTrends: Record<string, any>
  ): Promise<string> {
    const providerToUse = this.activeProvider.isAvailable()
      ? this.activeProvider
      : this.fallbackProvider;
    return providerToUse.generateActivityRecommendation(patientName, performanceTrends);
  }
}

export const aiService = new AIService();
