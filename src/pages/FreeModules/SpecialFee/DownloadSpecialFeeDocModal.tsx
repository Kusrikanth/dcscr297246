import { useMemo } from "react";

const DownloadSpecialFeeDocModal = ({ toggle, modalData }) => {
  const { originalFileName, s3URL } = modalData[0]?.systemFile;

  function handleDownloadDoc() {
    toggle();
    window.open(s3URL, "_blank");
  }

  return (
    <div className="tw-pb-3">

      <div className="tw-grid tw-grid-cols-12 tw-bg-gray-100 tw-py-2 tw-w-full tw-mx-auto">
        <div className="tw-col-span-9 tw-font-medium">
          File Name
        </div>
        <div className="tw-col-span-3 tw-font-medium">
          Download
        </div>
      </div>

      <div className="tw-grid tw-grid-cols-12 tw-py-2 tw-w-full tw-mx-auto">
        <div className="tw-col-span-9">
          {originalFileName}
        </div>

        <div className="tw-col-span-3">
          <div
            onClick={handleDownloadDoc}
            className="tw-cursor-pointer"
          >
            <i className="ri-download-line tw-text-sky-500 tw-text-xl"></i>
          </div>
        </div>
      </div>

    </div>

  );
};

export default DownloadSpecialFeeDocModal;
