import { useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon, Edit01Icon } from "@hugeicons-pro/core-stroke-standard";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getDigitalCurriculumListAct, hodFeedbackHistoryDigitalCurriculumDetailsByIdAct } from "../../../../store/lms/lmsdigitalcurriculum/lmsdigitalcurriculumaction";
import { getAssignedClassSubjectsList } from "../../../../store/academic/classSubjects/classsubjectsactions";
import { generateColumns } from "./helper";
import FeedBackHistoryModal from "./FeedBackHistoryModal";
import { useModal } from "../../../../hooks/modalhook";
import { useHistory } from "react-router-dom";

const initialValues = {
  academicYearId: "",
  searchString: "",
  classId: "",
  curriculumId: "",
  subjectId: "",
};

const ReviewCoursePlanner = () => {
  const { openModal: openFeedBackHistoryModal, closeModal: closeFeedBackHistoryModal, modalState: feedBackHistoryModalState } = useModal();
  const dispatch = useAppDispatch();

  const paginationDetailRef = useRef({ pageNo: 0, pageSize: 10 });

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    assignedClassSubjectsListResp,
    getDigitalCurriculumListResp,
    lmsdigitalcurriculumErrorAct,
  } = useAppSelector(
    ({ appData, instAcademics, branchAcademics, lmsdigitalcurriculum, classSubjectsInfo }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      assignedClassSubjectsListResp: classSubjectsInfo.assignedClassSubjectsListResp,
      getDigitalCurriculumListResp: lmsdigitalcurriculum.getDigitalCurriculumListResp,
      lmsdigitalcurriculumErrorAct: lmsdigitalcurriculum.lmsdigitalcurriculumErrorAct,
    }),
    shallowEqual
  );

  const signatureForm = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: () => { },
  });

  const digitalCurriculumRef = useRef({
    prevLmsdigitalcurriculumErrorActErrorResp: lmsdigitalcurriculumErrorAct,
  });

  useEffect(() => {
    const { prevLmsdigitalcurriculumErrorActErrorResp } = digitalCurriculumRef.current;
    if ( lmsdigitalcurriculumErrorAct && prevLmsdigitalcurriculumErrorActErrorResp !== lmsdigitalcurriculumErrorAct ) {
      const { details } = lmsdigitalcurriculumErrorAct || {};
      toast.error(details || "Something went wrong");
    }
    digitalCurriculumRef.current.prevLmsdigitalcurriculumErrorActErrorResp = lmsdigitalcurriculumErrorAct;
  }, [lmsdigitalcurriculumErrorAct]);

  const prevValuesRef = useRef({ academicYearId: "", curriculumId: "", classId: "" });

  const getDigitalCurriculumListApi = (otherProps?: any) => {
    const payload = {
      branchId,
      academicYearId: signatureForm.values.academicYearId,
      curriculumId: signatureForm.values.curriculumId,
      classId: signatureForm.values.classId,
      ...otherProps,
    };

    dispatch(
      getDigitalCurriculumListAct(
        generateActionPayload("get_digital_curriculum_list", undefined, payload)
      )
    );
  };

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload = {
      instituteId,
      branchId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "curriculumName",
      orderBy: "asc",
      ...otherProps,
    };

    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload)));
  };

  function getClassApiCall({ curriculumId, academicYearId }: { curriculumId?: string; academicYearId: string }) {
    const payload = {
      pageNo: 0,
      pageSize: 100,
      sortBy: "classSequence",
      orderBy: "asc",
      curriculumId,
      academicYearId,
      branchId,
    };

    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const classSubjectListApicall = (otherProps?: any) => {
    const { academicYearId, classId, curriculumId } = signatureForm.values;
    const payload = {
      academicYearId,
      curriculumId,
      branchClassId: classId,
      ...otherProps,
      pageNo: 0,
      pageSize: 100,
    };

    if (payload.academicYearId && payload.branchClassId) {
      dispatch(getAssignedClassSubjectsList(generateActionPayload("get_assigned_class_subject_list", undefined, payload)));
    }
  };

  useEffect(() => {
    const { data } = academicYearListResp || {};
    if (Array.isArray(data) && data.length > 0) {
      const currentYear =
        data.find((year: any) => year.yearStatus?.toUpperCase() === "CURRENT") || data[0];

      if (currentYear?.academicYearId) {
        const { academicYearId } = currentYear;
        signatureForm.setFieldValue("academicYearId", academicYearId);
        prevValuesRef.current.academicYearId = academicYearId;
        getCurriculumApiCall({ academicYearId });
      }
    }
  }, [academicYearListResp]);

  useEffect(() => {
    const { data } = brchCurriculumResp || {};
    if (Array.isArray(data) && data.length > 0) {
      const firstCurriculum = data[0];
      if (firstCurriculum?.branchCurriculumId) {
        signatureForm.setFieldValue("curriculumId", firstCurriculum.branchCurriculumId);
        prevValuesRef.current.curriculumId = firstCurriculum.branchCurriculumId;

        getClassApiCall({
          curriculumId: firstCurriculum.branchCurriculumId,
          academicYearId: prevValuesRef.current.academicYearId,
        });
      }
    }
  }, [brchCurriculumResp]);

  useEffect(() => {
    const { content } = branchClassResp || {};
    if (Array.isArray(content) && content.length > 0) {
      const firstClass = content[0];
      if (firstClass?.id && prevValuesRef.current.curriculumId && prevValuesRef.current.academicYearId) {
        const prevClassId = prevValuesRef.current.classId;
        signatureForm.setFieldValue("classId", firstClass.id);
        prevValuesRef.current.classId = firstClass.id;

        const payload = {
          academicYearId: prevValuesRef.current.academicYearId,
          curriculumId: prevValuesRef.current.curriculumId,
          branchClassId: firstClass.id,
          classId: firstClass.id,
        };
        if (prevClassId !== firstClass.id) {
          classSubjectListApicall(payload);
          getDigitalCurriculumListApi(payload);
        }
      }
    }
  }, [branchClassResp]);

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    paginationDetailRef.current.pageNo = 0;

    signatureForm.setFieldValue(name, value);

    if (name === "academicYearId") {
      prevValuesRef.current.academicYearId = value;
      getCurriculumApiCall({ academicYearId: value });
      signatureForm.setFieldValue("curriculumId", "");
      signatureForm.setFieldValue("classId", "");
      prevValuesRef.current.curriculumId = "";
      prevValuesRef.current.classId = "";
    } else if (name === "curriculumId") {
      prevValuesRef.current.curriculumId = value;
      getClassApiCall({
        curriculumId: value,
        academicYearId: prevValuesRef.current.academicYearId,
      });
      signatureForm.setFieldValue("classId", "");
      prevValuesRef.current.classId = "";
    } else if (name === "classId") {
      const payload = {
        academicYearId: prevValuesRef.current.academicYearId,
        curriculumId: prevValuesRef.current.curriculumId,
        branchClassId: value,
        classId: value,
      };
      classSubjectListApicall(payload);
      getDigitalCurriculumListApi(payload);
    }
  };

  const allData = getDigitalCurriculumListResp?.content || [];

  const inReviewData = useMemo(() => {
    return allData.filter((item: any) => item.buildStatus === "IN_REVIEW");
  }, [allData]);
  const history = useHistory();
    const handleReviewDigitalCurriculumDetails = (id: number) => {
        history.push(`/review-course-planner-details/${id}`);
    };
  const menuOptions = useMemo(
    () => [
      {
        id: "reviewPlanner",
        actionIcon: <HugeiconsIcon icon={Edit01Icon} className="text-muted" size={18} />,
        actionName: "Review Planner",
        onClickHndlr: (event: any) => {
           const id = event.currentTarget.getAttribute("data-id");
        if (id) {
          handleReviewDigitalCurriculumDetails(Number(id));
        }
        },
      },
      {
        id: "feedbackHistory",
        actionIcon: <HugeiconsIcon icon={Copy01Icon} className="text-muted" size={18} />,
        actionName: "Feedback History",
        onClickHndlr: (event: any) => {
           const id = event.currentTarget.getAttribute("data-id");
          dispatch(hodFeedbackHistoryDigitalCurriculumDetailsByIdAct(generateActionPayload("hod_feedback_history_course_planner_details_by_id", { subjectCurriculumBuildId: id }, undefined)));
          openFeedBackHistoryModal(id);
        },
      },
    ],
    [getDigitalCurriculumListResp]
  );

  const tableColumns = useMemo(() => generateColumns(menuOptions), [menuOptions, getDigitalCurriculumListResp]);
  const filteredData = useMemo(() => inReviewData || [], [inReviewData]);
  const hasData = filteredData.length > 0;

  const { data: curriculumTypes } = brchCurriculumResp || {};
  const { content: classTypes } = branchClassResp || {};

  return (
    <>
      <div className="page-content">
        <div className="container-fluid tw-space-y-4">
          <BreadCrumb pageTitle="LMS" />
          <div className="card tw-overflow-hidden" style={{ borderRadius: "12px" }}>
            <div className="tw-flex tw-flex-col tw-gap-1 tw-border-b tw-border-gray-200 tw-bg-white tw-px-5 tw-py-4">
              <h4 className="tw-mb-0 tw-text-lg tw-font-semibold tw-text-gray-900">Review Course Planner</h4>
              <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                Review and approve course planner plans submitted by faculty, ensuring quality and academic standards.
              </p>
            </div>
            <div className="card-body tw-bg-white px-0 pb-0">
              <div className="tw-flex tw-flex-col tw-gap-4">
                <div className="row g-3 tw-items-end !tw-px-5 !tw-py-2">
                  <div className="col-12 col-md-6 col-lg-4 col-xl-3">
                    <div className="search-box tw-relative">
                      <TextInput
                        name="searchString"
                        value={signatureForm.values.searchString}
                        onChange={filterHandler}
                        labelText="Search"
                        floatingLabel
                        formgroupClassName="my-0"
                      />
                      <i className="ri-search-line search-icon tw-text-gray-400"></i>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 col-lg-4 col-xl-2">
                    <SelectInput
                      name="curriculumId"
                      value={signatureForm.values.curriculumId}
                      onChange={filterHandler}
                      menuItems={curriculumTypes}
                      valueKey="branchCurriculumId"
                      textKey="curriculumName"
                      labelText="Curriculum"
                      formgroupClassName="my-0"
                      floatingLabel
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4 col-xl-2">
                    <SelectInput
                      name="classId"
                      value={signatureForm.values.classId}
                      onChange={filterHandler}
                      menuItems={classTypes}
                      valueKey="id"
                      textKey="shortName"
                      labelText="Class"
                      formgroupClassName="my-0"
                      floatingLabel
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4 col-xl-2">
                    <SelectInput
                      name="subjectId"
                      labelText="Subject"
                      value={signatureForm.values.subjectId}
                      onChange={filterHandler}
                      menuItems={assignedClassSubjectsListResp?.data}
                      valueKey="subjectId"
                      textKey="subjectName"
                      defaultSelect="Select"
                      formgroupClassName="my-0"
                      floatingLabel
                    />
                  </div>
                </div>
                <div className="card mb-0">
                  <div className="card-body p-0 lms_digital_curriculum">
                    {hasData ? (
                      <TableContainer
                        columns={tableColumns || []}
                        data={filteredData}
                        tableClass="mb-0"
                        divClass="table-responsive mb-3"
                        theadClass="table-light text-muted align-middle"
                        showCheckbox={false}
                        showPagination={true}
                        totalPages={getDigitalCurriculumListResp?.totalPages || 0}
                        totalRecords={getDigitalCurriculumListResp?.totalElements || 0}
                        callbackPaginationHndlr={() => { }}
                        currentPageNumber={getDigitalCurriculumListResp?.pageNumber || 0}
                      />
                    ) : (
                      <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center tw-bg-white tw-rounded-xl tw-border tw-shadow-sm tw-py-10 tw-px-4 tw-mx-4 tw-mb-5">
                        <div className="tw-w-14 tw-h-14 tw-bg-gray-100 tw-rounded-2xl tw-shadow-sm tw-flex tw-items-center tw-justify-center tw-mb-3">
                          <div className="tw-text-3xl tw-text-gray-400">📄</div>
                        </div>
                        <p className="tw-text-base tw-font-semibold tw-text-gray-700">No curriculum found</p>
                        <p className="tw-text-sm tw-text-gray-500 tw-mt-1">
                          Try adjusting filters or create a new digital curriculum for a class and subject.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="feedback-history-modal"
        isOpen={feedBackHistoryModalState.showModal}
        toggle={closeFeedBackHistoryModal}
        modalTitle="Feedback History Details"
        modalSize="xl"
      >
        <FeedBackHistoryModal
          toggle={closeFeedBackHistoryModal}
          id={feedBackHistoryModalState.modalData}
        />
      </ModalContainerUpdated></>
  );
};

export default ReviewCoursePlanner;
