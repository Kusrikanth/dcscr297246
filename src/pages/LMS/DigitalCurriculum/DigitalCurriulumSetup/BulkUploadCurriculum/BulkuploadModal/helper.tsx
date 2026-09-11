import React from "react";

export const bulkUploadSteps = [
  {
    id: "download-template",
    label: "Download Template",
    multiFormKeys: [],
  },
  {
    id: "upload-files",
    label: "Upload & Validate",
    multiFormKeys: [],
  },
  {
    id: "column-mapping",
    label: "Preview Codes",
    multiFormKeys: [],
  },
];

export const StepperFormContext = React.createContext<any>(null);
