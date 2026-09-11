import { PlusSignIcon } from "@hugeicons-pro/core-stroke-standard";
import { SelectInput, TextInput } from "../../../../Components/Common";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import classnames from "classnames";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { useFilterState } from "../../../../hooks/filterhook";
import { useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { getDigitalCurriculumListAct, getDigitalCurriculumStatsAct } from "../../../../store/lms/lmsdigitalcurriculum/lmsdigitalcurriculumaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { useFormik } from "formik";
import { getInstSubjectNameAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { toast } from "react-toastify";
import CurriculumPlannerGridView from "./CurriculumPlannerGridView";
import CurriculumPlannerTableView from "./CurriculumPlannerTableView";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { getMasterClassesAct, getMasterClassStreamGroupAct, getMasterCurriculumAct } from "../../../../store/masterdata/masterdataactions";

const initialValues = {
  academicYearId: "",
  searchString: "",
  classId: "",
  curriculumId: "",
  streamGroupId: "",
  subjectId: "",
};

const CurriculumPlannerList = () => {
  const [activeId, setActiveId] = useState("all");
  const [coursePlannerView, setCoursePlannerView] = useState({
    isGridMode: true,
  });
  const [activeDataId, setActiveDataId] = useState("grid");

  const { count } = useFilterState();
  const dispatch = useAppDispatch();

  const paginationDetailRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });
  const {
    instituteListResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    academicYearListResp,
    masterCurriculumResp,
    masterClassesResp,
    masterClassStreamGroupResp,
    instSubjectNameResp,
    getDigitalCurriculumListResp,
    getDigitalCurriculumStatsResp,
    lmsdigitalcurriculumErrorAct
  } = useAppSelector(
    ({ instituteInfo, appData, instAcademics, masterData, branchAcademics, lmsdigitalcurriculum, classSubjectsInfo }) => ({
      instituteListResp: instituteInfo.instituteListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      academicYearListResp: instAcademics.academicYearListResp,
      masterCurriculumResp: masterData.masterCurriculumResp,
      masterClassesResp: masterData.masterClassesResp,
      masterClassStreamGroupResp: masterData.masterClassStreamGroupResp,
      instSubjectNameResp: branchAcademics.instSubjectNameResp,
      getDigitalCurriculumListResp: lmsdigitalcurriculum.getDigitalCurriculumListResp,
      getDigitalCurriculumStatsResp: lmsdigitalcurriculum.getDigitalCurriculumStatsResp,
      lmsdigitalcurriculumErrorAct: lmsdigitalcurriculum.lmsdigitalcurriculumErrorAct
    }),
    shallowEqual
  );

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


  const MenuOptions = useMemo(() => {
    return [
      { id: "all", labelName: "All", customPadding: "", count: getStatsCount("all") },
      { id: "published", labelName: "Published", customPadding: "", count: getStatsCount("published") },
      { id: "draft", labelName: "Draft", customPadding: "", count: getStatsCount("draft") },
      { id: "inProgress", labelName: "In Progress", customPadding: "", count: getStatsCount("inProgress") },
      { id: "pending", labelName: "Pending", customPadding: "", count: getStatsCount("pending") },
      { id: "inReview", labelName: "In Review", customPadding: "", count: getStatsCount("inReview") },
    ];
  }, [getDigitalCurriculumStatsResp]);

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
    if (!Array.isArray(data) || data.length === 0) return;
    const currentYear = data.find((year: any) => year.yearStatus?.toUpperCase() === "CURRENT") || data[0];
    if (!currentYear?.academicYearId) return;
    const academicYearId = currentYear.academicYearId;
    signatureForm.setFieldValue("academicYearId", academicYearId);
    getDigitalCurriculumStatsApi({
      academicYearId,
      curriculumId: "",
      classId: "",
      streamGroupId: "",
      subjectId: "",
      searchString: "",
    });
    getDigitalCurriculumListApi({
      academicYearId,
      curriculumId: "",
      classId: "",
      streamGroupId: "",
      subjectId: "",
      searchString: "",
      pageNo: 0,
      pageSize: 10,
    });
  }, [academicYearListResp]);

  const getDigitalCurriculumStatsApi = (otherProps?: any) => {
    const selectedInstitute = instituteListResp?.data?.find(
      (item: any) => Number(item?.id) === Number(instituteId)
    );
    const payload = {
      instituteGroupId: selectedInstitute?.instituteGroupId,
      academicYearId: signatureForm.values.academicYearId,
      curriculumId: signatureForm.values.curriculumId,
      classId: signatureForm.values.classId,
      subjectId: signatureForm.values.subjectId,
      ...otherProps,
    };
    dispatch(getDigitalCurriculumStatsAct(generateActionPayload("get_digital_curriculum_stats", undefined, payload)));
  };

  const getDigitalCurriculumListApi = (otherProps?: any) => {
    const selectedInstitute = instituteListResp?.data?.find(
      (item: any) => Number(item?.id) === Number(instituteId)
    );
    const payload = {
      instituteGroupId: selectedInstitute?.instituteGroupId,
      searchString: signatureForm.values.searchString,
      academicYearId: signatureForm.values.academicYearId,
      curriculumId: signatureForm.values.curriculumId,
      classId: signatureForm.values.classId,
      streamGroupId: signatureForm.values.streamGroupId,
      subjectId: signatureForm.values.subjectId,
      ...otherProps,
    };

    dispatch(getDigitalCurriculumListAct(generateActionPayload("get_digital_curriculum_list", undefined, payload)));
  };

  const getCurriculumApiCall = () => {
    dispatch(getMasterCurriculumAct(generateActionPayload("get_master_curriculum", undefined, { pageNo: 0, pageSize: 50 })));
  };

  function getClassApiCall() {
    dispatch(
      getMasterClassesAct(
        generateActionPayload("get_master_classes", undefined)
      )
    );
  }

  function getMasterClassStreamGroupApiCall() {
    const payload = {
      classId: signatureForm.values.classId
    }
    dispatch(
      getMasterClassStreamGroupAct(
        generateActionPayload("get_master_class_stream_group", undefined, payload)
      )
    );
  }

  const subjectListApicall = (otherProps?: any) => {
    const payload = { instituteId, ...otherProps, pageNo: 0, pageSize: 100, };
    if (instituteId) {
      dispatch(
        getInstSubjectNameAct(generateActionPayload("get_inst_subject_name", undefined, payload))
      );
    }
  }

  useEffect(() => {
    getCurriculumApiCall();
    getClassApiCall();
    getMasterClassStreamGroupApiCall();
  }, []);

  useEffect(() => {
    if (signatureForm.values.classId) {
      getMasterClassStreamGroupApiCall();
    }

  }, [signatureForm.values.classId]);

  useEffect(() => {
    if (instituteId) {
      subjectListApicall();
    }
  }, [instituteId]);

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    paginationDetailRef.current.pageNo = 0;

    const filterValues = {
      academicYearId: signatureForm.values.academicYearId,
      curriculumId: signatureForm.values.curriculumId,
      classId: signatureForm.values.classId,
      streamGroupId: signatureForm.values.streamGroupId,
      subjectId: signatureForm.values.subjectId,
      searchString: signatureForm.values.searchString,
      [name]: value,
    };

    signatureForm.setFieldValue(name, value);

    if (name === "searchString") {
      getDigitalCurriculumListApi({
        ...filterValues,
        searchString: value,
        pageNo: 0,
        pageSize: 10,
      });
      return;
    }

    if (name === "curriculumId" || name === "classId" || name === "subjectId" || name === "streamGroupId") {
      getDigitalCurriculumStatsApi(filterValues);
      getDigitalCurriculumListApi({
        ...filterValues,
        pageNo: 0,
        pageSize: 10,
      });
      return;
    }
  };

  const history = useHistory();
  const handleCreateDigitalCurriculum = () => {
    history.push("/digital-curriculum/add-curriculum");
  };

  function clickMenuHandler(event: any) {
    const id = event.currentTarget.getAttribute("data-id");
    setActiveId(id);
  }
  const viewTabHandler = (view: "grid" | "list") => {
    setActiveDataId(view);
    setCoursePlannerView({ isGridMode: view === "grid" });
  };

  const refreshCurriculumData = () => {
    const payload = {
      academicYearId: signatureForm.values.academicYearId,
      curriculumId: signatureForm.values.curriculumId,
      classId: signatureForm.values.classId,
      subjectId: signatureForm.values.subjectId,
      branchId,
    };

    getDigitalCurriculumListApi(payload);
    getDigitalCurriculumStatsApi(payload);
  };

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const handlePaginationChange = (paginationInfo: IPaginationState) => {
    pagination.current = paginationInfo;

    const payload = {
      academicYearId: signatureForm.values.academicYearId,
      curriculumId: signatureForm.values.curriculumId,
      classId: signatureForm.values.classId,
      subjectId: signatureForm.values.subjectId,
      branchId,
      pageNo: paginationInfo.pageNo,
      pageSize: paginationInfo.pageSize,
    };

    getDigitalCurriculumListApi(payload);
  };

  const selectedClass = masterClassesResp?.find(
    (item: any) =>
      Number(item.id) === Number(signatureForm.values.classId)
  );

  const showStreamGroup =
    selectedClass?.classSequence === 14 ||
    selectedClass?.classSequence === 15;

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb pageTitle="LMS" />
          <div className="tw-bg-white tw-rounded-xl tw-border tw-shadow-sm tw-py-3 tw-px-4">
            <div className="tw-grid tw-grid-cols-10 tw-items-center tw-gap-4">
              <div className="tw-col-span-10 lg:tw-col-span-6">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                  Digital Curriculum
                </h4>
                <p className="tw-text-sm tw-text-gray-500 tw-mb-0">
                  View and manage your curriculum courses by filters or
                  explore section-wise plan.
                </p>
              </div>
              <div className="tw-col-span-10 lg:tw-col-span-4 tw-flex tw-justify-end">
                <button
                  className="btn btn-success"
                  onClick={handleCreateDigitalCurriculum}
                >
                  <HugeiconsIcon
                    icon={PlusSignIcon}
                    size={18}
                    className="me-2"
                  />
                  Add new
                </button>
              </div>
            </div>
          </div>
          <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mt-5">
            {[
              { label: "Draft", count: getStatsCount("draft"), bg: "#F3E8FF" },
              { label: "In Progress", count: getStatsCount("inProgress"), bg: "#E8F2FF" },
              { label: "Pending", count: getStatsCount("pending"), bg: "#FFF7E6" },
              { label: "In Review", count: getStatsCount("inReview"), bg: "#FFF2E8" },
              { label: "Published", count: getStatsCount("published"), bg: "#E8FFF1" },
              { label: "Rejected", count: getStatsCount("rejected"), bg: "#FFE8E8" },
            ].map((item, i) => (
              <div
                key={i}
                className="tw-col-span-10 sm:tw-col-span-5 lg:tw-col-span-2"
              >
                <div
                  className="tw-p-3 tw-rounded-xl"
                  style={{ backgroundColor: item.bg }}
                >
                  <p className="tw-text-sm tw-text-gray-600 tw-mb-1">{item.label}</p>
                  <p className="tw-text-xl tw-font-semibold tw-mb-2">{item.count}</p>
                </div>
              </div>
            ))}
          </div>
          <div
            className={classnames(
              "tw-bg-white tw-rounded-xl tw-border tw-shadow-sm tw-my-5",
              {
                "!tw-mb-0 !tw-border-b tw-border-gray-200": !coursePlannerView?.isGridMode,
              })}>
            <div className="tw-p-4">
              <div className="tw-grid tw-grid-cols-10 tw-gap-4">
                <div className="tw-col-span-10 md:tw-col-span-3 lg:tw-col-span-2">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      value={signatureForm.values.searchString}
                      onChange={filterHandler}
                      labelText="Search"
                      floatingLabel
                      formgroupClassName="mb-1"
                    ></TextInput>
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
                <div className="tw-col-span-10 md:tw-col-span-3 lg:tw-col-span-2">
                  <SelectInput
                    name="curriculumId"
                    value={signatureForm.values.curriculumId}
                    onChange={filterHandler}
                    menuItems={Array.isArray(masterCurriculumResp)
                      ? masterCurriculumResp
                      : []}
                    valueKey="id"
                    textKey="curriculumName"
                    labelText="Curriculum"
                    floatingLabel
                    formgroupClassName="mb-1"
                  />
                </div>
                <div className="tw-col-span-10 md:tw-col-span-3 lg:tw-col-span-2">
                  <SelectInput
                    name="classId"
                    value={signatureForm.values.classId}
                    onChange={filterHandler}
                    menuItems={Array.isArray(masterClassesResp)
                      ? masterClassesResp
                      : []}
                    valueKey="id"
                    textKey="shortCode"
                    labelText="Class"
                    floatingLabel
                    formgroupClassName="mb-1"
                  />
                </div>
                {showStreamGroup && (
                  <div className="tw-col-span-10 md:tw-col-span-3 lg:tw-col-span-2">
                    <SelectInput
                      name="streamGroupId"
                      value={signatureForm.values.streamGroupId}
                      onChange={filterHandler}
                      menuItems={Array.isArray(masterClassStreamGroupResp)
                        ? masterClassStreamGroupResp
                        : []}
                      valueKey="id"
                      textKey="groupName"
                      labelText="Stream"
                      floatingLabel
                      formgroupClassName="mb-1"
                    />
                  </div>
                )}
                <div className="tw-col-span-10 md:tw-col-span-3 lg:tw-col-span-2">
                  <SelectInput
                    name="subjectId"
                    labelText="Subject"
                    value={signatureForm.values.subjectId}
                    onChange={filterHandler}
                    menuItems={Array.isArray(instSubjectNameResp?.content)
                      ? instSubjectNameResp?.content
                      : []}
                    valueKey="id"
                    textKey="subjectName"
                    defaultSelect="Select"
                    floatingLabel
                    formgroupClassName="mb-1"
                  />
                </div>
              </div>
              <div className="tw-flex tw-justify-between tw-items-center tw-mt-4">
                <div className="tw-overflow-x-auto">
                  <UpdatedHorizontalTab
                    MenuOptions={MenuOptions}
                    activeTabId={activeId}
                    clickMenuHandler={clickMenuHandler}
                    showBadge={false}
                    horizontalClass="horizontal-menu-pill-tabs tw-w-fit"
                  />
                </div>
                <div className="tw-flex tw-items-center tw-select-none">
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
          {coursePlannerView?.isGridMode ? (
            <CurriculumPlannerGridView getDigitalCurriculumListResp={getDigitalCurriculumListResp} activeId={activeId} onPublishSuccess={refreshCurriculumData} onPaginationChange={handlePaginationChange} getDigitalCurriculumStatsApi={getDigitalCurriculumStatsApi} getDigitalCurriculumListApi={getDigitalCurriculumListApi} />
          ) : (
            <CurriculumPlannerTableView getDigitalCurriculumListResp={getDigitalCurriculumListResp} activeId={activeId} getDigitalCurriculumStatsApi={getDigitalCurriculumStatsApi} getDigitalCurriculumListApi={getDigitalCurriculumListApi} />
          )}
        </div>
      </div>
    </>
  );
};

export default CurriculumPlannerList;