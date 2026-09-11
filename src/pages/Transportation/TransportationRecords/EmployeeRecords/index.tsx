
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns, hasStateChanged, } from "./helper";
import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getBranchClassAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import {  exportEmpTransportationRecordsAct,getEmpTransportationRecordsAct } from "../../../../store/transportation/TransportationRecords/transportationrecordsaction";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import AdvanceFilterModal from "./AdvancedFilterModal";
import { getRouteListAct, getSlabsListAct } from "../../../../store/transportation/transportationaction";
import { useHistory } from "react-router-dom";
import { downloadExcelFile } from "../../../../utility/commonutility";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { ElearningExchangeIcon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  searchString: "",
  academicYearId: "",
  routeId: "",
  slabId: "",
};

const AllTransportationRecords = () => {
  const dispatch = useAppDispatch()
  const [empTransRecordFilterState, setEmpTransRecordFilterState] = useState(initialValues);
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
    getEmpTransportationRecordsResp,
    transportationRecordsErrorResp,
    exportEmpTransportationRecordsResp,
  } = useAppSelector(
    ({ globalData, instAcademics, appData, transportrecords }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getEmpTransportationRecordsResp: transportrecords.getEmpTransportationRecordsResp,
      transportationRecordsErrorResp: transportrecords.transportationRecordsErrorResp,
      exportEmpTransportationRecordsResp: transportrecords.exportEmpTransportationRecordsResp,
    }),
    shallowEqual
  );

  const newRequestRespRef = useRef({
    prevExportEmpTransportationRecordsResp: exportEmpTransportationRecordsResp,
    prevTransportationRecordsErrorResp: transportationRecordsErrorResp,
  });

  useEffect(() => {
    const { prevExportEmpTransportationRecordsResp, prevTransportationRecordsErrorResp } = newRequestRespRef.current;

    if (exportEmpTransportationRecordsResp && prevExportEmpTransportationRecordsResp !== exportEmpTransportationRecordsResp) {
      toast.success("Employee Records List Exprorted successfully.");
      toggleExportExcelModal()
      downloadExcelFile(exportEmpTransportationRecordsResp,"employee_transport_records");
    }
    else if (transportationRecordsErrorResp && prevTransportationRecordsErrorResp !== transportationRecordsErrorResp) {
      const { details } = transportationRecordsErrorResp;
      toast.error(details || "Something went wrong. Please try again later.");
    }

    newRequestRespRef.current.prevExportEmpTransportationRecordsResp = exportEmpTransportationRecordsResp;
    newRequestRespRef.current.prevTransportationRecordsErrorResp = transportationRecordsErrorResp;
  }, [exportEmpTransportationRecordsResp, transportationRecordsErrorResp]);

  const employeeTransRecordList = (otherProps?: any) => {

    let payload = {
      ...empTransRecordFilterState,
      branchId,
      ...pagination.current,
      ...otherProps,

    };
    if (payload.academicYearId) {
      dispatch(getEmpTransportationRecordsAct(generateActionPayload('get_emp_tranport_record_list', undefined, payload)))
    }
  }

  function getSlabsList() {
    dispatch(getSlabsListAct(generateActionPayload("get_slabs_list", undefined, { slabName: null, branchId, instituteId })));
  }

  useEffect(() => {
    
    return () => {
      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(resetBrchClassAct(undefined));
    }
  }, []);

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId

    setEmpTransRecordFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
    employeeTransRecordList({ academicYearId: yearId })
    getSlabsList()
    dispatch(getRouteListAct(generateActionPayload("get_route_details_list", undefined, { branchId, instituteId, pageNo: 0, pageSize: 200, sortBy: "routeName", orderBy: "ASC" })))
  }, [academicYearListResp,branchId,instituteId]);

  const menuOptions = useMemo(
    () => [
      {
        id: "change-request",
        actionIcon: <HugeiconsIcon icon={ElearningExchangeIcon} className="me-2 text-muted" size={18} />,
        actionName: "Change Request",
        onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
          const studentAllocationId = event.currentTarget.getAttribute("data-id");
          history.push(`/create-change-request`, { studentAllocationId: studentAllocationId , from : "employee" });
        },
      },
      {
        id: "termination-request",
        actionIcon: <HugeiconsIcon icon={ElearningExchangeIcon} className="me-2 text-danger" size={20} />,
        actionName: "Terminate Request",
        onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
          const studentAllocationId = event.currentTarget.getAttribute("data-id") || "";
          const findData = getEmpTransportationRecordsResp?.data?.find((data: any) => +data.studentAllocationId === +studentAllocationId);
          if (findData?.employeeId && studentAllocationId) {
            history.push(`/create-termination-request`, { studentData: findData , from : "employee" });
          }
        },
      },
    ],
    [getEmpTransportationRecordsResp]
  );

  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    setEmpTransRecordFilterState((prev: any) => ({ ...prev, [name]: value }))
    pagination.current.pageNo = 0;
    employeeTransRecordList({ [name]: value })

    const stateChanged = hasStateChanged({ ...initialValues, [name]: value, academicYearId: "" });
    setShowClearFilterState(stateChanged?.stateChange)
    stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)

  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    employeeTransRecordList(paginationInfo)
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
    dispatch(exportEmpTransportationRecordsAct(generateActionPayload("export_emp_tranport_record_list", undefined, { ...empTransRecordFilterState, branchId, instituteId }, {
      responseType: 'blob'
    })));
  }

  function getClassApiCall(curriculumId: string) {
    const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId, branchId };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  function advanceFilterCallbckHndlr(appliedFilters?: any) {
    pagination.current.pageNo = 0;
    const stateChanged = hasStateChanged({ ...initialValues, ...appliedFilters, academicYearId: "" });
    setShowClearFilterState(stateChanged?.stateChange)
    stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
    setEmpTransRecordFilterState((prevState: any) => ({ ...prevState, ...appliedFilters }));
    employeeTransRecordList(appliedFilters)
  }

  const toggleAdvanceFilter = () => {
    setOpen((prev: any) => !prev);
  }

  const clearFilterHndlr = () => {
    if (academicYearListResp) {
      pagination.current = { ...pagination.current, pageNo: 0 }
      let { academicYearId = "" } = academicYearListResp?.data?.find((year: any) =>  year.yearStatus === "CURRENT") || {};
      dispatch(resetBrchClassAct(undefined));
      setCount(null)
      setEmpTransRecordFilterState({ ...initialValues, academicYearId })
      employeeTransRecordList({ ...initialValues, academicYearId })
      setShowClearFilterState(false)
    }
  }


  const { data: academicYearList } = academicYearListResp || {};
  const { totalElements, totalPages, pageble } = getEmpTransportationRecordsResp || {}

  const roleColumns = useMemo(() => generateColumns(menuOptions), [getEmpTransportationRecordsResp]);

  return (
    <>
      <div className="tw-inline-block tw-w-full tw-mt-2">
        <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-3 tw-pb-3">

          <div className="tw-col-span-12 xl:tw-col-span-2">
            <div>
              <div className="search-box tw-relative">
                <TextInput
                  name="searchString"
                  value={empTransRecordFilterState.searchString}
                  onChange={filterHandler}
                  inputClassName="tw-bg-gray-100"
                  formgroupClassName="tw-mb-0"
                  placeHolder="Search"
                  labelText="Search"
                  floatingLabel
                />
                <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400" />
              </div>
            </div>
          </div>

          <div className="tw-col-span-12 xl:tw-col-span-2">
            <SelectInput
              name="academicYearId"
              value={empTransRecordFilterState.academicYearId}
              onChange={filterHandler}
              menuItems={academicYearList || []}
              valueKey="academicYearId"
              textKey="academicYearName"
              formgroupClassName="tw-mb-0"
              labelText="Academic Year"
              floatingLabel
            />
          </div>

          <div className="tw-col-span-1 tw-relative">
            <button
              onClick={toggleAdvanceFilter}
              className="tw-flex tw-items-center tw-gap-2 tw-p-2 tw-rounded-md tw-bg-[#F4F7FA] hover:tw-bg-[#e9edf3]"
            >
              <FilterSvg height="18px" width="18px" />
              <span>Filters</span>
            </button>

            {count > 0 && (
              <span className="tw-absolute -tw-top-2 tw-left-16 tw-bg-[#0ab39c] tw-text-white tw-text-xs tw-rounded-full tw-px-2">
                {count}
              </span>
            )}
          </div>

          <div className="tw-col-span-7 tw-flex tw-justify-end tw-items-center tw-gap-2">
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
              onClick={toggleExportExcelModal}
              variant="info"
            >
              <i className="ri-add-line" />
              Export
            </Button>
          </div>
        </div>

        <TableContainer
          columns={roleColumns || []}
          data={getEmpTransportationRecordsResp?.data || []}
          divClass="table-responsive tw-mb-1"
          theadClass="table-light text-muted align-middle"
          showPagination={true}
          totalPages={totalPages || 0}
          totalRecords={totalElements || 0}
          callbackPaginationHndlr={paginationHndlr}
          currentPageNumber={pageble?.pageNumber || 0}
        />
      </div>
      <ModalContainerUpdated
                id="export-all-employee-record-modal"
                isOpen={exportExcel.showModal}
                toggle={toggleExportExcelModal}
                modalTitle="Export Employee Records Data"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportExcel.showModal}
                    toggle={toggleExportExcelModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportModalHndler}
                    feature="transportation"
                    subFeature="all_records_employee"
                    remarksText="Enter remarks to export employee records?"
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
          appliedFilter={empTransRecordFilterState}
          applyFilterCallback={advanceFilterCallbckHndlr}
          toggleAdvanceFilter={toggleAdvanceFilter}
          isOpen={open}
        />
      </OffCanvasContainer>
    </>
  );
};

export default AllTransportationRecords;
