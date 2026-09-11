import { useFormik } from "formik";
import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { TextInput, ConfirmationModal, ModalContainerUpdated, SelectInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";

import AddSpecialFeeModal from "./AddFeeFineModal";
import {
  admissionTypeOptions,
  generateColumns,
} from "./helper";
import { toast } from "react-toastify";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { getFeeFinesAct, deleteFeeFineAct } from "../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";

import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
//Common Utility
import { getSortingKeys } from "../../../utility/commonutility";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../Components/Common/Button";
import * as Yup from "yup";

const initialValues: any = {
    name: "",
    branchId: "",
    academicYearId: "",
    admissionTypesForFines: "",
};

const validationSchema = Yup.object().shape({
  branchId: Yup.string().required("Branch required."),
});


const FeeFines: React.FC<any> = () => {
  const [addFinesModalState, setAddFinesModalState] =
    useState({
      showModal: false,
      feeFineId: "",
      modalData: undefined,
    });
  const [delFeeDetailsModalState, setDelFeeFineModalState] = useState({
    showModal: false,
    feeFineId: ""
  });
  const [branchState, setBranchState] = useState<any>([]);
  const paginationDetailRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });
  const sortingDetailRef = useRef(undefined);

  const dispatch = useAppDispatch();
  const { feeFinesResp, deleteFeeFineResp,
    currentInstIdResp: instituteId, showApiLoader, academicYearListResp, currentBranchIdResp: branchId,
    masterFeeSettingsErrorResp, loggedInUserRole, branchListResp, virtualRoleResp } =
    useAppSelector(({ appData, instAcademics, globalData, masterFeeSettings, branch }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      feeFinesResp: masterFeeSettings.feeFinesResp,
      deleteFeeFineResp: masterFeeSettings.deleteFeeFineResp,
      masterFeeSettingsErrorResp: masterFeeSettings.masterFeeSettingsErrorResp,
      loggedInUserRole: appData.loggedInUserRole,
      branchListResp: branch.branchListResp,
      virtualRoleResp: appData.virtualRoleResp
    }), shallowEqual);
    
  const showInstituteAdminUI = loggedInUserRole === 'INSTITUTE_ADMIN' && !virtualRoleResp;

  const feeConcessionForm = useFormik({
                  initialValues,
                  validationSchema,
                  onSubmit: (values) => {
                    
                  },
                });

  const feeDetailsRespRef = useRef<any>({
    prevDeleteFeeFineResp: deleteFeeFineResp,
    prevMasterFeeSettingsErrorResp: masterFeeSettingsErrorResp
  });

  useEffect(() => {
    const { prevDeleteFeeFineResp, prevMasterFeeSettingsErrorResp } = feeDetailsRespRef.current;
    if (deleteFeeFineResp && prevDeleteFeeFineResp !== deleteFeeFineResp) {
      setDelFeeFineModalState((prevState: any) => ({ ...prevState, showModal: false, feeFineId: "" }));
      getFeeFinesApiCall();
      toast.success("Fee fine deleted successfully.");
    } else if (masterFeeSettingsErrorResp && masterFeeSettingsErrorResp !== prevMasterFeeSettingsErrorResp) {
      const { details, message }: any = masterFeeSettingsErrorResp;
      toast.error(details || message || "Something went wrong.");
    }
    feeDetailsRespRef.current.prevDeleteFeeFineResp = deleteFeeFineResp;
    feeDetailsRespRef.current.prevMasterFeeSettingsErrorResp = masterFeeSettingsErrorResp;
  }, [deleteFeeFineResp, masterFeeSettingsErrorResp]);

  // useEffect(() => {
  //   getFeeFinesApiCall();
  // }, []);

  useEffect(() => {
    if (!instituteId) return;
    if (!academicYearListResp) {
      const payload = { instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
      dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
    } else {
      const { data } = academicYearListResp || {};
      if (Array.isArray(data)) {
        const yearId = data.find(
          (year: any) => year.yearStatus === "CURRENT"
        )?.academicYearId;

        if (yearId) {
          feeConcessionForm.setFieldValue("academicYearId", yearId);
        }
      }
    }
  }, [instituteId, academicYearListResp]);
  useEffect(() => {
    if (!branchListResp || !showInstituteAdminUI) return;

    const branch = branchListResp?.data?.[0];

    if (branch?.branchId) {
      setBranchState(
        branchListResp.data.filter(
          (b: any) => b.branchId !== branchId
        )
      );
      feeConcessionForm.setFieldValue("branchId", branch.branchId);
    }
  }, [branchListResp, showInstituteAdminUI]);

  useEffect(() => {
  const { academicYearId } = feeConcessionForm.values;

  if (!academicYearId) return;

  if (showInstituteAdminUI && !feeConcessionForm.values.branchId) return;

  getFeeFinesApiCall({
    academicYearId,
    branchId: showInstituteAdminUI ? feeConcessionForm.values.branchId : branchId,
  });

}, [feeConcessionForm.values.academicYearId, feeConcessionForm.values.branchId, showInstituteAdminUI, branchId]);

  const toggleFeeFineModal = useCallback((apiCall?: boolean) => {
    setAddFinesModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
    if (typeof (apiCall) === "boolean" && apiCall) {
      getFeeFinesApiCall();
    }
  }, [instituteId, feeFinesResp]);



  function addFeeFineHndlr() {
     if (showInstituteAdminUI && !feeConcessionForm.values.branchId) {
    feeConcessionForm.setFieldTouched("branchId", true, true);
    return;
  }
    setAddFinesModalState((prevState: any) => ({
      ...prevState, showModal: true,
      feeFineId: "", modalData: undefined
    }));
  }

  function editFeeFineHndlr(event: any) {
    const feeFineId = event.currentTarget.getAttribute("data-id"),
      modalData: any = feeFinesResp?.feeFineList?.find((item: any) => item.id === Number(feeFineId));
    if (modalData) {
      setAddFinesModalState((prevState: any) => ({ ...prevState, showModal: true, feeFineId, modalData }));
    }
  }

  function deleteFeeFineHndlr(event: any) {
    const feeFineId = event.currentTarget.getAttribute("data-id");
    if (feeFineId)
      setDelFeeFineModalState((prevState: any) => ({ ...prevState, showModal: true, feeFineId }));
  }

  const menuOptions = useMemo((): IOptionsHrtl[] => ([{
    id: "edit",
    actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={18}/>,
    actionName: "Edit",
    onClickHndlr: editFeeFineHndlr,
  }, {
    id: "delete",
    actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="me-2 text-danger" size={18}/>,
    actionName: "Delete",
    onClickHndlr: deleteFeeFineHndlr
  }]), [feeFinesResp]);

  function delModalCancelHndlr() {
    setDelFeeFineModalState((prevState: any) => ({ ...prevState, showModal: false }));
  }
  function delModalSubmitHndlr() {
    const { feeFineId } = delFeeDetailsModalState;
    dispatch(deleteFeeFineAct(generateActionPayload("delete_fee_fine", { feeFineId })));
  }

  function paginationHndlr(paginationInfo: any) {
    paginationDetailRef.current = paginationInfo;
    getFeeFinesApiCall(paginationInfo);
  }

  function getFeeFinesApiCall(otherProps?: any) {
    const sortingParams = getSortingKeys(sortingDetailRef.current);
    const payload = { instituteId, branchId: branchId || feeConcessionForm.values.branchId, academicYearId: feeConcessionForm.values.academicYearId, ...otherProps, ...sortingParams };
    dispatch(getFeeFinesAct(generateActionPayload("get_fee_fines", undefined, payload)));
  }

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    feeConcessionForm.setValues((prevState: any) => ({ ...prevState, [name]: value }));
    getFeeFinesApiCall({ [name]: value });
  }

  function onChangeAcademicYearHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    feeConcessionForm.setValues((prevState: any) => ({ ...prevState, [name]: value }));
    getFeeFinesApiCall({ [name]: value });
  }


  function sortingHandler(sortingKeys: any) {
    if (sortingDetailRef.current && sortingDetailRef.current !== sortingKeys) {
      sortingDetailRef.current = sortingKeys;
      getFeeFinesApiCall();
      //Testing
    } else {
      sortingDetailRef.current = sortingKeys;
    }
  }

  const feeParticularColumns = useMemo(() => {
    const { pageNo, pageSize } = paginationDetailRef.current,
      offset = pageNo * pageSize;
    const newColumns = generateColumns(menuOptions, offset)
    if (showInstituteAdminUI) {
            return newColumns
        } else {
           return newColumns.filter(item => item?.accessor !== "branchName")
        }
  }, [feeFinesResp]),
    { feeFineList, pageNumber, totalPages, totalElements } = feeFinesResp || {};
  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Fines" pageTitle="Fee" />

          <div className="tw-bg-white tw-rounded tw-shadow">

            <div className="tw-py-2 tw-px-4 tw-border-b">
              <div className="tw-flex tw-grid-cols-12 tw-items-center">

                <div className="tw-col-span-6">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Fines
                  </h4>
                </div>

                <div className="tw-col-span-auto tw-ml-auto">
                  <Button
                  variant="primary"
                    onClick={addFeeFineHndlr}
                  >
                    <i className="ri-add-line" />
                    Add New
                  </Button>
                </div>

              </div>
            </div>

            <div className="tw-p-0">

              <div className="tw-py-3 tw-px-3">
                <div className="tw-grid tw-grid-cols-12 tw-gap-3">

                  <div className="tw-col-span-12 lg:tw-col-span-4">
                    <div className="tw-relative search-box">
                      <TextInput
                        name="name"
                        value={feeConcessionForm.values.name}
                        onChange={onChangeFilterHndlr}
                        formgroupClassName="mb-0"
                        placeHolder="Search"
                        labelText="Search"
                        floatingLabel
                      />
                      <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400" />
                    </div>
                  </div>

                  <div className="tw-col-span-12 lg:tw-col-span-2">
                    <SelectInput
                      name="academicYearId"
                      value={feeConcessionForm.values.academicYearId}
                      onChange={onChangeAcademicYearHndlr}
                      menuItems={academicYearListResp?.data}
                      valueKey="academicYearId"
                      textKey="academicYearName"
                      formgroupClassName="mb-0"
                      labelText="Academic Year"
                      floatingLabel
                    />
                  </div>

                  {showInstituteAdminUI && (
                    <div className="tw-col-span-2">
                      <SelectInput
                        name="branchId"
                        valueKey="branchId"
                        textKey="branchName"
                        value={feeConcessionForm.values.branchId}
                        menuItems={branchState}
                        onChange={onChangeFilterHndlr}
                        labelText="Branch Name"
                        floatingLabel
                        formgroupClassName="tw-mb-0"
                        invalid={!!(feeConcessionForm.touched.branchId && feeConcessionForm.errors.branchId)}
                        error={feeConcessionForm.touched.branchId ? feeConcessionForm.errors.branchId : ""}
                      />
                    </div>
                  )}
                  <div className="tw-col-span-12 lg:tw-col-span-2">
                    <SelectInput
                      name="admissionTypesForFines"
                      value={feeConcessionForm.values.admissionTypesForFines}
                      onChange={onChangeAcademicYearHndlr}
                      menuItems={admissionTypeOptions}
                      valueKey="id"
                      textKey="name"
                      formgroupClassName="mb-0"
                      labelText="Admission Type"
                      floatingLabel
                    />
                  </div>
                </div>
              </div>

              <TableContainer
                columns={feeParticularColumns || []}
                data={Array.isArray(feeFineList) ? feeFineList : []}
                divClass="tw-overflow-x-auto tw-mb-1"
                tableClass="tw-whitespace-nowrap"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                showPagination={false}
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
        id="add-fine-modal"
        isOpen={addFinesModalState.showModal}
        toggle={toggleFeeFineModal}
        modalTitle={addFinesModalState.feeFineId ? "Update Fine" : "Create Fine"}
        modalSize="md"
      >
        <AddSpecialFeeModal
          toggle={toggleFeeFineModal}
          instituteId={instituteId}
          branchId={branchId || feeConcessionForm.values.branchId}
          feeFineId={addFinesModalState.feeFineId}
          editFeeFineDetails={addFinesModalState.modalData}
        />
      </ModalContainerUpdated>

      <ConfirmationModal
        id="delete-feename-modal"
        isOpen={delFeeDetailsModalState.showModal}
        confirmMessage="Are you sure you want to delete this fee fine?"
        cancelHndlr={delModalCancelHndlr}
        confirmHndlr={delModalSubmitHndlr}
      />
    </>
  );
};

export default FeeFines;

