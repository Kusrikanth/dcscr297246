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


export function transformGoalsToFeatures(goals: any[]): any[] {
  return goals?.map((goal) => ({
    id: String(goal.goalId),
    description: goal?.goalIndex + " - " + goal.goalName,
    parentFeatureId: "",
    subFeatures: (goal.competencies || [])?.map((comp: any) => ({
      id: String(comp.competencyId),
      description: comp?.competencyIndex + " - " + comp?.competencyName,
      parentFeatureId: String(goal.id),
      subFeatures: [],
    })),
  }));
}


export function renderValueSection(selectedItems: any) {
    return `${selectedItems?.domainIndex} - ${selectedItems?.name}`;
  }

  export function renderOptionsEmployee(item: any) {
    return `${item?.domainIndex} - ${item?.name}`;
  }


export function transformResponse(data: any) {
  return {
    domainId: data.domainId,
    curriculumGoals: [
      {
        goalName: data.goalName,
        goalIndex: data.goalIndex,
        competencies: data.termDetailsDTOS || []
      }
    ]
  };
}
