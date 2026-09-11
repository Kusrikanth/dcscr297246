import React from "react";
export interface Step {
  id: string;
  label: string;
  multiFormKeys?: string[]; // optional
}
export const stepInfo: Step[] = [
  { id: "basic_details", label: "Basic Details", multiFormKeys: ["field1", "field2"] },
  { id: "add_question", label: "Add Questions" },
  { id: "assign", label: "Assign" },
  { id: "settings", label: "Settings" },
  { id: "review", label: "Review & Submit" },
];

export enum TABS_ACTIONS {
    NEXT_TAB = "NEXT_TAB",
    PREVIOUS_TAB = "PREVIOUS_TAB",
    PARTICULAR_TAB = "PARTICULAR_TAB",
    SUBMIT_TAB = "SUBMIT_TAB"
}
export const StepperFormContext: any = React.createContext<any>(null);
