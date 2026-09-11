import {
  BookEditIcon,
  CheckListIcon,
  File02Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";
import { default as DocumentIconSvg } from "../../../../assets/imagesdps/directory/registration-icons/documents.svg?react";
import { default as ReportIconSvg } from "../../../../assets/imagesdps/directory/registration-icons/student_profile.svg?react";

export const stepInfo = [
  {
    id: "basic_details",
    title: "Basic Details",
    iconImage: <DocumentIconSvg></DocumentIconSvg>,
    multiFormKeys: [],
  },
  {
    id: "curriculum",
    title: "Curriculum",
    iconImage: <ReportIconSvg></ReportIconSvg>,
    multiFormKeys: [],
  },
  {
    id: "review",
    title: "Review",
    iconImage: <DocumentIconSvg></DocumentIconSvg>,
    multiFormKeys: [],
  },
];

export enum TABS_ACTIONS {
  NEXT_TAB = "NEXT_TAB",
  PREVIOUS_TAB = "PREVIOUS_TAB",
  PARTICULAR_TAB = "PARTICULAR_TAB",
  SUBMIT_TAB = "SUBMIT_TAB",
}

export const StepperFormContext: any = React.createContext<any>(null);

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
