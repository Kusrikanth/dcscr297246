import { useMemo, useState } from "react";
import { HorizontalWizard } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { stepInfo, StepperFormContext } from "./helper";
import BulkUploadFile from "./BulkUploadFile";
import BulkUploadColumnMaping from "./BulkUploadColumnMaping";
import BulkUploadRepair from "./BulkUploadRepair";
import BulkUploadImport from "./BulkUploadImport";
import SetupMasterData from "./SetupMasterData";

function getActiveMenuComponent(menuId: any) {
  switch (menuId) {
    case "setup_master_data":
      return SetupMasterData;
    case "bulk_upload_file":
      return BulkUploadFile;
    case "bulk_upload_column_maping":
      return BulkUploadColumnMaping;
    // case "bulk_upload_repair":
    //   return BulkUploadRepair;
    case "bulk_upload_import":
      return BulkUploadImport;
  }
}

const BulkUpload = () => {
  const [activeStepId, setActiveStepId] = useState("setup_master_data");

  function updateStepHndlr(stepId: any) {
    setActiveStepId(stepId);
    getActiveMenuComponent(stepId);
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeStepId);
    if (TabComponent) {
      return <TabComponent />;
    }
  }, [activeStepId]);

  return (
    <>
      <div className="page-content">
        <div className="container-fluid bulk-upload">
          <BreadCrumb
            title="Bulk Upload"
            pageTitle="Bulk Upload"
          />

          <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200 tw-mt-4">

            <div className="tw-px-6 tw-py-4 tw-border-b tw-border-gray-200">
              <div className="tw-flex tw-items-center tw-justify-between">
                <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                  Bulk Upload
                </h4>
              </div>
            </div>

            <div className="tw-p-6">

              <HorizontalWizard
                updateStepHndlr={updateStepHndlr}
                stepsList={stepInfo}
                activeStepId={activeStepId}
                containerClass="tw-mb-8"
              />

              <div>
                {activeComponent}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BulkUpload;
