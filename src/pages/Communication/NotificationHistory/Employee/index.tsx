import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { shallowEqual } from "react-redux";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { useFilterState } from "../../../../hooks/filterhook";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { useModal } from "../../../../hooks/modalhook";
import { debounce, downloadExcelFile } from "../../../../utility/commonutility";
import { ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { exportNotificationHistoryAct, getNotificationHistoryAct, getSmsTemplateListAct } from "../../../../store/communication/communicationactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { generateColumns, ignoredKeys, statusOptions } from "./helper";
import AdvanceFilterModal from "./AdvanceFilterModal";
import { convertToFullTime, convertToFullTimeWithPeriod, Current_Date } from "../../../../utility/dateutility";
import { CustomDatePicker } from "../../../DashBoardBranchSummary/CustomDatePicker";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  searchString: "",
  academicYearId: "",
  fromDate: convertToFullTime(Current_Date),
  toDate: convertToFullTimeWithPeriod(Current_Date),
  status: "",
  templateId: "",
  notificationType: "",
}
const EmployeeNotification = () => {
  const [filterState, setFilterState] = useState(initialValues);
  const [open, setOpen] = useState<boolean>(false);
  const paginationDetailRef = useRef<IPaginationState>({
    pageNo: 0,
    pageSize: 10,
  });
  const { showClearFilterState, count, advanceFilterChange } = useFilterState();

  const dispatch = useAppDispatch();
  const { closeModal: closeExportLoginHistoryModalHnldr,
    openModal: openExportLoginHistoryModalHnldr, modalState: exportLoginHistoryModalState } = useModal();

  const loginUserApiCall = (otherProps?: any) => {
    let payload = {
      branchId,
      instituteId,
      userType: "EMPLOYEE",
      ...otherProps,
      ...paginationDetailRef.current,

    };
    payload.toDate = convertToFullTimeWithPeriod(payload.toDate);
    payload.fromDate = convertToFullTime(payload.fromDate);
    dispatch(getNotificationHistoryAct(generateActionPayload('get_notification_history', undefined, payload)))
  }


  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    userManagementErrorResp,
    showApiLoader,
    exportNotificationHistoryResp,
    saveIPRestrictionResp,
    getRoleTypeListResp,
    getSmsTemplateListResp,
    getNotificationHistoryResp

  } = useAppSelector(
    ({ instAcademics, appData, userManagement, globalData, communication }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      userManagementErrorResp: userManagement.userManagementErrorResp,
      showApiLoader: globalData.showApiLoader,
      exportNotificationHistoryResp: communication.exportNotificationHistoryResp,
      saveIPRestrictionResp: userManagement.saveIPRestrictionResp,
      getRoleTypeListResp: userManagement.getRoleTypeListResp,
      getSmsTemplateListResp: communication.getSmsTemplateListResp,
      getNotificationHistoryResp: communication.getNotificationHistoryResp
    }),
    shallowEqual
  );

  const loginHistoryRef = useRef({
    prevUserManagementErrorResp: userManagementErrorResp,
    prevExportLoginHistoryResp: exportNotificationHistoryResp,

  });

  useEffect(() => {
    const { prevUserManagementErrorResp, prevExportLoginHistoryResp } =
      loginHistoryRef.current;
    if (userManagementErrorResp && userManagementErrorResp !== prevUserManagementErrorResp) {
      const { details } = userManagementErrorResp || {}
      toast.error(details || "Something went wrong");
    }
    else if (exportNotificationHistoryResp && exportNotificationHistoryResp !== prevExportLoginHistoryResp) {
      toast.success("Exported successfully");
      closeExportLoginHistoryModalHnldr()
      downloadExcelFile(exportNotificationHistoryResp, "export_notification_history");
    }

    loginHistoryRef.current.prevUserManagementErrorResp = userManagementErrorResp;
    loginHistoryRef.current.prevExportLoginHistoryResp = exportNotificationHistoryResp;
  }, [userManagementErrorResp, exportNotificationHistoryResp]);


  const loginHistory = useFormik({
    enableReinitialize: true,
    initialValues: filterState,
    onSubmit: (values) => { },
  })

  const getSmsTemplateList = () => {
    const payload = {
      instituteId,
      branchId
    }
    dispatch(getSmsTemplateListAct(generateActionPayload('get_sms_template_list', undefined, payload)))
  }

  useEffect(() => {
    getSmsTemplateList();
  }, [instituteId, branchId])

  const toggleAdvanceFilter = () => {
    setOpen(prev => !prev);
  }

  useEffect(() => {
    if (academicYearListResp) {
      let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId || "";
      loginHistory.setFieldValue("academicYearId", yearId);
      loginUserApiCall({
        academicYearId: yearId,
        toDate: convertToFullTimeWithPeriod(Current_Date),
        fromDate: convertToFullTime(Current_Date)
      });
      setFilterState((prevState) => ({ ...prevState, academicYearId: yearId }));
    }
  }, [academicYearListResp]);

  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationDetailRef.current = paginationInfo;
    loginUserApiCall(paginationInfo);
  }

  function search(value: string) {
    loginUserApiCall({ ...filterState, searchString: value });
  }
  function submitExportHndlr() {

    const payload = {
      branchId,
      userType: "EMPLOYEE",
      ...filterState,
    };
    payload.toDate = convertToFullTimeWithPeriod(payload.toDate || Current_Date);
    payload.fromDate = convertToFullTime(payload.fromDate || Current_Date);
    dispatch(exportNotificationHistoryAct(generateActionPayload('export_notification_history', undefined, payload, {
      responseType: 'blob'
    })))
  }
  const debounceFun = useCallback(debounce(search, 200), [getNotificationHistoryResp])

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    paginationDetailRef.current.pageNo = 0;
    if (name === "searchString") {
      setFilterState((prevState) => ({ ...prevState, [name]: value }));
      debounceFun(value);
    }
    else {
      setFilterState((prevState) => ({ ...prevState, [name]: value }));
      loginUserApiCall({ ...filterState, [name]: value });

    }
    // advanceFilterChange({
    //   keys: { ...filterState, [name]: value },
    //   ignoredKeys,
    // });
  }
  function advanceFilterCallbckHndlr(appliedFilters?: any) {
    paginationDetailRef.current = { ...paginationDetailRef.current, pageNo: 0 }
    advanceFilterChange({ keys: { ...filterState, ...appliedFilters, academicYearId: "" }, ignoredKeys })
    setFilterState((prevState: any) => ({ ...prevState, ...appliedFilters }));
    loginUserApiCall(appliedFilters)
  }

  const clearFilterHndlr = () => {
    const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};

    paginationDetailRef.current = { ...paginationDetailRef.current, pageNo: 0 }
    setFilterState({ ...initialValues, academicYearId: academicYearId || "" });
    loginUserApiCall({ ...initialValues, academicYearId: academicYearId });
    advanceFilterChange({ keys: { ...initialValues }, ignoredKeys });
  };

  const handleDateChange = ({ startDate, endDate }: any) => {
    if (startDate && endDate) {
      setFilterState((prev: any) => ({
        ...prev,
        fromDate: startDate,
        toDate: endDate
      }));
      loginUserApiCall({
        ...filterState,
        fromDate: convertToFullTime(startDate),
        toDate: convertToFullTimeWithPeriod(endDate)
      });
    }
  }

  const columns = useMemo(() => generateColumns(), []);
  const { content: NotificationHistoryList, totalPages, pageNumber, totalElements: totalRecords } = getNotificationHistoryResp || {};
  return (
    <>
      <div className="tw-p-4">
        <div className="tw-grid tw-grid-cols-12 tw-gap-3">

          <div className="tw-col-span-12 lg:tw-col-span-3">
            <div className="search-box tw-relative">
              <TextInput
                name="searchString"
                formgroupClassName="tw-mb-0"
                placeHolder="Search"
                labelText="Search"
                floatingLabel
                value={loginHistory.values.searchString}
                onChange={onChangeFilterHndlr}
              />
              <i className="ri-search-line search-icon"></i>
            </div>
          </div>

          <div className="tw-col-span-12 lg:tw-col-span-2">
            <CustomDatePicker
              name="dateRange"
              startDate={loginHistory.values.fromDate}
              endDate={loginHistory.values.toDate}
              onChange={handleDateChange}
              placeholder="Select a Date Range"
              monthsShown={2}
              formgroupClassName="tw-mb-0"
              labelText="Date Range"
              floatingLabel
            />
          </div>

          <div className="tw-col-span-12 lg:tw-col-span-2">
            <SelectInput
              name="status"
              value={loginHistory.values.status}
              onChange={onChangeFilterHndlr}
              menuItems={statusOptions || []}
              valueKey="name"
              textKey="name"
              formgroupClassName="tw-mb-0"
              labelText="Status"
              floatingLabel
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
              className="tw-absolute tw--top-2 tw-left-16 tw-rounded-full tw-bg-emerald-500 tw-text-white tw-text-xs tw-px-2"
            >
              {count}
            </span>
          </div>

          {showClearFilterState && (
            <div className="tw-col-auto tw-flex tw-mr-auto">
              <Button
                type="button"
                onClick={clearFilterHndlr}
                variant="wrong"
              >
                Clear filter
              </Button>
            </div>
          )}

          <div className="tw-col-span-4 tw-ml-auto">
            <Button
              id="export-btn"
              variant="exportBtn"
              onClick={openExportLoginHistoryModalHnldr}
            >
              <img src={ExportIcon} className="tw-h-full" />
              <UncontrolledTooltip placement="bottom" target="export-btn">
                Export
              </UncontrolledTooltip>
            </Button>
          </div>

        </div>
      </div>
      <TableContainer
        columns={columns || []}
        data={NotificationHistoryList || []}
        tableClass="mb-0"
        divClass="table-responsive mb-3"
        theadClass="table-light text-muted align-middle"
        showCheckbox={false}
        showPagination={true}
        totalPages={totalPages}
        totalRecords={totalRecords}
        callbackPaginationHndlr={paginationHndlr}
        currentPageNumber={pageNumber}
      ></TableContainer>

      <OffCanvasContainer
        isOpen={open}
        headerTitle="Advance Filters"
        closeHndlr={toggleAdvanceFilter}
        id="advance-filter-login-user"
      >
        <AdvanceFilterModal
          filterState={filterState}
          applyFilterCallback={advanceFilterCallbckHndlr}
          toggleAdvanceFilter={toggleAdvanceFilter}
          onChangeFilterHndlr={onChangeFilterHndlr}
          isOpen={open}
          getRoleTypeListResp={getRoleTypeListResp}
          getSmsTemplateListResp={getSmsTemplateListResp}
        />
      </OffCanvasContainer>
      <ModalContainerUpdated
        id="export-login-history-modal"
        isOpen={exportLoginHistoryModalState.showModal}
        toggle={closeExportLoginHistoryModalHnldr}
        modalTitle="Export Notification History Details"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportLoginHistoryModalState.showModal}
          toggle={closeExportLoginHistoryModalHnldr}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={submitExportHndlr}
          feature="notification"
          subFeature="notification_logs_export"
          remarksText="Enter remarks to export notification history details?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default EmployeeNotification;
