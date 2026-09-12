"""Pydantic schemas for Activation Steering and Mechanistic Telemetry."""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class SteeringDirectionRequest(BaseModel):
    id: str = Field(..., description="Unique identifier for the direction")
    label: str = Field(..., description="Human-readable label (e.g., Cautious, Concise)")
    layer_index: int = Field(..., description="Target residual stream layer")
    strength: float = Field(default=1.0, ge=-3.0, le=3.0, description="Steering scalar multiplier α")
    is_active: bool = Field(default=True, description="Whether the intervention hook is attached")


class SteeringPresetApplyRequest(BaseModel):
    preset_name: str = Field(..., description="Preset name: cautious, concise, detailed, creative, neutral")
    strength: Optional[float] = Field(default=None, description="Optional override for steering strength")


class ComparePromptRequest(BaseModel):
    prompt: str = Field(..., description="The prompt to evaluate across unsteered and steered forward passes")
    preset_name: str = Field(default="concise", description="Target behavioral preset")
    strength: float = Field(default=1.5, ge=0.0, le=3.0, description="Steering multiplier α")
    layer_index: Optional[int] = Field(default=None, description="Optional override for target layer")


class ComparePromptResponse(BaseModel):
    prompt: str
    unsteered_output: str
    steered_output: str
    preset_name: str
    applied_direction: str
    strength: float
    target_layer: int
    metrics: Dict[str, Any]


class LayerActivationSummary(BaseModel):
    layer_index: int
    mean_activation: float
    max_activation: float
    norm: float


class SteeringStatusResponse(BaseModel):
    active_preset: str
    attached_hooks: int
    model_name: str
    total_layers: int
    is_steering_active: bool
