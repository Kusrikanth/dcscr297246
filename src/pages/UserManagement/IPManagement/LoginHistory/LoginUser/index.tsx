import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ConfirmationModal,
  ModalContainerUpdated,
  OffCanvasContainer,
  SelectInput,
  TextInput,
} from "../../../../../Components/Common";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns, sourceList, ignoredKeys, convertArrayToObjects } from "./helper";
import { default as CrossSvg } from "../../../../../assets/imagesdps/academics/CrossSvg.svg?react";
import { useModal } from "../../../../../hooks/modalhook";
import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../../../assets/imagesdps/common_icon/export_icon.svg";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { exportLoginHistoryAct, getLoginHistoryAct, getOSListAct, getRoleTypeListAct, resetOSListAct, saveIPRestrictionAct } from "../../../../../store/usermanagement/usermanagementactions";
import { shallowEqual } from "react-redux";
import { useFormik } from "formik";
import { IPaginationState } from "../../../../../Components/Common/Pagination";
import { useFilterState } from "../../../../../hooks/filterhook";
import { debounce, downloadExcelFile } from "../../../../../utility/commonutility";
import { toast } from "react-toastify";
import ExportModal from "../../../../Directory/StudentManagement/ExportModal";
import { default as FilterSvg } from "../../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import AdvanceFilterModal from "./AdvanceFilterModal";
import BlockIpModal from "./BlockIpModal";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertDiamondStrokeStandard, CancelCircleIcon } from "@hugeicons-pro/core-stroke-standard"
import { CustomDatePicker } from "../../../../DashBoardBranchSummary/CustomDatePicker";
import { Current_Date } from "../../../../../utility/dateutility";
import Button from "../../../../../Components/Common/Button";

const initialValues = {
  searchStr: "",
  startDate: Current_Date,
  endDate: Current_Date,
  academicYearId: "",
  source: "",
  osBrowser: "",
  roleType: "",
}
const LoginUser = () => {
  const [filterState, setFilterState] = useState(initialValues);
  const [open, setOpen] = useState<boolean>(false);
  const paginationDetailRef = useRef<IPaginationState>({
    pageNo: 0,
    pageSize: 10,
  });
  const { showClearFilterState, count, advanceFilterChange } = useFilterState();

  const dispatch = useAppDispatch();
  const {
    closeModal: closeBlockLoginHistoryModal,
    openModal: openBlockLoginHistoryModal,
    modalState: blockLoginHistory,
  } = useModal();

  const { closeModal: closeExportLoginHistoryModalHnldr,
    openModal: openExportLoginHistoryModalHnldr, modalState: exportLoginHistoryModalState } = useModal();

  const {
    closeModal: closeEndSessionLoginHistoryModal,
    openModal: openEndSessionLoginHistoryModal,
    modalState: endSessionLoginHistory,
  } = useModal();

  const loginUserApiCall = (otherProps?: any) => {
    const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
    let payload = {
      branchId,
      searchStr: filterState.searchStr,
      startDate: filterState.startDate,
      endDate: filterState.endDate,
      source: filterState.source,
      osBrowser: filterState.osBrowser,
      roleType: filterState.roleType,
      ...otherProps,
      ...paginationDetailRef.current,
      academicYearId,

    };
    dispatch(getLoginHistoryAct(generateActionPayload('get_login_history', undefined, payload)))
  }
  const osBrowserList = (source: any) => {
    const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};

    let payload = {
      branchId,
      academicYearId: academicYearId,
      source,
    }
    if (source) {
      dispatch(getOSListAct(generateActionPayload('get_os_list', undefined, payload)))
    }
  }

  const roleTypeList = () => {

    let payload = {
      branchId,
    }
    if (branchId) {
      dispatch(getRoleTypeListAct(generateActionPayload('get_role_types', undefined, payload)))
    }
  }

  const {
    academicYearListResp,
    brchCurriculumResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    brchClassCurriculumResp,
    getLoginHistoryResp,
    getOSListResp,
    userManagementErrorResp,
    showApiLoader,
    exportLoginHistoryResp,
    saveIPRestrictionResp,
    getRoleTypeListResp,

  } = useAppSelector(
    ({ instAcademics, branchAcademics, appData, applicationSale, userManagement, globalData }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      brchClassCurriculumResp: applicationSale.brchClassCurriculumResp,
      getLoginHistoryResp: userManagement.getLoginHistoryResp,
      getOSListResp: userManagement.getOSListResp,
      userManagementErrorResp: userManagement.userManagementErrorResp,
      showApiLoader: globalData.showApiLoader,
      exportLoginHistoryResp: userManagement.exportLoginHistoryResp,
      saveIPRestrictionResp: userManagement.saveIPRestrictionResp,
      getRoleTypeListResp: userManagement.getRoleTypeListResp,
    }),
    shallowEqual
  );

  const loginHistoryRef = useRef({
    prevUserManagementErrorResp: userManagementErrorResp,
    prevExportLoginHistoryResp: exportLoginHistoryResp,
    prevSaveIPRestrictionResp: saveIPRestrictionResp

  });

  useEffect(() => {
    const { prevUserManagementErrorResp, prevExportLoginHistoryResp, prevSaveIPRestrictionResp } =
      loginHistoryRef.current;
    if (userManagementErrorResp && userManagementErrorResp !== prevUserManagementErrorResp) {
      const { details } = userManagementErrorResp || {}
      toast.error(details || "Something went wrong");
    }
    else if (exportLoginHistoryResp && exportLoginHistoryResp !== prevExportLoginHistoryResp) {
      const { details } = exportLoginHistoryResp || {}
      toast.success(details || " Exported successfully");
      closeExportLoginHistoryModalHnldr()
      loginUserApiCall();
      downloadExcelFile(exportLoginHistoryResp, "login_history");
    }
    else if (saveIPRestrictionResp && saveIPRestrictionResp !== prevSaveIPRestrictionResp) {
      toast.success("Ip Blocked successfully");
      closeBlockLoginHistoryModal()
      loginUserApiCall();
    }
    loginHistoryRef.current.prevUserManagementErrorResp = userManagementErrorResp;
    loginHistoryRef.current.prevExportLoginHistoryResp = exportLoginHistoryResp;
    loginHistoryRef.current.prevSaveIPRestrictionResp = saveIPRestrictionResp
  }, [userManagementErrorResp, exportLoginHistoryResp, saveIPRestrictionResp]);

  const menuOptions = useMemo(
    () => [
      {
        id: "block-ip",
        actionIcon: (
          <HugeiconsIcon icon={AlertDiamondStrokeStandard} className="tw-text-red-500" size={18} />
        ),
        actionName: "Block IP",
        onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
          const id = event.currentTarget.getAttribute("data-id");
          openBlockLoginHistoryModal(id);
        },
      },
      {
        id: "end-session",
        actionIcon: <HugeiconsIcon icon={CancelCircleIcon} className="tw-text-gray-500" size={18} />,
        actionName: "End Session",
        onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
          const id = event.currentTarget.getAttribute("data-id");
          openEndSessionLoginHistoryModal(id);
        },
      },
    ],
    []
  );

  const loginHistory = useFormik({
    enableReinitialize: true,
    initialValues: filterState,
    onSubmit: (values) => { },
  })

  const toggleAdvanceFilter = () => {
    setOpen(prev => !prev);
  }

  useEffect(() => {
    if (academicYearListResp) {
      let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
      loginHistory.setFieldValue("academicYearId", yearId);
      loginUserApiCall({ academicYearId: yearId });
      roleTypeList();
    }
  }, [academicYearListResp]);

  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationDetailRef.current = paginationInfo;
    loginUserApiCall(paginationInfo);
  }

  function search(value: string) {
    loginUserApiCall({ ...filterState, searchStr: value });
  }

  const debounceFun = useCallback(debounce(search, 200), [getLoginHistoryResp])

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    paginationDetailRef.current.pageNo = 0;
    if (name === "searchStr") {
      setFilterState((prevState) => ({ ...prevState, [name]: value }));
      debounceFun(value);
    }
    else if (name === "source") {
      if (value) {
        osBrowserList(value)
        setFilterState((prevState) => ({ ...prevState, [name]: value, osBrowser: "", searchStr: "" }));
        loginUserApiCall({ [name]: value, osBrowser: "", searchStr: "" });
      }
      else {
        setFilterState((prevState) => ({ ...prevState, [name]: value }));
        loginUserApiCall({ [name]: value });
        dispatch(resetOSListAct(undefined))
      }
    }
    else {
      setFilterState((prevState) => ({ ...prevState, [name]: value }));
      loginUserApiCall({ [name]: value });
    }
    advanceFilterChange({
      keys: { ...filterState, [name]: value },
      ignoredKeys,
    });
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
    dispatch(resetOSListAct(undefined))

  };

  function submitExportHndlr() {
    const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};

    const payload = {
      branchId,
      academicYearId,
      searchStr: filterState.searchStr,
      startDate: filterState.startDate,
      endDate: filterState.endDate,
      source: filterState.source,
      osBrowser: filterState.osBrowser,
      roleType: filterState.roleType,
    };
    dispatch(exportLoginHistoryAct(generateActionPayload('export_login_history', undefined, payload, {
      responseType: 'blob'
    })))
  }

  const handleDateChange = ({ startDate, endDate }: any) => {
    if (startDate && endDate) {
      setFilterState((prev: any) => ({ ...prev, startDate, endDate }));
      loginUserApiCall({ startDate, endDate });
    }
  } 

  const columns = useMemo(() => generateColumns(menuOptions), []);
  const { data: loginHistoryList, totalPages, pageNumber, totalElements: totalRecords } = getLoginHistoryResp || {};
  const osNamelist = convertArrayToObjects(getOSListResp?.osName)
  return (
    <>
      <div className="tw-px-4 tw-pb-4 tw-pt-2">
        <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-items-end tw-break-words">
          <div className="tw-col-span-12 lg:tw-col-span-3">
            <div className="search-box">
              <TextInput
                name="searchStr"
                formgroupClassName="tw-mb-0"
                placeHolder="Search"
                labelText="Search"
                floatingLabel
                value={loginHistory.values.searchStr}
                onChange={onChangeFilterHndlr}
              />
              <i className="ri-search-line search-icon"></i>
            </div>
          </div>
          <div className="tw-col-span-12 lg:tw-col-span-2">
            <SelectInput
              name="source"
              value={loginHistory.values.source}
              onChange={onChangeFilterHndlr}
              menuItems={sourceList || []}
              valueKey="id"
              textKey="name"
              formgroupClassName="tw-mb-0"
              labelText="Source"
              floatingLabel
            />
          </div>
          <div className="tw-col-span-12 lg:tw-col-span-2">
            <SelectInput
              name="osBrowser"
              value={loginHistory.values.osBrowser}
              onChange={onChangeFilterHndlr}
              menuItems={osNamelist || []}
              valueKey="name"
              textKey="name"
              formgroupClassName="tw-mb-0"
              labelText="OS Browser"
              floatingLabel
            />
          </div>
          <div className="tw-col-span-12 lg:tw-col-span-2">
            <CustomDatePicker
              name="dateRange"
              startDate={loginHistory.values.startDate}
              endDate={loginHistory.values.endDate}
              onChange={handleDateChange}
              placeholder="Select a Date Range"
              monthsShown={2}
              formgroupClassName="tw-mb-0"
              labelText="Date Range"
              floatingLabel
            />
          </div>
          <div className="tw-col-auto tw-relative">
            <Button
              variant="secondary"
              type="button"
              className="tw-flex tw-items-center"
              onClick={toggleAdvanceFilter}
              disabled={showApiLoader}
            >
              <FilterSvg height="18px" width="18px" />
              <span className="tw-ml-2">Filters</span>
            </Button>
            <span className="tw-absolute tw-top-2 tw-left-16 tw-bg-[#0ab39c] tw-text-white tw-text-xs tw-px-2 tw-rounded-full">
              {count}
            </span>
          </div>
          <div className="tw-col-auto">{showClearFilterState && (
            <Button
              variant="wrong"
              type="button"
              className="tw-px-2 tw-py-1"
              onClick={clearFilterHndlr}
            >
              Clear filter
            </Button>
          )}
          </div>
          <div className="tw-col-auto tw-ml-auto">
            <Button
              type="button"
              variant="exportBtn"
              onClick={openExportLoginHistoryModalHnldr}
              className="tw-flex tw-items-center !tw-p-2"
            >
              <img src={ExportIcon} className="tw-h-5 tw-w-5" />
            </Button>
          </div>
        </div>
      </div>
      <TableContainer
        columns={columns || []}
        data={loginHistoryList || []}
        tableClass="tw-mb-0"
        divClass="tw-overflow-x-auto tw-mb-3"
        theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
        showCheckbox={false}
        showPagination={true}
        totalPages={totalPages}
        totalRecords={totalRecords}
        callbackPaginationHndlr={paginationHndlr}
        currentPageNumber={pageNumber}
      />
      <ModalContainerUpdated
        id="block-login-history"
        isOpen={blockLoginHistory.showModal}
        toggle={closeBlockLoginHistoryModal}
        modalTitle="Block Login History"
        modalSize="md"
        hideHeader={true}
      >
        <BlockIpModal
          isOpen={blockLoginHistory.showModal}
          toggle={closeBlockLoginHistoryModal}
          modalData={blockLoginHistory.modalData}
        />

      </ModalContainerUpdated>

      <ConfirmationModal
        id="end-session-login-history"
        isOpen={endSessionLoginHistory.showModal}
        confirmMessage="Are you sure you want to end a login session"
        cancelHndlr={closeEndSessionLoginHistoryModal}
        confirmHndlr={() => { }}
        showImgIcon={true}
        iconType="reject`"
      ></ConfirmationModal>
      <ModalContainerUpdated
        id="export-login-history-modal"
        isOpen={exportLoginHistoryModalState.showModal}
        toggle={closeExportLoginHistoryModalHnldr}
        modalTitle="Export Login History Details"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportLoginHistoryModalState.showModal}
          toggle={closeExportLoginHistoryModalHnldr}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={submitExportHndlr}
          feature="user_management"
          subFeature="login_history"
          remarksText="Enter remarks to export login history details?"
        />
      </ModalContainerUpdated>
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
        />
      </OffCanvasContainer>
    </>
  );
};

export default LoginUser;
