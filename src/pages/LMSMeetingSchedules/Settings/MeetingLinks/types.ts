export interface ISubTreeParentInfo {
  parentFeatureId: string;
  parentFeatureName: string;
}

export interface ITreeContext {
  value: {
    action: string;
    ids: string[];
  };
  toggle: (action: string, ids: string[]) => void;
  editModuleHandler?: (data: any) => void;
  addModuleHandler?: (data: any) => void;
  deleteModuleHndlr?: (data: any) => void;
}
