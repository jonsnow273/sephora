# 🔬 Activation Steering in Sephora

Activation steering is the research core of Sephora. Instead of tweaking system prompts or fine-tuning weights, Sephora controls model behavior by **surgically modifying intermediate activations** during the forward pass.

---

## 💡 Conceptual Foundation

In modern decoder transformers, token representations pass through a sequence of residual layers.
A concept (e.g., *caution*, *conciseness*, *creativity*) can often be represented as a direction vector in the activation space of a specific layer.

During inference, we add a steering vector scaled by a user-controlled strength multiplier:
- **Positive multiplier**: Increases the expression of the target behavior.
- **Zero multiplier**: Standard unsteered output.
- **Negative multiplier**: Suppresses the behavior.

---

## 🛠️ Implementation with TransformerLens

Sephora uses `HookedTransformer` from **TransformerLens**:
1. Hooks are registered at target residual stream layers (`blocks.{layer}.hook_resid_post`).
2. Custom hook functions compute and inject vector additions.
3. Because model weights are untouched, multiple steering directions can be dynamically applied or toggled in real time without reloading the model.

---

## 🎛️ Built-in Presets

| Preset | Target Layer | Direction | Effect |
|--------|--------------|-----------|--------|
| `cautious` | Middle layers (~14-16) | Safety / Risk Awareness | Highlights risks, validates user intentions before acting |
| `concise` | Middle-late layers (~18-20) | Brevity / Directness | Removes filler words; outputs brief bullet points |
| `detailed` | Late layers (~20-24) | Elaboration | Provides deep explanations and context |
| `creative` | Early-middle layers (~10-14) | Temperature / Diversity | Suggests imaginative, out-of-the-box approaches |

---

## 📊 Visual Dashboard

The React frontend includes a dedicated Steering Dashboard:
- **Layer Activation Heatmap**: Displays per-layer activation magnitudes across generated tokens.
- **Direction Sliders**: Interactive controls from `-3.0` to `+3.0` for real-time steering calibration.
- **Side-by-Side Comparator**: Inspect responses generated with and without steering vectors.
