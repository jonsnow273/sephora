// Activation Steering types

export type SteeringPreset = 'neutral' | 'cautious' | 'concise' | 'detailed' | 'creative';

export interface SteeringDirection {
  id: string;
  label: string;
  description: string;
  layerIndex: number;
  strength: number;       // -3.0 to +3.0
  isActive: boolean;
}

export interface LayerActivation {
  layerIndex: number;
  meanActivation: number;
  maxActivation: number;
  activations: number[];  // per-token activations
}

export interface SteeringSession {
  preset: SteeringPreset;
  directions: SteeringDirection[];
  layerActivations: LayerActivation[];
  modelName: string;
  totalLayers: number;
}
