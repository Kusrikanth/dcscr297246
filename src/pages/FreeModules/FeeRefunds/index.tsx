import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { useHistory } from "react-router-dom";
import {
  generateColumns,
  hasStateChanged,
} from "./helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {
  getInstAcademicYearAct,
} from "../../../store/mastersettings/instacademics/instacademicactions";
import {
  getBranchCurriculumAct, getBranchClassAct,
  setBrchClassAct,
  resetBrchClassAct,
  resetBrchCurriculumAct,
} from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { exportFeeRefundListAct, getFeeRefundsAct } from "../../../store/fee/feecollections/feecollectionactions";
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";
import { IBranchInfo } from "../../../store/mastersettings/branch/branchtypes";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import Button from "../../../Components/Common/Button";


const initialFilterState = {
  studentName: "",
  startDate: "",
  endDate: "",
  instituteId: "",
  branchClassId: "",
  academicYearId: "",
  branchCurriculumId: "",
  branchId: "",
};
const FeeRefunds = () => {
  const history = useHistory();
  const [filterState, setFilterState] = useState<any>(initialFilterState);
  const [branchState, setBranchState] = useState<Array<IBranchInfo>>([]);
  const [showClearFilterState, setShowClearFilterState] = useState(false);
  const [exportExcel, setExportExcel] = useState<any>({
    showModal: false,
  })
  const paginationDetailRef = useRef<any>({
    pageNo: 0,
    pageSize: 10,
  });
  const sortingDetailRef = useRef<any>(undefined);

  const dispatch = useAppDispatch();
  const { studentsStatsResp, getStudentsByFilterResp, studentsListResp,
    branchClassResp,
    academicYearListResp, instAcademicErrorResp,
    brchSectionsResp, deleteStudentResp, brchCurriculumResp,
    exportStudentDataResp, currentInstIdResp: instituteId, currentBranchIdResp: branchId,
    feeRefundsResp,
    studentManagementErrorResp,
    exportFeeRefundResp,
    showApiLoader,
    feeCollectionErrorResp,
    loggedInUserRole,
    branchListResp,
    virtualRoleResp } =
    useAppSelector(({ appData, directoryStudent, branchAcademics, feeCollections,
      instAcademics, globalData, branch }) => ({
        studentsStatsResp: directoryStudent.studentsStatsResp,
        getStudentsByFilterResp: directoryStudent.getStudentsByFilterResp,
        studentsListResp: directoryStudent.studentsListResp,
        branchClassResp: branchAcademics.branchClassResp,
        brchSectionsResp: branchAcademics.brchSectionsResp,
        deleteStudentResp: directoryStudent.deleteStudentResp,
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        academicYearListResp: instAcademics.academicYearListResp,
        instAcademicErrorResp: instAcademics.instAcademicErrorResp,
        exportStudentDataResp: directoryStudent.exportStudentDataResp,
        currentInstIdResp: appData.currentInstIdResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        feeRefundsResp: feeCollections.feeRefundsResp,
        exportFeeRefundResp: feeCollections.exportFeeRefundResp,
        showApiLoader: globalData.showApiLoader,
        studentManagementErrorResp: directoryStudent.studentManagementErrorResp,
        feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,
        loggedInUserRole: appData.loggedInUserRole,
        branchListResp: branch.branchListResp,
        virtualRoleResp: appData.virtualRoleResp
      }), shallowEqual);

  const showInstituteAdminUI = loggedInUserRole === 'INSTITUTE_ADMIN' && !virtualRoleResp;

  const feeDetailsRespRef = useRef<any>({
    prevAcademicYearListResp: academicYearListResp,
    prevexportFeeRefundResp: exportFeeRefundResp,
    prevFeeCollectionErrorResp: feeCollectionErrorResp
  });
  const toggleExportExcelModal = () => {
    setExportExcel((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };
  function downloadExcelFile(blobStream: any) {

    const url = window.URL.createObjectURL(new Blob([(blobStream)]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Fee_Refund_List.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  useEffect(() => {
    if (instituteId) {
      const payload = { instituteId, sortBy: "academicYearName", orderBy: "desc", pageNo: 0, pageSize: 20 };
      dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
    }
  }, [instituteId]);

  const exportModalHndler = () => {
    dispatch(exportFeeRefundListAct(generateActionPayload("export_fee_refund", undefined, { ...filterState, branchId: showInstituteAdminUI ? filterState.branchId : branchId, instituteId }, {
      responseType: 'blob'
    })));
  }
  useEffect(() => {
    const { prevAcademicYearListResp, prevexportFeeRefundResp, prevFeeCollectionErrorResp } = feeDetailsRespRef.current;
    if (academicYearListResp && prevAcademicYearListResp !== academicYearListResp) {
      if (Array.isArray(academicYearListResp?.data)) {
        const { academicYearId } = academicYearListResp.data?.find((year: any) => year.yearStatus === "CURRENT") || {};
        let updatedBranchId = ""
        if (showInstituteAdminUI) {
          updatedBranchId = ""
        } else {
          updatedBranchId = branchId
        }
        setFilterState((prevState: any) => ({ ...prevState, academicYearId, branchId: updatedBranchId }));
        getFeeRefundApiCall({ academicYearId, branchId: updatedBranchId });
      }
    }
    else if (feeCollectionErrorResp && feeCollectionErrorResp !== prevFeeCollectionErrorResp) {
      const { message }: any = feeCollectionErrorResp;
      toast.error(message || "Something went wrong.");
    }
    else if (exportFeeRefundResp && prevexportFeeRefundResp !== exportFeeRefundResp) {
      toast.success("List Exported Successfully.")
      toggleExportExcelModal()
      downloadExcelFile(exportFeeRefundResp);
    }
    feeDetailsRespRef.current.prevAcademicYearListResp = academicYearListResp;
    feeDetailsRespRef.current.prevexportFeeRefundResp = exportFeeRefundResp;
    feeDetailsRespRef.current.prevFeeCollectionErrorResp = feeCollectionErrorResp;
  }, [academicYearListResp, exportFeeRefundResp, feeCollectionErrorResp]);

  useEffect(() => {
    if (branchListResp) {
      setBranchState(branchListResp?.data.filter((branch: any) => branch.branchId != branchId))
    }
  }, [branchListResp])


  useEffect(() => {
    if (branchId && !showInstituteAdminUI) {
      if (academicYearListResp) {
        const { academicYearId }: any = academicYearListResp?.data.find((item: any) => item.yearStatus === "CURRENT") || {};
        getCurriculumApiCall({ academicYearId })
      }
    }
  }, [branchId, showInstituteAdminUI]);

  const moveToNewFeeRefundHandler = () => {
    history.push("/fee-refunds/create-refund");
  };

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    paginationDetailRef.current.pageNo = 0;
    if (name === 'academicYearId') {
      if (value) {
        getFeeRefundApiCall({ [name]: value, branchClassId: null, branchCurriculumId: "" });
        dispatch(resetBrchClassAct(undefined));
        setFilterState((prev: any) => ({ ...prev, [name]: value, branchClassId: "", branchCurriculumId: "" }));
        if (branchId || filterState.branchId) {
          getCurriculumApiCall({ branchId: showInstituteAdminUI ? filterState.branchId : branchId, academicYearId: value, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" });
        }
      }
      else {
        dispatch(resetBrchCurriculumAct(undefined));
        dispatch(resetBrchClassAct(undefined));
        setFilterState((prev: any) => ({ ...prev, [name]: value, branchClassId: "", branchCurriculumId: "" }));
      }
    }
    else if (name === "branchCurriculumId") {
      if (!value) {
        setFilterState((prev: any) => ({ ...prev, [name]: "" }));
        dispatch(resetBrchClassAct(undefined));
      } else {
        setFilterState((prev: any) => ({ ...prev, [name]: value, branchClassId: "" }));
        getClassApiCall({ curriculumId: value, academicYearId: filterState.academicYearId });
      }
    }
    else if (name === 'branchId') {
      if (value) {
        getCurriculumApiCall({ branchId: value, academicYearId: filterState.academicYearId });
        setFilterState((prevState: any) => ({ ...prevState, [name]: value, curriculumId: "", classId: "" }));
        getFeeRefundApiCall({ [name]: value, curriculumId: "", classId: "" });
      }
      else {
        dispatch(resetBrchCurriculumAct(undefined));
        dispatch(resetBrchClassAct(undefined));
        setFilterState((prevState: any) => ({ ...prevState, [name]: value, curriculumId: "", classId: "" }));
      }
    }
    else {
      setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
      getFeeRefundApiCall({ [name]: value });
    }
    const stateChanged = hasStateChanged({ ...filterState, [name]: value, academicYearId: "" });
    setShowClearFilterState(stateChanged?.stateChange);
  }

  const getClassApiCall = (otherProps?: any) => {
    const payload = { branchId: showInstituteAdminUI ? filterState.branchId : branchId, academicYearId: filterState.academicYearId, curriculumId: filterState.branchCurriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }
  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: filterState.academicYearId, branchId: showInstituteAdminUI ? filterState.branchId : branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  function getFeeRefundApiCall(otherProps?: any) {
    const payload = { instituteId, ...filterState, ...otherProps };
    const params = { ...paginationDetailRef.current, orderBy: "", sortBy: "" };
    dispatch(getFeeRefundsAct(generateActionPayload("get_fee_refunds", params, payload)));
  }

  function paginationHndlr(paginationInfo: any) {
    paginationDetailRef.current = paginationInfo;
    getFeeRefundApiCall();
  }

  const clearFilterHndlr = () => {
    if (academicYearListResp) {
      paginationDetailRef.current = { ...paginationDetailRef.current, pageNo: 0 }
      let { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus === "CURRENT") || {};
      dispatch(resetBrchClassAct(undefined));
      let updatedBranchId = ""
      if (showInstituteAdminUI) {
        updatedBranchId = ""
      } else {
        updatedBranchId = branchId
      }
      if (!showInstituteAdminUI) {
        getCurriculumApiCall({ academicYearId, branchId: updatedBranchId })
      }
      else {
        dispatch(resetBrchCurriculumAct(undefined));
      }
      setFilterState({ ...initialFilterState, academicYearId, branchId: updatedBranchId })
      getFeeRefundApiCall({ ...initialFilterState, academicYearId, branchId: updatedBranchId })
      setShowClearFilterState(false)
    }
  }

  const roleColumns = useMemo(() => {
    const newColumns = generateColumns();
    return newColumns.filter((item: any) => {
      if (item?.Header === "Actions") {
        if (!showInstituteAdminUI) {
          return true
        }
        return false
      }
      else if (item?.Header === "Branch Name") {
        if (showInstituteAdminUI) {
          return true
        }
        return false
      }
      return true
    })
  }, [showInstituteAdminUI]),
    { data: refundsList, pageNumber, totalPages, totalElements } = feeRefundsResp || {};
  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Fee Refunds" pageTitle="Fee" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <div className="tw-w-1/2">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Refund List
                  </h4>
                </div>

                <div className="tw-ml-auto tw-flex tw-items-center tw-gap-2">
                  {!showInstituteAdminUI && (
                    <Button
                      onClick={moveToNewFeeRefundHandler}
                      variant="primary"
                    >
                      <i className="ri-add-line tw-me-1" />
                      <span>Create New</span>
                    </Button>
                  )}

                  <Button
                    variant="exportBtn"
                    id="export-btn"
                    onClick={toggleExportExcelModal}
                  >
                    <img src={ExportIcon} className="tw-h-full tw-w-auto" />
                  </Button>

                  <UncontrolledTooltip placement="bottom" target="export-btn">
                    Export
                  </UncontrolledTooltip>
                </div>
              </div>
            </div>

            <div className="tw-p-4">
              <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                <div className="tw-col-span-3">
                  <div className="search-box tw-relative">
                    <TextInput
                      name="studentName"
                      value={filterState.studentName}
                      onChange={onChangeFilterHndlr}
                      formgroupClassName="tw-mb-0"
                      placeHolder="Search"
                      labelText="Search"
                      floatingLabel
                    />
                    <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2"></i>
                  </div>
                </div>

                <div className="tw-col-span-2">
                  <SelectInput
                    name="academicYearId"
                    value={filterState.academicYearId}
                    onChange={onChangeFilterHndlr}
                    menuItems={academicYearListResp?.data}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    labelText="Academic Year"
                    floatingLabel
                    formgroupClassName="tw-mb-0"
                  />
                </div>

                {showInstituteAdminUI && (
                  <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                    <SelectInput
                      name="branchId"
                      value={filterState.branchId}
                      menuItems={branchState}
                      valueKey="branchId"
                      textKey="branchName"
                      onChange={onChangeFilterHndlr}
                      labelText="Branch Name"
                      floatingLabel
                      formgroupClassName="tw-mb-0"
                    />
                  </div>
                )}

                <div className="tw-col-span-2">
                  <SelectInput
                    name="branchCurriculumId"
                    value={filterState.branchCurriculumId}
                    onChange={onChangeFilterHndlr}
                    menuItems={brchCurriculumResp?.data}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    labelText="Curriculum"
                    floatingLabel
                    formgroupClassName="tw-mb-0"
                  />
                </div>

                <div className="tw-col-span-2">
                  <SelectInput
                    name="branchClassId"
                    value={filterState.branchClassId}
                    onChange={onChangeFilterHndlr}
                    menuItems={branchClassResp?.content}
                    valueKey="id"
                    textKey="shortName"
                    labelText="Class"
                    floatingLabel
                    formgroupClassName="tw-mb-0"
                  />
                </div>

                <div className="tw-col-span-12 xl:tw-col-span-2 tw-flex tw-items-end tw-justify-end tw-gap-2 tw-flex-wrap">
                  {showClearFilterState && (
                    <Button
                      type="button"
                      onClick={clearFilterHndlr}
                      variant="wrong"
                    >
                      Clear filter
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <TableContainer
              columns={roleColumns || []}
              data={Array.isArray(refundsList) ? refundsList : []}
              divClass="tw-overflow-x-auto tw-mb-3"
              tableClass="tw-mb-0"
              theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
              showPagination={true}
              totalPages={totalPages}
              totalRecords={totalElements}
              callbackPaginationHndlr={paginationHndlr}
              currentPageNumber={pageNumber}
            />
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="fee-refund-export-modal"
        isOpen={exportExcel.showModal}
        toggle={toggleExportExcelModal}
        modalTitle='Export Fee Refunds Data'
        modalSize="md"
      >
        <ExportModal
          isOpen={exportExcel.showModal}
          toggle={toggleExportExcelModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportModalHndler}
          feature="fee"
          subFeature={!showInstituteAdminUI ? "fee_refunds" : ""}
          remarksText="Enter remarks to export fee refunds data?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default FeeRefunds;
