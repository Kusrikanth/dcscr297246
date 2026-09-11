
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, OffCanvasContainer, SelectInput, TextInput } from "../../Components/Common";
import TableContainer from "../../Components/Common/TableContainer";
import { generateColumns, hasStateChanged, statusData, } from "./helper";
import { default as FilterSvg } from "../../assets/imagesdps/academics/FilterSvg.svg?react";
import { default as EditSvg } from "../../assets/imagesdps/academics/EditSvg.svg?react";
import { default as DeleteIconSvg } from "../../assets/imagesdps/academics/DeleteIconSvg.svg?react";
import { useAppSelector } from "../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { getInstAcademicYearAct } from "../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../store/branchsettings/branchacademics/branchacademicsactions";
import { exportAllNewRequestAct, getAllStudentsTransRecListAct } from "../../store/transportation/TransportationRecords/transportationrecordsaction";
import { IPaginationState } from "../../Components/Common/Pagination";
import { toast } from "react-toastify";
import AdvanceFilterModal from "./AdvancedFilterModal";
import { getRouteListAct, getSlabsListAct } from "../../store/transportation/transportationaction";
import { useHistory } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { resetSectionListAct } from "../../store/academic/classroomManagment/classroommanagmentslice";
import Button from "../../Components/Common/Button";

const initialValues: any = {
  searchString: "",
  academicYearId: "",
  // isStopService : "",
  curriculumId: "",
  classId: "",
  sectionId: "",
  routeId: "",
  slabId: "",
};

const AllTransportationRecords = () => {
  const dispatch = useDispatch()
  const [allStudentsFilterState, setAllStudentsFilterState] =
    useState<any>(initialValues);
  const history = useHistory();

  const pagination: any = useRef<any>({
    pageNo: 0,
    pageSize: 10
  })
  const [open, setOpen] = useState<boolean>(false);
  const [count, setCount] = useState<any>();
  const [showClearFilterState, setShowClearFilterState] = useState(false);
  const [appliedFilterState, setAppliedFilterState] = useState({
    canClearFilter: false
  })
  const [exportExcel, setExportExcel] = useState<any>({
    showModal: false,
    requestId: undefined
  })

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getAllStudentsTransRecListResp,
    transportationRecordsErrorResp,
    exportAllNewRequestResp,
  } = useAppSelector(
    ({ globalData, instAcademics, appData, transportrecords }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getAllStudentsTransRecListResp: transportrecords.getAllStudentsTransRecListResp,
      transportationRecordsErrorResp: transportrecords.transportationRecordsErrorResp,
      exportAllNewRequestResp: transportrecords.exportAllNewRequestResp,
    }),
    shallowEqual
  );

  const newRequestRespRef = useRef({
    prevExportAllNewRequestResp: exportAllNewRequestResp,
    prevTransportationRecordsErrorResp: transportationRecordsErrorResp,
  });

  useEffect(() => {
    const { prevExportAllNewRequestResp, prevTransportationRecordsErrorResp } = newRequestRespRef.current;

    if (exportAllNewRequestResp && prevExportAllNewRequestResp !== exportAllNewRequestResp) {
      toast.success("All Records List Exprorted successfully.");
      toggleExportExcelModal()
      downloadExcelFile(exportAllNewRequestResp);
    }
    else if (transportationRecordsErrorResp && prevTransportationRecordsErrorResp !== transportationRecordsErrorResp) {
      const { details } = transportationRecordsErrorResp;
      toast.error(details || "Something went wrong. Please try again later.");
    }

    newRequestRespRef.current.prevExportAllNewRequestResp = exportAllNewRequestResp;
    newRequestRespRef.current.prevTransportationRecordsErrorResp = transportationRecordsErrorResp;
  }, [exportAllNewRequestResp, transportationRecordsErrorResp]);

  function downloadExcelFile(blobStream: any) {

    const url = window.URL.createObjectURL(new Blob([(blobStream)]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'all_requests.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  const allStudentsList = (otherProps?: any) => {

    const { academicYearId, searchString } = allStudentsFilterState;
    let payload = {
      academicYearId: academicYearId,
      branchId,
      searchString,
      ...pagination.current,
      ...otherProps,

    };
    if (payload.academicYearId) {
      dispatch(getAllStudentsTransRecListAct(generateActionPayload('get_all_stu_trans_record', undefined, payload)))
    }
  }

  function getSlabsList() {
    dispatch(getSlabsListAct(generateActionPayload("get_slabs_list", undefined, { slabName: null, branchId, instituteId })));
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: allStudentsFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
}

  useEffect(() => {
    return () => {
      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(resetBrchClassAct(undefined));
    }
  }, []);

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId

    // academicsFilterForm.setValues((prev:any)=>({...prev,masterAcademicYearId:yearId}))
    setAllStudentsFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
    allStudentsList({ academicYearId: yearId })
    getSlabsList()
    dispatch(getRouteListAct(generateActionPayload("get_route_details_list", undefined, { branchId, instituteId, pageNo: 0, pageSize: 200, sortBy: "routeName", orderBy: "ASC" })))
    getCurriculumApiCall({ academicYearId: yearId })
  }, [academicYearListResp]);

  const menuOptions = useMemo(
    () => [
      {
        id: "change-request",
        actionIcon: <i className="ri-checkbox-circle-line me-2 fs-16"></i>,
        actionName: "Change Request",
        onClickHndlr: (event: any) => {
          const studentAllocationId = event.currentTarget.getAttribute("data-id");
          history.push(`/create-change-request`, { studentAllocationId: studentAllocationId });
        },
      },
      {
        id: "termination-request",
        actionIcon: <i className="ri-checkbox-circle-line me-2 fs-16"></i>,
        actionName: "Terminate Request",
        onClickHndlr: (event: any) => {
          const studentAllocationId = event.currentTarget.getAttribute("data-id");
          const findData = getAllStudentsTransRecListResp?.data?.find((data: any) => +data.studentAllocationId === +studentAllocationId);
          if (findData?.studentId && studentAllocationId) {
            history.push(`/create-termination-request`, { studentData: findData });
          }
        },
      },
    ],
    [getAllStudentsTransRecListResp]
  );

  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;
    let stateChanged = hasStateChanged({ ...initialValues, [name]: value, academicYearId: "" });
    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value })
      dispatch(resetBrchClassAct(undefined));
      dispatch(resetSectionListAct(undefined));
      setAllStudentsFilterState((prev: any) => ({ ...prev, [name]: value, classId: null, curriculumId: "",sectionId: null }));
      stateChanged = hasStateChanged({ ...setAllStudentsFilterState, academicYearId: "",classId : null,curriculumId:"", sectionId: null });
      allStudentsList({ [name]: value,classId : null,curriculumId:"",sectionId: null })
    }
    else{
      allStudentsList({ [name]: value })
      setAllStudentsFilterState((prev: any) => ({ ...prev, [name]: value }))
    }
    setShowClearFilterState(stateChanged?.stateChange)
    stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)

  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    allStudentsList(paginationInfo)
    // getSectionListResp(paginationInfo);
  }

  const toggleExportExcelModal = (id?: any) => {
    setExportExcel((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      requestId: id || "",
    }));
  };

  const exportModalHndler = () => {
    dispatch(exportAllNewRequestAct(generateActionPayload("export_all_transport_request", undefined, { ...allStudentsFilterState, branchId, instituteId }, {
      responseType: 'blob'
    })));
  }

  function getClassApiCall(curriculumId: string) {
    const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", academicYearId: allStudentsFilterState.academicYearId, curriculumId, branchId };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  function advanceFilterCallbckHndlr(appliedFilters?: any) {
    pagination.current.pageNo = 0;
    const stateChanged = hasStateChanged({ ...initialValues, ...appliedFilters, academicYearId: "" });
    setShowClearFilterState(stateChanged?.stateChange)
    stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
    setAllStudentsFilterState((prevState: any) => ({ ...prevState, ...appliedFilters }));
    allStudentsList(appliedFilters)
  }

  const toggleAdvanceFilter = () => {
    setOpen((prev: any) => !prev);
  }

  const clearFilterHndlr = () => {
    if (academicYearListResp) {
      pagination.current = { ...pagination.current, pageNo: 0 }
      let { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus === "CURRENT") || {};
      dispatch(resetBrchClassAct(undefined));
      dispatch(resetSectionListAct(undefined));
      getCurriculumApiCall({ academicYearId })
      setCount(null)
      setAllStudentsFilterState({ ...initialValues, academicYearId })
      allStudentsList({ ...initialValues, academicYearId })
      setShowClearFilterState(false)
    }
  }


  const { data: academicYearList } = academicYearListResp || {};
  const { totalElements, totalPages, pageble } = getAllStudentsTransRecListResp || {}

  const roleColumns = useMemo(() => generateColumns(menuOptions), [getAllStudentsTransRecListResp]);

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb
            title="daily attendance"
            pageTitle="All Transportation Records"
            pageTitleName="All Records"
          />

          <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-mt-4 tw-mb-4">

            <div className="tw-p-4 tw-border-b tw-border-gray-200">
              <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                All Transport Records
              </h4>
            </div>

            <div className="tw-p-4 tw-grid tw-grid-cols-1 xl:tw-grid-cols-12 tw-gap-4 tw-items-end">

              <div className="xl:tw-col-span-3 tw-relative search-box">
                <TextInput
                  name="searchString"
                  value={allStudentsFilterState.searchString}
                  onChange={filterHandler}
                  formgroupClassName="tw-mb-0"
                  placeHolder="Search..."
                  labelText="Search"
                  floatingLabel
                />
                <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
              </div>

              <div className="xl:tw-col-span-2">
                <SelectInput
                  name="academicYearId"
                  value={allStudentsFilterState.academicYearId}
                  onChange={filterHandler}
                  menuItems={academicYearList || []}
                  valueKey="academicYearId"
                  textKey="academicYearName"
                  formgroupClassName="tw-mb-0"
                  defaultSelect="Academic Year"
                />
              </div>

              
              <div className="tw-relative">
                <div
                  onClick={toggleAdvanceFilter}
                  className="tw-flex tw-items-center tw-gap-2 tw-bg-gray-100 tw-p-2 tw-cursor-pointer tw-rounded"
                >
                  <FilterSvg height="18px" width="18px" />
                  <span>Filters</span>
                </div>

                <span
                  className="tw-absolute -tw-top-2 tw-left-16 tw-rounded-full tw-bg-emerald-500 tw-text-white tw-text-xs tw-px-2"
                >
                  {count}
                </span>
              </div>

              {showClearFilterState && (
                <div className="tw-flex tw-items-center tw-justify-end xl:tw-col-span-3">
                  <Button
                    type="button"
                    onClick={clearFilterHndlr}
                    variant="wrong"
                  >
                    Clear filter
                  </Button>
                </div>
              )}

            </div>
            <div className="tw-px-0 tw-pb-4">
              <TableContainer
                columns={roleColumns || []}
                data={getAllStudentsTransRecListResp?.data || []}
                divClass="tw-overflow-x-auto tw-mb-1"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                showPagination={true}
                totalPages={totalPages || 0}
                totalRecords={totalElements || 0}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageble?.pageNumber || 0}
              />
            </div>
          </div>
        </div>
      </div>


      <ConfirmationModal
        id="all-requests-export-modal"
        isOpen={exportExcel.showModal}
        confirmMessage="You want to Download ?"
        cancelHndlr={() => toggleExportExcelModal()}
        confirmHndlr={exportModalHndler}
        isDisble={showApiLoader}
        iconType='approve'
        btnClassName='btn w-sm btn-success'
      />
      <OffCanvasContainer
        isOpen={open}
        headerTitle="Advance Filters"
        closeHndlr={toggleAdvanceFilter}
        id="all-records-advance-filter"
      >
        <AdvanceFilterModal
          getClassApiCall={getClassApiCall}
          appliedFilter={allStudentsFilterState}
          applyFilterCallback={advanceFilterCallbckHndlr}
          toggleAdvanceFilter={toggleAdvanceFilter}
          isOpen={open}
        />
      </OffCanvasContainer>
    </>
  );
};

export default AllTransportationRecords;
