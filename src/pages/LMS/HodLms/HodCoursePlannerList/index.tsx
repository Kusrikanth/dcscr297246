import { Delete02Icon, Edit03Icon, Megaphone01Icon, PromotionIcon, ViewIcon } from "@hugeicons-pro/core-stroke-standard";
import { ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import { HugeiconsIcon } from "@hugeicons/react";
import { useHistory } from "react-router-dom";
import { useEffect, useMemo, useRef } from "react";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getBranchClassAct, getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getAssignedClassSubjectsList } from "../../../../store/academic/classSubjects/classsubjectsactions";
import { getDigitalCurriculumBasicDetailsByIdAct, getDigitalCurriculumListAct } from "../../../../store/lms/lmsdigitalcurriculum/lmsdigitalcurriculumaction";
import { useModal } from "../../../../hooks/modalhook";
import PublishCoursePlannerModal from "./PublishCoursePlannerModal";
import { toast } from "react-toastify";
import ViewDigitalCurriculumModal from "./ViewDigitalCurriculumModal";

const initialValues = {
  academicYearId: "",
  searchString: "",
  classId: "",
  curriculumId: "",
  subjectId: "",
};

const HodCoursePlannerList = () => {
  const history = useHistory();
  const paginationDetailRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });
  const dispatch = useAppDispatch();
  const { openModal: openPublishDigitalCurriculumModal, closeModal: closePublishDigitalCurriculumModal, modalState: publishDigitalCurriculumModalState } = useModal();
  const { openModal: openViewDigitalCurriculumModal, closeModal: closeViewDigitalCurriculumModal, modalState: viewDigitalCurriculumModalState } = useModal();

  const hodCoursePlanerForm = useFormik({
    initialValues,
    onSubmit: (values) => { },
  });

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    assignedClassSubjectsListResp,
    getDigitalCurriculumListResp,
    saveBuildPublishResp,
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
      saveBuildPublishResp: lmsdigitalcurriculum.saveBuildPublishResp,
      lmsdigitalcurriculumErrorAct: lmsdigitalcurriculum.lmsdigitalcurriculumErrorAct,
    }),
    shallowEqual
  );

  const digitalCurriculumGridRef = useRef<any>({
    prevSaveBuildPublishResp: saveBuildPublishResp,
    prevLmsdigitalcurriculumErrorActErrorResp: lmsdigitalcurriculumErrorAct,
  });

  useEffect(() => {
    const { prevSaveBuildPublishResp, prevLmsdigitalcurriculumErrorActErrorResp } = digitalCurriculumGridRef.current;
    if (lmsdigitalcurriculumErrorAct && prevLmsdigitalcurriculumErrorActErrorResp !== lmsdigitalcurriculumErrorAct) {
      const { details } = lmsdigitalcurriculumErrorAct || {};
      toast.error(details || "Something went wrong");
    }
    else if (saveBuildPublishResp && prevSaveBuildPublishResp !== saveBuildPublishResp) {
      toast.success("Build published successfully!");
      closePublishDigitalCurriculumModal()
    }
    digitalCurriculumGridRef.current.prevLmsdigitalcurriculumErrorActErrorResp = lmsdigitalcurriculumErrorAct;
    digitalCurriculumGridRef.current.prevSaveBuildPublishResp = saveBuildPublishResp;
  }, [lmsdigitalcurriculumErrorAct, saveBuildPublishResp]);

  const menuOptions = useMemo(
    () => [
      {
        id: "buildCurriculum",
        actionIcon: (
          <HugeiconsIcon
            icon={ViewIcon}
            className="text-muted me-2"
            size={18}
          />
        ),
        actionName: "Build Curriculum",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          history.push("/course-planner/approve-course-planner", { digitalCurriculumId: id });
        },
      },
      {
        id: "delete",
        actionIcon: (
          <HugeiconsIcon
            icon={Delete02Icon}
            className="text-danger me-2"
            size={18}
          />
        ),
        actionName: "Delete",
        onClickHndlr: (event: any) => { },
      },
      {
        id: "edit",
        actionIcon: (
          <HugeiconsIcon
            icon={Edit03Icon}
            className="text-muted me-2"
            size={18}
          />
        ),
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          history.push("/course-planner/approve-course-planner", { digitalCurriculumId: id });
        },
      },
      {
        id: "publish",
        actionIcon: (
          <HugeiconsIcon
            icon={PromotionIcon}
            className="me-2 text-muted"
            size={18}
          />
        ),
        actionName: "Publish",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          dispatch(
            getDigitalCurriculumBasicDetailsByIdAct(
              generateActionPayload(
                "get_digital_curriculum_basic_details_by_id",
                { subjectCurriculumId: id },
                undefined
              )
            )
          );
          openPublishDigitalCurriculumModal(id);
        }
      },
      {
        id: "View",
        actionIcon: <HugeiconsIcon icon={Megaphone01Icon} className="me-2 text-muted" size={18} />,
        actionName: "View Build Curriculum",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          openViewDigitalCurriculumModal(id);
        },
      },
    ],
    [getDigitalCurriculumListResp]
  );
  useEffect(() => {
    const { data } = academicYearListResp || {};
    if (Array.isArray(data) && data.length > 0) {
      const currentYear =
        data.find((year: any) => year.yearStatus?.toUpperCase() === "CURRENT") || data[0];

      if (currentYear?.academicYearId) {
        const { academicYearId } = currentYear;
        hodCoursePlanerForm.setFieldValue("academicYearId", academicYearId);
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
        hodCoursePlanerForm.setFieldValue("curriculumId", firstCurriculum.branchCurriculumId);
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
        hodCoursePlanerForm.setFieldValue("classId", firstClass.id);
        prevValuesRef.current.classId = firstClass.id;

        const payload = {
          academicYearId: prevValuesRef.current.academicYearId,
          curriculumId: prevValuesRef.current.curriculumId,
          branchClassId: firstClass.id,
          classId: firstClass.id,
        };
        if (prevClassId !== firstClass.id) {
          classSubjectListApicall(payload);
        }
        getDigitalCurriculumListApi({ classId: firstClass.id });
      }
    }
  }, [branchClassResp]);
  const prevValuesRef = useRef({ academicYearId: "", curriculumId: "", classId: "" });
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
    const { academicYearId, classId, curriculumId } = hodCoursePlanerForm.values;
    const payload = { academicYearId: academicYearId, curriculumId: curriculumId, branchClassId: classId, ...otherProps, pageNo: 0, pageSize: 100, };
    if (payload.academicYearId && payload.branchClassId) {
      dispatch(
        getAssignedClassSubjectsList(
          generateActionPayload("get_assigned_class_subject_list", undefined, payload)
        )
      );
    }
  }

  const getDigitalCurriculumListApi = (otherProps?: any) => {

    const payload = {
      branchId,
      academicYearId: hodCoursePlanerForm.values.academicYearId,
      curriculumId: hodCoursePlanerForm.values.curriculumId,
      classId: hodCoursePlanerForm.values.classId,
      subjectId: hodCoursePlanerForm.values.subjectId,
      curriculumStatus: "PUBLISHED",
      ...otherProps,
    };

    if (payload.academicYearId) {
      dispatch(getDigitalCurriculumListAct(generateActionPayload("get_digital_curriculum_list", undefined, payload)));

    }
  };

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    paginationDetailRef.current.pageNo = 0;

    hodCoursePlanerForm.setFieldValue(name, value);

    if (name === "academicYearId") {
      prevValuesRef.current.academicYearId = value;
      getCurriculumApiCall({ academicYearId: value });
      hodCoursePlanerForm.setFieldValue("curriculumId", "");
      hodCoursePlanerForm.setFieldValue("classId", "");
      prevValuesRef.current.curriculumId = "";
      prevValuesRef.current.classId = "";
      getDigitalCurriculumListApi({ academicYearId: value, curriculumId: "", classId: "" });
    } else if (name === "curriculumId") {
      prevValuesRef.current.curriculumId = value;
      getClassApiCall({
        curriculumId: value,
        academicYearId: prevValuesRef.current.academicYearId,
      });
      hodCoursePlanerForm.setFieldValue("classId", "");
      prevValuesRef.current.classId = "";
      // getDigitalCurriculumListApi({ curriculumId: value, classId: "" });
    } else if (name === "classId") {
      const payload = {
        academicYearId: prevValuesRef.current.academicYearId,
        curriculumId: prevValuesRef.current.curriculumId,
        branchClassId: value,
        classId: value,
      };
      classSubjectListApicall(payload);
      getDigitalCurriculumListApi({ classId: value });
    }
  };

  const tableColumns = useMemo(() => generateColumns(menuOptions), []);
  const { data: curriculumTypes } = brchCurriculumResp || {};
  const { content: classTypes } = branchClassResp || {};
  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb pageTitle="LMS"></BreadCrumb>
          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col-12 col-lg-6">
                  <h4 className="tw-mb-2 card-title">Courses Planner</h4>
                  <p className="tw-text-xs tw-mb-0 tw-text-gray-500">
                    Monitor course plans & validate curriculum alignment.
                  </p>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12 col-md-6 col-lg-4 col-xl-3">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      value={""}
                      onChange={() => { }}
                      labelText="Search"
                      floatingLabel
                      formgroupClassName="mb-0"
                    ></TextInput>
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-4 col-xl-2">
                  <SelectInput
                    name="curriculumId"
                    value={hodCoursePlanerForm.values.curriculumId}
                    onChange={filterHandler}
                    menuItems={curriculumTypes}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    labelText="Curriculum"
                    formgroupClassName="mb-2"
                    floatingLabel
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-4 col-xl-2">
                  <SelectInput
                    name="classId"
                    value={hodCoursePlanerForm.values.classId}
                    onChange={filterHandler}
                    menuItems={classTypes}
                    valueKey="id"
                    textKey="shortName"
                    labelText="Class"
                    formgroupClassName="mb-2"
                    floatingLabel
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-4 col-xl-2 ">
                  <SelectInput
                    name="subjectId"
                    labelText="Subject"
                    value={hodCoursePlanerForm.values.subjectId}
                    onChange={filterHandler}
                    menuItems={assignedClassSubjectsListResp?.data}
                    valueKey="subjectId"
                    textKey="subjectName"
                    defaultSelect="Select"
                    formgroupClassName='mb-2'
                    floatingLabel
                  />
                </div>
              </div>
              <div className="tw-flex tw-justify-between">
              </div>
            </div>
            <TableContainer
              columns={tableColumns || []}
              data={getDigitalCurriculumListResp?.content || []}
              tableClass="mb-0"
              divClass="table-responsive mb-0 border"
              theadClass="table-light text-muted align-middle"
              showCheckbox={false}
              showPagination={false}
            />
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="publish-curriculum-structure-modal"
        isOpen={publishDigitalCurriculumModalState.showModal}
        toggle={closePublishDigitalCurriculumModal}
        modalTitle="Publish Curriculum Details"
        modalSize="lg"
      >
        <PublishCoursePlannerModal
          toggle={closePublishDigitalCurriculumModal}
          id={publishDigitalCurriculumModalState.modalData}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="view-curriculum-structure-modal"
        isOpen={viewDigitalCurriculumModalState.showModal}
        toggle={closeViewDigitalCurriculumModal}
        modalTitle="View Build Curriculum Details"
        headerClassName="!tw-bg-slate-900 !tw-text-white"
        modalSize="lg"
      >
        <ViewDigitalCurriculumModal
          toggle={closeViewDigitalCurriculumModal}
          id={viewDigitalCurriculumModalState.modalData}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default HodCoursePlannerList;

