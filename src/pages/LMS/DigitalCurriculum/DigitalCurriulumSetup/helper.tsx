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
    label: "Basic Info",
    // iconImage: <DocumentIconSvg></DocumentIconSvg>,
    multiFormKeys: [],
  },
  {
    id: "bulk_upload_curriculum",
    label: "Bulk Upload Curriculum",
    // iconImage: <DocumentIconSvg></DocumentIconSvg>,
    multiFormKeys: [],
  },
  {
    id: "curriculum",
    label: "Curriculum Structure",
    // iconImage: <ReportIconSvg></ReportIconSvg>,
    multiFormKeys: [],
  },
  {
    id: "review",
    label: "Review & Save",
    // iconImage: <DocumentIconSvg></DocumentIconSvg>,
    multiFormKeys: [],
  },
];

export enum TABS_ACTIONS {
  NEXT_TAB = "NEXT_TAB",
  PREVIOUS_TAB = "PREVIOUS_TAB",
  PARTICULAR_TAB = "PARTICULAR_TAB",
  SUBMIT_TAB = "SUBMIT_TAB",
}

export const StepperFormContext = React.createContext<any>(null);

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
