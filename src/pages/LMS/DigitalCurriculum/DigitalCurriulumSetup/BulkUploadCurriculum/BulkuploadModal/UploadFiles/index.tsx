import React, { useContext, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CloudUploadIcon, CircleArrowRight01Icon } from "@hugeicons-pro/core-stroke-standard";
import { BulkUploadStepperContext } from "../index";
import { saveDigitalCurriculumBulkUploadExcelAct } from "../../../../../../../store/lms/lmsdigitalcurriculum/lmsdigitalcurriculumaction";
import { generateActionPayload } from "../../../../../../../utility/reduxutility";
import { useAppDispatch } from "../../../../../../../hooks/storehook";
import TableContainer from "../../../../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { toast } from "react-toastify";

const UploadFiles = () => {
  const stepperContext = useContext(BulkUploadStepperContext);
  const bulkContext = useContext(BulkUploadStepperContext);
  const dispatch = useAppDispatch();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (!file) return;
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv"
    ];
    const maxSizeMB = 5;
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file format. Please upload an Excel file.");
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size exceeds ${maxSizeMB} MB limit.`);
      return;
    }
    setSelectedFile(file);
    uploadFileToServer(file);
  };

  const handleNext = () => {
    // if (!selectedFile) return;
    stepperContext?.goToNextStep?.();
  };

  const uploadFileToServer = (file: File) => {
    bulkContext?.setBulkUploadData({});
    const subjectCurriculumId = bulkContext?.subjectCurriculumId;
    const formData = new FormData();
    formData.append("bucketName", "dps-institute-bucket-kendriyavidyalay-3-20");
    formData.append("file", file);
    dispatch(
      saveDigitalCurriculumBulkUploadExcelAct(
        generateActionPayload(
          "save_digital_curriculum_bulk_upload_excel",
          { subjectCurriculumId },
          formData
        )
      )
    );
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv"
    ];
    const maxSizeMB = 5;
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file format. Please upload an Excel file (.xlsx, .xls, .csv).");
      event.target.value = "";
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size exceeds ${maxSizeMB} MB limit.`);
      event.target.value = "";
      return;
    }
    setSelectedFile(file);
    uploadFileToServer(file);
  };

  const handlePrevious = () => {
    stepperContext?.goToPreviousStep?.();
  };

  const tableColumns = useMemo(() => generateColumns(), []);
  const { bulkUploadData } = bulkContext || {};

  const { summary, warnings, errors, rowResults } = bulkUploadData || {};
  const hasValidData =
    bulkUploadData?.rowResults &&
    Array.isArray(bulkUploadData.rowResults) &&
    bulkUploadData.rowResults.length > 0;

  return (
    <div className="">
      <div className="tw-px-10 tw-py-6">
        <div
          className={`tw-mb-3 tw-border-2 tw-border-dashed tw-rounded-lg tw-p-3 tw-text-center tw-transition-colors tw-mb-2 ${isDragOver
            ? "tw-border-blue-400 tw-bg-blue-50"
            : "tw-border-gray-300 tw-bg-gray-50"
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <HugeiconsIcon
            icon={CloudUploadIcon}
            size={48}
            className="tw-text-gray-400 tw-mx-auto tw-mb-4"
          />
          <p className="tw-text-gray-600 tw-mb-2">
            Drop your completed Excel file here or click to browse
          </p>
          <p className="tw-text-sm tw-text-gray-500 tw-mb-4">
            Smart Template v5 only · Max 5 MB
          </p>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileSelect}
            className="tw-hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="tw-inline-block tw-bg-white tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-rounded-md tw-text-gray-700 tw-cursor-pointer hover:tw-bg-gray-50 tw-transition-colors"
          >
            Select File
          </label>
          {selectedFile && (
            <div className={`tw-mt-4 tw-p-2 tw-rounded-md
                ${hasValidData ? "tw-bg-green-50 tw-border tw-border-green-200"
                : "tw-bg-yellow-50 tw-border tw-border-yellow-300"}`}>
              <p className="tw-text-sm tw-mb-0 tw-py-2">
                <span className="tw-font-semibold">Selected:</span> {selectedFile.name}
              </p>
            </div>
          )}
        </div>
        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-3 tw-gap-5 tw-mb-6">
          <div className="tw-bg-green-50 tw-border tw-border-green-200 tw-rounded-xl tw-p-5">
            <h4 className="tw-font-semibold tw-text-green-900 tw-mb-2">
              Summary
            </h4>
            <p className="tw-text-green-800 tw-text-sm">
              ✔ {summary?.totalRows || 0} rows processed ·
              {summary?.totalUnits || 0} Units ·
              {summary?.totalChapters || 0} Chapters ·
              {summary?.totalTopics || 0} Topics
            </p>
          </div>
          <div className="tw-bg-yellow-50 tw-border tw-border-yellow-300 tw-rounded-xl tw-p-5">
            <h4 className="tw-font-semibold tw-text-yellow-900 tw-mb-2">
              Warnings
            </h4>
            <p className="tw-text-yellow-800 tw-text-sm">
              ⚠ {warnings?.warningCount || 0} warnings found
            </p>
          </div>
          <div className="tw-bg-red-50 tw-border tw-border-red-300 tw-rounded-xl tw-p-5">
            <h4 className="tw-font-semibold tw-text-red-900 tw-mb-2">
              Errors
            </h4>
            <p className="tw-text-red-800 tw-text-sm">
              ✖ {errors?.errorCount || 0} errors found
            </p>
          </div>
        </div>
        <div className="tw-bg-white tw-border tw-border-gray-200 tw-rounded-xl tw-overflow-hidden">
          <TableContainer
            columns={tableColumns}
            data={rowResults || []}
            tableClass="mb-0"
            divClass="table-responsive max-h-400px"
            theadClass="table-light text-muted align-middle position-sticky top-0"
            showCheckbox={false}
            showPagination={false}
          />
        </div>
        <div className="tw-flex tw-justify-between tw-items-center tw-pt-6">
          <button
            onClick={handlePrevious}
            className="tw-bg-white tw-border tw-border-gray-300 tw-text-gray-700 tw-px-6 tw-py-2 tw-rounded-md hover:tw-bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!(hasValidData && (errors?.errorCount === 0))}
            className="tw-bg-teal-600 hover:tw-bg-teal-700 tw-text-white tw-px-6 tw-py-2 tw-rounded-md tw-flex tw-items-center tw-gap-2 disabled:tw-cursor-not-allowed disabled:tw-bg-gray-300"
          >
            Next
            <HugeiconsIcon icon={CircleArrowRight01Icon} size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadFiles;