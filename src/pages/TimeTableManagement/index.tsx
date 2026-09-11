import { useCallback, useEffect, useMemo, useRef } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { generateColumns, tableData } from "./helper";
import TableContainer from "../../Components/Common/TableContainer";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, PencilEdit01Icon, Copy01Icon, Delete02Icon } from "@hugeicons-pro/core-stroke-standard";
import { useHistory, useParams } from "react-router-dom";
import { SelectInput, TextInput } from "../../Components/Common";
import { CustomDatePicker } from "../DashBoardBranchSummary/CustomDatePicker";
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { resetSectionListAct } from "../../store/academic/classroomManagment/classroommanagmentslice";
import { resetBrchClassAct } from "../../store/branchsettings/branchacademics/branchacademicsslice";
import { getBranchClassAct, getBranchCurriculumAct } from "../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../utility/reduxutility";
import { getSectionList } from "../../store/academic/classroomManagment/classroommanagmentactions";
import { getTimeTableAct, viewTimeTableAct } from "../../store/academic/timetableManagment/timetableManagmentactions";
import { debounce } from "../../utility/commonutility";
import { IPaginationState } from "../../Components/Common/Pagination";
import Button from "../../Components/Common/Button";

const initialValues = {
  searchString: "",
  curriculumId: "",
  classId: "",
  sectionId: "",
  startDate: "",
  endDate: "",
  academicYearId: "",
}

const TimeTable = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
   const pagination = useRef({
      pageNo: 0,
      pageSize: 10
    })

  const {
    getTimeTableResp,
    currentBranchIdResp: branchId,
    getTimeTableErrResp,
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    sectionListResp,
  } = useAppSelector(
    ({ timeTableManagement, appData, instAcademics, branchAcademics, classroomManagmentInfo }) => ({
      getTimeTableResp: timeTableManagement.getTimeTableResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getTimeTableErrResp : timeTableManagement.getTimeTableErrResp,
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      sectionListResp: classroomManagmentInfo.sectionListResp,

    }),
    shallowEqual
  );


  const newRequestRespRef = useRef({
    prevGetTimeTableErrResp: getTimeTableErrResp,
  });

  useEffect(() => {
    const { prevGetTimeTableErrResp } = newRequestRespRef.current;
    if (getTimeTableErrResp && prevGetTimeTableErrResp !== getTimeTableErrResp) {
      const { details } = getTimeTableErrResp;
      toast.error(details || "Something went wrong. Please try again later.");
    }

    newRequestRespRef.current.prevGetTimeTableErrResp = getTimeTableErrResp;
  }, [getTimeTableErrResp]);
  function addNewTimeTableHndlr() {
    history.push("/time-table/create-time-table");
  }

  function viewTimeTableHndlr(event: any) {
    let id = event.currentTarget.getAttribute("data-id");
    // dispatch(viewTimeTableAct(generateActionPayload("view_timetable", {id: id}, undefined)));
    history.push(`/preview-time-table/${id}`);
  }

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit01Icon} size={18} className="me-2" />,
        actionName: "Edit",
      },
      {
        id: "copy",
        actionIcon: <HugeiconsIcon icon={Copy01Icon} size={18} className="me-2" />,
        actionName: "Copy",
      },
      {
        id: "view",
        actionIcon: <HugeiconsIcon icon={ViewIcon} size={18} className="me-2" />,
        actionName: "View",
        onClickHndlr: viewTimeTableHndlr,
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02Icon} size={18} className="me-2 text-danger" />,
        actionName: "delete",
      },
    ],
    []
  );

  const timeTableForm = useFormik({
      initialValues,
      onSubmit: (values) => {
      
      },
    });

  useEffect(() => {
      const yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
      timeTableForm.setFieldValue("academicYearId", yearId)
      getCurriculumApiCall({ academicYearId: yearId });
      getTimeTableListApiCall({ academicYearId: yearId });
    }, [academicYearListResp]);

  const getTimeTableListApiCall = (otherProps?: any) => {
      const payload = {
        branchId,
        academicYearId: timeTableForm.values.academicYearId,
        curriculumId: timeTableForm.values.curriculumId,
        classId: timeTableForm.values.classId,
        sectionId: timeTableForm.values.sectionId,
        searchString: timeTableForm.values.searchString,
        startDay: timeTableForm.values.startDate,
        endDay: timeTableForm.values.endDate,
        ...otherProps,
      }
      dispatch(getTimeTableAct(generateActionPayload("get_timetable", undefined, payload)));
    }
  
  const getCurriculumApiCall = (otherProps?: any) => {
      const payload1 = { academicYearId: timeTableForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
      dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }
    const getClassApiCall = (otherProps?: any) => {
      const payload = { branchId: branchId, academicYearId: timeTableForm.values?.academicYearId, curriculumId: timeTableForm.values.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
      dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }
  
    const getSectionListResp = (otherProps?: any) => {
      let payload = { branchClassId: timeTableForm.values.classId || null, masterAcademicYearId: timeTableForm.values.academicYearId, curriculumId: timeTableForm.values.curriculumId, pageNo: 0, pageSize: 20, sortBy: "sectionName", orderBy: "asc", ...otherProps }
      if (payload.branchClassId && payload.masterAcademicYearId) {
        dispatch(
          getSectionList(
            generateActionPayload("get_section_list", undefined, payload)
          )
        );
      }
    }

    function search(value: string) {
        getTimeTableListApiCall({ ...timeTableForm.values, searchString: value });
      }
    
      const debounceFun = useCallback(debounce(search, 200), [getTimeTableResp]);

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      pagination.current.pageNo = 0;
      if (name === 'curriculumId') {
        timeTableForm.setValues((prev: any) => ({ ...prev, [name]: value, classId: "", sectionId: "" }));
        dispatch(resetSectionListAct(undefined))
  
        if (!value) {
          dispatch(resetBrchClassAct(undefined))
        }
        else {
          getClassApiCall({ curriculumId: value, academicYearId: timeTableForm.values.academicYearId });
          getTimeTableListApiCall({ curriculumId: value })
        }
      }
      else if (name === 'classId') {
        timeTableForm.setValues((prev: any) => ({ ...prev, [name]: value, sectionId: "" }));
        if (!value) {
          dispatch(resetSectionListAct(undefined))
        } else {
          getSectionListResp({ branchClassId: value })
          getTimeTableListApiCall({ classId: value });
        }
      }
      else if (name === "searchString") {
        timeTableForm.setValues((prev: any) => ({ ...prev, [name]: value }))
        debounceFun(value);
      }
      else {
        timeTableForm.setValues((prev: any) => ({ ...prev, [name]: value }))
        getTimeTableListApiCall({ [name]: value });
      }
    }

    const handleDateChange = ({ startDate, endDate }:any)=>{
      if(startDate && endDate){
        timeTableForm.setValues((prev: any) => ({ ...prev, startDate, endDate }));
        getTimeTableListApiCall({ startDay: startDate, endDay: endDate });
      }
    } 

     function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        getTimeTableListApiCall(paginationInfo);
      }

  const tableColumns = useMemo(() => generateColumns(menuOptions), [getTimeTableResp]);

  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { content: classTypes } = branchClassResp || {};
  const {  totalElements, totalPages, pageNumber } = getTimeTableResp || {}

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb pageTitle="Time Table Management" title="Time Table Management"></BreadCrumb>

          <div className="tw-bg-white tw-rounded-lg tw-shadow">
            <div className="tw-px-4 tw-py-3 tw-border-b">
              <div className="tw-flex tw-items-center tw-justify-between">
                <div>
                  <h4 className="tw-text-base tw-font-semibold tw-m-0">Time Table</h4>
                </div>

                <div>
                  <div className="tw-flex">
                    <Button
                    variant="primary"
                      onClick={addNewTimeTableHndlr}
                    >
                      <i className="ri-add-line"></i>
                      Create Time Table
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="tw-p-0">
              <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-4 tw-pt-5 tw-pb-2">
                <div className="tw-col-span-12 lg:tw-col-span-3">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      placeHolder="Search"
                      labelText="Search"
                      floatingLabel
                      value={timeTableForm.values.searchString}
                      onChange={filterHandler}
                      formgroupClassName="tw-mb-0"
                    />
                    <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
                  </div>
                </div>

                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                  <SelectInput
                    name="curriculumId"
                    value={timeTableForm.values.curriculumId}
                    onChange={filterHandler}
                    menuItems={curriculumTypes}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    labelText="Curriculum"
                    // labelClass="required"
                    // inputClassName="bg-light"
                    // formgroupClassName="mb-0 mt-lg-3"
                    floatingLabel
                    // invalid={(timeTableForm.touched.curriculumId && timeTableForm.errors.curriculumId) ? true : false}
                    // error={(timeTableForm.touched.curriculumId && timeTableForm.errors.curriculumId) ? timeTableForm.errors.curriculumId : ""}
                  />
                </div>

                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                  <SelectInput
                    name="classId"
                    value={timeTableForm.values.classId}
                    onChange={filterHandler}
                    menuItems={classTypes}
                    valueKey="id"
                    textKey="shortName"
                    labelText="Class"
                    // labelClass="required"
                    // inputClassName="bg-light"
                    // formgroupClassName="mb-0 mt-lg-3"
                    floatingLabel
                    // invalid={(timeTableForm.touched.classId && timeTableForm.errors.classId) ? true : false}
                    // error={(timeTableForm.touched.classId && timeTableForm.errors.classId) ? timeTableForm.errors.classId : ""}
                  />
                </div>

                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                  <SelectInput
                    name="sectionId"
                    value={timeTableForm.values.sectionId}
                    onChange={filterHandler}
                    menuItems={sectionListResp?.data}
                    valueKey="sectionId"
                    textKey="sectionName"
                    labelText="Section"
                    // labelClass="required"
                    // inputClassName="bg-light"
                    // formgroupClassName="mb-0 mt-lg-3"
                    floatingLabel
                    // invalid={(timeTableForm.touched.sectionId && timeTableForm.errors.sectionId) ? true : false}
                    // error={(timeTableForm.touched.sectionId && timeTableForm.errors.sectionId) ? timeTableForm.errors.sectionId : ""}
                  />
                </div>

                <div className="tw-col-span-12 lg:tw-col-span-3">
                  <CustomDatePicker
                    name="dateRange"
                    startDate={timeTableForm.values.startDate}
                    endDate={timeTableForm.values.endDate}
                    onChange={handleDateChange}
                    placeholder="Select a Date Range"
                    monthsShown={2}
                    formgroupClassName="tw-mb-3"
                    labelText="Date Range"
                    floatingLabel
                  ></CustomDatePicker>
                </div>
              </div>

              <TableContainer
                columns={tableColumns || []}
                data={Array.isArray(getTimeTableResp?.data) ? getTimeTableResp?.data : []}
                tableClass="tw-mb-0"
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                showPagination={true}
                totalPages={totalPages || 0}
                totalRecords={totalElements || 0}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber || 0}
              ></TableContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TimeTable;
