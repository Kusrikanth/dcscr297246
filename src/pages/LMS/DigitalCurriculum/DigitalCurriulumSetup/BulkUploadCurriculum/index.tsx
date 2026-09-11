import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Bookmark03Icon, CircleArrowLeft01Icon, CircleArrowRight01Icon, File01Icon, Edit01Icon, Upload01Icon, Note05Icon, FolderFileStorageIcon } from "@hugeicons-pro/core-stroke-standard";
import { StepperFormContext } from "../helper";
import { useModal } from "../../../../../hooks/modalhook";
import { ModalContainerUpdated } from "../../../../../Components/Common";
import BulkuploadModal from "./BulkuploadModal";
import { toast } from "react-toastify";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { resetDigitalCurriculumManualUploadByIdAct, resetSaveDigitalCurriculumManualUploadAct } from "../../../../../store/lms/lmsdigitalcurriculum/lmsdigitalcurriculumslice";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}

const BulkUploadCurriculum = () => {
  const dispatch = useAppDispatch();
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const { modalState, openModal, closeModal } = useModal();
  const [bulkUploadCompleted, setBulkUploadCompleted] = useState(false);
  const { goToNextStep, goToPreviousStep, goToStep, isFirstStep, isLastStep, subjectCurriculumId, setIsBulkUpload } =
    useContext(StepperFormContext);
  const [isBulkUploadSuccess, setIsBulkUploadSuccess] = useState(false);

  const handleNext = () => {
    goToNextStep();
  };

  const handlePrevious = () => {
    goToPreviousStep();
  };

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
    if (method === "manual") {
      setIsBulkUpload(false);
      goToNextStep();
    } else if (method === "bulk") {
      setIsBulkUpload(true);
      openModal();
    }
  };

  const {
    lmsdigitalcurriculumErrorAct,
    saveDigitalCurriculumBulkUploadResp,
  } = useAppSelector(
    ({ lmsdigitalcurriculum }) => ({
      lmsdigitalcurriculumErrorAct: lmsdigitalcurriculum.lmsdigitalcurriculumErrorAct,
      saveDigitalCurriculumBulkUploadResp: lmsdigitalcurriculum.saveDigitalCurriculumBulkUploadResp,
    }),
    shallowEqual
  );

  const bulkUploadRef = useRef<any>({
    prevLmsdigitalcurriculumErrorAct: lmsdigitalcurriculumErrorAct,
    prevSaveDigitalCurriculumBulkUploadResp: saveDigitalCurriculumBulkUploadResp,
  });

  useEffect(() => {
    const { prevSaveDigitalCurriculumBulkUploadResp } = bulkUploadRef.current;
    if (!bulkUploadCompleted && saveDigitalCurriculumBulkUploadResp && prevSaveDigitalCurriculumBulkUploadResp !== saveDigitalCurriculumBulkUploadResp ) {
      toast.success("Bulk Upload Successfully Completed.");
      closeModal();
      setIsBulkUploadSuccess(true);
      setBulkUploadCompleted(true);
    }
    bulkUploadRef.current.prevSaveDigitalCurriculumBulkUploadResp = saveDigitalCurriculumBulkUploadResp;
  }, [saveDigitalCurriculumBulkUploadResp]);

  return (
    <>
      <div className="card h-100 mb-0" style={{ borderRadius: "10px" }}>
        <div
          className="card-header"
          style={{
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
            padding: "20px",
          }}
        >
          <div className="d-flex align-items-center" style={{ gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#CBF3EF",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <HugeiconsIcon icon={File01Icon} size={24} color="#0AB39C" />
            </div>
            <div className="d-grid">
              <h4
                className="mb-1"
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#333",
                  lineHeight: "1.3",
                }}
              >
                Step 2: Create Method
              </h4>
              <span
                className="text-muted"
                style={{
                  fontSize: "14px",
                  color: "#6c757d",
                  lineHeight: "1.4",
                }}
              >
                How would you like to build your curriculum structure?
              </span>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="row g-4 !tw-justify-center px-3">
            <div className="col-12 col-md-4 !tw-pl-0">
              <div className={`card h-100 cursor-pointer border tw-transition-all tw-duration-200 hover:tw-shadow-md ${selectedMethod === "manual" ? "border-success shadow-sm" : "border-light"}`}
                style={{
                  borderRadius: "12px",
                  cursor: "pointer",
                  borderWidth: selectedMethod === "manual" ? "2px" : "1px",
                }}
                onClick={() => handleMethodSelect("manual")}
              >
                <div className="card-body text-center" style={{ padding: "28px 24px" }}>
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 10px auto",
                    }}
                  >
                    <HugeiconsIcon icon={Edit01Icon} size={32} color="#6c757d" />
                  </div>
                  <h5
                    className="mb-2"
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    <HugeiconsIcon icon={Note05Icon} size={18} color="#6c757d" className="me-1" />
                    Manual Creation
                  </h5>
                  <p
                    className="text-muted mb-0"
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.5",
                      color: "#6c757d",
                    }}
                  >
                    Add units, chapters, and topics one by one using our editor.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4 !tw-pr-0">
              <div className={`card h-100 cursor-pointer border tw-transition-all tw-duration-200 hover:tw-shadow-md ${selectedMethod === "bulk" ? "border-success shadow-sm" : "border-light"}`}
                style={{
                  borderRadius: "12px",
                  cursor: "pointer",
                  borderWidth: selectedMethod === "bulk" ? "2px" : "1px",
                }}
                onClick={() => handleMethodSelect("bulk")}
              >
                <div className="card-body text-center" style={{ padding: "28px 24px" }}>
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 10px auto",
                    }}
                  >
                    <HugeiconsIcon icon={Upload01Icon} size={32} color="#6c757d" />
                  </div>
                  <h5
                    className="mb-2"
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    <HugeiconsIcon icon={FolderFileStorageIcon} size={18} color="#6c757d" className="me-1" />
                    Bulk Upload
                  </h5>
                  <p
                    className="text-muted mb-0"
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.5",
                      color: "#6c757d",
                    }}
                  >
                    Upload your curriculum via CSV/Excel and map the fields.
                  </p>
                </div>
              </div>
            </div>
            <div className="row mt-3 px-0">
              <div className="col-12 d-flex justify-content-between mt-2 px-0">
                <div>
                  {!isFirstStep && (
                    <button
                      type="button"
                      className="btn btn-light fs-12 px-4 py-2 me-2"
                      onClick={handlePrevious}
                      style={{ borderRadius: "8px" }}
                    >
                      <HugeiconsIcon
                        icon={CircleArrowLeft01Icon}
                        size={20}
                        color="currentColor"
                        className="me-2"
                      />
                      Previous
                    </button>
                  )}
                </div>
                <div className="d-flex">
                  <button
                    type="button"
                    className="btn btn-outline-primary mx-2 fs-12 px-4 py-2"
                    style={{ borderRadius: "8px" }}
                  >
                    <HugeiconsIcon
                      icon={Bookmark03Icon}
                      size={20}
                      color="currentColor"
                      className="me-2"
                    />
                    Save as draft
                  </button>
                  <button
                    type="button"
                    className="btn btn-success fs-12 px-4 py-2"
                    onClick={handleNext}
                    disabled={
                      !selectedMethod ||
                      (selectedMethod === "bulk" && !isBulkUploadSuccess)
                    }
                    style={{ borderRadius: "8px" }}
                  >
                    Next Step
                    <HugeiconsIcon
                      icon={CircleArrowRight01Icon}
                      size={20}
                      color="currentColor"
                      className="ms-1"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="bulk-upload"
        isOpen={modalState.showModal}
        toggle={() => closeModal()}
        modalTitle="Bulk Upload"
        modalSize="xl"
      >
        <BulkuploadModal
          id={modalState.modalData}
          isOpen={false}
          toggle={() => closeModal()}
          modalTitle="Bulk Upload"
          subjectCurriculumId={subjectCurriculumId}
          closeModal={closeModal}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default BulkUploadCurriculum;
