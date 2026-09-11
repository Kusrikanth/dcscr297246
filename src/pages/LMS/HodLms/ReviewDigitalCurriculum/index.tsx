import { PlusSignIcon } from "@hugeicons-pro/core-stroke-standard";
import { SelectInput, TextInput } from "../../../../Components/Common";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import classnames from "classnames";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { getDigitalCurriculumListAct } from "../../../../store/lms/lmsdigitalcurriculum/lmsdigitalcurriculumaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { useFormik } from "formik";
import { getBranchClassAct, getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { toast } from "react-toastify";
import CurriculumPlannerGridView from "./CurriculumPlannerGridView";
import CurriculumPlannerTableView from "./CurriculumPlannerTableView";
import { getAssignedClassSubjectsList } from "../../../../store/academic/classSubjects/classsubjectsactions";

const initialValues = {
  academicYearId: "",
  searchString: "",
  classId: "",
  curriculumId: "",
  subjectId: "",
};

const ReviewDigitalCurriculum = () => {
  const [coursePlannerView, setCoursePlannerView] = useState({
    isGridMode: true,
  });
  const [activeDataId, setActiveDataId] = useState("grid");
  const dispatch = useAppDispatch();

  const paginationDetailRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    assignedClassSubjectsListResp,
    getDigitalCurriculumListResp,
    getDigitalCurriculumStatsResp,
    lmsdigitalcurriculumErrorAct
  } = useAppSelector(
    ({ appData, instAcademics, branchAcademics, lmsdigitalcurriculum, classSubjectsInfo }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      assignedClassSubjectsListResp: classSubjectsInfo.assignedClassSubjectsListResp,
      getDigitalCurriculumListResp: lmsdigitalcurriculum.getDigitalCurriculumListResp,
      getDigitalCurriculumStatsResp: lmsdigitalcurriculum.getDigitalCurriculumStatsResp,
      lmsdigitalcurriculumErrorAct: lmsdigitalcurriculum.lmsdigitalcurriculumErrorAct,

    }),
    shallowEqual
  );

  const STATUS_MAP: Record<string, string> = {
    draft: "DRAFT",
    inProgress: "IN_PROGRESS",
    inReview: "IN_REVIEW",
    published: "PUBLISHED",
  };

  const stats = getDigitalCurriculumStatsResp || {};

  const getStatsCount = (status: string) => {
    if (status === "all") {
      return Object.values(stats).reduce(
        (sum: number, v: any) => sum + Number(v || 0),
        0
      );
    }
    return Number(stats?.[status] || 0);
  };

  const signatureForm = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (values) => { },
  });

  const digitalCurriculumRef = useRef({
    prevLmsdigitalcurriculumErrorActErrorResp: lmsdigitalcurriculumErrorAct,
  });

  useEffect(() => {
    const { prevLmsdigitalcurriculumErrorActErrorResp } = digitalCurriculumRef.current;
    if (lmsdigitalcurriculumErrorAct && prevLmsdigitalcurriculumErrorActErrorResp !== lmsdigitalcurriculumErrorAct) {
      const { details } = lmsdigitalcurriculumErrorAct || {};
      toast.error(details || "Something went wrong");
    }
    digitalCurriculumRef.current.prevLmsdigitalcurriculumErrorActErrorResp = lmsdigitalcurriculumErrorAct;
  }, [lmsdigitalcurriculumErrorAct,]);

  const prevValuesRef = useRef({ academicYearId: "", curriculumId: "", classId: "" });

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

  const getDigitalCurriculumListApi = (otherProps?: any) => {

    const payload = {
      branchId,
      academicYearId: signatureForm.values.academicYearId,
      curriculumId: signatureForm.values.curriculumId,
      classId: signatureForm.values.classId,
      ...otherProps,
    };

    dispatch(getDigitalCurriculumListAct(generateActionPayload("get_digital_curriculum_list", undefined, payload)));
  };

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = {
      instituteId,
      branchId: branchId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "curriculumName",
      orderBy: "asc",
      ...otherProps,
    };
    dispatch(
      getBranchCurriculumAct(
        generateActionPayload("get_brch_curriculum", undefined, payload1)
      )
    );
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

    dispatch(
      getBranchClassAct(
        generateActionPayload("get_brch_curriculum_class", undefined, payload)
      )
    );
  }
  const classSubjectListApicall = (otherProps?: any) => {
    const { academicYearId, classId, curriculumId } = signatureForm.values;
    const payload = { academicYearId: academicYearId, curriculumId: curriculumId, branchClassId: classId, ...otherProps, pageNo: 0, pageSize: 100, };
    if (payload.academicYearId && payload.branchClassId) {
      dispatch(
        getAssignedClassSubjectsList(
          generateActionPayload("get_assigned_class_subject_list", undefined, payload)
        )
      );
    }
  }

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

  const { data: curriculumTypes } = brchCurriculumResp || {};
  const { content: classTypes } = branchClassResp || {};
  const data = getDigitalCurriculumListResp?.content || [];

  const viewTabHandler = (view: "grid" | "list") => {
    setActiveDataId(view);
    setCoursePlannerView({ isGridMode: view === "grid" });
  };
  const allData = getDigitalCurriculumListResp?.content || [];

  const inReviewData = useMemo(() => {
    return allData.filter(
      (item: any) =>
        item.curriculumStatus === "IN_REVIEW" &&
        item.reviewStatus === "PENDING"
    );
  }, [allData]);

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb pageTitle="LMS"></BreadCrumb>
          <div className="card" style={{ borderRadius: "10px" }}>
            <div className="card-body row">
              <div className="col-12 col-lg-6">
                <h4 className="card-title">Review Digital Curriculum</h4>
                <p className="fs-13 tw-text-gray-500 tw-mb-0">
                  Review and approve curriculum plans submitted by faculty, ensuring quality and academic standards.
                </p>
              </div>
            </div>
          </div>
          <div className="row g-3 mb-4">
            {[
              { label: "Draft", count: getStatsCount("draft"), color: "#F3E8FF" },
              { label: "In Progress", count: getStatsCount("inProgress"), color: "#E8F2FF" },
              { label: "Pending", count: getStatsCount("pending"), color: "#FFF7E6" },
              { label: "In Review", count: getStatsCount("inReview"), color: "#FFF2E8" },
              { label: "Published", count: getStatsCount("published"), color: "#E8FFF1" },
              { label: "Rejected", count: getStatsCount("rejected"), color: "#FFE8E8" },
            ]
              .map((item, i) => (
                <div
                  key={i}
                  className="col-auto"
                  style={{ width: "16.5%", borderRadius: "50px" }}
                >
                  <div className="p-3 text-start" style={{ backgroundColor: item.color, borderRadius: "10px" }}>
                    <p className="mb-1">{item.label}</p>
                    <h4 className="fw-bold">{item.count}</h4>
                  </div>
                </div>
              ))}
          </div>
          <div
            className={classnames("card", {
              "!tw-mb-0 !tw-border-b tw-border-gray-200": !coursePlannerView?.isGridMode,
            })}
            style={{ borderRadius: "10px" }}>
            <div className="card-body !tw-py-3 tw-mt-2">
              <div className="row g-3">
                <div className="col-12 col-md-6 col-lg-4 col-xl-2">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      value={""}
                      onChange={() => { }}
                      labelText="Search"
                      floatingLabel
                      formgroupClassName="my-1"
                    ></TextInput>
                    <i className="ri-search-line search-icon"></i>
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
                    formgroupClassName="my-1"
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
                    formgroupClassName="my-1"
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
                    formgroupClassName="my-1"
                    floatingLabel
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-4 col-xl-2">
                  <SelectInput
                    name="admin"
                    value={""}
                    onChange={() => { }}
                    menuItems={[]}
                    valueKey=""
                    textKey=""
                    labelText="Created by"
                    formgroupClassName="my-1"
                    floatingLabel
                  ></SelectInput>
                </div>
                <div className="col-auto tw-ms-auto tw-pe-0">
                  <div className="tw-ms-auto tw-pe-3 tw-flex tw-items-center tw-gap-0 tw-select-none">
                    <span
                      className="tw-py-1.5 tw-px-3 tw-rounded-l-lg tw-cursor-pointer tw-text-sm"
                      style={{
                        backgroundColor: activeDataId === "grid" ? "#3577F119" : "#40518919",
                        color: activeDataId === "grid" ? "#3577F1" : "#405189",
                      }}
                      onClick={() => viewTabHandler("grid")}
                    >
                      Grid
                    </span>
                    <span
                      className="tw-py-1.5 tw-px-3 tw-rounded-r-lg tw-cursor-pointer tw-text-sm"
                      style={{
                        backgroundColor: activeDataId === "list" ? "#3577F119" : "#40518919",
                        color: activeDataId === "list" ? "#3577F1" : "#405189",
                      }}
                      onClick={() => viewTabHandler("list")}
                    >
                      List
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {coursePlannerView?.isGridMode ? (
            <CurriculumPlannerGridView
              getDigitalCurriculumListResp={{ ...getDigitalCurriculumListResp, content: inReviewData }}
              activeId="inReview"
            />
          ) : (
            <CurriculumPlannerTableView
              getDigitalCurriculumListResp={{ ...getDigitalCurriculumListResp, content: inReviewData }}
              activeId="inReview"
            />
          )}

        </div>
      </div>
    </>
  );
};

export default ReviewDigitalCurriculum;
