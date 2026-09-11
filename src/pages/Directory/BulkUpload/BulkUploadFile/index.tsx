import {
  HugeiconsIcon
} from "@hugeicons/react";
import { Download04Icon, AlertCircleIcon } from "@hugeicons-pro/core-stroke-standard"
import { MultipleFileUpload } from "../../../../Components/Common";
import Button from "../../../../Components/Common/Button";


const BulkUploadFile = () => {
  return (
    <div className="bulk-upload-file-container">
      <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-y-3">
        <div className="tw-col-span-1 lg:tw-col-span-5 xxl:tw-col-span-4">
          <div className="tw-mb-4">
            <h5 className="tw-mb-1">Instructions</h5>
            <p className="tw-text-gray-500 tw-mb-0">Download XLS Template here</p>
            <Button variant="info">
              <HugeiconsIcon
                icon={Download04Icon}
                className="tw-mr-2 tw-text-white"
                size={22}
              />
              Download
            </Button>
          </div>

          <div>
            <p className="tw-text-gray-500 tw-mb-2">Note:</p>
            <div className="">
              <div className="tw-flex tw-items-start tw-mb-2">
                <HugeiconsIcon
                  icon={AlertCircleIcon}
                  className="tw-mr-2"
                  size={22}
                />
                <p className="tw-text-gray-500 tw-text-sm tw-mb-0">Download the Template.</p>
              </div>
              <div className="tw-flex tw-items-start tw-mb-2">
                <HugeiconsIcon
                  icon={AlertCircleIcon}
                  className="tw-mr-2"
                  size={22}
                />
                <p className="tw-text-gray-500 tw-text-sm tw-mb-0">
                  Files allowed to download are .XLS and .XLSX
                </p>
              </div>
              <div className="tw-flex tw-items-start tw-mb-2">
                <HugeiconsIcon
                  icon={AlertCircleIcon}
                  className="tw-mr-2"
                  size={22}
                />
                <p className="tw-text-gray-500 tw-text-sm tw-mb-0">
                  The maximum file upload szie is 1,024.00MB.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="tw-col-span-1 lg:tw-col-span-7 xxl:tw-col-span-8">
          <div>
            <h5 className="tw-mb-1">Upload File</h5>
            <p className="tw-text-gray-500">Upload XLSX File you want to import</p>
          </div>
          <div>
            <MultipleFileUpload name="bulk-upload"></MultipleFileUpload>
          </div>

          <div className="tw-flex tw-justify-end tw-mt-5">
            <Button variant="primary">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadFile;
