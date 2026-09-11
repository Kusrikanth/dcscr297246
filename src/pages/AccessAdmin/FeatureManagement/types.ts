
export interface IPermission {
    // Define the structure of permissions, e.g., if permissions are strings or specific objects
    name: string;
    level: number;
}

export interface IFeature {
    id: string;
    code: string;
    description: string;
    subFeatures: IFeature[];
    permissions: IPermission[]; // Replace with the correct type if `permissions` are objects
}

export interface ITreeContextValue {
    action: 'COLLAPSE' | 'EXPAND_ALL' | 'COLLAPSE_ALL' | '',
    ids: string[]
}
export interface ITreeContext {
    value: ITreeContextValue,
    toggle: (action: 'COLLAPSE' | 'EXPAND_ALL' | 'COLLAPSE_ALL', ids: string[]) => void,
    editModuleHandler: (featureInfo: {
        isRootFeature: boolean,
        parentFeatureId: string,
        featureId: string, featureName: string,
        parentsInfo: ISubTreeParentInfo[]
    }) => void,
    addModuleHandler: (featureInfo: {
        isRootFeature: boolean, featureId: string, featureName: string,
        parentsInfo: ISubTreeParentInfo[],
    }) => void,
    deleteModuleHndlr: (featureInfo: {
        isRootFeature: boolean, featureId: string, featureName: string, subFeatureNames: string[],
    }) => void
}

export interface ISubTreeParentInfo {
    parentFeatureId: string,
    parentFeatureName: string
}