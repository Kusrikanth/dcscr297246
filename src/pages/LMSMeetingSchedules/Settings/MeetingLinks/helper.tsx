import React from 'react';
import { ITreeContext } from './types';

export const TreeContextProvider = React.createContext<ITreeContext>({
  value: {
    action: '',
    ids: [],
  },
  toggle: () => {},
  editModuleHandler: () => {},
  addModuleHandler: () => {},
  deleteModuleHndlr: () => {},
});

export function getAllParentIds(features: any[]) {
  let ids: string[] = [];

  features.forEach((feature) => {
    ids.push(feature.id);

    if (feature.subFeatures?.length > 0) {
      ids = ids.concat(getAllParentIds(feature.subFeatures));
    }
  });

  return ids;
}

export function transformClassSectionsToFeatures(data: any[]): any[] {
  return (
    data?.map((classItem) => ({
      id: String(classItem.classId),
      description: classItem.className,
      parentFeatureId: '',
      sectionCount: classItem.sectionCount ?? classItem.sections?.length ?? 0,
      subFeatures:
        classItem.sections?.map((section: any) => ({
          id: String(section.sectionId),
          description: section.sectionName,
          parentFeatureId: String(classItem.classId),
          subFeatures: [],

          meetingLink: section.meetingLink,
          meetingId: section.meetingId,
          passcode: section.passcode,
          createdBy: section.createdBy,
          createdByCode: section.createdByCode,
        })) || [],
    })) || []
  );
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
        competencies: data.termDetailsDTOS || [],
      },
    ],
  };
}
