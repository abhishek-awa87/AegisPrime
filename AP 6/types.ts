export type AegisState =
  | 'idle'
  | 'generating_strategy'
  | 'strategy_generated'
  | 'generating_blueprint'
  | 'blueprint_generated';

export interface Strategy {
  persona: string;
  audience: string;
  format: string;
  tone: string;
}

export interface Notification {
  id: number;
  message: string;
}
