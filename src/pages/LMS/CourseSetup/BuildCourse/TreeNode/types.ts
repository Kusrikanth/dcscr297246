export interface IPermission {
  name: string;
  level: number;
}

export interface IFeature {
  id: string;
  code: string;
  description: string;
  subFeatures: IFeature[];
  permissions: IPermission[];
  type: string;
  hours?: number;
  progressStatus?:string;
}

export interface ITreeContextValue {
  action: "COLLAPSE" | "EXPAND_ALL" | "COLLAPSE_ALL" | "";
  ids: string[];
}
export interface ITreeContext {
  value: ITreeContextValue;
  toggle: (
    action: "COLLAPSE" | "EXPAND_ALL" | "COLLAPSE_ALL",
    ids: string[]
  ) => void;
}

export interface ISubTreeParentInfo {
  parentFeatureId: string;
  parentFeatureName: string;
}
