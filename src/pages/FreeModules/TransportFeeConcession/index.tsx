import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { shallowEqual } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
//Common Component
import TableContainer from "../../../Components/Common/TableContainer";
import { ConfirmationModal, ModalContainerUpdated, SelectInput } from "../../../Components/Common";
//Helper
import { generateColumns } from "./helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { getTransportFeeConcessionsAct, deleteTransportFeeConcessionAct } from "../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";

//Interface & Types
import { IPaginationState } from "../../../Components/Common/Pagination";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
//Common Utility
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import AddTransportFeeConcession from "./AddTransportFeeConcession";
import Button from "../../../Components/Common/Button";
import { useFormik } from "formik";
import * as Yup from "yup";

const initialValues = {
    branchId: "",
}
const validationSchema = Yup.object().shape({
  branchId: Yup.string().required("Branch required."),
});

const TransportFeeConcession: React.FC = () => {
    const [feeConcessionModalState, setFeeConcessionModalState] = useState({
        showModal: false,
        feeConcessionId: undefined, modalData: undefined
    });
    const [delFeeConcessionModalState, setDelFeeConcessionModalState] = useState({
        showModal: false,
        feeConcessionId: ""
    });
    //  const [filterState, setFilterState] = useState<any>({
    //     branchId: ""  
    //   });
        const [branchState, setBranchState] = useState<any>([]);
      
    const sortingDetailRef = useRef<any>(undefined);
    const paginationDetailRef = useRef({
        pageNo: 0,
        pageSize: 10,
    });

    const dispatch = useAppDispatch();
    const { currentInstIdResp: instituteId, currentBranchIdResp: branchId, transportFeeConcessionsResp, deleteTransportFeeConcessionResp, masterTermTypesResp, masterFeeSettingsErrorResp, loggedInUserRole, branchListResp, virtualRoleResp } =
        useAppSelector(({ appData, masterFeeSettings, masterData, branch }) => ({
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            masterTermTypesResp: masterData.masterTermTypesResp,
            transportFeeConcessionsResp: masterFeeSettings.transportFeeConcessionsResp,
            deleteTransportFeeConcessionResp: masterFeeSettings.deleteTransportFeeConcessionResp,
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

    const termsRespRef = useRef({
        prevDeleteTransportFeeConcessionResp: deleteTransportFeeConcessionResp,
        prevMasterFeeSettingsErrorResp: masterFeeSettingsErrorResp
    });

    useEffect(() => {
        if (instituteId) {
            getTransportFeeConcessionApiCall();
        }
    }, [instituteId]);

      useEffect(() => {
        if (branchListResp) {
          setBranchState(branchListResp?.data.filter((branch: any) => branch.branchId != branchId))
        }
      }, [branchListResp])

    useEffect(() => {
        const { prevDeleteTransportFeeConcessionResp, prevMasterFeeSettingsErrorResp } = termsRespRef.current;
        if (deleteTransportFeeConcessionResp && deleteTransportFeeConcessionResp !== prevDeleteTransportFeeConcessionResp) {
            setDelFeeConcessionModalState((prevState: any) => ({ ...prevState, showModal: false, feeConcessionId: "" }));
            getTransportFeeConcessionApiCall();
            toast.success("Fee concession deleted successfully.")
        }
        else if (masterFeeSettingsErrorResp && masterFeeSettingsErrorResp !== prevMasterFeeSettingsErrorResp) {
            const { details }: any = masterFeeSettingsErrorResp;
            toast.error(details);
        }
        termsRespRef.current.prevDeleteTransportFeeConcessionResp = deleteTransportFeeConcessionResp;
        termsRespRef.current.prevMasterFeeSettingsErrorResp = masterFeeSettingsErrorResp;
    }, [deleteTransportFeeConcessionResp, masterFeeSettingsErrorResp]);

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
            getTransportFeeConcessionApiCall();
        }
    }, [transportFeeConcessionsResp]);

    function editFeeConcessionHndlr(event: any) {
        const feeConcessionId = event.currentTarget.getAttribute("data-id");
        let modalData: any = transportFeeConcessionsResp?.data.find((item: any) => item.id === +feeConcessionId);
        if (modalData) {
            setFeeConcessionModalState((prevState: any) => ({ ...prevState, showModal: true, feeConcessionId, modalData }))
        }
    }

    function deleteFeeConcessionHndlr(event: any) {
        const feeConcessionId: string = event.currentTarget.getAttribute("data-id");
        if (feeConcessionId)
            setDelFeeConcessionModalState((prevState: any) => ({ ...prevState, showModal: true, feeConcessionId }));
    }

      function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        feeConcessionForm.setValues((prevState: any) => ({ ...prevState, [name]: value }));
        getTransportFeeConcessionApiCall({ [name]: value });
        if (name === "branchId") {
          if (value) {
            feeConcessionForm.setValues((prev: any) => ({ ...prev, [name]: value }));
          }
          else {
            feeConcessionForm.setValues((prev: any) => ({ ...prev, [name]: value }));
           
          }
        }
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
        }]), [transportFeeConcessionsResp]);


    function getTransportFeeConcessionApiCall(otherProps?: any) {
        const payload = {
            instituteId, ...paginationDetailRef.current, ...otherProps
        };
        dispatch(getTransportFeeConcessionsAct(generateActionPayload("get_transport_fee_concession", undefined, payload)));
    }

    function delModalCancelHndlr() {
        setDelFeeConcessionModalState((prevState: any) => ({ ...prevState, showModal: false, academicYearId: "" }));
    }

    function delModalSubmitHndlr() {
        const { feeConcessionId } = delFeeConcessionModalState;
        dispatch(deleteTransportFeeConcessionAct(generateActionPayload("delete_transport_fee_concession", { feeConcessionId })));
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        paginationDetailRef.current = paginationInfo;
        getTransportFeeConcessionApiCall();
    }

    function sortingHandler(sortingKeys: any) {
        if (sortingDetailRef.current && sortingDetailRef.current !== sortingKeys) {
            sortingDetailRef.current = sortingKeys;
            getTransportFeeConcessionApiCall();
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
    }, [transportFeeConcessionsResp, showInstituteAdminUI]);

    const { data: concessionList, pageNumber, totalPages, totalElements } = transportFeeConcessionsResp || {};
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
                                    Transport Fee Concession
                                </h4>

                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={addFeeConcessionHndlr}
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
                modalSize="md"
                modalTitle={feeConcessionModalState.feeConcessionId ? "Edit Fee Concession" : "Add Fee Concession"}
                isOpen={feeConcessionModalState.showModal}
                toggle={toggleConcessionModalHndlr}
            >
                <AddTransportFeeConcession
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
                confirmMessage="Are you sure you want to delete this transport fee concession?"
                cancelHndlr={delModalCancelHndlr}
                confirmHndlr={delModalSubmitHndlr}
                showImgIcon
                iconType="reject"
            />
            <ToastContainer />
        </React.Fragment >
    )
}

export default TransportFeeConcession;