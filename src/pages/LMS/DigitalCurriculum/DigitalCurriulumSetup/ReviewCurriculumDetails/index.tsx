import { HugeiconsIcon } from "@hugeicons/react";
import { Bookmark03Icon, CircleArrowLeft01Icon, File01Icon} from "@hugeicons-pro/core-stroke-standard";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { StepperFormContext } from "../helper";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { getDigitalCurriculumManualUploadByIdAct, submitDigitalCurriculumReviewAct} from "../../../../../store/lms/lmsdigitalcurriculum/lmsdigitalcurriculumaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import {  convertCurriculumToTree,  StatusPill,  TreeContextProvider} from "./helper";
import { ModuleTree } from "./TreeComponent";
import "../../../../Examination/HolisticReports/Settings/CurriculumGoals/_treecomponent.scss";
import classnames from "classnames";
import { InputCheckbox, TextArea } from "../../../../../Components/Common";
import { useFormik } from "formik";
import { StepperFormContextRequestChange } from "../../CurriculumPlannerList/EditCurriculumStructureModal/helper";

interface ReviewCurriculumDetailsProps {
  subjectCurriculumId?: number;
  toggle: any;
  getDigitalCurriculumStatsApi?: (payload?: any) => void;
  getDigitalCurriculumListApi?: (payload?: any) => void;
}

const initialValues = { remarks: "" };

const ReviewCurriculumDetails: React.FC<ReviewCurriculumDetailsProps> = (props) => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const location = useLocation();

  const isRequestChange = location.pathname === "/digital-curriculum";
  const isUsingRequestChangeCtx = isRequestChange;

  const [agree, setAgree] = useState(false);

  const stepperContext = useContext(StepperFormContext);
  const stepperContextRequestChange = useContext(StepperFormContextRequestChange);
  const ctx = isUsingRequestChangeCtx ? stepperContextRequestChange : stepperContext;

  const subjectCurriculumId = props.subjectCurriculumId ?? ctx?.subjectCurriculumId;
  const goToPreviousStep = ctx?.goToPreviousStep;

  const MAX_REMARKS = 500;

  const { getDigitalCurriculumanualUploadByIdResp, submitDigitalCurriculumReviewResp } =
    useAppSelector(
      ({ lmsdigitalcurriculum }) => ({
        getDigitalCurriculumanualUploadByIdResp:
          lmsdigitalcurriculum.getDigitalCurriculumanualUploadByIdResp,
        submitDigitalCurriculumReviewResp:
          lmsdigitalcurriculum.submitDigitalCurriculumReviewResp,
      }),
      shallowEqual
    );

  const bulkUploadRef = useRef<any>({
    prevSubmitDigitalCurriculumReviewResp: submitDigitalCurriculumReviewResp,
  });

  useEffect(() => {
    const { prevSubmitDigitalCurriculumReviewResp } = bulkUploadRef.current;

    if (
      submitDigitalCurriculumReviewResp &&
      prevSubmitDigitalCurriculumReviewResp !== submitDigitalCurriculumReviewResp
    ) {
      toast.success("Digital Curriculum Submitted for Review.");

      if (isUsingRequestChangeCtx) {
        props.toggle?.();
      } else {
        history.push("/digital-curriculum");
      }
      props.getDigitalCurriculumStatsApi?.();
      props.getDigitalCurriculumListApi?.();
    }

    bulkUploadRef.current.prevSubmitDigitalCurriculumReviewResp =
      submitDigitalCurriculumReviewResp;
  }, [submitDigitalCurriculumReviewResp, isUsingRequestChangeCtx, history, props]);

  const submitHodFormik = useFormik({
    enableReinitialize: false,
    initialValues,
    onSubmit: () => { },
  });

  useEffect(() => {
    if (!subjectCurriculumId) return;
    dispatch(
      getDigitalCurriculumManualUploadByIdAct(
        generateActionPayload(
          "get_digital_curriculum_manual_upload_by_id",
          { subjectCurriculumId },
          undefined
        )
      )
    );
  }, [subjectCurriculumId, dispatch]);

  const units = getDigitalCurriculumanualUploadByIdResp?.units || [];
  const hasData = units?.length > 0;

  const [expandCollapseState, setExpandCollapseState] = useState({
    action: "",
    ids: [] as string[],
  });

  const expandCollapseHndlr = (action: string, ids?: string[]) =>
    setExpandCollapseState({ action, ids: ids || [] });

  const expandAll = () => expandCollapseHndlr("EXPAND_ALL");
  const collapseAll = () => expandCollapseHndlr("COLLAPSE_ALL");

  const treeData = useMemo(() => convertCurriculumToTree(units), [units]);

  const totalChapters = useMemo(
    () => units.reduce((sum, u) => sum + (u.chapters?.length || 0), 0),
    [units]
  );

  const totalTopics = useMemo(
    () =>
      units.reduce(
        (sum, u) =>
          sum +
          (u.chapters?.reduce((s, c) => s + (c.topics?.length || 0), 0) || 0),
        0
      ),
    [units]
  );

  const handleSaveDigitalCurriculum = () => {
    if (!subjectCurriculumId) return;
    dispatch(
      submitDigitalCurriculumReviewAct(
        generateActionPayload("submit_digital_curriculum_review", {
          subjectCurriculumId,
          isConfirmed: agree,
          comment: submitHodFormik.values.remarks || "",
        })
      )
    );
  };

  const btnBase =
    "tw-inline-flex tw-items-center tw-justify-center tw-gap-2 tw-rounded-xl tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-transition";
  const btnPrimary = `${btnBase} tw-bg-teal-600 tw-text-white hover:tw-bg-teal-700`;
  const btnOutline = `${btnBase} tw-border tw-border-gray-300 tw-text-gray-700 hover:tw-bg-gray-50`;
  const btnGhost = `${btnBase} tw-text-gray-700 hover:tw-bg-gray-100`;

  const countPill =
    "tw-ml-2 tw-min-w-[28px] tw-text-center tw-inline-flex tw-items-center tw-justify-center tw-px-2 tw-py-0.5 tw-rounded-full tw-bg-gray-100 tw-text-gray-800 tw-text-xs tw-font-semibold";

  const remarksLen = submitHodFormik.values.remarks?.length || 0;

  const canSubmit = useMemo(
    () => hasData && agree && remarksLen <= MAX_REMARKS,
    [hasData, agree, remarksLen]
  );

  const cardHeightClass = isUsingRequestChangeCtx
    ? "tw-h-[80vh] tw-overflow-hidden"
    : "tw-h-full tw-min-h-[460px]";

  return (
    <div >
      <div >
        <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-rounded-xl tw-items-stretch">
          {!isUsingRequestChangeCtx && (
            <div className="tw-col-span-12">
              <div className="tw-rounded-2xl tw-bg-white tw-border tw-border-gray-100 tw-shadow-sm">
                <div className="tw-p-4 tw-flex tw-items-center tw-justify-between">
                  <div className="tw-flex tw-items-center">
                    <div className="tw-mr-3 tw-w-12 tw-h-12 tw-bg-[#CBF3EF] tw-rounded-2xl tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
                      <HugeiconsIcon icon={File01Icon} size={24} color="#0AB39C" />
                    </div>
                    <div className="tw-grid">
                      <h4 className="tw-mb-1 tw-text-[20px] tw-font-semibold tw-text-gray-900 tw-leading-tight">
                        Step 4: Review &amp; Save
                      </h4>
                      <span className="tw-text-[14px] tw-text-gray-500 tw-leading-snug">
                        Review the curriculum structure and save.
                      </span>
                    </div>
                  </div>
                  <div className="tw-flex tw-items-center tw-gap-3">
                    <button type="button" className={btnOutline}>
                      Export PDF Syllabus
                    </button>
                    <button type="button" className={btnPrimary}>
                      Export CSV
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="tw-col-span-12 md:tw-col-span-8">
            <div
              className={classnames(
                "tw-rounded-2xl tw-bg-white tw-border tw-border-gray-100 tw-shadow-sm tw-flex tw-flex-col",
                cardHeightClass
              )}
            >
              <div className="tw-flex tw-items-start tw-justify-between tw-border-b tw-border-gray-100 tw-p-4">
                <div className="tw-flex tw-flex-col tw-gap-2">
                  <h4 className="tw-text-[16px] tw-font-semibold tw-text-gray-900 tw-mb-0">
                    <span className="tw-mr-2">Curriculum Structure</span>
                    <StatusPill
                      tone="warning"
                      variant="soft"
                      size="md"
                      label="HOD Status — Not Verified"
                    />
                  </h4>
                  <div className="tw-flex tw-flex-wrap tw-gap-6 tw-text-sm tw-text-gray-600">
                    <div className="tw-flex tw-items-center">
                      Units: <span className={countPill}>{units.length}</span>
                    </div>
                    <div className="tw-flex tw-items-center">
                      Chapters: <span className={countPill}>{totalChapters}</span>
                    </div>
                    <div className="tw-flex tw-items-center">
                      Topics: <span className={countPill}>{totalTopics}</span>
                    </div>
                  </div>
                </div>
                <div className="tw-flex tw-flex-wrap tw-gap-2 tw-justify-end">
                  <button type="button" onClick={expandAll} className={btnOutline}>
                    <i className="ri-arrow-down-s-line" />
                    Expand all
                  </button>
                  <button type="button" onClick={collapseAll} className={btnOutline}>
                    <i className="ri-arrow-up-s-line" />
                    Collapse all
                  </button>
                </div>
              </div>
              <div
                className={classnames(
                  "tw-flex-1 tw-px-4 tw-pb-6 tw-my-3",
                  isUsingRequestChangeCtx ? "tw-overflow-y-auto" : "tw-overflow-y-auto"
                )}
              >
                <TreeContextProvider.Provider
                  value={{ value: expandCollapseState, toggle: expandCollapseHndlr }}
                >
                  {treeData.map((node) => (
                    <ModuleTree
                      key={node.id}
                      level={1}
                      parentsInfo={[]}
                      parentFeatureId=""
                      {...node}
                    />
                  ))}
                </TreeContextProvider.Provider>
              </div>
              {!isUsingRequestChangeCtx && (
                <div className="tw-flex tw-items-center tw-justify-between tw-border-t tw-border-gray-100 tw-p-4 tw-bg-white">
                  <button type="button" onClick={goToPreviousStep} className={btnGhost}>
                    <HugeiconsIcon icon={CircleArrowLeft01Icon} size={18} />
                    Previous
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="tw-col-span-12 md:tw-col-span-4">
            <div
              className={classnames(
                "tw-rounded-2xl tw-bg-white tw-border tw-border-gray-100 tw-shadow-sm tw-flex tw-flex-col",
                cardHeightClass
              )}
            >
              <div className="tw-border-b tw-border-gray-100 tw-p-4">
                <div className="tw-flex tw-items-start tw-gap-3">
                  <div className="tw-w-10 tw-h-10 tw-rounded-2xl tw-bg-[#F1FFFD] tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
                    <HugeiconsIcon icon={Bookmark03Icon} size={20} color="#0AB39C" />
                  </div>
                  <div className="tw-flex-1">
                    <div className="tw-flex tw-items-center tw-gap-2">
                      <h4 className="tw-text-[16px] tw-font-semibold tw-text-gray-900 tw-mb-0">
                        Submit to HOD
                      </h4>
                      <span className="tw-ml-auto">
                        <StatusPill tone="neutral" variant="soft" size="md" label="Draft" />
                      </span>
                    </div>
                    <p className="tw-mt-1 tw-text-[13px] tw-text-gray-500 tw-leading-snug mb-1">
                      Final check before sending for approval.
                    </p>
                  </div>
                </div>
              </div>
              <div
                className={classnames(
                  "tw-flex-1 tw-p-4 tw-space-y-4",
                  isUsingRequestChangeCtx ? "tw-overflow-y-auto" : "tw-overflow-y-auto"
                )}
              >
                <div className="tw-rounded-2xl tw-border tw-border-teal-100 tw-bg-teal-50/40 tw-p-4">
                  <div className="tw-text-sm tw-text-gray-700 tw-leading-relaxed">
                    <div className="tw-font-semibold tw-text-gray-900">What happens next</div>
                    <ul className="tw-mt-2 tw-space-y-1 tw-list-disc tw-pl-5">
                      <li>
                        Your curriculum moves to <b>HOD review</b>.
                      </li>
                      <li>
                        Structure editing is <b>locked</b> until feedback/approval.
                      </li>
                      <li>HOD receives a notification immediately.</li>
                    </ul>
                  </div>
                </div>
                <div className="tw-rounded-2xl tw-border tw-border-gray-200 tw-bg-white tw-p-4">
                  <div className="tw-flex tw-items-start tw-gap-3">
                    <div className="tw-mt-1">
                      <InputCheckbox
                        name="instructionsConfim"
                        value={agree}
                        onChange={() => setAgree(!agree)}
                        formgroupClassName="mb-0"
                        labelName="I confirm that the curriculum structure is complete and aligned with the board syllabus."
                      />
                    </div>
                  </div>
                  {!hasData && (
                    <div className="tw-mt-3 tw-rounded-xl tw-bg-amber-50 tw-border tw-border-amber-100 tw-p-3">
                      <p className="tw-text-[13px] tw-text-amber-900 tw-mb-0">
                        Add at least <b>one unit</b> to enable submission.
                      </p>
                    </div>
                  )}
                </div>
                <div className="tw-rounded-2xl tw-border tw-border-gray-200 tw-bg-white tw-p-4">
                  <div className="tw-flex tw-items-center tw-justify-between tw-mb-2">
                    <div className="tw-text-sm tw-font-semibold tw-text-gray-900">
                      Note to HOD  
                      <span className="tw-text-gray-400 tw-font-normal">(optional)</span>
                    </div>
                    <div className="tw-text-xs tw-text-gray-500">
                      {remarksLen}/{MAX_REMARKS}
                    </div>
                  </div>
                  <TextArea
                    name="remarks"
                    value={submitHodFormik.values.remarks}
                    onChange={(e) => {
                      const next = e.target.value?.slice(0, MAX_REMARKS);
                      submitHodFormik.setFieldValue("remarks", next);
                    }}
                    labelText=""
                    inputClassName="w-100"
                    formgroupClassName="h-100 mb-0"
                  />
                  <div className="tw-mt-2 tw-text-[12px] tw-text-gray-500">
                    Use this to highlight changes, exceptions, or alignment notes for faster review.
                  </div>
                </div>
                <div className="tw-mt-2 tw-text-[12px] tw-text-gray-500">
                  {canSubmit
                    ? "Ready to submit."
                    : !hasData
                      ? "Add curriculum units to enable submission."
                      : "Confirm the checklist to enable submission."}
                </div>
              </div>
              {!isUsingRequestChangeCtx && (
                <div className="tw-border-t tw-border-gray-100 tw-p-4 tw-bg-white">
                  <div className="tw-flex tw-items-center tw-gap-2">
                    <button
                      type="button"
                      className={classnames(
                        btnPrimary,
                        "tw-flex-1 tw-px-6",
                        (!canSubmit || submitHodFormik.values.remarks.length > MAX_REMARKS) &&
                        "tw-opacity-60 tw-cursor-not-allowed hover:tw-bg-teal-600"
                      )}
                      disabled={!canSubmit}
                      onClick={handleSaveDigitalCurriculum}
                    >
                      Submit to HOD for Review
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isUsingRequestChangeCtx && (
        <div className="tw-border-t tw-border-gray-200 tw-bg-white tw-p-4 tw-flex tw-justify-between tw-gap-2">
          <button
            type="button"
            onClick={() => props.toggle?.()}
            className="tw-border tw-border-gray-300 tw-rounded-lg tw-px-4 tw-py-2"
          >
            Close
          </button>

          <button
            type="button"
            className={classnames(btnPrimary, !canSubmit && "tw-opacity-60 tw-cursor-not-allowed")}
            disabled={!canSubmit}
            onClick={handleSaveDigitalCurriculum}
          >
            Submit to HOD for Review
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewCurriculumDetails;
