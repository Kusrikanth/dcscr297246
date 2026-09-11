
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns, hasStateChanged, } from "./helper";
import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { exportStuTransportationRecordsAct, getStuTransportationRecordsAct } from "../../../../store/transportation/TransportationRecords/transportationrecordsaction";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import AdvanceFilterModal from "./AdvancedFilterModal";
import { getRouteListAct, getSlabsListAct } from "../../../../store/transportation/transportationaction";
import { useHistory } from "react-router-dom";
import { getFeeTermByTypeAct } from "../../../../store/fee/feereport/feereportactions";
import { downloadExcelFile } from "../../../../utility/commonutility";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { ElearningExchangeIcon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  routeId: "",
  slabId: "",
  termIds: "",
  sectionId:"",
  studentStatus:"",
  terminationStatus:"",
};

const AllTransportationRecords = () => {
  const dispatch = useAppDispatch()
  const [stuTransRecordFilterState, setStuTransRecordFilterState] =
    useState(initialValues);
  const history = useHistory();

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  })
  const [open, setOpen] = useState<boolean>(false);
  const [count, setCount] = useState<any>();
  const [showClearFilterState, setShowClearFilterState] = useState(false);

  const [exportExcel, setExportExcel] = useState({
    showModal: false,
    requestId: undefined
  })

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getStuTransportationRecordsResp,
    transportationRecordsErrorResp,
    exportStuTransportationRecordsResp,
    feeTermByTypeResp,
  } = useAppSelector(
    ({ globalData, instAcademics, appData, transportrecords , feeReport }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getStuTransportationRecordsResp: transportrecords.getStuTransportationRecordsResp,
      transportationRecordsErrorResp: transportrecords.transportationRecordsErrorResp,
      exportStuTransportationRecordsResp: transportrecords.exportStuTransportationRecordsResp,
      feeTermByTypeResp : feeReport.feeTermByTypeResp,
    }),
    shallowEqual
  );

  const newRequestRespRef = useRef({
    prevExportStuTransportationRecordsResp: exportStuTransportationRecordsResp,
    prevTransportationRecordsErrorResp: transportationRecordsErrorResp,
  });

  useEffect(() => {
    const { prevExportStuTransportationRecordsResp, prevTransportationRecordsErrorResp } = newRequestRespRef.current;

    if (exportStuTransportationRecordsResp && prevExportStuTransportationRecordsResp !== exportStuTransportationRecordsResp) {
      toast.success("Students Records List Exprorted successfully.");
      toggleExportExcelModal()
      downloadExcelFile(exportStuTransportationRecordsResp,'student_transport_records');
    }
    else if (transportationRecordsErrorResp && prevTransportationRecordsErrorResp !== transportationRecordsErrorResp) {
      const { details } = transportationRecordsErrorResp;
      toast.error(details || "Something went wrong. Please try again later.");
    }

    newRequestRespRef.current.prevExportStuTransportationRecordsResp = exportStuTransportationRecordsResp;
    newRequestRespRef.current.prevTransportationRecordsErrorResp = transportationRecordsErrorResp;
  }, [exportStuTransportationRecordsResp, transportationRecordsErrorResp]);

  const allStudentsList = (otherProps?: any) => {

    let payload = {
      ...stuTransRecordFilterState,
      branchId,
      ...pagination.current,
      ...otherProps,

    };
    if (payload.academicYearId) {
      dispatch(getStuTransportationRecordsAct(generateActionPayload('get_stu_tranport_record_list', undefined, payload)))
    }
  }

  function getSlabsList() {
    dispatch(getSlabsListAct(generateActionPayload("get_slabs_list", undefined, { slabName: null, branchId, instituteId })));
  }
  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: stuTransRecordFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
}

  useEffect(() => {
    const feeTermParams = {
      feeType: "TERM",
      instituteId,
     }
    dispatch(getFeeTermByTypeAct(generateActionPayload("get_feeterm_bytype", undefined, feeTermParams)));

    return () => {
      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(resetBrchClassAct(undefined));
    }
  }, []);

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
    setStuTransRecordFilterState((prev: any) => ({ ...prev, academicYearId: yearId , studentStatus:"ACTIVE", }))
    allStudentsList({ academicYearId: yearId,studentStatus:"ACTIVE", })
    const stateChanged = hasStateChanged({ ...initialValues, academicYearId: "",studentStatus:"ACTIVE", });
    setShowClearFilterState(stateChanged?.stateChange)
    stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
    getSlabsList()
    dispatch(getRouteListAct(generateActionPayload("get_route_details_list", undefined, { branchId, instituteId, pageNo: 0, pageSize: 200, sortBy: "routeName", orderBy: "ASC" })))
    getCurriculumApiCall({ academicYearId: yearId })
  }, [academicYearListResp,branchId,instituteId]);

  const menuOptions = useMemo(
    () => [
      {
        id: "change-request",
        actionIcon: <HugeiconsIcon icon={ElearningExchangeIcon} className="me-2 text-muted" size={18} />,
        actionName: "Change Request",
        onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
          const studentId = event.currentTarget.getAttribute("data-id");
          history.push(`/create-change-request`, { studentId: studentId,academicYearId :stuTransRecordFilterState.academicYearId,  from: "student" });
        },
      },
      {
        id: "termination-request",
        actionIcon: <HugeiconsIcon icon={ElearningExchangeIcon} className="me-2 text-danger" size={18} />,
        actionName: "Terminate Request",
        onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
          const studentId = event.currentTarget.getAttribute("data-id") || "";
          const findData = getStuTransportationRecordsResp?.data?.find((data: any) => +data.studentId === +studentId);
          if (studentId) {
            history.push(`/create-termination-request`, { studentData: findData, from: "student" });
          }
        },
      },
    ],
    [getStuTransportationRecordsResp]
  );

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;
    let stateChanged = hasStateChanged({ ...initialValues, [name]: value, academicYearId: "" });
    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value })
      dispatch(resetBrchClassAct(undefined));
      setStuTransRecordFilterState((prev: any) => ({ ...prev, [name]: value, classId: null, curriculumId: "" }))
      stateChanged = hasStateChanged({ ...setStuTransRecordFilterState, academicYearId: "",classId : null,curriculumId:"" });
      allStudentsList({ [name]: value,classId : null,curriculumId:"" })
    }
    else{
      allStudentsList({ [name]: value })
      setStuTransRecordFilterState((prev) => ({ ...prev, [name]: value }))
    }
    setShowClearFilterState(stateChanged?.stateChange)
    stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)

  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    allStudentsList(paginationInfo)
  }

  const toggleExportExcelModal = (id?: any) => {
    setExportExcel((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      requestId: id || "",
    }));
  };

  const exportModalHndler = () => {
    dispatch(exportStuTransportationRecordsAct(generateActionPayload("export_stu_tranport_record_list", undefined, { ...stuTransRecordFilterState, branchId, instituteId }, {
      responseType: 'blob'
    })));
  }

  const getClassApiCall = (otherProps?:any)=>{
    const payload = { branchId: branchId, academicYearId : stuTransRecordFilterState?.academicYearId, curriculumId: stuTransRecordFilterState?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 , ...otherProps };
     dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
}

  function advanceFilterCallbckHndlr(appliedFilters?: any) {
    pagination.current.pageNo = 0;
    const stateChanged = hasStateChanged({ ...initialValues, ...appliedFilters, academicYearId: "" });
    setShowClearFilterState(stateChanged?.stateChange)
    stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
    setStuTransRecordFilterState((prevState: any) => ({ ...prevState, ...appliedFilters }));
    allStudentsList(appliedFilters)
  }

  const toggleAdvanceFilter = () => {
    setOpen((prev: any) => !prev);
  }

  const clearFilterHndlr = () => {
    if (academicYearListResp) {
      pagination.current = { ...pagination.current, pageNo: 0 }
      let { academicYearId = "" } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
      dispatch(resetBrchClassAct(undefined));
      setCount(null)
      setStuTransRecordFilterState({ ...initialValues, academicYearId })
      allStudentsList({ ...initialValues, academicYearId })
      setShowClearFilterState(false)
      getCurriculumApiCall({ academicYearId: academicYearId })
    }
  }


  const { data: academicYearList } = academicYearListResp || {};
  const { totalElements, totalPages, pageble } = getStuTransportationRecordsResp || {}

  const roleColumns = useMemo(() => generateColumns(menuOptions), [getStuTransportationRecordsResp]);

  return (
    <>
      <div className="tw-inline-block tw-w-full tw-mt-2">
        <div className="tw-card-body tw-grid tw-grid-cols-12 tw-gap-3 tw-p-2">
          <div className="tw-col-span-12 xl:tw-col-span-2">
            <div className="search-box tw-relative">
              <TextInput
                name="searchString"
                value={stuTransRecordFilterState.searchString}
                onChange={filterHandler}
                formgroupClassName="tw-mb-0"
                placeHolder="Search"
                labelText="Search"
                floatingLabel
              />

              <i className="ri-search-line search-icon"></i>
            </div>
          </div>

          <div className="tw-col-span-12 xl:tw-col-span-2">
            <SelectInput
              name="academicYearId"
              value={stuTransRecordFilterState.academicYearId}
              onChange={filterHandler}
              menuItems={academicYearList || []}
              valueKey="academicYearId"
              textKey="academicYearName"
              formgroupClassName="tw-mb-0"
              labelText="Academic Year"
              floatingLabel
            />
          </div>

          <div className="tw-col-span-12 xl:tw-col-span-2">
            <div className="tw-mb-3">
              <SelectInput
                name="termIds"
                value={stuTransRecordFilterState.termIds}
                onChange={filterHandler}
                menuItems={feeTermByTypeResp || []}
                valueKey="termId"
                textKey="termTypeName"
                labelText="Terms"
                floatingLabel
              />
            </div>
          </div>

          <div className="tw-col-span-12 xl:tw-col-span-1 tw-relative">
            <button
              onClick={toggleAdvanceFilter}
              className="tw-flex tw-items-center tw-bg-[#F4F7FA] tw-p-2 tw-rounded-md"
            >
              <FilterSvg height={"18px"} width={"18px"} />
              <span className="tw-ml-2">Filters</span>
            </button>

            {count > 0 && (
              <span className="tw-absolute -tw-top-2 tw-left-[78px] tw-bg-[#0ab39c] tw-text-white tw-text-xs tw-px-2 tw-py-0.5 tw-rounded-full">
                {count}
              </span>
            )}
          </div>

          <div className="tw-col-span-12 tw-flex tw-justify-end tw-items-center tw-gap-2 xl:tw-col-span-5">
            {showClearFilterState && (
              <Button
                type="button"
                variant="wrong"
                onClick={clearFilterHndlr}
              >
                Clear filter
              </Button>
            )}

            <Button
              onClick={() => toggleExportExcelModal()}
              variant="info"
            >
              <i className="ri-add-line tw-me-2" />
              Export
            </Button>
          </div>
        </div>

        <TableContainer
          columns={roleColumns || []}
          data={getStuTransportationRecordsResp?.data || []}
          divClass="tw-overflow-x-auto tw-mb-1"
          theadClass="tw-bg-gray-50 tw-text-muted tw-align-middle"
          showPagination={true}
          totalPages={totalPages || 0}
          totalRecords={totalElements || 0}
          callbackPaginationHndlr={paginationHndlr}
          currentPageNumber={pageble?.pageNumber || 0}
        />
      </div>
      {/* <ConfirmationModal
        id="all-requests-export-modal"
        isOpen={exportExcel.showModal}
        confirmMessage="You want to Download ?"
        cancelHndlr={() => toggleExportExcelModal()}
        confirmHndlr={exportModalHndler}
        isDisble={showApiLoader}
        iconType='approve'
        btnClassName='btn w-sm btn-success'
      /> */}
      <ModalContainerUpdated
                id="export-all-student-records-modal"
                isOpen={exportExcel.showModal}
                toggle={toggleExportExcelModal}
                modalTitle="Export Student Records Data"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportExcel.showModal}
                    toggle={toggleExportExcelModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportModalHndler}
                    feature="transportation"
                    subFeature="all_records_student"
                    remarksText="Enter remarks to export student records data?"
                />
            </ModalContainerUpdated>
      <OffCanvasContainer
        isOpen={open}
        headerTitle="Advance Filters"
        closeHndlr={toggleAdvanceFilter}
        id="all-records-advance-filter"
      >
        <AdvanceFilterModal
          getClassApiCall={getClassApiCall}
          appliedFilter={stuTransRecordFilterState}
          applyFilterCallback={advanceFilterCallbckHndlr}
          toggleAdvanceFilter={toggleAdvanceFilter}
          isOpen={open}
        />
      </OffCanvasContainer>
    </>
  );
};

export default AllTransportationRecords;
