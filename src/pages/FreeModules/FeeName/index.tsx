import { useFormik } from "formik";
import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { SelectInput, TextInput, ConfirmationModal, ModalContainerUpdated } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import FeeNameModal from "./FeeNameModal";
import {
  generateColumns,
} from "./helper";
import { toast } from "react-toastify";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { getFeeParticularsAct, deleteFeeParticularAct } from "../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";
import { getFeeCategoriesAct } from "../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";

import {
  getBranchCurriculumAct,
  resetBrchCurriculumAct
} from "../../../store/branchsettings/branchacademics/branchacademicsactions";
//Types
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
//Common Utility
import { getSortingKeys } from "../../../utility/commonutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../Components/Common/Button";
import * as Yup from "yup";

const initialValues: any = {
     name: "",
    branchId: "",
    curriculumId: "",
    feeCategoryId: "",
    academicYearId: "",
}

const validationSchema = Yup.object().shape({
  branchId: Yup.string().required("Branch required."),
});
const FeeDetails: React.FC<any> = () => {

  const [addFeeDetailsModalState, setAddFeeDetailsModalState] =
    useState<any>({
      showModal: false,
      feeParticularId: "",
      modalData: undefined,
    });
  const [delFeeDetailsModalState, setDelFeeDetailsModalState] = useState<any>({
    showModal: false,
    feeParticularId: ""
  });

  const [branchState, setBranchState] = useState<any>([]);
  
  const paginationDetailRef = useRef<any>({
    pageNo: 0,
    pageSize: 10,
  });
  const sortingDetailRef = useRef<any>(undefined);

  const dispatch = useAppDispatch();
  const { feeParticularsResp, deleteFeeParticularResp,
    brchCurriculumResp, feeCategoriesResp,
    currentInstIdResp: instituteId, currentBranchIdResp: branchId,
    masterFeeSettingsErrorResp, academicYearListResp, loggedInUserRole, branchListResp, virtualRoleResp } =
    useAppSelector(({ appData, instAcademics, branchAcademics, masterFeeSettings, instFeeSettings, branch }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      feeCategoriesResp: masterFeeSettings.feeCategoriesResp,
      feeParticularsResp: masterFeeSettings.feeParticularsResp,
      deleteFeeParticularResp: masterFeeSettings.deleteFeeParticularResp,
      masterFeeSettingsErrorResp: masterFeeSettings.masterFeeSettingsErrorResp,
      loggedInUserRole: appData.loggedInUserRole,
      branchListResp: branch.branchListResp,
      virtualRoleResp: appData.virtualRoleResp
    }), shallowEqual);
    
    
  const showInstituteAdminUI = loggedInUserRole === 'INSTITUTE_ADMIN' && !virtualRoleResp;

  const feeDetailsRespRef = useRef<any>({
    prevBrchCurriculumResp: brchCurriculumResp,
    prevDeleteFeeParticularResp: deleteFeeParticularResp,
    prevMasterFeeSettingsErrorResp: masterFeeSettingsErrorResp
  });

  const feeNameModalForm = useFormik({
      initialValues,
      validationSchema,
      onSubmit: (values) => {
        
      },
    });

  useEffect(() => {
    const { prevBrchCurriculumResp, prevDeleteFeeParticularResp, prevMasterFeeSettingsErrorResp } = feeDetailsRespRef.current;
    if (brchCurriculumResp && prevBrchCurriculumResp !== brchCurriculumResp) {
      const { branchCurriculumId } = brchCurriculumResp?.data[0] || {};
      if (branchCurriculumId) {
        feeNameModalForm.setValues((prevState: any) => ({ ...prevState, curriculumId: branchCurriculumId }));
        getFeeParticularApiCall({ curriculumId: branchCurriculumId });
      }
    }
    else if (deleteFeeParticularResp && prevDeleteFeeParticularResp !== deleteFeeParticularResp) {
      setDelFeeDetailsModalState((prevState: any) => ({ ...prevState, showModal: false, feeParticularId: "" }));
      paginationDetailRef.current.pageNo = 0;
      getFeeParticularApiCall();
      toast.success("Fee particular deleted successfully.");
    } else if (masterFeeSettingsErrorResp && masterFeeSettingsErrorResp !== prevMasterFeeSettingsErrorResp) {
      const { message }: any = masterFeeSettingsErrorResp;
      toast.error(message || "Something went wrong.");
    }
    feeDetailsRespRef.current.prevBrchCurriculumResp = brchCurriculumResp;
    feeDetailsRespRef.current.prevDeleteFeeParticularResp = deleteFeeParticularResp;
    feeDetailsRespRef.current.prevMasterFeeSettingsErrorResp = masterFeeSettingsErrorResp;
  }, [brchCurriculumResp, deleteFeeParticularResp, masterFeeSettingsErrorResp]);

  useEffect(() => {
    if (instituteId) {
      const params = {
        instituteId, pageNo: 0, pageSize: 100
      };
      dispatch(getFeeCategoriesAct(generateActionPayload("get_fee_categories", undefined, params)));
    }
  }, [branchId, instituteId]);

  useEffect(() => {
    if (academicYearListResp && !showInstituteAdminUI) {
      const { academicYearId }: any = academicYearListResp?.data.find((item: any) => item.yearStatus === "CURRENT") || {};
      feeNameModalForm.setFieldValue("academicYearId", academicYearId);
      getCurriculumApiCall({ academicYearId })
    }
    else if (academicYearListResp && showInstituteAdminUI) {
      const { academicYearId }: any = academicYearListResp?.data.find((item: any) => item.yearStatus === "CURRENT") || {};
      feeNameModalForm.setFieldValue("academicYearId", academicYearId);
      
    }
  }, [academicYearListResp]);

  useEffect(() => {
          if (branchListResp && showInstituteAdminUI) {
              const branch = branchListResp?.data[0];
            setBranchState(branchListResp?.data.filter((branch: any) => branch.branchId != branchId))
            feeNameModalForm.setFieldValue("branchId", branch.branchId);
            getCurriculumApiCall({ branchId: branch.branchId });
            getFeeParticularApiCall({ branchId: branch.branchId });
          }
      }, [branchListResp, showInstituteAdminUI]);
  

  const toggleFeeDetailsModal = useCallback((apiCall?: boolean) => {
    setAddFeeDetailsModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
    if (typeof (apiCall) === "boolean" && apiCall) {
      getFeeParticularApiCall();
    }
  }, [instituteId, feeParticularsResp]);

  function addFeeNameModalHndlr() {
    if (showInstituteAdminUI && !feeNameModalForm.values.branchId) {
    feeNameModalForm.setFieldTouched("branchId", true, true);
    return;
  }
    setAddFeeDetailsModalState((prevState: any) => ({
      ...prevState, showModal: true,
      feeParticularId: "", modalData: undefined
    }));
  }

  function editFeeDetailsHndlr(event: any) {
    const feeParticularId = event.currentTarget.getAttribute("data-id"),
      modalData: any = feeParticularsResp?.data.find((item: any) => item.id === Number(feeParticularId));
    if (modalData) {
      setAddFeeDetailsModalState((prevState: any) => ({ ...prevState, showModal: true, feeParticularId, modalData }));
    }
  }

  function deleteFeeDetailsHndlr(event: any) {
    const feeParticularId = event.currentTarget.getAttribute("data-id");
    if (feeParticularId)
      setDelFeeDetailsModalState((prevState: any) => ({ ...prevState, showModal: true, feeParticularId }));
  }

  const menuOptions = useMemo((): IOptionsHrtl[] => ([{
    id: "edit",
    actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={18} />,
    actionName: "Edit",
    onClickHndlr: editFeeDetailsHndlr,
  }, {
    id: "delete",
    actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
    actionName: "Delete",
    onClickHndlr: deleteFeeDetailsHndlr
  }]), [feeParticularsResp]);

  function delModalCancelHndlr() {
    setDelFeeDetailsModalState((prevState: any) => ({ ...prevState, showModal: false }));
  }
  function delModalSubmitHndlr() {
    const { feeParticularId } = delFeeDetailsModalState;
    dispatch(deleteFeeParticularAct(generateActionPayload("delete_fee_particular", { feeParticularId })));
  }

  function paginationHndlr(paginationInfo: any) {
    paginationDetailRef.current = paginationInfo;
    getFeeParticularApiCall(paginationInfo);
  }

  function getFeeParticularApiCall(otherProps?: any) {
    const sortingParams = getSortingKeys(sortingDetailRef.current);
    const payload = { instituteId, branchId: branchId || feeNameModalForm.values.branchId, ...otherProps, ...paginationDetailRef.current, ...sortingParams };
    delete payload.academicYearId
    dispatch(getFeeParticularsAct(generateActionPayload("get_fee_particulars", undefined, payload)));
  }
  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: feeNameModalForm.values.academicYearId, branchId: showInstituteAdminUI ? feeNameModalForm.values.branchId : branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }
  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    //Resetting the page on applying filter
    paginationDetailRef.current.pageNo = 0;
    if (name === "academicYearId") {
      feeNameModalForm.setValues((prev: any) => ({ ...prev, [name]: value, curriculumId: "", feeParticularId: "" }));
      getCurriculumApiCall({ academicYearId: value });
    } 
    else if(name === "branchId") {
      if(value){
          feeNameModalForm.setValues((prev: any) => ({ ...prev, [name]: value, curriculumId: "", feeParticularId: "" }));
          getCurriculumApiCall({ branchId: value });
          
      }
      else{
          feeNameModalForm.setValues((prev: any) => ({ ...prev, [name]: value, curriculumId: "", feeParticularId: "" }));
          dispatch(resetBrchCurriculumAct(undefined));
      }
    }
    else {
      feeNameModalForm.setValues((prevState: any) => ({ ...prevState, [name]: value }));
      getFeeParticularApiCall({ [name]: value });
    }
  }

  function sortingHandler(sortingKeys: any) {
    if (sortingDetailRef.current && sortingDetailRef.current !== sortingKeys) {
      sortingDetailRef.current = sortingKeys;
      getFeeParticularApiCall();
      //Testing
    } else {
      sortingDetailRef.current = sortingKeys;
    }
  }

  const feeParticularColumns = useMemo(() => {
    const { pageNo, pageSize } = paginationDetailRef.current,
      offset = pageNo * pageSize;
    const newColumns = generateColumns(menuOptions, offset);

    if (showInstituteAdminUI) {
            return newColumns
        } else {
           return newColumns.filter(item => item?.accessor !== "branchName")
        }
  }, [feeParticularsResp]),
    { data: feeParticularsList, pageNumber, totalPages, totalElements } = feeParticularsResp || {},
    { feeCategoryVOList: categoryList } = feeCategoriesResp || {};
  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Fee Name" pageTitle="Fee" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center tw-justify-between">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                  Fee Particulars
                </h4>

                <Button
                  onClick={addFeeNameModalHndlr}
                  variant="primary"
                >
                  <i className="ri-add-line" />
                  Add New
                </Button>
              </div>
            </div>

            <div className="tw-p-0">
              <div className="tw-p-4">
                <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-4">

                  <div className="lg:tw-col-span-4">
                    <div className="tw-relative search-box">
                      <TextInput
                        name="name"
                        value={feeNameModalForm.values.name}
                        onChange={onChangeFilterHndlr}
                        formgroupClassName="tw-mb-0"
                        placeHolder="Search"
                        labelText="Search"
                        floatingLabel
                      />
                      <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400" />
                    </div>
                  </div>

                  <div className="lg:tw-col-span-2">
                    <SelectInput
                      name="academicYearId"
                      value={feeNameModalForm.values.academicYearId}
                      onChange={onChangeFilterHndlr}
                      menuItems={academicYearListResp?.data}
                      valueKey="academicYearId"
                      textKey="academicYearName"
                      formgroupClassName="tw-mb-0"
                      labelText="Academic Year"
                      floatingLabel
                    />
                  </div>

                  {showInstituteAdminUI && (
                    <div className="lg:tw-col-span-2">
                      <SelectInput
                        name="branchId"
                        valueKey="branchId"
                        textKey="branchName"
                        value={feeNameModalForm.values.branchId}
                        menuItems={branchState}
                        onChange={onChangeFilterHndlr}
                        labelText="Branch Name"
                        floatingLabel
                        formgroupClassName="tw-mb-0"
                        invalid={!!(feeNameModalForm.touched.branchId && feeNameModalForm.errors.branchId)}
                        error={feeNameModalForm.touched.branchId ? feeNameModalForm.errors.branchId : ""}
                      />
                    </div>
                  )}

                  <div className="lg:tw-col-span-2">
                    <SelectInput
                      name="curriculumId"
                      value={feeNameModalForm.values.curriculumId}
                      onChange={onChangeFilterHndlr}
                      menuItems={brchCurriculumResp?.data}
                      valueKey="branchCurriculumId"
                      textKey="curriculumName"
                      formgroupClassName="tw-mb-0"
                      labelText="Curriculum"
                      floatingLabel
                    />
                  </div>

                  <div className="lg:tw-col-span-2">
                    <SelectInput
                      name="feeCategoryId"
                      value={feeNameModalForm.values.feeCategoryId}
                      onChange={onChangeFilterHndlr}
                      menuItems={categoryList}
                      valueKey="id"
                      textKey="name"
                      formgroupClassName="tw-mb-0"
                      labelText="Fee Category"
                      floatingLabel
                    />
                  </div>

                </div>
              </div>

              <TableContainer
                columns={feeParticularColumns || []}
                data={Array.isArray(feeParticularsList) ? feeParticularsList : []}
                divClass="tw-overflow-x-auto tw-mb-3"
                tableClass="tw-w-full tw-border-collapse"
                theadClass="tw-bg-gray-100 tw-text-gray-600 tw-text-sm"
                showPagination={true}
                totalPages={totalPages}
                totalRecords={totalElements}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber}
                manualSorting={true}
                sortingHandler={sortingHandler}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="add-fee-perticular-modal"
        isOpen={addFeeDetailsModalState.showModal}
        toggle={toggleFeeDetailsModal}
        modalTitle={addFeeDetailsModalState.feeParticularId ? "Edit Fee Particulars" : "Add Fee Particulars"}
        modalSize="md"
      >
        <FeeNameModal
          isOpen={addFeeDetailsModalState.showModal}
          toggle={toggleFeeDetailsModal}
          modalTitle={addFeeDetailsModalState.feeParticularId ? "Edit Fee Particulars" : "Add Fee Particulars"}
          instituteId={instituteId}
          branchId={branchId || feeNameModalForm.values.branchId}
          feeParticularId={addFeeDetailsModalState.feeParticularId}
          editFeeDetails={addFeeDetailsModalState.modalData}
          academicYearId={feeNameModalForm.values.academicYearId}
          showInstituteAdminUI={showInstituteAdminUI}
          branchState={branchState}
        />
      </ModalContainerUpdated>

      <ConfirmationModal
        id="delete-feename-modal"
        isOpen={delFeeDetailsModalState.showModal}
        confirmMessage="Are you sure you want to delete this fee particular?"
        cancelHndlr={delModalCancelHndlr}
        confirmHndlr={delModalSubmitHndlr}
      />
    </>
  );
};

export default FeeDetails;

