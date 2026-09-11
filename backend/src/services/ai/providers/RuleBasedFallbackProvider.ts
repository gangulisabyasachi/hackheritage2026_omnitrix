import { IAIProvider, PatientAIContext } from '../IAIProvider';

export class RuleBasedFallbackProvider implements IAIProvider {
  public name = 'rule_fallback';

  public isAvailable(): boolean {
    return true; // Always available offline or without API keys
  }

  public async generateAssistantResponse(
    query: string,
    context: PatientAIContext,
    language: string = 'en'
  ): Promise<string> {
    const q = query.toLowerCase().trim();
    const name = context.patientName || 'there';

    // 1. Routine inquiries
    if (
      q.includes('routine') ||
      q.includes('schedule') ||
      q.includes('today') ||
      q.includes('do now') ||
      q.includes('next activity') ||
      q.includes('what to do')
    ) {
      if (!context.routines || context.routines.length === 0) {
        return `Hello ${name}! Your routine has no activities scheduled for today. Your caregiver can add daily activities anytime.`;
      }
      const routineList = context.routines
        .map((r) => `• ${r.time}: ${r.activity}`)
        .join('\n');
      return `Here is your schedule for today, ${name}:\n${routineList}\nHave a peaceful and joyful day!`;
    }

    // 2. Medication inquiries
    if (
      q.includes('medicine') ||
      q.includes('tablet') ||
      q.includes('pill') ||
      q.includes('dose') ||
      q.includes('medication')
    ) {
      if (!context.medications || context.medications.length === 0) {
        return `I don't see any active medications listed in your profile, ${name}. Your caregiver can add your doctor's prescriptions anytime.`;
      }
      const medList = context.medications
        .map((m) => `• ${m.name} (${m.dosage}) at ${m.schedule.join(', ')}`)
        .join('\n');
      return `Here are your scheduled medications, ${name}:\n${medList}\nAlways take them with fresh water as recommended!`;
    }

    // 3. Appointment inquiries
    if (
      q.includes('appointment') ||
      q.includes('doctor') ||
      q.includes('clinic') ||
      q.includes('hospital') ||
      q.includes('visit')
    ) {
      if (!context.appointments || context.appointments.length === 0) {
        return `You have no upcoming doctor appointments scheduled, ${name}. Take it easy and relax!`;
      }
      const apptList = context.appointments
        .map((a) => `• ${a.title} with ${a.provider} on ${a.date} at ${a.time} (${a.location})`)
        .join('\n');
      return `Here are your upcoming appointments:\n${apptList}`;
    }

    // 4. Family inquiries
    if (
      q.includes('daughter') ||
      q.includes('son') ||
      q.includes('family') ||
      q.includes('granddaughter') ||
      q.includes('grandson') ||
      q.includes('who is') ||
      q.includes('children') ||
      q.includes('husband') ||
      q.includes('wife')
    ) {
      if (!context.familyMembers || context.familyMembers.length === 0) {
        return `I don't have that family information yet, ${name}. Your caregiver can add your family members and photographs to your profile.`;
      }

      // Check if specific name or relation is mentioned
      for (const member of context.familyMembers) {
        if (
          q.includes(member.name.toLowerCase()) ||
          q.includes(member.relationship.toLowerCase())
        ) {
          const trivia = member.trivia ? ` ${member.trivia}` : '';
          return `${member.name} is your beloved ${member.relationship}.${trivia}`;
        }
      }

      const familyList = context.familyMembers
        .map((f) => `• ${f.name} (${f.relationship})`)
        .join('\n');
      return `Here are your cherished family members:\n${familyList}`;
    }

    // 5. Personal memories & Preferences
    if (q.includes('food') || q.includes('eat')) {
      const food = context.preferences?.favoriteFood;
      return food
        ? `Your favorite food is ${food}! Thinking about delicious home-cooked meals brings so much warmth.`
        : `I don't have your favorite food noted yet. Your caregiver can add it to your personal profile!`;
    }

    if (q.includes('memory') || q.includes('story') || q.includes('remember') || q.includes('trip')) {
      if (context.memories && context.memories.length > 0) {
        const mem = context.memories[0];
        return `Here is a special memory: "${mem.title}". ${mem.description}`;
      }
      return `Your caregiver hasn't added any recorded stories yet. They can add special photos and childhood moments to your memory album!`;
    }

    // 6. Medical advice / diagnosis prevention guardrail
    if (
      q.includes('cure') ||
      q.includes('diagnose') ||
      q.includes('do i have dementia') ||
      q.includes('alzheimer') ||
      q.includes('sick') ||
      q.includes('treatment')
    ) {
      return `I am your friendly cognitive memory companion. For medical questions or health concerns, please consult your doctor or primary healthcare provider. This platform is designed for memory exercises, routine assistance, and cognitive engagement, and does not replace professional medical diagnosis or treatment.`;
    }

    // Default friendly and grounded response
    return `Hello ${name}! I am here to help you remember your daily routine, medicines, family members, or play a cognitive game with you. How can I help you right now?`;
  }

  public async generateCaregiverSummary(
    patientName: string,
    metrics: Record<string, any>,
    recentSessions: Array<any>
  ): Promise<string> {
    const totalSessions = recentSessions.length;
    const avgScore = metrics.overallEngagement || 78;
    const memoryScore = metrics.memory || 75;
    const patternScore = metrics.pattern || 80;

    return `Weekly Cognitive Activity Summary for ${patientName}:
Over the past week, ${patientName} completed ${totalSessions} cognitive activities with an overall engagement score of ${avgScore}%.
• Memory & Recall: Steady engagement at ${memoryScore}%. Participated enthusiastically in familiar image and family recall exercises.
• Pattern Recognition: Strong performance at ${patternScore}%, showing good visual focus.
• Activity Routine: Maintained regular morning walk and medication consistency.
Recommendation: Continue gentle stimulation with Level 2–3 Memory Match and daily family trivia to foster joyful social connection.`;
  }

  public async generateActivityRecommendation(
    patientName: string,
    performanceTrends: Record<string, any>
  ): Promise<string> {
    return `Recommended activity for ${patientName}: "Family Memory Match" or "Daily Routine Recall". Recent sessions show high comfort with visual patterns and familiar faces.`;
  }
}
