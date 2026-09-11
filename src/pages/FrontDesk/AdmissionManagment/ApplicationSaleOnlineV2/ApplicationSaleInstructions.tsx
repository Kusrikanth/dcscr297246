import {
  UncontrolledAccordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";

const ApplicationSaleInstructions = ({
  updateStepHndlr,
  applicationSaleData,
}) => {
  const {
    getRegistrationInstructionResp,
    getRegistrationInstructionSecondResp,
    saveEnquiryAppSaleResp,
    showApiLoader,
  } = useAppSelector(
    ({ admissionAvailabilityRequest, globalData, applicationSale }) => ({
      getRegistrationInstructionResp:
        admissionAvailabilityRequest.getRegistrationInstructionResp,
      getRegistrationInstructionSecondResp:
        admissionAvailabilityRequest.getRegistrationInstructionSecondResp,
      showApiLoader: globalData.showApiLoader,
      saveEnquiryAppSaleResp: applicationSale.saveEnquiryAppSaleResp,
    }),
    shallowEqual
  );

  return (
    <div className="instruction-new-container m-0 !tw-bg-transparent tw-border tw-overflow-hidden tw-rounded-[18px]">
      <div className="inner-instruction-container w-100 tw-m-0">
        <UncontrolledAccordion
          open="general-instructions"
          defaultOpen={["general-instructions", "cb-instructions"]}
          stayOpen
        >
          {getRegistrationInstructionSecondResp && (
            <AccordionItem className="mb-0">
              <AccordionHeader
                tag="span"
                className="fs-normal"
                targetId="cb-instructions"
              >
                <div className="mt-0 p-0">
                  <span className="tw-font-semibold tw-text-dark tw-text-base tw-me-4">
                    Welcome to Cambridge International
                  </span>
                </div>
              </AccordionHeader>
              <AccordionBody accordionId="cb-instructions">
                <div className="instruction-container-section-1 p-0">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: getRegistrationInstructionSecondResp || "",
                    }}
                    className="mb-4 w-100"
                  ></div>
                </div>
              </AccordionBody>
            </AccordionItem>
          )}
          {getRegistrationInstructionResp && (
            <AccordionItem className="mb-0">
              <AccordionHeader
                tag="span"
                className="fs-normal"
                targetId="general-instructions"
              >
                <div className="mt-0 p-0">
                  {/* <span>GENERAL INSTRUCTIONS</span> */}
                  <span className="tw-font-semibold tw-text-dark tw-text-base tw-me-4">
                    General Instructions
                  </span>
                </div>
              </AccordionHeader>
              <AccordionBody accordionId="general-instructions">
                <div className="instruction-container-section-1 p-0">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: getRegistrationInstructionResp || "",
                    }}
                    className="mb-4 w-100"
                  ></div>
                </div>
              </AccordionBody>
            </AccordionItem>
          )}
        </UncontrolledAccordion>
      </div>

      <div className="row justify-content-center d-none">
        <div className="pay-button col-12 col-md-4">
          {saveEnquiryAppSaleResp &&
            Object.keys(saveEnquiryAppSaleResp).length > 0 && (
              <button
                className="btn btn-green w-100 py-3 fs-16 !tw-mt-10"
                type="button"
                disabled={showApiLoader}
                onClick={(event: any) => {
                  event.preventDefault();
                  updateStepHndlr("stepup", {}, "2");
                }}
              >
                Next
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationSaleInstructions;
