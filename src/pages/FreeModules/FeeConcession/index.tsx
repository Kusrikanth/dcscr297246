import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Card, CardHeader, CardBody, Row, Col, Input, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { shallowEqual } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
//Common Component
import TableContainer from "../../../Components/Common/TableContainer";
import { ConfirmationModal, TextIconInput, SelectInput, ModalContainerUpdated } from "../../../Components/Common";
//Helper
import { generateColumns, academicTermTableData } from "./helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Modal Component
import AddEditFeeConcession from "./AddEditFeeConcession";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { getInstAcademicTermAct, deleteInstAcademicTermAct, getInstTermAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { getMasterTermTypesAct } from "../../../store/masterdata/masterdataactions";
import { getFeeConcessionsAct, deleteFeeConcessionAct, getFeeCategoriesAct } from "../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";

//Interface & Types
import { IPaginationState } from "../../../Components/Common/Pagination";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
//Common Utility
import { getSortingKeys } from "../../../utility/commonutility";

import { concessionOptions } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../Components/Common/Button";
import { useFormik } from "formik";
import * as Yup from "yup";

const initialValues = {
    branchId: "",
    feeCategoryId: "",
}
const validationSchema = Yup.object().shape({
  branchId: Yup.string().required("Branch required."),
});
const FeeConcession: React.FC<any> = () => {
    const [feeConcessionModalState, setFeeConcessionModalState] = useState<any>({
        showModal: false,
        feeConcessionId: undefined, modalData: undefined
    });
    const [delFeeConcessionModalState, setDelFeeConcessionModalState] = useState<any>({
        showModal: false,
        feeConcessionId: ""
    });
    // const [filterState, setFilterState] = useState<any>({
    //     search: undefined,
    //     branchId: undefined,
    //     feeCategoryId: undefined,
    // });
    const [branchState, setBranchState] = useState<any>([]);
    const sortingDetailRef = useRef<any>(undefined);
    const paginationDetailRef = useRef<any>({
        pageNo: 0,
        pageSize: 10,
    });

    const dispatch = useAppDispatch();
    const { currentInstIdResp: instituteId, currentBranchIdResp: branchId, feeConcessionsResp, deleteFeeConcessionResp, masterTermTypesResp, feeCategoriesResp, masterFeeSettingsErrorResp, loggedInUserRole, branchListResp, virtualRoleResp } =
        useAppSelector(({ appData, masterFeeSettings, masterData, branch }) => ({
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            masterTermTypesResp: masterData.masterTermTypesResp,
            feeCategoriesResp: masterFeeSettings.feeCategoriesResp,
            feeConcessionsResp: masterFeeSettings.feeConcessionsResp,
            deleteFeeConcessionResp: masterFeeSettings.deleteFeeConcessionResp,
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

    const termsRespRef = useRef<any>({
        prevDeleteFeeConcessionResp: deleteFeeConcessionResp,
        prevMasterFeeSettingsErrorResp: masterFeeSettingsErrorResp
    });

    useEffect(() => {
        if (instituteId) {
            getFeeConcessionApiCall();
            const payload = {
                instituteId,
                pageNo: 0,
                pageSize: 100
            };
            dispatch(getFeeCategoriesAct(generateActionPayload("get_fee_categories", undefined, payload)));
        }
    }, [instituteId]);
    useEffect(() => {
        if (branchListResp) {
          setBranchState(branchListResp?.data.filter((branch: any) => branch.branchId != branchId))
        }
      }, [branchListResp])

    useEffect(() => {
        const { prevDeleteFeeConcessionResp, prevMasterFeeSettingsErrorResp } = termsRespRef.current;
        if (deleteFeeConcessionResp && deleteFeeConcessionResp !== prevDeleteFeeConcessionResp) {
            setDelFeeConcessionModalState((prevState: any) => ({ ...prevState, showModal: false, feeConcessionId: "" }));
            getFeeConcessionApiCall(feeConcessionForm.values);
            toast.success("Fee concession deleted successfully.")
        }
        else if (masterFeeSettingsErrorResp && masterFeeSettingsErrorResp !== prevMasterFeeSettingsErrorResp) {
            const { details }: any = masterFeeSettingsErrorResp;
            toast.error(details);
        }
        termsRespRef.current.prevDeleteFeeConcessionResp = deleteFeeConcessionResp;
        termsRespRef.current.prevMasterFeeSettingsErrorResp = masterFeeSettingsErrorResp;
    }, [deleteFeeConcessionResp, masterFeeSettingsErrorResp]);

    function addFeeConcessionHndlr() {
         if (showInstituteAdminUI && !feeConcessionForm.values.branchId) {
    feeConcessionForm.setFieldTouched("branchId", true, true);
    return;
  }
        setFeeConcessionModalState((prevState: any) => ({ ...prevState, showModal: true, feeConcessionId: undefined, modalData: undefined }))
    }
    const toggleConcessionModalHndlr = useCallback((apiCall?: boolean) => {
        setFeeConcessionModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
        if (typeof (apiCall) === "boolean" && apiCall) {
            getFeeConcessionApiCall();
        }
    }, [feeConcessionsResp]);

    function editFeeConcessionHndlr(event: any) {
        const feeConcessionId = event.currentTarget.getAttribute("data-id");
        let modalData: any = feeConcessionsResp?.data.find((item: any) => item.id === +feeConcessionId);
        if (modalData) {
            setFeeConcessionModalState((prevState: any) => ({ ...prevState, showModal: true, feeConcessionId, modalData }))
        }
    }

    function deleteFeeConcessionHndlr(event: any) {
        const feeConcessionId: string = event.currentTarget.getAttribute("data-id");
        if (feeConcessionId)
            setDelFeeConcessionModalState((prevState: any) => ({ ...prevState, showModal: true, feeConcessionId }));
    }

    const menuOptions = useMemo((): IOptionsHrtl[] => ([
        {
            id: "edit",
            actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={18} />,
            actionName: "Edit",
            onClickHndlr: editFeeConcessionHndlr,
        },
        {
            id: "delete",
            actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
            actionName: "Delete",
            onClickHndlr: deleteFeeConcessionHndlr
        }]), [feeConcessionsResp]);


    function getFeeConcessionApiCall(otherProps?: any) {
        const sortingParams = getSortingKeys(sortingDetailRef.current);
        const payload = {
            branchId,
            ...otherProps,
            ...paginationDetailRef.current,
            ...sortingParams
        };
        dispatch(getFeeConcessionsAct(generateActionPayload("get_fee_concession", undefined, payload)));
    }

    function delModalCancelHndlr() {
        setDelFeeConcessionModalState((prevState: any) => ({ ...prevState, showModal: false, feeConcessionId: "" }));
    }

    function delModalSubmitHndlr() {
        const { feeConcessionId } = delFeeConcessionModalState;
        dispatch(deleteFeeConcessionAct(generateActionPayload("delete_fee_concession", { feeConcessionId })));
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        paginationDetailRef.current = paginationInfo;
        getFeeConcessionApiCall();
    }

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        feeConcessionForm.setValues((prevState: any) => ({ ...prevState, [name]: value }));
        getFeeConcessionApiCall({ [name]: value });
    }

    function sortingHandler(sortingKeys: any) {
        if (sortingDetailRef.current && sortingDetailRef.current !== sortingKeys) {
            sortingDetailRef.current = sortingKeys;
            getFeeConcessionApiCall();
            //Testing
        } else {
            sortingDetailRef.current = sortingKeys;
        }
    }

    const feeConcessionColumns = useMemo(() => {
        const { pageNo, pageSize } = paginationDetailRef.current,
            offset = pageNo * pageSize;
        const newColumns = generateColumns(menuOptions, offset)
        if (showInstituteAdminUI) {
            return newColumns
        } else {
           return newColumns.filter(item => item?.accessor !== "branchName")
        }
    }, [feeConcessionsResp]);

    const { data: concessionList, pageNumber, totalPages, totalElements } = feeConcessionsResp || {};
    return (
        <React.Fragment>
             <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Fee Structure" pageTitle="Fee" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
                        <div className="tw-p-4 tw-border-b">
                            <div className="tw-flex tw-grid-cols-12 tw-items-center">

                                <div className="tw-col-span-4 tw-flex tw-items-center">
                                    <h4 className="tw-text-lg tw-font-semibold tw-mr-5">
                                        Fee Concession
                                    </h4>
                                </div>

                                <div className=" tw-ml-auto">
                                    <Button
                                        variant="primary"
                                        onClick={addFeeConcessionHndlr}
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

                                    <div className="tw-col-span-5">
                                        <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                                            <div className="tw-col-span-6 sm:tw-col-span-3 lg:tw-col-span-6">
                                                <SelectInput
                                                    name="feeCategoryId"
                                                    value={feeConcessionForm.values.feeCategoryId}
                                                    onChange={onChangeFilterHndlr}
                                                    menuItems={feeCategoriesResp?.feeCategoryVOList}
                                                    formgroupClassName="mb-0"
                                                    valueKey="id"
                                                    textKey="name"
                                                    labelText="Fee Category"
                                                    floatingLabel
                                                />
                                            </div>
                                            {showInstituteAdminUI && (
                                                <div className="tw-col-span-6">
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
                                            
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <TableContainer
                                columns={feeConcessionColumns || []}
                                data={Array.isArray(concessionList) ? concessionList : []}
                                divClass="tw-overflow-x-auto tw-mb-3"
                                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
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
                id="add-branch-modal"
                modalSize="lg"
                modalTitle={feeConcessionModalState.feeConcessionId ? "Edit Fee Concession" : "Add Fee Concession"}
                isOpen={feeConcessionModalState.showModal}
                toggle={toggleConcessionModalHndlr}
            >
                <AddEditFeeConcession
                    formId="add-terms"
                    instituteId={instituteId}
                    branchId={branchId || feeConcessionForm.values.branchId}
                    feeConcessionId={feeConcessionModalState.feeConcessionId}
                    editModalData={feeConcessionModalState.modalData}
                    toggle={toggleConcessionModalHndlr}
                />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-inst-academic-terms"
                isOpen={delFeeConcessionModalState.showModal}
                confirmMessage="Are you sure you want to delete this fee concession?"
                cancelHndlr={delModalCancelHndlr}
                confirmHndlr={delModalSubmitHndlr}
            />
            <ToastContainer />
        </React.Fragment >
    )
}

export default FeeConcession;