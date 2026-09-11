import { useMemo, useContext, useState, useCallback, useEffect, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CircleArrowRight01Icon } from "@hugeicons-pro/core-stroke-standard";
import { StepperFormContext } from "../helper";
import { generateColumnsModalColumns } from "./helper";
import TableContainer from "../../../../../../../Components/Common/TableContainer";
import { BulkUploadStepperContext } from "../index";
import { useAppDispatch, useAppSelector } from "../../../../../../../hooks/storehook";
import { getDigitalCurriculumBulkUploadPreviewAct, getDigitalCurriculumListAct, saveDigitalCurriculumBulkUploadAct, saveHeaderMapDigitalCurriculumAct } from "../../../../../../../store/lms/lmsdigitalcurriculum/lmsdigitalcurriculumaction";
import { generateActionPayload } from "../../../../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";

const ColumnMapping = ({ toggle }) => {
  const bulkContext = useContext(BulkUploadStepperContext);
  const dispatch = useAppDispatch();

  const { fileHeaders = [], expectedHeaders = [] } =
    bulkContext?.bulkUploadData || {};
  const handleCancel = () => bulkContext.goToPreviousStep();
  const [tableData, setTableData] = useState(() => {
    return expectedHeaders.map((expected) => {
      const normalizedExpected = expected.toLowerCase().replace(/\s+/g, "");
      let prefill =
        fileHeaders.find(
          (header) =>
            header.toLowerCase().replace(/\s+/g, "") === normalizedExpected
        ) ||
        fileHeaders.find((header) => {
          const expectedWords = expected.toLowerCase().split(/\s+/);
          const headerWords = header.toLowerCase().split(/\s+/);
          return expectedWords.some((word) =>
            headerWords.some((hword) => hword.includes(word))
          );
        });

      return {
        fieldName: expected,
        attributes: prefill || "",
      };
    });
  });
  const {
    lmsdigitalcurriculumErrorAct,
    getDigitalCurriculumBulkUploadPreviewResp,
  } = useAppSelector(
    ({ lmsdigitalcurriculum }) => ({

      lmsdigitalcurriculumErrorAct: lmsdigitalcurriculum.lmsdigitalcurriculumErrorAct,
      getDigitalCurriculumBulkUploadPreviewResp: lmsdigitalcurriculum.getDigitalCurriculumBulkUploadPreviewResp,

    }),
    shallowEqual
  );
  
  const previewBulkUploadDataRef = useRef<any>({
    prevLmsdigitalcurriculumErrorAct: lmsdigitalcurriculumErrorAct,
  });

  useEffect(() => {
    const { prevLmsdigitalcurriculumErrorAct } = previewBulkUploadDataRef.current;
    if (lmsdigitalcurriculumErrorAct && prevLmsdigitalcurriculumErrorAct !== lmsdigitalcurriculumErrorAct) {
      toast.error(lmsdigitalcurriculumErrorAct.details || "Something went wrong.");
    }
    previewBulkUploadDataRef.current.prevLmsdigitalcurriculumErrorAct = lmsdigitalcurriculumErrorAct;

  }, [lmsdigitalcurriculumErrorAct]);

  const handleNext = () => {
    const mappingData = tableData.map((row) => ({
      attribute: row.fieldName,
      fileHeader: row.attributes,
    }));

    const payload = { mappingData };
    dispatch(
      saveDigitalCurriculumBulkUploadAct(
        generateActionPayload(
          "save_digital_curriculum_bulk_upload",
          { subjectCurriculumId: bulkContext?.subjectCurriculumId }
        )
      )
    );
  };

  useEffect(() => {
    if (!bulkContext?.subjectCurriculumId) return;

    dispatch(
      getDigitalCurriculumBulkUploadPreviewAct(
        generateActionPayload(
          "get_digital_curriculum_bulk_upload_excel_preview",

          { subjectCurriculumId: bulkContext?.subjectCurriculumId }, undefined,
        )
      )
    );
  }, [bulkContext?.subjectCurriculumId]);

  const tableColumns = useMemo(() => generateColumnsModalColumns(), []);

  return (
    <div className="modal-body">
      <div className="tw-grid tw-grid-cols-1 tw-gap-8">
        <div className="lg:tw-col-span-2">
          <h3 className="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-1">
            Review auto-generated codes
          </h3>
          <p className="tw-text-gray-600 tw-mb-6">
            Validate the codes before publishing. Once imported, these will be used across all curriculum modules.
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <TableContainer
            columns={tableColumns || []}
            data={Array.isArray(getDigitalCurriculumBulkUploadPreviewResp) ? getDigitalCurriculumBulkUploadPreviewResp : []}
            tableClass="mb-0"
            divClass="table-responsive max-h-400px"
            theadClass="table-light text-muted align-middle position-sticky top-0"
          />
        </div>
      </div>
      <div className="tw-flex tw-justify-between tw-items-center tw-pt-4 tw-border-t tw-border-gray-200">
        <button
          onClick={handleCancel}
          className="tw-bg-white tw-border tw-border-gray-300 tw-text-gray-700 tw-px-6 tw-py-2 tw-rounded-md hover:tw-bg-gray-50 tw-transition-colors"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="tw-bg-teal-600 hover:tw-bg-teal-700 tw-text-white tw-px-6 tw-py-2 tw-rounded-md tw-flex tw-items-center tw-gap-2 tw-transition-colors"
        >
          Next
          <HugeiconsIcon icon={CircleArrowRight01Icon} size={16} />
        </button>
      </div>
    </div>
  );
};

export default ColumnMapping;
