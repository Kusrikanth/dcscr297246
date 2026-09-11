import { nanoid } from 'nanoid';
import React from 'react';
import { IFeature, ITreeContext } from './types';


export const TreeContextProvider = React.createContext<ITreeContext>({
    value: {
        action: '',
        ids: []
    },
    toggle: () => { },
    editModuleHandler: () => { },
    addModuleHandler: () => { },
    deleteModuleHndlr: () => { }
});

export function getAllParentIds(features: IFeature[]) {
    let ids: string[] = [];
    features.forEach(feature => {
        ids.push(feature.id);

        if (feature.subFeatures.length > 0) {
            ids = ids.concat(getAllParentIds(feature.subFeatures));
        }
    });
    return ids;
}