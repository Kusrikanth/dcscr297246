import React, { useMemo, useEffect, useRef, useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import TableContainer from "../../../Components/Common/TableContainer";
import { ConfirmationModal, ModalContainerUpdated, SelectInput } from "../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getFeeConcessionTypeListAct, deleteFeeConcessionTypeAct } from "../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import AddEditFeeConcessionType from "./AddEditFeeConcessionType";
import { generateColumns } from "./helper";
import { useModal } from "../../../hooks/modalhook";
import Button from "../../../Components/Common/Button";
import { useFormik } from "formik";
import * as Yup from "yup";

const initialValues = {
    branchId: "",
}
const validationSchema = Yup.object().shape({
  branchId: Yup.string().required("Branch required."),
});

const FeeConcessionType: React.FC<any> = () => {
    const { closeModal: closeAddModalHnldr, openModal: openAddModalHnldr, modalState: addModalState } = useModal();
    const { closeModal: closeDelModalHnldr, openModal: openDelModalHnldr, modalState: delModalState } = useModal();
    const paginationDetailRef = useRef<any>({
        pageNo: 0,
        pageSize: 10,
    });
    // const [filterState, setFilterState] = useState<any>({
    //         branchId: ""  
    //       });
    const [branchState, setBranchState] = useState<any>([]);

    const dispatch = useAppDispatch();
    const { currentInstIdResp: instituteId, currentBranchIdResp: branchId, getFeeConcessionTypeListResp,  masterFeeSettingsErrorResp, addFeeConcessionTypeResp, updateFeeConcessionTypeResp, deleteFeeConcessionTypeResp, loggedInUserRole, branchListResp, virtualRoleResp } =
        useAppSelector(({ appData, masterFeeSettings, branch }) => ({
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            getFeeConcessionTypeListResp: masterFeeSettings.getFeeConcessionTypeListResp,
            masterFeeSettingsErrorResp: masterFeeSettings.masterFeeSettingsErrorResp,
            addFeeConcessionTypeResp: masterFeeSettings.addFeeConcessionTypeResp,
            updateFeeConcessionTypeResp: masterFeeSettings.updateFeeConcessionTypeResp,
            deleteFeeConcessionTypeResp: masterFeeSettings.deleteFeeConcessionTypeResp,
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
        prevDeleteFeeConcessionTypeResp: deleteFeeConcessionTypeResp,
        prevMasterFeeSettingsErrorResp: masterFeeSettingsErrorResp,
        prevAddFeeConcessionTypeResp: addFeeConcessionTypeResp,
        prevUpdateFeeConcessionTypeResp: updateFeeConcessionTypeResp
    });

    useEffect(() => {
        if (instituteId && branchId) {
            getFeeConcessionTypeApiCall();
        }
    }, [instituteId, branchId]);

    useEffect(() => {
        const { prevAddFeeConcessionTypeResp,prevDeleteFeeConcessionTypeResp, prevMasterFeeSettingsErrorResp ,prevUpdateFeeConcessionTypeResp} = termsRespRef.current;
        if (addFeeConcessionTypeResp && prevAddFeeConcessionTypeResp !== addFeeConcessionTypeResp) {
            closeAddModalHnldr();
            getFeeConcessionTypeApiCall();
            toast.success("Fee Concession Type added successfully.");
        }
        else  if (updateFeeConcessionTypeResp &&  prevUpdateFeeConcessionTypeResp!== updateFeeConcessionTypeResp) {
            closeAddModalHnldr();
            getFeeConcessionTypeApiCall();
            toast.success("Fee Concession Type Updated successfully.");
        }
        else if (deleteFeeConcessionTypeResp && deleteFeeConcessionTypeResp !== prevDeleteFeeConcessionTypeResp) {
            closeDelModalHnldr()
            getFeeConcessionTypeApiCall();
            toast.success("Fee concession type deleted successfully.")
        }
        else if (masterFeeSettingsErrorResp && masterFeeSettingsErrorResp !== prevMasterFeeSettingsErrorResp) {
            const { details } = masterFeeSettingsErrorResp;
            toast.error(details);
        }
        termsRespRef.current.prevDeleteFeeConcessionTypeResp = deleteFeeConcessionTypeResp;
        termsRespRef.current.prevMasterFeeSettingsErrorResp = masterFeeSettingsErrorResp;
        termsRespRef.current.prevAddFeeConcessionTypeResp = addFeeConcessionTypeResp;
        termsRespRef.current.prevUpdateFeeConcessionTypeResp = updateFeeConcessionTypeResp;
    }, [deleteFeeConcessionTypeResp, masterFeeSettingsErrorResp, addFeeConcessionTypeResp, updateFeeConcessionTypeResp]);


    useEffect(() => {
        if (branchListResp && showInstituteAdminUI) {
           const branch = branchListResp?.data[0];
            setBranchState(branchListResp?.data.filter((branch: any) => branch.branchId != branchId))
            feeConcessionForm.setFieldValue("branchId", branch.branchId);
            getFeeConcessionTypeApiCall({ branchId: branch.branchId });

        }
    }, [branchListResp, showInstituteAdminUI]);

    function editFeeConcessionHndlr(event: any) {
        const feeConcessionId = event.currentTarget.getAttribute("data-id");
        let modalData: any = getFeeConcessionTypeListResp?.data?.find((item: any) => item.id === +feeConcessionId);
        if (modalData) {
            openAddModalHnldr({feeConcessionId, modalData })
        }
    }

    function deleteFeeConcessionHndlr(event: any) {
        const feeConcessionId: string = event.currentTarget.getAttribute("data-id");
        if (feeConcessionId){
            openDelModalHnldr({ feeConcessionId });
        }
    }

     function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
            const { name, value } = event.target;
            feeConcessionForm.setValues((prevState: any) => ({ ...prevState, [name]: value }));
            getFeeConcessionTypeApiCall({ [name]: value });
          }

    const menuOptions = useMemo((): IOptionsHrtl[] => ([
        {
            id: "edit",
            actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={18}/>,
            actionName: "Edit",
            onClickHndlr: editFeeConcessionHndlr,
        },
        {
            id: "delete",
            actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18}/>,
            actionName: "Delete",
            onClickHndlr: deleteFeeConcessionHndlr
        }]), [getFeeConcessionTypeListResp]);


    function getFeeConcessionTypeApiCall(otherProps?: any) {
        const payload = {
            branchId: showInstituteAdminUI ? feeConcessionForm.values.branchId : branchId,
            ...paginationDetailRef.current,
            ...otherProps
        };
        dispatch(getFeeConcessionTypeListAct(generateActionPayload("get_fee_concession_type", undefined, payload)));
    }

    function delModalSubmitHndlr() {
        const { feeConcessionId } = delModalState.modalData;
        dispatch(deleteFeeConcessionTypeAct(generateActionPayload("delete_fee_concession_type", { id: feeConcessionId })));
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        paginationDetailRef.current = paginationInfo;
        getFeeConcessionTypeApiCall(paginationInfo);
    }
function openAddModal() {
         if (showInstituteAdminUI && !feeConcessionForm.values.branchId) {
    feeConcessionForm.setFieldTouched("branchId", true, true);
    return;
  }
  openAddModalHnldr();
    }

    const feeConcessionTypeColumns = useMemo(() => {
        const newColumns = generateColumns(menuOptions)
        if (showInstituteAdminUI) {
            return newColumns
        } else {
           return newColumns.filter(item => item?.accessor !== "branchName")
        }
    }, [getFeeConcessionTypeListResp]);

    const { data: concessionList, pageNumber, totalPages, totalElements } = getFeeConcessionTypeListResp || {};
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    <BreadCrumb
                        title="Fee Concession"
                        pageTitle="Fee"
                    />

                    <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-mt-4">

                        <div className="tw-border-b tw-border-gray-200 tw-px-6 tw-py-4">
                            <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-items-center md:tw-justify-between tw-gap-4">

                                <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                                    Fee Concession Type
                                </h4>

                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={openAddModal}
                                >
                                    <i className="ri-add-line tw-mr-2"></i>
                                    Add New
                                </Button>

                            </div>
                        </div>

                                {showInstituteAdminUI && (
                        <div className="tw-p-4">
                            <div className="tw-grid tw-grid-cols-12 tw-gap-4">

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
                            </div>
                        </div>
                                )}

                        <div className="tw-p-0">
                            <TableContainer
                                columns={feeConcessionTypeColumns || []}
                                data={
                                    Array.isArray(getFeeConcessionTypeListResp?.data)
                                        ? getFeeConcessionTypeListResp?.data
                                        : []
                                }
                                divClass="tw-overflow-x-auto tw-mb-3"
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

            </div>

            <ModalContainerUpdated
                id="add-branch-modal"
                modalSize="md"
                modalTitle={addModalState.modalData?.feeConcessionId ? "Edit Fee Concession Type" : "Add Fee Concession Type"}
                isOpen={addModalState.showModal}
                toggle={closeAddModalHnldr}
            >
                <AddEditFeeConcessionType
                    formId="add-terms"
                    instituteId={instituteId}
                    branchId={branchId || feeConcessionForm.values.branchId}
                    editModalData={addModalState.modalData}
                    id={addModalState.modalData?.feeConcessionId}
                    toggle={closeAddModalHnldr}
                />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-inst-academic-terms"
                isOpen={delModalState.showModal}
                confirmMessage="Are you sure you want to delete this fee concession type?"
                cancelHndlr={closeDelModalHnldr}
                confirmHndlr={delModalSubmitHndlr}
                iconType="danger"
            />
        </React.Fragment >
    )
}

export default FeeConcessionType;