import { RuleBasedFallbackProvider } from '../services/ai/providers/RuleBasedFallbackProvider';
import { PatientAIContext } from '../services/ai/IAIProvider';

describe('AI Fallback & Safety Guardrails', () => {
  const provider = new RuleBasedFallbackProvider();

  const mockContext: PatientAIContext = {
    patientName: 'Mrs. Ananya Das',
    age: 74,
    preferredLanguage: 'as',
    routines: [
      { time: '08:30 AM', activity: 'Breakfast', description: 'Porridge and tea' },
      { time: '09:15 AM', activity: 'Morning Medicine', description: 'Donepezil' },
    ],
    medications: [
      {
        name: 'Donepezil',
        dosage: '5mg',
        schedule: ['09:15 AM'],
        instructions: 'Take with water',
      },
    ],
    appointments: [
      {
        title: 'Dr. Barua Review',
        provider: 'Dr. Barua',
        date: '2026-09-22',
        time: '11:00 AM',
        location: 'Apollo Clinic',
      },
    ],
    familyMembers: [
      {
        name: 'Priyadarshini',
        relationship: 'Daughter',
        trivia: 'She calls every evening at 4:30 PM.',
      },
    ],
    memories: [
      {
        title: 'Kaziranga Trip',
        description: 'Saw one-horned rhinos.',
        category: 'family',
      },
    ],
    preferences: {
      favoriteFood: 'Masor Tenga fish curry',
    },
  };

  it('should answer routine question using patient context without hallucination', async () => {
    const response = await provider.generateAssistantResponse(
      'What do I have to do today?',
      mockContext
    );
    expect(response).toContain('Breakfast');
    expect(response).toContain('08:30 AM');
    expect(response).toContain('Mrs. Ananya Das');
  });

  it('should answer medication questions accurately from context', async () => {
    const response = await provider.generateAssistantResponse(
      'When do I take my medicine?',
      mockContext
    );
    expect(response).toContain('Donepezil');
    expect(response).toContain('09:15 AM');
  });

  it('should answer family questions accurately from context', async () => {
    const response = await provider.generateAssistantResponse(
      'Who is Priyadarshini?',
      mockContext
    );
    expect(response).toContain('Daughter');
    expect(response).toContain('Priyadarshini');
  });

  it('should state information is unavailable when asked about unrecorded items', async () => {
    const emptyContext: PatientAIContext = {
      ...mockContext,
      medications: [],
      appointments: [],
    };
    const medResponse = await provider.generateAssistantResponse(
      'What medicine do I take?',
      emptyContext
    );
    expect(medResponse).toContain("don't see any active medications");

    const apptResponse = await provider.generateAssistantResponse(
      'When is my appointment?',
      emptyContext
    );
    expect(apptResponse).toContain('no upcoming doctor appointments');
  });

  it('should refuse medical diagnosis and direct to doctor', async () => {
    const diagResponse = await provider.generateAssistantResponse(
      'Do I have dementia or Alzheimer?',
      mockContext
    );
    expect(diagResponse).toContain('consult your doctor');
    expect(diagResponse).toContain('does not replace');
  });
});
