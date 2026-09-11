import React from "react";

export const stepInfo = [
  {
    id: "curriculum-structure",
    label: "Curriculum Structure",
    multiFormKeys: [],
  },
  {
    id: "review-save",
    label: "Review & Save",
    multiFormKeys: [],
  },
];

export enum TABS_ACTIONS {
  NEXT_TAB = "NEXT_TAB",
  PREVIOUS_TAB = "PREVIOUS_TAB",
  PARTICULAR_TAB = "PARTICULAR_TAB",
  SUBMIT_TAB = "SUBMIT_TAB",
}

export const StepperFormContextRequestChange = React.createContext<any>(null);

export const courseGenerationList = [
  {
    id: "auto",
    name: "Auto Generate",
  },
  {
    id: "manul",
    name: "Generate Manul",
  },
];
