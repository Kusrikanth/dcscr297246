import { default as BulkUploadFileSvg } from "../../../assets/imagesdps/directory/icons/bulk-upload-file.svg?react";
import { default as ColumnMapping } from "../../../assets/imagesdps/directory/icons/column-mapping.svg?react";
import { default as BulkUploadRepair } from "../../../assets/imagesdps/directory/icons/bulk-upload-repair.svg?react";
import { default as BulkUploadImport } from "../../../assets/imagesdps/directory/icons/bulk-upload-import.svg?react";
import React from "react";

export const StepperFormContext: any = React.createContext<any>(null);

export const stepInfo = [
  {
    id: "setup_master_data",
    title: "Setup Master Data",
    iconImage: <BulkUploadFileSvg />,
  },
  {
    id: "bulk_upload_file",
    title: "Upload File",
    iconImage: <BulkUploadFileSvg />,
  },
  {
    id: "bulk_upload_column_maping",
    title: "Column Maping",
    iconImage: <ColumnMapping />,
  },
  // {
  //   id: "bulk_upload_repair",
  //   title: "Repair",
  //   iconImage: <BulkUploadRepair />,
  // },
  {
    id: "bulk_upload_import",
    title: "Import",
    iconImage: <BulkUploadImport />,
  },
];
