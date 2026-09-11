import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TableContainer from "../../../../../../../Components/Common/TableContainer";
import { generateColumns, ignoredKeys, searchInputOptions, attemptStatus, resultStatus } from "./helper";
import { useHistory } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AnalysisTextLinkIcon,
  PencilEdit02Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../../../../../assets/imagesdps/common_icon/export_icon.svg";
import {
  ModalContainerUpdated,
  OffCanvasContainer,
  SearchInput,
  SelectInput,
  TextInput,
} from "../../../../../../../Components/Common";
import { default as FilterSvg } from "../../../../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import AdvanceFilterModal from "./AdvanceFilterModal";
import * as Yup from "yup";
import { validateOnChange } from "../../../../../../../utility/validationutility";
import { useAppDispatch, useAppSelector } from "../../../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { useFormik } from "formik";
import { editFeedbackAct, exportStudentResultListAct, getResultListAct } from "../../../../../../../store/lms/lmsAssessment/lmsAssessmentaction";
import { generateActionPayload } from "../../../../../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct } from "../../../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getSectionList } from "../../../../../../../store/academic/classroomManagment/classroommanagmentactions";
import { useFilterState } from "../../../../../../../hooks/filterhook";
import { IPaginationState } from "../../../../../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import { useModal } from "../../../../../../../hooks/modalhook";
import ExportModal from "../../../../../../Directory/StudentManagement/ExportModal";
import { downloadExcelFile } from "../../../../../../../utility/commonutility";


const initialValues = {
  academicYearId: "",
  curriculumId: "",
  classId: "",
  searchString: "",
  nameFilterType: "",
  attemptStatus: "",
  sectionId: "",
  resultStatus: "",
}

const StudentsGradeList = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const { showClearFilterState, count, advanceFilterChange } = useFilterState();
  const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);
  const [searchStudentState, setSearchStudentState] = useState("global");
  const { closeModal: closeExportStudentResultListHnldr, openModal: openExportStudentResultListModalHnldr, modalState: exportStudentResultListModalState } = useModal();

  const dispatch = useAppDispatch();
  const toggleAdvanceFilter = () => {
    setOpen((prev) => !prev);
  };
  const paginationDetailRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });
  const getResultListApiCall = (otherProps?: any) => {
    const payload = {
      ...resultListForm.values,
      branchId,
      nameFilterType: searchStudentState,
      assessmentId: getAssessmentByIdResp.id,
      // academicYearId: resultListForm.values.academicYearId,
      // curriculumId: resultListForm.values.curriculumId,
      // classId: resultListForm.values.classId,
      // // subjectId: resultListForm.values.subjectId,
      // searchString: resultListForm.values.searchString,
      // nameFilterType: resultListForm.values.nameFilterType,
      ...paginationDetailRef.current,
      ...otherProps,
    }
    if (payload.branchId) {
      dispatch(getResultListAct(generateActionPayload("get_result_list", undefined, payload)));
    }
  };

  const {
    userDetails,
    userMeResp,
    academicYearListResp,
    getAllAssessmentsResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    brchCurriculumResp,
    branchClassResp,
    sectionListResp,
    showApiLoader,
    savePublishAssessmentResp,
    lmsAssessmentErrorAct,
    saveRescheduleAssessmentResp,
    getResultListResp,
    editFeedbackResp,
    getAssessmentByIdResp,
    exportStudentResultListResp
  }: any = useAppSelector(
    ({ Profile, login, lmsAssessment, appData, branchAcademics, instAcademics, globalData, classroomManagmentInfo }) => ({
      userDetails: Profile.userDetails,
      userMeResp: login.userMeResp,
      getAllAssessmentsResp: lmsAssessment.getAllAssessmentsResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      sectionListResp: classroomManagmentInfo.sectionListResp,
      academicYearListResp: instAcademics.academicYearListResp,
      showApiLoader: globalData.showApiLoader,
      savePublishAssessmentResp: lmsAssessment.savePublishAssessmentResp,
      lmsAssessmentErrorAct: lmsAssessment.lmsAssessmentErrorAct,
      saveRescheduleAssessmentResp: lmsAssessment.saveRescheduleAssessmentResp,
      getResultListResp: lmsAssessment.getResultListResp,
      editFeedbackResp: lmsAssessment.editFeedbackResp,
      getAssessmentByIdResp: lmsAssessment.getAssessmentByIdResp,
      exportStudentResultListResp: lmsAssessment.exportStudentResultListResp

    }),
    shallowEqual
  );

  const resultListForm = useFormik({
    initialValues,
    onSubmit: (values) => { },
  });
  const instituteRespRef = useRef<any>({
    prevLmsAssessmentErrorAct: lmsAssessmentErrorAct,
    prevExportStudentResultListResp: exportStudentResultListResp,
    prevEditFeedbackResp: editFeedbackResp,

  });

  useEffect(() => {
    const { prevLmsAssessmentErrorAct, prevExportStudentResultListResp, prevEditFeedbackResp } = instituteRespRef.current;
    if (lmsAssessmentErrorAct && prevLmsAssessmentErrorAct !== lmsAssessmentErrorAct) {
      toast.error(lmsAssessmentErrorAct.details || "Something went wrong.");
    }
    else if (exportStudentResultListResp && prevExportStudentResultListResp !== exportStudentResultListResp) {
      toast.success("Student Result List Download Successfully.");
      closeExportStudentResultListHnldr();
      downloadExcelFile(exportStudentResultListResp, 'student_result_list.xlsx')
    }
    else if (editFeedbackResp && prevEditFeedbackResp !== editFeedbackResp) {
      toast.success("Feedback updated successfully.");
      setData(prevData =>
        prevData.map(item => ({
          ...item,
          isSelected: false
        }))
      );
      setAllStudentSelectedState(false);
      getResultListApiCall();
    }

    instituteRespRef.current.prevEditFeedbackResp = prevEditFeedbackResp;
    instituteRespRef.current.prevLmsAssessmentErrorAct = lmsAssessmentErrorAct;
    instituteRespRef.current.prevExportStudentResultListResp = exportStudentResultListResp;
  }, [lmsAssessmentErrorAct, exportStudentResultListResp, editFeedbackResp]);
  
  const submitExportHndlr = () => {
    dispatch(exportStudentResultListAct(
      generateActionPayload(
        "export_student_result_list",
        undefined,
        {
          ...resultListForm.values,
      branchId,
      nameFilterType: searchStudentState,
      assessmentId: getAssessmentByIdResp.id,
        },
        {
          responseType: 'blob'
        }
      )
    ));
  };
  
  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: (
          <HugeiconsIcon
            icon={PencilEdit02Icon}
            className="me-2 d-inline-block"
            size={18}
            color="#878a99"
          />
        ),
        actionName: "Edit",
      },
      {
        id: "view",
        actionIcon: (
          <HugeiconsIcon
            icon={AnalysisTextLinkIcon}
            className="me-2 d-inline-block"
            size={18}
            color="#878a99"
          />
        ),
        actionName: "View Result",
        onClickHndlr: (event: any) => {
          //   history.push(`/student-assessment-results`);
        },
      },
    ],
    [data]
  );
  useEffect(() => {
    if (getResultListResp && Array.isArray(getResultListResp?.content)) {
      const data = getResultListResp.content.map((item: any) => {

        return {
          ...item,
          isSelected: false,

        };
      })
      setData(data);
    }
  }, [getResultListResp]);

  useEffect(() => {
    if (getAssessmentByIdResp?.academicYearId) {
      const academicYearId = getAssessmentByIdResp.academicYearId;
      resultListForm.setFieldValue("academicYearId", academicYearId || "");
      getResultListApiCall({ academicYearId });
    }
  }, [getAssessmentByIdResp]);

  const getSectionListResp = (otherProps?: any) => {

    let payload = {
      branchClassId: getAssessmentByIdResp.classId || null,
      masterAcademicYearId: getAssessmentByIdResp.academicYearId,
      curriculumId: getAssessmentByIdResp.branchCurriculumId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "sectionName",
      orderBy: "asc",
      ...otherProps
    }

    if (payload.branchClassId && payload.masterAcademicYearId) {
      dispatch(
        getSectionList(
          generateActionPayload("get_section_list", undefined, payload)
        )
      );
    }
  }
  useEffect(() => {
  if (getAssessmentByIdResp?.classId && getAssessmentByIdResp?.academicYearId) {
    getSectionListResp();
  }
}, [getAssessmentByIdResp]);

  const onChangeInputHndlr = (event: any) => {
    const { name, value } = event.target;
    const match = name.match(/\[(\d+)\]\.(\w+)/);
    if (!match) return;

    const rowIndex = parseInt(match[1], 10);
    const field = match[2];

    setData((prev) => {
      const updated = [...prev];
      updated[rowIndex] = {
        ...updated[rowIndex],
        [field]: value,
      };
      return updated;
    });
  };

const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = event.target;
  paginationDetailRef.current.pageNo = 0;

  const apiPayload: any = { [name]: value };

  resultListForm.setFieldValue(name, value);

  getResultListApiCall(apiPayload);
  advanceFilterChange({ keys: { ...initialValues }, ignoredKeys });
};

  const clearFilterHndlr = () => {
    if (academicYearListResp) {
      paginationDetailRef.current = { ...paginationDetailRef.current, pageNo: 0 };
      let { academicYearId } = academicYearListResp?.data?.find((year: any) => year.isCurrent) || academicYearListResp?.data?.[0] || {};
      resultListForm.setValues({ ...initialValues, academicYearId: academicYearId || "" });
      setSearchStudentState('global')
      getResultListApiCall({ ...initialValues, academicYearId, nameFilterType: 'global' });
      advanceFilterChange({ keys: { ...initialValues }, ignoredKeys });
    }
  };

  const selectedHndlr = () => {
    const payload = data.filter(item => item.isSelected && item.feedBack) // filter condition
      .map(item => ({
        id: item.id,
        feedback: item.feedBack as string
      }));
    if (payload.length > 0) {
      dispatch(editFeedbackAct(generateActionPayload("edit_feedback", undefined, payload)));
    } else {
      toast.warning("Please select students with feedback to update.");
    }

  }

  const advanceFilterCallbckHndlr = (appliedFilters?: any) => {
    // paginationDetailRef.current = { ...paginationDetailRef.current, pageNo: 0 };
    paginationDetailRef.current.pageNo = 0;
    resultListForm.setValues((prevState: any) => ({ ...prevState, ...appliedFilters }));
    advanceFilterChange({ keys: { ...initialValues, ...appliedFilters, academicYearId: "" }, ignoredKeys });
    getResultListApiCall({ ...appliedFilters, pageNo: 0 });
    // toggleAdvanceFilter();
  }

  function onSearchHandler(name: string, value: any) {
    paginationDetailRef.current.pageNo = 0;
    setSearchStudentState((prev) => {
      const updatedFilterType = prev;
      resultListForm.setValues((prevState) => {
        const updatedState = {
          ...prevState,
          searchString: value,
          nameFilterType: updatedFilterType
        };
        getResultListApiCall(updatedState);
        return updatedState;
      });
      return updatedFilterType;
    });
  }

  function onChangeHandler(name: string, id: any, item: any) {
    setSearchStudentState(id);
    paginationDetailRef.current.pageNo = 0;

    resultListForm.setValues((prevState) => {
      const updatedState = {
        ...prevState,
        nameFilterType: id,
        searchString: ""
      };
      getResultListApiCall(updatedState);
      return updatedState;
    });
  }
  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationDetailRef.current = paginationInfo;
    getResultListApiCall();
  }
  const allStudentCheckHndlr = useCallback((event: any) => {
    const { checked } = event.target;
    setAllStudentSelectedState(checked);
    let updateStudentState = [...data];
    updateStudentState.forEach((item: any) => {
      item.isSelected = checked;
      if (!checked) {
        item.errors = {};
      }
    });
    setData(updateStudentState);
  }, [data]);

  const singleStudentCheckHndlr = useCallback((event: any) => {
    const { checked } = event.currentTarget
    const studentIdNumber = event.currentTarget.getAttribute("data-id")
    const studentRowIndex = data.findIndex((item: any) => +item.id === Number(studentIdNumber));
    if (studentRowIndex > -1) {
      const studentDetails: any = data[studentRowIndex];
      let updateStudentState: any = [...data];
      updateStudentState.splice(studentRowIndex, 1, {
        ...studentDetails, isSelected: checked, ...(checked ? {} : { errors: {} }),
      });

      setData(updateStudentState);
      const isAllSelected = updateStudentState.every((item: any) => item.isSelected);
      setAllStudentSelectedState(isAllSelected);
    }
  }, [data]);

  const hasSelectedData = useMemo(() => {
    return data.some(item => item.isSelected && item.attemptStatus === "EVALUATED");
  }, [data]);

  const tableColumns = useMemo(() => generateColumns(menuOptions, onChangeInputHndlr, allStudentSelectedState, allStudentCheckHndlr, singleStudentCheckHndlr,), [menuOptions, onChangeInputHndlr, data, allStudentSelectedState, allStudentCheckHndlr, singleStudentCheckHndlr]);

  const { data: curriculumTypes } = brchCurriculumResp || {};
  const { content: classTypes } = branchClassResp || {};
  const { totalElements, totalPages, pageable, content: assessmentData } = getResultListResp || {}


  return (
    <>
      <div className="card">
        <div className="card-body p-0">
          <div className="row g-3 p-3 pb-0">
            <div className="col-12 col-lg-4 col-xl-3">
              <div className="search-box">
                <SearchInput
                  hideDefaultSelect
                  name="searchString"
                  value={searchStudentState}
                  menuItems={searchInputOptions}
                  idKey="id"
                  labelName="Search With"
                  searchHandler={onSearchHandler}
                  onChange={onChangeHandler}
                  renderSelectedValue={(item: any) => item?.name}
                  renderOptions={(item: any) => item?.name}
                />
              </div>
            </div>
            <div className="col-12 col-lg-3 col-xl-2">
              <SelectInput
                name="sectionId"
                value={resultListForm.values.sectionId}
                onChange={filterHandler}
                menuItems={sectionListResp?.data}
                valueKey="sectionId"
                textKey="sectionName"
                labelText="Section"
                floatingLabel
              ></SelectInput>
            </div>
            <div className="col-12 col-lg-3 col-xl-2">
              <SelectInput
                name="attemptStatus"
                value={resultListForm.values.attemptStatus}
                onChange={filterHandler}
                menuItems={attemptStatus || []}
                valueKey="value"
                textKey="label"
                labelText="Assessment Status"
                floatingLabel
              ></SelectInput>
            </div>
            <div className="col-12 col-lg-3 col-xl-2">
              <SelectInput
                name="resultStatus"
                value={resultListForm.values.resultStatus}
                onChange={filterHandler}
                menuItems={resultStatus || []}
                valueKey="value"
                textKey="label"
                labelText="Result Status"
                floatingLabel
              ></SelectInput>
            </div>
            {showClearFilterState && (
              <div className="col-auto ">
                <button
                  type="button"
                  onClick={clearFilterHndlr}
                  className="btn btn-ghost-danger"
                >
                  Clear filter
                </button>
              </div>
            )}
            {hasSelectedData && <div className="col-auto ">
              <button
                type="button"
                onClick={selectedHndlr}
                className="btn btn-success"
              >
                Update Feedback
              </button>
            </div>}
            <div className="col-auto ms-auto">
              <div className="d-flex align-items-center">
                <button
                  id="export-btn"
                  className="btn btn-icon btn-rounded btn-soft-info p-2"
                 onClick={() => openExportStudentResultListModalHnldr()}
                >
                  <img src={ExportIcon} className="img-fluid h-100" />
                  <UncontrolledTooltip placement="bottom" target="export-btn">
                    Export
                  </UncontrolledTooltip>
                </button>
              </div>
            </div>

          </div>
          <TableContainer
            columns={tableColumns || []}
            data={data || []}
            divClass="table-responsive mb-3 fs-12"
            tableClass="table-nowrap"
            theadClass="table-light text-muted align-middle"
            showPagination={true}
            showCheckbox={false}
            totalPages={totalPages || 0}
            totalRecords={totalElements || 0}
            callbackPaginationHndlr={paginationHndlr}
            currentPageNumber={pageable?.pageNumber || 0}
            onChangeInputHndlr={onChangeInputHndlr}
          />
        </div>
      </div>
      <OffCanvasContainer
        isOpen={open}
        headerTitle="Advance Filters"
        closeHndlr={toggleAdvanceFilter}
        id="advance-filter-login-user"
      >
        <AdvanceFilterModal
          appliedFilter={resultListForm.values}
          applyFilterCallback={advanceFilterCallbckHndlr}
          toggleAdvanceFilter={toggleAdvanceFilter}
          isOpen={open}
        />
      </OffCanvasContainer>
      <ModalContainerUpdated
        id="export-login-history-modal"
        isOpen={exportStudentResultListModalState.showModal}
        toggle={closeExportStudentResultListHnldr}
        modalTitle="Export Student Resul List Details"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportStudentResultListModalState.showModal}
          toggle={closeExportStudentResultListHnldr}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={submitExportHndlr}
          feature="assessment"
          subFeature="assessment_result_list"
          remarksText="Enter remarks to export Student Resul List details?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default StudentsGradeList;
