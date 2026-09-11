import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ConfirmationModal,
  DateInput,
  ModalContainerUpdated,
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
import { exportLoginHistoryAct, exportNotLoginUsersAct, getLoginHistoryAct, getNotLoginUsersAct, getOSListAct, getRoleTypeListAct, resetOSListAct, resetRoleTypeListAct } from "../../../../../store/usermanagement/usermanagementactions";
import { shallowEqual } from "react-redux";
import { useFormik } from "formik";
import { IPaginationState } from "../../../../../Components/Common/Pagination";
import { useFilterState } from "../../../../../hooks/filterhook";
import { debounce, downloadExcelFile } from "../../../../../utility/commonutility";
import { toast } from "react-toastify";
import ExportModal from "../../../../Directory/StudentManagement/ExportModal";
import Button from "../../../../../Components/Common/Button";



const initialValues = {
  searchStr: "",
  academicYearId: "",
  roleType: "",
}
const NotLoginUser = () => {
  const [filterState, setFilterState] = useState(initialValues);
  const paginationDetailRef = useRef<IPaginationState>({
          pageNo: 0,
          pageSize: 10,
      });
  const { showClearFilterState,count, advanceFilterChange } = useFilterState();

  const dispatch = useAppDispatch();


  const { closeModal: closeExportLoginHistoryModalHnldr,
    openModal: openExportLoginHistoryModalHnldr, modalState: exportLoginHistoryModalState } = useModal();


  const notLoginUserApiCall = (otherProps?: any) => {
    const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
    let payload = {
      branchId,
      academicYearId,
      searchStr: filterState.searchStr,
      roleType: filterState.roleType,
      ...otherProps,
      ...paginationDetailRef.current,

    };
    dispatch(getNotLoginUsersAct(generateActionPayload('get_not_login_users', undefined, payload)))
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
    getNotLoginUsersResp,
    userManagementErrorResp,
    showApiLoader,
    exportNotLoginUsersResp,
    getRoleTypeListResp,

  } = useAppSelector(
    ({ instAcademics, branchAcademics, appData, applicationSale, userManagement, globalData }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      brchClassCurriculumResp: applicationSale.brchClassCurriculumResp,
      getNotLoginUsersResp: userManagement.getNotLoginUsersResp,
      userManagementErrorResp: userManagement.userManagementErrorResp,
      showApiLoader: globalData.showApiLoader,
      exportNotLoginUsersResp: userManagement.exportNotLoginUsersResp,
      getRoleTypeListResp: userManagement.getRoleTypeListResp
    }),
    shallowEqual
  );

  const loginHistoryRef = useRef<any>({
      prevUserManagementErrorResp: userManagementErrorResp,
      prevExportNotLoginUsersResp: exportNotLoginUsersResp,

    });

useEffect(() => {
    const { prevUserManagementErrorResp, prevExportNotLoginUsersResp } =
    loginHistoryRef.current;
    if (userManagementErrorResp && userManagementErrorResp !== prevUserManagementErrorResp) {
      const { details } = userManagementErrorResp || {}
      toast.error(details || "Something went wrong");
    }
    else if (exportNotLoginUsersResp && exportNotLoginUsersResp !== prevExportNotLoginUsersResp) {
      toast.success("Exported successfully");
      closeExportLoginHistoryModalHnldr()
      notLoginUserApiCall();
      downloadExcelFile(exportNotLoginUsersResp,"not_login_users");
    }
    loginHistoryRef.current.prevUserManagementErrorResp = userManagementErrorResp;
    loginHistoryRef.current.prevExportNotLoginUsersResp = exportNotLoginUsersResp;
   
  }, [userManagementErrorResp, exportNotLoginUsersResp]);

  const loginHistory = useFormik({
    enableReinitialize: true,
    initialValues: filterState,
    onSubmit: (values) => { },
  })

    useEffect(() => {
         if (academicYearListResp){
              let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
              loginHistory.setFieldValue("academicYearId",yearId);
              notLoginUserApiCall({ academicYearId: yearId });
              roleTypeList();
          }
      }, [academicYearListResp]);

   function paginationHndlr(paginationInfo: IPaginationState) {
          paginationDetailRef.current = paginationInfo;
          notLoginUserApiCall(paginationInfo);
      }

      function search(value: string) {
        notLoginUserApiCall({ ...filterState, searchStr: value });
    }

    const debounceFun = useCallback(debounce(search, 200), [getNotLoginUsersResp])

 function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        paginationDetailRef.current.pageNo = 0;
        if(name === "searchStr"){
          setFilterState((prevState) => ({ ...prevState, [name]: value }));
          debounceFun(value);
        }
        else if(name ==="roleType"){
          if(value){
            setFilterState((prevState) => ({ ...prevState,[name]: value }));
            notLoginUserApiCall({ [name]: value });
          }
          else{
            setFilterState((prevState) => ({ ...prevState, [name]: value }));
            notLoginUserApiCall({ [name]: value });
            dispatch(resetRoleTypeListAct(undefined))
          }
        }
        else{
          setFilterState((prevState) => ({ ...prevState, [name]: value }));
          notLoginUserApiCall({ [name]: value });
        }
        advanceFilterChange({
            keys: { ...filterState, [name]: value },
            ignoredKeys,
        });
    }

      const clearFilterHndlr = () => {
          const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};

              paginationDetailRef.current = { ...paginationDetailRef.current, pageNo: 0 }
              setFilterState({ ...initialValues, academicYearId: academicYearId || "" });
              notLoginUserApiCall({ ...initialValues, academicYearId: academicYearId });
              advanceFilterChange({ keys: { ...initialValues }, ignoredKeys });
            dispatch(resetOSListAct(undefined))

      };
function submitExportHndlr() {
    const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
        const payload = {
          branchId,
          academicYearId,
          roleType: filterState.roleType,
        };
        dispatch(exportNotLoginUsersAct(generateActionPayload('export_not_login_users', undefined, payload, {
            responseType: 'blob'
        })))
    }

  const columns = useMemo(() => generateColumns(), []);
  const { data: loginHistoryList, totalPages, pageNumber, totalElements:totalRecords } = getNotLoginUsersResp || {};
  return (
    <>
      <div className="tw-px-4 tw-pb-4 tw-pt-2">
        <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-items-end">
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
              name="roleType"
              value={loginHistory.values.roleType}
              onChange={onChangeFilterHndlr}
              menuItems={getRoleTypeListResp || []}
              valueKey="roleTypes"
              textKey="roleTypes"
              formgroupClassName="tw-mb-0"
              labelText="Role Type"
              floatingLabel
            />
          </div>
          <div className="tw-col-span-6">{showClearFilterState && (
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
                id="export-login-history-modal"
                isOpen={exportLoginHistoryModalState.showModal}
                toggle={closeExportLoginHistoryModalHnldr}
                modalTitle="Export Not Login History Details"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportLoginHistoryModalState.showModal}
                    toggle={closeExportLoginHistoryModalHnldr}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={submitExportHndlr}
                    feature="user_management"
                    subFeature="not_login_history"
                    remarksText="Enter remarks to export not login history details?"
                />
            </ModalContainerUpdated>
    </>
  );
};

export default NotLoginUser;
