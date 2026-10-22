export type Kind='projectile_motion'|'free_fall'|'uniform_motion';
export type Parameter={value:number|null;unit:string;confidence:number;source_text:string|null};
export type Extraction={supported:boolean;exercise_type:Kind|'unsupported';language:string;original_text:string;summary:string;parameters:Record<string,Parameter>;requested_outputs:string[];missing_parameters:string[];warnings:string[]};
export type Values=Record<string,number>;
export type Lang='fr'|'en'|'ar';
