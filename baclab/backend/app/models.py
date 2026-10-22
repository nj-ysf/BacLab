from typing import Literal
from pydantic import BaseModel, ConfigDict, Field, model_validator

Kind = Literal['projectile_motion', 'free_fall', 'uniform_motion', 'unsupported']
FIELDS = {'projectile_motion': ['initial_speed', 'launch_angle', 'initial_height', 'gravity'], 'free_fall': ['initial_height', 'initial_velocity', 'gravity'], 'uniform_motion': ['initial_position', 'speed', 'duration']}
class Strict(BaseModel):
    model_config = ConfigDict(extra='forbid', allow_inf_nan=False)
class Parameter(Strict):
    value: float | None
    unit: str = Field(max_length=20)
    confidence: float = Field(ge=0, le=1)
    source_text: str | None = Field(max_length=1000)
class Extraction(Strict):
    supported: bool
    exercise_type: Kind
    language: str = Field(max_length=20)
    original_text: str = Field(max_length=12000)
    summary: str = Field(max_length=2000)
    parameters: dict[str, Parameter]
    requested_outputs: list[str]
    missing_parameters: list[str]
    warnings: list[str]
    @model_validator(mode='after')
    def consistency(self):
        if self.supported != (self.exercise_type != 'unsupported'):
            raise ValueError('Inconsistent exercise classification')
        expected = FIELDS.get(self.exercise_type, [])
        if set(self.parameters) - set(expected):
            raise ValueError('Unexpected parameter')
        self.missing_parameters = [k for k in expected if k not in self.parameters or self.parameters[k].value is None]
        return self
class AnalyzeInput(Strict):
    text: str = Field(default='', max_length=12000)
    demo_id: Literal['projectile_motion', 'free_fall', 'uniform_motion'] | None = None
class ExplainInput(Strict):
    exercise_type: Literal['projectile_motion', 'free_fall', 'uniform_motion']
    parameters: dict[str, float]
    results: dict[str, float]
    language: Literal['fr', 'en', 'ar', 'darija'] = 'fr'
    @model_validator(mode='after')
    def valid(self):
        if set(self.parameters) != set(FIELDS[self.exercise_type]):
            raise ValueError('Missing or unexpected parameters')
        for k,v in self.parameters.items():
            if abs(v)>100000 or (k in ('gravity','duration') and v<=0) or (k=='initial_height' and v<0) or (k=='launch_angle' and not 0<=v<=90):
                raise ValueError('Invalid physical parameter')
        if not self.results or len(self.results)>20 or any(abs(v)>1e9 for v in self.results.values()):
            raise ValueError('Invalid results')
        return self

class Explanation(Strict):
    steps: list[str] = Field(min_length=1, max_length=5)
    @model_validator(mode='after')
    def short_prose(self):
        if any(len(step)>700 for step in self.steps):
            raise ValueError('Explanation too long')
        # Numerical results are displayed from the engine, never from generated prose.
        if any(any(c.isdigit() for c in step) for step in self.steps):
            raise ValueError('Use qualitative prose only, no numerical values')
        return self
