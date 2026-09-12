// Activation Steering & Mechanistic Interpretability Types

export type SteeringPreset = 'neutral' | 'cautious' | 'concise' | 'detailed' | 'creative';

export interface SteeringDirection {
  id: string;
  label: string;
  description: string;
  layerIndex: number;
  strength: number;       // Range: -3.0 to +3.0
  isActive: boolean;
  category?: 'style' | 'safety' | 'reasoning' | 'custom';
}

export interface LayerActivation {
  layerIndex: number;
  meanActivation: number;
  maxActivation: number;
  activations: number[];  // Per-token activation norms
}

export interface SteeringSession {
  preset: SteeringPreset;
  directions: SteeringDirection[];
  layerActivations: LayerActivation[];
  modelName: string;
  totalLayers: number;
}

// Side-by-Side Comparison Lab Types
export interface SteeringComparisonResult {
  prompt: string;
  unsteeredOutput: string;
  steeredOutput: string;
  preset: SteeringPreset;
  appliedDirection: string;
  strength: number;
  targetLayer: number;
  metrics: {
    unsteeredTokens: number;
    steeredTokens: number;
    tokenDeltaPercentage: number;
    latencyMs: number;
    estimatedPerplexityDelta?: number;
  };
}

export interface BenchmarkPrompt {
  id: string;
  category: 'automation' | 'technical' | 'conversational';
  prompt: string;
  recommendedPreset: SteeringPreset;
  expectedBehavior: string;
}
