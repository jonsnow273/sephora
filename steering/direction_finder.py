"""
Steering vector extraction via contrastive activation differences.

Computes the mean difference between positive and negative
hidden state distributions to derive behavioral steering directions.
"""

from typing import Optional
import torch
import torch.nn.functional as F

from core import logger
from steering.presets import SteeringPreset


class DirectionFinder:
    """
    Extracts behavioral steering vectors from a loaded model using
    contrastive activation differences.

    The extraction procedure:
    1. Forward-pass all positive prompt examples through the model.
    2. Forward-pass all negative prompt examples through the model.
    3. Compute: v = mean(h_pos) - mean(h_neg) at target layer L.
    4. Normalize: v_hat = v / ||v||_2
    """

    def __init__(self, model, tokenizer_wrapper):
        self.model = model
        self.tokenizer_wrapper = tokenizer_wrapper

    def _extract_hidden_state(
        self,
        text: str,
        layer_index: int,
    ) -> Optional[torch.Tensor]:
        """
        Run a single forward pass and extract the hidden state at
        the specified layer for the final token position.

        Args:
            text: Input string to process.
            layer_index: Which transformer layer to extract from.

        Returns:
            Tensor of shape (d_model,) or None on failure.
        """
        tokenizer = self.tokenizer_wrapper.tokenizer
        inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
        device = next(self.model.parameters()).device
        inputs = {k: v.to(device) for k, v in inputs.items()}

        try:
            with torch.no_grad():
                outputs = self.model(**inputs, output_hidden_states=True)

            hidden_states = outputs.hidden_states
            total_layers = len(hidden_states) - 1
            effective_idx = layer_index + 1
            if effective_idx >= len(hidden_states):
                effective_idx = max(1, len(hidden_states) - 3)
                logger.debug(f"Target layer {layer_index} clamped to model layer {effective_idx - 1} (total: {total_layers})")

            # Extract the last token's hidden state: shape (d_model,)
            layer_hidden = hidden_states[effective_idx]  # (batch, seq_len, d_model)
            last_token_hidden = layer_hidden[0, -1, :]     # (d_model,)
            return last_token_hidden.float().cpu()

        except Exception as e:
            logger.error(f"Hidden state extraction failed: {e}")
            return None

    def compute_direction(
        self,
        preset: SteeringPreset,
    ) -> Optional[torch.Tensor]:
        """
        Compute the normalized steering vector for a given preset
        using its contrastive prompt pairs.

        Args:
            preset: A SteeringPreset with positive and negative examples.

        Returns:
            Normalized direction tensor of shape (d_model,), or None on failure.
        """
        if not preset.positive_examples or not preset.negative_examples:
            logger.warning(
                f"Preset '{preset.name}' has no contrastive examples. "
                "Returning zero vector (neutral)."
            )
            return None

        logger.info(
            f"Extracting steering direction for '{preset.name}' at layer {preset.target_layer} "
            f"({len(preset.positive_examples)} positive, {len(preset.negative_examples)} negative examples)"
        )

        pos_states = []
        neg_states = []

        for text in preset.positive_examples:
            h = self._extract_hidden_state(text, preset.target_layer)
            if h is not None:
                pos_states.append(h)

        for text in preset.negative_examples:
            h = self._extract_hidden_state(text, preset.target_layer)
            if h is not None:
                neg_states.append(h)

        if not pos_states or not neg_states:
            logger.error(
                f"Could not extract activations for preset '{preset.name}'. "
                "Check that model is loaded and output_hidden_states is supported."
            )
            return None

        mean_pos = torch.stack(pos_states).mean(dim=0)   # (d_model,)
        mean_neg = torch.stack(neg_states).mean(dim=0)   # (d_model,)

        direction = mean_pos - mean_neg
        direction_norm = F.normalize(direction, dim=0)

        logger.info(
            f"Direction extracted for '{preset.name}' | "
            f"raw norm: {direction.norm():.4f} | "
            f"normalized: {direction_norm.norm():.4f}"
        )

        return direction_norm

    def compute_all_preset_directions(
        self,
        presets: list[SteeringPreset],
    ) -> dict[str, torch.Tensor]:
        """
        Compute and return direction vectors for a list of presets.

        Returns:
            Dict mapping preset name -> normalized direction tensor.
        """
        directions = {}
        for preset in presets:
            if preset.name == "neutral":
                continue
            vec = self.compute_direction(preset)
            if vec is not None:
                directions[preset.name] = vec
                logger.info(f"Direction cached: '{preset.name}'")
        return directions
