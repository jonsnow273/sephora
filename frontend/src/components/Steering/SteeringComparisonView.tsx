import React, { useState } from 'react';
import { SteeringPreset, SteeringComparisonResult } from '@/types/steering';
import { Sliders, Zap, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface SteeringComparisonViewProps {
  onRunComparison?: (prompt: string, preset: SteeringPreset, strength: number) => Promise<void>;
  currentResult?: SteeringComparisonResult | null;
  isLoading?: boolean;
}

export const SteeringComparisonView: React.FC<SteeringComparisonViewProps> = ({
  onRunComparison,
  currentResult,
  isLoading = false,
}) => {
  const [prompt, setPrompt] = useState('Explain what a race condition is in multi-threaded programming.');
  const [preset, setPreset] = useState<SteeringPreset>('concise');
  const [strength, setStrength] = useState<number>(1.8);

  const handleCompare = async () => {
    if (onRunComparison && prompt.trim()) {
      await onRunComparison(prompt, preset, strength);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-400" />
            Activation Steering Comparison Lab
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Observe how identical prompts produce different observable behaviors via internal residual stream interventions.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-purple-950/60 border border-purple-800/40 text-purple-300 px-3 py-1.5 rounded-full">
          <span>Zero Prompt Overhead</span>
        </div>
      </div>

      {/* Input & Controls */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            Test Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-sm text-gray-200 focus:outline-none focus:border-purple-500 transition"
            placeholder="Type a prompt to test across baseline and steered generation..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Preset Selector */}
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
              Behavioral Direction Preset
            </label>
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value as SteeringPreset)}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-sm text-gray-200 focus:outline-none focus:border-purple-500"
            >
              <option value="concise">Concise (Layer 19, -60% tokens)</option>
              <option value="cautious">Cautious (Layer 16, Risk awareness)</option>
              <option value="detailed">Detailed (Layer 21, Technical rigor)</option>
              <option value="creative">Creative (Layer 13, Associative breadth)</option>
              <option value="neutral">Neutral (α = 0, Baseline)</option>
            </select>
          </div>

          {/* Strength Slider */}
          <div>
            <div className="flex justify-between text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
              <span>Steering Multiplier (α)</span>
              <span className="font-mono text-purple-400 font-bold">{strength.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="3.0"
              step="0.1"
              value={strength}
              onChange={(e) => setStrength(parseFloat(e.target.value))}
              className="w-full accent-purple-500 bg-gray-950 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
              <span>0.0 (Baseline)</span>
              <span>1.5 (Balanced)</span>
              <span>3.0 (Max / Saturation limit)</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleCompare}
          disabled={isLoading || !prompt.trim()}
          className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition"
        >
          <Zap className="w-4 h-4" />
          {isLoading ? 'Running Dual Forward Pass...' : 'Run Side-by-Side Evaluation'}
        </button>
      </div>

      {/* Side-by-Side Comparison Output */}
      {currentResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-800">
          {/* Baseline Panel */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <span className="text-xs font-mono text-gray-400 uppercase">Unsteered Baseline (α = 0)</span>
              <span className="text-xs text-gray-500 font-mono">{currentResult.metrics.unsteeredTokens} tokens</span>
            </div>
            <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
              {currentResult.unsteeredOutput}
            </p>
          </div>

          {/* Steered Panel */}
          <div className="bg-purple-950/20 border border-purple-800/40 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-purple-800/30 pb-2">
              <span className="text-xs font-mono text-purple-300 uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                Steered: {currentResult.appliedDirection} (α = +{currentResult.strength.toFixed(1)})
              </span>
              <span className="text-xs text-purple-300 font-mono">
                {currentResult.metrics.steeredTokens} tokens ({currentResult.metrics.tokenDeltaPercentage > 0 ? '+' : ''}
                {currentResult.metrics.tokenDeltaPercentage}%)
              </span>
            </div>
            <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
              {currentResult.steeredOutput}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
