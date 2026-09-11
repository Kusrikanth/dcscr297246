
import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { shallowEqual } from "react-redux";
import {
  SelectInput, TextInput, ConfirmationModal, ModalContainerUpdated,
} from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import FeeStructureModal from "./FeeStructureModal";
import { toast } from "react-toastify";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { getFeeStructuresAct, deleteFeeStructureAct } from "../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";
import {
  getBranchCurriculumAct,
  resetBrchCurriculumAct
} from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import {
  getInstAcademicYearAct,
} from "../../../store/mastersettings/instacademics/instacademicactions";
import { getFeeParticularsAct } from "../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";

//Types
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
//Common Utility
import { getSortingKeys } from "../../../utility/commonutility";
import {
  generateColumns
} from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
const FeeStructure = () => {
  const [feeStructureModalState, setFeeStructureModalS] =
    useState({
      showModal: false,
      feeStructureId: "",
      modalData: undefined,
    });
  const [delFeeStructureModalState, setDelFeeStructureModalState] = useState({
    showModal: false,
    feeStructureId: ""
  });
  const [filterState, setFilterState] = useState<any>({
    search: "",
    academicYearId: "",
    curriculumId: "",
    feeParticularId: "",
  });
  const paginationDetailRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });
  const sortingDetailRef = useRef<any>(undefined);

  const dispatch = useAppDispatch();
  const { feeStructuresResp, deleteFeeStructureResp,
    currentInstIdResp: instituteId, currentBranchIdResp: branchId,
    academicYearListResp, brchCurriculumResp, feeParticularsResp, showApiLoader, loggedInUserRole,
    masterFeeSettingsErrorResp } =
    useAppSelector(({ appData, instAcademics, branchAcademics, masterFeeSettings, globalData }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      feeParticularsResp: masterFeeSettings.feeParticularsResp,
      feeStructuresResp: masterFeeSettings.feeStructuresResp,
      showApiLoader: globalData.showApiLoader,
      loggedInUserRole: appData.loggedInUserRole,
      deleteFeeStructureResp: masterFeeSettings.deleteFeeStructureResp,
      masterFeeSettingsErrorResp: masterFeeSettings.masterFeeSettingsErrorResp,
    }), shallowEqual);

  const feeDetailsRespRef = useRef({
    prevAcademicYearListResp: academicYearListResp,
    prevDeleteSpecialFeeResp: deleteFeeStructureResp,
    prevMasterFeeSettingsErrorResp: masterFeeSettingsErrorResp
  });

  useEffect(() => {
    const { prevAcademicYearListResp, prevDeleteSpecialFeeResp, prevMasterFeeSettingsErrorResp } = feeDetailsRespRef.current;
    if (academicYearListResp && prevAcademicYearListResp !== academicYearListResp) {
      if (Array.isArray(academicYearListResp?.data)) {
        const { academicYearId } = academicYearListResp.data?.find((year: any) => year.yearStatus === "CURRENT") || {};
        setFilterState((prevState: any) => ({ ...prevState, academicYearId }));
        getFeeStructureApiCall({ academicYearId });
        const brchCurriculumparams = { academicYearId, branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, brchCurriculumparams)));
      }
    }
    else if (deleteFeeStructureResp && prevDeleteSpecialFeeResp !== deleteFeeStructureResp) {
      setDelFeeStructureModalState((prevState: any) => ({ ...prevState, showModal: false, feeStructureId: "" }));
      getFeeStructureApiCall();
      toast.success("Special fee deleted successfully.");
    } else if (masterFeeSettingsErrorResp && masterFeeSettingsErrorResp !== prevMasterFeeSettingsErrorResp) {
      const { details }: any = masterFeeSettingsErrorResp;
      toast.error(details || "Something went wrong.");
    }
    feeDetailsRespRef.current.prevAcademicYearListResp = academicYearListResp;
    feeDetailsRespRef.current.prevDeleteSpecialFeeResp = deleteFeeStructureResp;
    feeDetailsRespRef.current.prevMasterFeeSettingsErrorResp = masterFeeSettingsErrorResp;
  }, [academicYearListResp, deleteFeeStructureResp, masterFeeSettingsErrorResp]);

  const canCreateAndUpdate = useMemo(() => {
    return loggedInUserRole !== 'ACCOUNT' && loggedInUserRole !== 'ACCOUNT_HEAD';
  }, [loggedInUserRole]);

  useEffect(() => {
    getFeeStructureApiCall();
  }, []);

  useEffect(() => {
    if (instituteId) {
      const payload = { instituteId, sortBy: "academicYearName", orderBy: "desc", pageNo: 0, pageSize: 20 };
      dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));

      const particularPayload = { instituteId, pageNo: 0, pageSize: 100, branchId };
      dispatch(getFeeParticularsAct(generateActionPayload("get_fee_particulars", undefined, particularPayload)));

    }
  }, [instituteId]);

  const toggleFeeStructureModal = useCallback((apiCall?: boolean) => {
    setFeeStructureModalS((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
    if (typeof (apiCall) === "boolean" && apiCall) {
      getFeeStructureApiCall();
    }
  }, [instituteId, feeStructuresResp]);

  function addFeeStructureModalHndlr() {
    setFeeStructureModalS((prevState: any) => ({
      ...prevState, showModal: true,
      feeStructureId: "",
      modalData: undefined
    }));
  }

  function editFeeStructureHndlr(event: any) {
    const feeStructureId = event.currentTarget.getAttribute("data-id");
    if (feeStructureId) {
      setFeeStructureModalS((prevState: any) => ({
        ...prevState, showModal: true, feeStructureId
      }));
    }
  }

  function deleteSpecialFeeHndlr(event: any) {
    const feeStructureId = event.currentTarget.getAttribute("data-id");
    if (feeStructureId) {
      setDelFeeStructureModalState((prevState: any) => ({ ...prevState, showModal: true, feeStructureId }));
    }
  }

  const menuOptions = useMemo((): IOptionsHrtl[] => ([{
    id: "edit",
    actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={18} />,
    actionName: "Edit",
    onClickHndlr: editFeeStructureHndlr,
  }, {
    id: "delete",
    actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="me-2 text-danger" size={18} />,
    actionName: "Delete",
    onClickHndlr: deleteSpecialFeeHndlr
  }]), [feeStructuresResp]);

  function delModalCancelHndlr() {
    setDelFeeStructureModalState((prevState: any) => ({ ...prevState, showModal: false }));
  }
  function delModalSubmitHndlr() {
    const { feeStructureId } = delFeeStructureModalState;
    dispatch(deleteFeeStructureAct(generateActionPayload("delete_fee_structure", { feeStructureId })));
  }

  function paginationHndlr(paginationInfo: any) {
    paginationDetailRef.current = paginationInfo;
    getFeeStructureApiCall(paginationInfo);
  }

  function getFeeStructureApiCall(otherProps?: any) {
    const sortingParams = getSortingKeys(sortingDetailRef.current);
    const payload = { branchId, ...filterState, ...otherProps, ...paginationDetailRef.current, ...sortingParams };
    dispatch(getFeeStructuresAct(generateActionPayload("get_fee_structure", undefined, payload)));
  }

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
    getFeeStructureApiCall({ [name]: value });
    if (name === 'academicYearId') {
      setFilterState((prev: any) => ({ ...prev, [name]: value, curriculumId: "", feeParticularId: "" }));
      getFeeStructureApiCall({ [name]: value, curriculumId: "", classId: "" });
      if (value) {
        const curriculumParams = { academicYearId: value, branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, curriculumParams)));
      } else {
        dispatch(resetBrchCurriculumAct(undefined));
      }
    }
    else if (name === "curriculumId") {
      const particularPayload = { instituteId, pageNo: 0, pageSize: 100, branchId, curriculumId: value };
      dispatch(getFeeParticularsAct(generateActionPayload("get_fee_particulars", undefined, particularPayload)));
    }
  }

  function sortingHandler(sortingKeys: any) {
    if (sortingDetailRef.current && sortingDetailRef.current !== sortingKeys) {
      sortingDetailRef.current = sortingKeys;
      getFeeStructureApiCall();
      //Testing
    } else {
      sortingDetailRef.current = sortingKeys;
    }
  }

  const feeStructureColumns = useMemo(() => {
    const columns = generateColumns(menuOptions);
    if (canCreateAndUpdate) {
      return columns;
    } else {
      return columns.filter((col) => col.accessor !== 'actions')
    }
  }, [feeStructuresResp, canCreateAndUpdate]),
    { data: feeStructureList, pageNumber, totalPages, totalElements } = feeStructuresResp || {};
  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Fee Structure" pageTitle="Fee" />

          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">
                    Fee Structure Details
                  </h4>
                </div>
                {canCreateAndUpdate && <div className="col-auto ms-auto">
                  <div className="d-flex">
                    <button
                      className="btn btn-success float-end d-flex align-items-center"
                      onClick={addFeeStructureModalHndlr}
                    >
                      <i className="ri-add-line me-2" />
                      Add New
                    </button>
                    {/* <div className="d-flex">
                      <span
                        style={{
                          backgroundColor: "#DEEAF7",
                        }}
                        className="p-2 d-flex align-items-center justify-content-center me-2 rounded-circle cursor-pointer"
                      >
                        <Export2Svg />
                      </span>
                      <span
                        style={{
                          backgroundColor: "#F4F7FA",
                        }}
                        className="p-2 d-flex align-items-center justify-content-center rounded-circle cursor-pointer"
                      >
                        <FilterSvg />
                      </span>
                    </div> */}
                  </div>
                </div>}
              </div>
            </div>

            <div className="card-body">
              <div className="row g-3">
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-3">
                  <div className="search-box">
                    <TextInput
                      name="search"
                      value={filterState.search}
                      onChange={onChangeFilterHndlr}
                      // inputClassName="bg-soft-light"
                      formgroupClassName="mb-0"
                      placeHolder="Search"
                      labelText='Search'
                      floatingLabel

                    />

                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>

                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="academicYearId"
                    value={filterState.academicYearId}
                    onChange={onChangeFilterHndlr}
                    menuItems={academicYearListResp?.data}
                    formgroupClassName="mb-0"
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    labelText='Academic Year'
                    floatingLabel
                  />
                </div>

                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="curriculumId"
                    value={filterState.curriculumId}
                    onChange={onChangeFilterHndlr}
                    menuItems={brchCurriculumResp?.data}
                    formgroupClassName="mb-0"
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    labelText='Curriculum'
                    floatingLabel
                  />
                </div>

                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="feeParticularId"
                    value={filterState.feeParticularId}
                    onChange={onChangeFilterHndlr}
                    menuItems={feeParticularsResp?.data}
                    valueKey="id"
                    textKey="particularName"
                    // inputClassName="bg-light border-0"
                    formgroupClassName="mb-0"
                    labelText='Fee Name'
                    floatingLabel
                  />
                </div>

                {/* <div className="col-auto ms-auto">
                    <button
                      className="btn button-info float-end d-flex align-items-center"
                      //   onClick={moveToNewFeeReceiptHandler}
                    >
                      Apply Fillters
                    </button>
                  </div> */}
              </div>
            </div>

            <TableContainer
              columns={feeStructureColumns || []}
              data={Array.isArray(feeStructureList) ? feeStructureList : []}
              divClass="table-responsive mb-3"
              theadClass="table-light text-muted align-middle"
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
        id="add-fee-structure"
        isOpen={feeStructureModalState.showModal}
        toggle={toggleFeeStructureModal}
        modalTitle={feeStructureModalState.feeStructureId ? "Update Fee Structure" : "Add Fee Structure"}
        modalSize="lg"
      >
        <FeeStructureModal
          isOpen={feeStructureModalState.showModal}
          toggle={toggleFeeStructureModal}
          instituteId={instituteId}
          branchId={branchId}
          feeStructureId={feeStructureModalState.feeStructureId}
          editFeeStructureDetails={feeStructureModalState.modalData}
        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-fee-structure"
        isOpen={delFeeStructureModalState.showModal}
        confirmMessage="Are you sure you want to delete this special structure?"
        cancelHndlr={delModalCancelHndlr}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        iconType="reject"
        isDisble={showApiLoader}
      />
    </>
  );
};

export default FeeStructure;
