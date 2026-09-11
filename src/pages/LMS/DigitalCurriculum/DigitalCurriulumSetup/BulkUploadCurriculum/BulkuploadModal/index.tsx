import React, { useEffect, useMemo, useRef, useState } from "react";
import UpdatedHorizontalWizard from "../../../../../../Components/Common/UpdatedHorizontalWizard";
import { bulkUploadSteps } from "./helper";
import UploadFiles from "./UploadFiles";
import ColumnMapping from "./ColumnMapping";
import Result from "./Result";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import DownloadExcelFile from "./DownloadExcelFile";
import { resetSaveDigitalCurriculumBulkUploadExcelAct } from "../../../../../../store/lms/lmsdigitalcurriculum/lmsdigitalcurriculumslice";

export const BulkUploadStepperContext = React.createContext<any>(null);

const BulkuploadModal = (props: any) => {
  const { id, subjectCurriculumId, closeModal } = props;
  const [activeStepId, setActiveStepId] = useState(id || "download-template");
  const [bulkUploadData, setBulkUploadData] = useState<any>({});
  const [previewData, setPreviewData] = useState<any>({});
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const dispatch = useAppDispatch();
  const updateStepHndlr = (stepId: string) => {
    setActiveStepId(stepId);
  };

  const goToNextStep = () => {
    const currentIndex = bulkUploadSteps.findIndex(
      (step) => step.id === activeStepId
    );
    if (currentIndex < bulkUploadSteps.length - 1) {
      setActiveStepId(bulkUploadSteps[currentIndex + 1].id);
    }
  };

  const {
    lmsdigitalcurriculumErrorAct,
    saveDigitalCurriculumBulkUploadExcelResp,
    saveHeaderMapDigitalCurriculumResp,
    downloadStaticHealthResp,
  } = useAppSelector(
    ({ lmsdigitalcurriculum, classroomManagmentInfo }) => ({

      lmsdigitalcurriculumErrorAct: lmsdigitalcurriculum.lmsdigitalcurriculumErrorAct,
      saveDigitalCurriculumBulkUploadExcelResp: lmsdigitalcurriculum.saveDigitalCurriculumBulkUploadExcelResp,
      saveHeaderMapDigitalCurriculumResp: lmsdigitalcurriculum.saveHeaderMapDigitalCurriculumResp,
      downloadStaticHealthResp: classroomManagmentInfo.downloadStaticHealthResp,

    }),
    shallowEqual
  );
  const bulkUploadModalRef = useRef<any>({
    prevLmsdigitalcurriculumErrorAct: lmsdigitalcurriculumErrorAct,
    prevSaveDigitalCurriculumBulkUploadExcelResp: saveDigitalCurriculumBulkUploadExcelResp,
    prevSaveHeaderMapDigitalCurriculumResp: saveHeaderMapDigitalCurriculumResp,
    prevDownloadStaticHealthResp: downloadStaticHealthResp,
  });

  useEffect(() => {
    const { prevLmsdigitalcurriculumErrorAct, prevSaveDigitalCurriculumBulkUploadExcelResp, prevSaveHeaderMapDigitalCurriculumResp, prevDownloadStaticHealthResp } = bulkUploadModalRef.current;
    if (lmsdigitalcurriculumErrorAct && prevLmsdigitalcurriculumErrorAct !== lmsdigitalcurriculumErrorAct) {
      toast.error(lmsdigitalcurriculumErrorAct.details || "Something went wrong.");
    }
    else if (saveDigitalCurriculumBulkUploadExcelResp && prevSaveDigitalCurriculumBulkUploadExcelResp !== saveDigitalCurriculumBulkUploadExcelResp) {
      toast.success("File uploaded successfully.");
      if (saveDigitalCurriculumBulkUploadExcelResp?.data) {
        setBulkUploadData(saveDigitalCurriculumBulkUploadExcelResp.data);
        if (activeStepId === "download-template") {
          goToNextStep();
        }
      }
    }
    else if (saveHeaderMapDigitalCurriculumResp && prevSaveHeaderMapDigitalCurriculumResp !== saveHeaderMapDigitalCurriculumResp) {
      toast.success("Headers Added successfully.");
      if (saveHeaderMapDigitalCurriculumResp?.data) {
        setPreviewData(saveHeaderMapDigitalCurriculumResp.data);
        if (activeStepId === "column-mapping") {
          goToNextStep();
        }
      }
    }
    else if (downloadStaticHealthResp && downloadStaticHealthResp !== prevDownloadStaticHealthResp) {
      const { systemFile } = downloadStaticHealthResp,
        { s3URL } = systemFile || {};
      if (s3URL) {
        const url = s3URL || ""
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'bulk_upload.xlsx');
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        link.remove();
        setDownloadSuccess(true);
      } else {
        toast.error('Download url for bulk upload form is not found.');
      }
    }
    bulkUploadModalRef.current.prevSaveDigitalCurriculumBulkUploadExcelResp = saveDigitalCurriculumBulkUploadExcelResp;
    bulkUploadModalRef.current.prevSaveHeaderMapDigitalCurriculumResp = saveHeaderMapDigitalCurriculumResp;
    bulkUploadModalRef.current.prevLmsdigitalcurriculumErrorAct = lmsdigitalcurriculumErrorAct;
    bulkUploadModalRef.current.prevDownloadStaticHealthResp = downloadStaticHealthResp;

  }, [lmsdigitalcurriculumErrorAct, saveDigitalCurriculumBulkUploadExcelResp, saveHeaderMapDigitalCurriculumResp, downloadStaticHealthResp, activeStepId]);

  useEffect(() => {
    if (activeStepId === "upload-files") {
      dispatch(resetSaveDigitalCurriculumBulkUploadExcelAct(undefined));
      // setBulkUploadData({});
    }
  }, [activeStepId]);

  const goToPreviousStep = () => {
    const currentIndex = bulkUploadSteps.findIndex(
      (step) => step.id === activeStepId
    );
    if (currentIndex > 0) {
      setActiveStepId(bulkUploadSteps[currentIndex - 1].id);
    }
  };

  const goToStep = (stepId: string) => {
    setActiveStepId(stepId);
  };

  const getActiveMenuComponent = (menuId: string) => {
    switch (menuId) {
      case "download-template":
        return DownloadExcelFile;
      case "upload-files":
        return UploadFiles;
      case "column-mapping":
        return ColumnMapping;
      case "result":
        return Result;
      default:
        return UploadFiles;
    }
  };

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeStepId);
    return <TabComponent />;
  }, [activeStepId]);

  const contextValue = {
    activeStepId,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    bulkUploadData,
    setBulkUploadData,
    subjectCurriculumId,
    previewData,
    setPreviewData,
    closeModal
  };

  return (
    <>
      <div className="card p-3 lms_step_wizard !tw-border-none !tw-shadow-none !tw-mb-1">
        <div style={{ pointerEvents: "none", cursor: "default" }}>
          <UpdatedHorizontalWizard
            updateStepHndlr={() => { }}
            stepsList={bulkUploadSteps}
            activeStepId={activeStepId}
            formgroupClassName="!tw-pl-4 !tw-pr-0"
          />
        </div>
      </div>
      <div className="d-inline-block w-100">
        <BulkUploadStepperContext.Provider value={contextValue}>
          {activeComponent}
        </BulkUploadStepperContext.Provider>
      </div>
    </>
  );
};

export default BulkuploadModal;
