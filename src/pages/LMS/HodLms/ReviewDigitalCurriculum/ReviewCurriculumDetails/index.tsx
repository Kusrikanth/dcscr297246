import { HugeiconsIcon } from "@hugeicons/react";
import { Bookmark03Icon, File01Icon } from "@hugeicons-pro/core-stroke-standard";
import { useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import classnames from "classnames";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { hodReviewDigitalCurriculumDetailsByIdAct, resetHodReviewDigitalCurriculumDetailsByIdAct, submitHodReviewDigitalCurriculumDetailsByIdAct } from "../../../../../store/lms/lmsdigitalcurriculum/lmsdigitalcurriculumaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { convertCurriculumToTree, TreeContextProvider } from "./helper";
import { ModuleTree } from "./TreeComponent";
import { RadioInputContainer, TextArea } from "../../../../../Components/Common";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";

const initialValues = {
  reviewComments: "",
  resultReleaseMode: "",
};

const validationSchema = Yup.object({
  reviewComments: Yup.string().when("resultReleaseMode", {
    is: (v: string) => v === "REQUEST_CHANGE" || v === "REJECTED",
    then: (s) => s.required("Feedback is required").max(500),
  }),
});

const ReviewCurriculumDetails = () => {
  const scheduleOptions: Array<any> = [
    {
      id: "APPROVED",
      name: "Approve curriculum as submitted",
    },
    {
      id: "REQUEST_CHANGE",
      name: "Request changes from Admin",
    },
    {
      id: "REJECTED",
      name: "Reject curriculum (not aligned / major issues)",
    }
  ];
  const dispatch = useAppDispatch();
  const history = useHistory();
  const MAX_REMARKS = 500;
  const { id } = useParams<{ id: string }>();
  const subjectCurriculumId = Number(id);

  const { getHodReviewDigitalCurriculumDetailsByIdResp, submitHodReviewDigitalCurriculumDetailsByIdResp, lmsdigitalcurriculumErrorAct } = useAppSelector(
    ({ lmsdigitalcurriculum }) => ({
      getHodReviewDigitalCurriculumDetailsByIdResp:
        lmsdigitalcurriculum.getHodReviewDigitalCurriculumDetailsByIdResp,
      submitHodReviewDigitalCurriculumDetailsByIdResp:
        lmsdigitalcurriculum.submitHodReviewDigitalCurriculumDetailsByIdResp,
      lmsdigitalcurriculumErrorAct: lmsdigitalcurriculum.lmsdigitalcurriculumErrorAct,
    }),
    shallowEqual
  );

  const bulkUploadRef = useRef<any>({
    prevSubmitDigitalCurriculumReviewResp: submitHodReviewDigitalCurriculumDetailsByIdResp,
    prevLmsdigitalcurriculumErrorActErrorResp: lmsdigitalcurriculumErrorAct,
  });

  useEffect(() => {
    const { prevSubmitDigitalCurriculumReviewResp, prevLmsdigitalcurriculumErrorActErrorResp } = bulkUploadRef.current;
    if (submitHodReviewDigitalCurriculumDetailsByIdResp && prevSubmitDigitalCurriculumReviewResp !== submitHodReviewDigitalCurriculumDetailsByIdResp) {
      toast.success("Digital Curriculum decision submitted successfully.");
      history.push("/review-digital-curriculum");
    }
    else if (lmsdigitalcurriculumErrorAct && prevLmsdigitalcurriculumErrorActErrorResp !== lmsdigitalcurriculumErrorAct) {
      const { details } = lmsdigitalcurriculumErrorAct || {};
      toast.error(details || "Something went wrong");
    }
    bulkUploadRef.current.prevLmsdigitalcurriculumErrorActErrorResp = lmsdigitalcurriculumErrorAct;
    bulkUploadRef.current.prevSubmitDigitalCurriculumReviewResp = submitHodReviewDigitalCurriculumDetailsByIdResp;
  }, [submitHodReviewDigitalCurriculumDetailsByIdResp, lmsdigitalcurriculumErrorAct]);

  const submitHodFormik = useFormik({
    enableReinitialize: false,
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
    },
  });

  useEffect(() => {
    if (!subjectCurriculumId) return;
    dispatch(
      hodReviewDigitalCurriculumDetailsByIdAct(
        generateActionPayload(
          "hod_review_digital_curriculum_details_by_id",
          { subjectCurriculumId },
          undefined
        )
      )
    );
    return () => {
      dispatch(resetHodReviewDigitalCurriculumDetailsByIdAct(undefined));
    };
  }, [subjectCurriculumId, dispatch]);

  const subjectDTO =
    getHodReviewDigitalCurriculumDetailsByIdResp?.subjectCurriculumReqDTO;

  const units = subjectDTO?.units ?? [];
  const subjectMeta =
    getHodReviewDigitalCurriculumDetailsByIdResp?.subjectCurriculumDTO;

  const formatVersion = (version?: string | number) => {
    if (!version) return "-";

    const v = String(version).toLowerCase().replace(/^v/, "");

    return v.includes(".") ? `V${v}` : `V${v}.0`;
  };

  const hasData = units?.length > 0;

  const [expandCollapseState, setExpandCollapseState] = useState({
    action: "",
    ids: [] as string[],
  });

  function expandCollapseHndlr(action: string, ids?: string[]) {
    setExpandCollapseState({ action, ids: ids || [] });
  }

  const expandAll = () => expandCollapseHndlr("EXPAND_ALL");
  const collapseAll = () => expandCollapseHndlr("COLLAPSE_ALL");

  const treeData = useMemo(
    () => convertCurriculumToTree(units),
    [units]
  );

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
  const subjectCurriculumReviewId = getHodReviewDigitalCurriculumDetailsByIdResp?.curriculumReviewDTO?.id
  const buildPayload = () => ({
    subjectCurriculumReviewId: getHodReviewDigitalCurriculumDetailsByIdResp?.curriculumReviewDTO?.id,
    subjectCurriculumId,
    reviewStatus: submitHodFormik.values.resultReleaseMode,
    reviewComments: submitHodFormik.values.reviewComments || "",
  });

  const handleSaveDigitalCurriculum = async () => {
    const errors = await submitHodFormik.validateForm();
    if (Object.keys(errors).length) {
      submitHodFormik.setTouched({
        resultReleaseMode: true,
        reviewComments: true,
      });
      return;
    }
    const payload = buildPayload();
    dispatch(
      submitHodReviewDigitalCurriculumDetailsByIdAct(
        generateActionPayload("submit_hod_review_digital_curriculum_details_by_id", {
          subjectCurriculumId: subjectCurriculumReviewId,
        }, payload)
      )
    );
  };

  const btnBase =
    "tw-inline-flex tw-items-center tw-justify-center tw-gap-2 tw-rounded-xl tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-transition";
  const btnPrimary = `${btnBase} tw-bg-teal-600 tw-text-white hover:tw-bg-teal-700`;
  const btnOutline = `${btnBase} tw-border tw-border-gray-300 tw-text-gray-700 hover:tw-bg-gray-50`;
  const countPill =
    "tw-ml-2 tw-min-w-[28px] tw-text-center tw-inline-flex tw-items-center tw-justify-center tw-px-2 tw-py-0.5 tw-rounded-full tw-bg-gray-100 tw-text-gray-800 tw-text-xs tw-font-semibold";
  const remarksLen = submitHodFormik.values.reviewComments?.length || 0;
  const isSubmitEnabled = Boolean(submitHodFormik.values.resultReleaseMode);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb title="Digital Curriculum Setup" pageTitle="Digital Curriculum" />
        <div
          className={classnames(
            "tw-grid tw-grid-cols-12 tw-gap-4 tw-p-4 tw-pt-0 tw-rounded-xl tw-items-stretch",
            {
              "tw-min-h-[calc(200px)]": !hasData,
              "tw-h-[calc(100vh-200px)]": hasData,
            }
          )}
        >
          <div className="tw-col-span-12 tw-h-full">
            <div className="tw-rounded-2xl tw-bg-white tw-border tw-border-gray-100 tw-shadow-sm">
              <div className="tw-p-4 tw-flex tw-items-center tw-justify-between">
                <div className="tw-flex tw-items-center">
                  <div className="tw-mr-3 tw-w-12 tw-h-12 tw-bg-[#CBF3EF] tw-rounded-2xl tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
                    <HugeiconsIcon icon={File01Icon} size={24} color="#0AB39C" />
                  </div>
                  <div className="tw-grid">
                    <h4 className="tw-mb-1 tw-text-[20px] tw-font-semibold tw-text-gray-900 tw-leading-tight">
                      Review Digital Curriculum
                    </h4>
                    <span className="tw-text-[14px] tw-text-gray-500 tw-leading-snug">
                      Review the curriculum structure.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {!hasData ? (
            <div className="tw-col-span-12 tw-flex tw-flex-1 tw-items-center tw-justify-center">
              <div className="tw-w-full tw-h-[calc(500px)] tw-bg-white tw-rounded-2xl tw-border tw-border-gray-100 tw-shadow-sm tw-p-10 tw-text-center tw-flex tw-flex-col tw-items-center tw-justify-center">
                <div className="tw-mx-auto  tw-mb-4 tw-w-16 tw-h-16 tw-rounded-2xl tw-bg-gray-100 tw-flex tw-items-center tw-justify-center">
                  <span className="tw-text-3xl">📄</span>
                </div>
                <h3 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                  Curriculum not ready for review
                </h3>
                <p className="tw-mt-2 tw-text-sm tw-text-gray-500 leading-relaxed">
                  This curriculum has been submitted without any units, chapters, or topics.
                  Please ask the Admin to complete the curriculum structure and resubmit it for approval.
                </p>
                <p className="tw-text-xs tw-text-gray-400">
                  Once submitted, the curriculum hierarchy will appear here for your review.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="tw-col-span-12 md:tw-col-span-8 tw-h-full tw-overflow-hidden">
                <div className="tw-rounded-2xl tw-bg-white tw-border tw-border-gray-100 tw-shadow-sm tw-flex tw-flex-col tw-h-full tw-min-h-[460px]">
                  <div className="tw-flex tw-items-start tw-justify-between tw-border-b tw-border-gray-100 tw-p-4">
                    <div className="tw-flex tw-flex-col tw-gap-2">
                      <h4 className="tw-text-[16px] tw-font-semibold tw-text-gray-900 tw-mb-0">
                        <span className="tw-mr-2">Curriculum Structure </span>
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
                  <div className="tw-flex-1 tw-overflow-y-auto tw-px-4 tw-pb-6 tw-my-3">
                    <TreeContextProvider.Provider
                      value={{ value: expandCollapseState, toggle: expandCollapseHndlr }}
                    >
                      {treeData.map((node) => (
                        <ModuleTree
                          key={node.id}
                          level={1}
                          parentsInfo={[]}
                          {...node}
                        />
                      ))}
                    </TreeContextProvider.Provider>
                  </div>
                </div>
              </div>
              <div className="tw-col-span-12 md:tw-col-span-4 tw-h-full tw-overflow-hidden">
                <div className="tw-rounded-2xl tw-bg-white tw-border tw-border-gray-100 tw-shadow-sm tw-flex tw-flex-col tw-h-full tw-min-h-[460px] tw-overflow-hidden">
                  <div className="tw-border-b tw-border-gray-100 tw-p-4 tw-mb-3">
                    <div className="tw-flex tw-items-start tw-gap-3">
                      <div className="tw-w-10 tw-h-10 tw-rounded-2xl tw-bg-[#F1FFFD] tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
                        <HugeiconsIcon icon={Bookmark03Icon} size={20} color="#0AB39C" />
                      </div>
                      <div className="tw-flex-1">
                        <div className="tw-flex tw-items-center tw-gap-2">
                          <h4 className="tw-text-[16px] tw-font-semibold tw-text-gray-900 tw-mb-0">
                            Admin Submission Details
                          </h4>
                        </div>
                        <p className="tw-mt-1 tw-text-[13px] tw-text-gray-500 tw-leading-snug mb-1" >
                          Final check before sending for approval.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="tw-flex-1 tw-p-4 tw-pt-0 tw-space-y-4 tw-overflow-y-auto">
                    <div className="tw-rounded-2xl tw-border tw-border-teal-100 tw-bg-teal-50/40 tw-p-4">
                      <div className="tw-text-sm tw-text-gray-700 tw-leading-relaxed">
                        <div className="tw-font-semibold tw-text-gray-900">Submitted Curriculum</div>
                        <ul className="tw-mt-2 tw-space-y-1 tw-list-disc tw-pl-5 tw-mb-0">
                          <li>{subjectMeta?.curriculumCode || "-"} - <b>{subjectMeta?.subjectCurriculumName || "-"}</b></li>
                          <li>{subjectMeta?.curriculumName || "-"} , {subjectMeta?.className || "-"}</li>
                          <li>Version : <b>{formatVersion(subjectMeta?.version)}</b></li>
                          <li>Submitted By : <b>{subjectMeta?.submittedBy || "-"}</b></li>
                        </ul>
                      </div>
                    </div>
                    <div className="tw-rounded-2xl tw-border tw-border-teal-100 tw-bg-teal-50/40 tw-p-4">
                      <div className="tw-text-sm tw-text-gray-700 tw-leading-relaxed">
                        <div className="tw-font-semibold tw-text-gray-900">Admin Note to HOD</div>
                        <ul className="tw-mt-2 tw-space-y-1 tw-list-disc tw-pl-5 tw-mb-0">
                          <li>{subjectMeta?.curriculumCode || "-"} - <b>{subjectMeta?.subjectCurriculumName || "-"}</b></li>
                        </ul>
                      </div>
                    </div>
                    <div className="tw-rounded-2xl tw-border tw-border-gray-200 tw-bg-white tw-p-4">
                      <div className="tw-flex tw-items-start tw-gap-3">
                        <div className="list-group digital_curriculum_radio_layout">
                          <RadioInputContainer
                            name="resultReleaseMode"
                            inputContainerClassName="d-grid gap-2"
                            radioOptions={scheduleOptions}
                            value={submitHodFormik.values.resultReleaseMode}
                            onChange={(e) => {
                              submitHodFormik.handleChange(e);
                              submitHodFormik.setFieldTouched("resultReleaseMode", true, true);
                            }}
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
                          Your feedback to Admin <span className="tw-text-gray-400 tw-font-normal"></span>
                        </div>
                        <div className="tw-text-xs tw-text-gray-500">
                          {remarksLen}/{MAX_REMARKS}
                        </div>
                      </div>
                      <TextArea
                        name="reviewComments"
                        value={submitHodFormik.values.reviewComments}
                        onChange={(e) => {
                          const next = e.target.value?.slice(0, MAX_REMARKS);
                          submitHodFormik.setFieldValue("reviewComments", next);
                        }}
                        invalid={submitHodFormik.touched.reviewComments && submitHodFormik.errors.reviewComments ? true : false}
                        error={submitHodFormik.touched.reviewComments && submitHodFormik.errors.reviewComments ? submitHodFormik.errors.reviewComments : ""}
                        labelText=""
                        inputClassName="w-100"
                        formgroupClassName="h-100 mb-0"
                      />
                      <div className="tw-mt-2 tw-text-[12px] tw-text-gray-500">
                        Use this to highlight changes, exceptions, or alignment notes for faster review.
                      </div>
                    </div>
                  </div>
                  <div className="tw-border-t tw-border-gray-100 tw-p-4 tw-mt-2 tw-bg-white">
                    <div className="tw-flex tw-items-center tw-gap-2">
                      <button
                        type="button"
                        className={classnames(btnPrimary, "tw-flex-1", {
                          "tw-opacity-60 tw-cursor-not-allowed": !isSubmitEnabled,
                        })}
                        disabled={!isSubmitEnabled}
                        onClick={handleSaveDigitalCurriculum}
                      >
                        Submit Decision
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCurriculumDetails;
