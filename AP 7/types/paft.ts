export const PERSONAS = ['Expert Advisor', 'Teacher', 'Consultant', 'Creative Thinker'] as const;
export const AUDIENCES = ['General Public', 'Professionals', 'Students', 'Executives'] as const;
export const FORMATS = ['Outline', 'Essay', 'Bullet Points', 'Step-by-Step'] as const;
export const TONES = ['Formal', 'Casual', 'Friendly', 'Authoritative'] as const;

export type Persona = string;
export type Audience = string;
export type Format = string;
export type Tone = string;

export interface PAFTContext {
  persona: Persona;
  audience: Audience[];
  format: Format;
  tone: Tone;
}

export interface PAFTState extends PAFTContext {
  setPersona: (persona: Persona) => void;
  toggleAudience: (audience: Audience) => void;
  setFormat: (format: Format) => void;
  setTone: (tone: Tone) => void;
}