import React, { useContext, useEffect, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  CalendarIcon,
  CheckmarkCircle02Icon,
  UserIcon,
  BarChartIcon,
  CircleArrowRight01Icon,
  CheckmarkCircle03Icon
} from '@hugeicons-pro/core-stroke-standard'
import { BulkUploadStepperContext } from "../index";

const Result = () => {
  const bulkContext = useContext(BulkUploadStepperContext);
  const [progress, setProgress] = useState(0);
  const [isValidating, setIsValidating] = useState(true);
  const [showValidationData, setShowValidationData] = useState(false);
  const [validationData, setValidationData] = useState({
    units: 0,
    chapters: 0,
    topics: 0,
    sessions: 0
  });

  const handleContinue = () => bulkContext.closeModal();
  const handleCancel = () => bulkContext.goToPreviousStep();

  const uploadData = {
    uploadDate: bulkContext.bulkUploadData?.uploadDate || 'N/A',
    status: 'Success',
    uploadedBy: bulkContext.bulkUploadData?.uploadedBy || 'N/A',
    records: `${bulkContext.bulkUploadData?.totalRecords || 0} total`
  };

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 2;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsValidating(false);
          setShowValidationData(true);
        }, 200);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (bulkContext.previewData) {
      setValidationData({
        units: bulkContext.previewData.totalUnitCount || 0,
        chapters: bulkContext.previewData.totalChapterCount || 0,
        topics: bulkContext.previewData.totalTopicCount || 0,
        sessions: bulkContext.previewData.totalSessionCount || 0,
      });
    }
  }, [bulkContext.previewData]);

  const hasValidationData = Object.values(validationData).some((v) => v > 0);

  return (
    <div className="modal-body">
      <div className="tw-bg-white tw-rounded-lg tw-p-0 !tw-w-full tw-text-center">
        <div className="tw-mb-4">
          <div className="tw-mb-2">
            <div
              className={`tw-w-14 tw-h-14 tw-mx-auto tw-rounded-full tw-flex tw-items-center tw-justify-center 
    ${isValidating
                  ? 'tw-bg-orange-100'
                  : hasValidationData
                    ? 'tw-bg-green-100'
                    : 'tw-bg-green-100'
                }`}
            >
              <HugeiconsIcon
                icon={CheckmarkCircle03Icon}
                size={32}
                className={
                  isValidating
                    ? 'tw-text-orange-600'
                    : hasValidationData
                      ? 'tw-text-green-600'
                      : 'tw-text-green-600'
                }
              />
            </div>
          </div>

          <h3 className="tw-text-xl tw-font-semibold tw-text-gray-800 tw-mb-2">
            {isValidating
              ? "Validating Data"
              : hasValidationData
                ? "Data Validated"
                : "No Valid Data Found"}
          </h3>

          <p className="tw-text-sm tw-text-gray-500 tw-mb-6">
            {isValidating
              ? "Checking data integrity & relationship"
              : hasValidationData
                ? "Data validation completed successfully"
                : "No records detected for validation"}
          </p>
          <div className="tw-w-full tw-max-w-lg tw-mx-auto">
            <div className="tw-flex tw-justify-between tw-items-center tw-mb-2">
              <span className="tw-text-sm tw-font-medium tw-text-gray-700">
                Progress
              </span>
              <span
                className={`tw-text-sm tw-font-bold ${progress === 100
                  ? 'tw-text-green-600'
                  : 'tw-text-blue-600'
                  }`}
              >
                {Math.round(progress)}%
              </span>
            </div>
            <div className="tw-w-full tw-h-2 tw-bg-gray-200 tw-rounded-full tw-overflow-hidden">
              <div
                className={`tw-h-full tw-rounded-full tw-transition-all tw-duration-300 tw-ease-out ${progress === 100
                  ? 'tw-bg-green-500'
                  : 'tw-bg-blue-500'
                  }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {(isValidating || showValidationData) && (
          <div className="tw-animate-fadeIn tw-duration-500 tw-ease-out">
            <div className="tw-bg-green-50 tw-border tw-border-green-200 tw-rounded-lg tw-p-4 tw-mb-4">
              <div className="tw-grid tw-grid-cols-2 tw-gap-4 tw-max-w-md tw-mx-auto tw-justify-items-center">
                {[
                  { icon: CalendarIcon, label: "Upload Date", value: uploadData.uploadDate },
                  { icon: UserIcon, label: "Uploaded By", value: uploadData.uploadedBy },
                  { icon: CheckmarkCircle02Icon, label: "Status", value: uploadData.status },
                  { icon: BarChartIcon, label: "Records", value: uploadData.records }
                ].map((item, idx) => (
                  <div key={idx} className="tw-flex tw-flex-col tw-items-center tw-gap-2">
                    <div className="tw-flex tw-items-center tw-gap-2 tw-mb-1">
                      <HugeiconsIcon
                        icon={item.icon}
                        size={16}
                        className={`${progress < 100
                            ? 'tw-text-orange-500'
                            : hasValidationData
                              ? 'tw-text-green-600'
                              : 'tw-text-gray-400'
                          }`}
                      />
                      <span className="tw-text-sm tw-font-medium tw-text-green-700">
                        {item.label}
                      </span>
                    </div>
                    <div className="tw-text-sm tw-text-green-700 tw-font-normal">
                      {item.value || "-"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum Stats */}
            <div className="tw-grid tw-grid-cols-4 tw-gap-2 tw-mb-4">
              {[
                { bg: "blue", label: "Units", key: "units" },
                { bg: "purple", label: "Chapters", key: "chapters" },
                { bg: "orange", label: "Topics", key: "topics" },
                { bg: "teal", label: "Sessions", key: "sessions" }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`tw-bg-${item.bg}-50 tw-border tw-border-${item.bg}-200 tw-rounded-lg tw-p-4 tw-transition-transform tw-duration-300 hover:tw-scale-[1.03]`}
                >
                  <div className={`tw-text-2xl tw-font-bold tw-text-${item.bg}-600 tw-mb-1`}>
                    {progress < 100 ? 0 : validationData[item.key as keyof typeof validationData] || 0}
                  </div>
                  <div className={`tw-text-md tw-font-medium tw-text-${item.bg}-600`}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="tw-flex tw-justify-between tw-items-center tw-pt-4 tw-border-t tw-border-gray-200">
          <button
            onClick={handleCancel}
            className="tw-bg-white tw-border tw-border-gray-300 tw-text-gray-700 tw-px-6 tw-py-2 tw-rounded-md hover:tw-bg-gray-50 tw-transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            disabled={progress < 100}
            className={`tw-px-6 tw-py-2 tw-rounded-md tw-flex tw-items-center tw-gap-2 tw-transition-colors ${progress < 100
                ? "tw-bg-gray-300 tw-text-gray-500 tw-cursor-not-allowed"
                : "tw-bg-teal-600 hover:tw-bg-teal-700 tw-text-white"
              }`}
          >
            Continue
            <HugeiconsIcon icon={CircleArrowRight01Icon} size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
