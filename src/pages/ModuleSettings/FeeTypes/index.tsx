import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Card, CardHeader, CardBody, Row, Col, Input, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { shallowEqual } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
//Common Component
import TableContainer from "../../../Components/Common/TableContainer";
import { ConfirmationModal, TextIconInput, SelectInput, ModalComponent } from "../../../Components/Common";
//Helper
import { generateColumns, academicTermTableData } from "./helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Modal Component
import AddEditAcademicTerms from "./AddEditFeeType";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { getInstAcademicTermAct, deleteInstAcademicTermAct, getInstTermAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { getMasterTermTypesAct } from "../../../store/masterdata/masterdataactions";
import { getFeeTypesAct, deleteFeeTypeAct } from "../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";

//Interface & Types
import { IPaginationState } from "../../../Components/Common/Pagination";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
//Common Utility
import { getSortingKeys } from "../../../utility/commonutility";
import Button from "../../../Components/Common/Button";

const FeeTypes: React.FC<any> = ({ instituteId, instituteName }) => {
    const [termsModalState, setTermsModalState] = useState<any>({
        showModal: false,
        feeTypeId: undefined, modalData: undefined
    });
    const [delTermsModalState, setDelTermsModalState] = useState<any>({
        showModal: false,
        feeTypeId: ""
    });
    const [filterState, setFilterState] = useState<any>({
        search: undefined,
    });
    const sortingDetailRef = useRef<any>(undefined);
    const paginationDetailRef = useRef<any>({
        pageNo: 0,
        pageSize: 10,
    });

    const dispatch = useAppDispatch();
    const { feeTypesResp, deleteFeeTypeResp, masterTermTypesResp, masterFeeSettingsErrorResp } =
        useAppSelector(({ instAcademics, masterFeeSettings, masterData }) => ({
            masterTermTypesResp: masterData.masterTermTypesResp,
            feeTypesResp: masterFeeSettings.feeTypesResp,
            deleteFeeTypeResp: masterFeeSettings.deleteFeeTypeResp,
            masterFeeSettingsErrorResp: masterFeeSettings.masterFeeSettingsErrorResp
        }), shallowEqual);

    const termsRespRef = useRef<any>({
        prevDeleteFeeTypeResp: deleteFeeTypeResp,
        prevMasterFeeSettingsErrorResp: masterFeeSettingsErrorResp
    });

    useEffect(() => {
        if (instituteId) {
            getFeeTypesApiCall();
        }
    }, [instituteId]);

    useEffect(() => {
        const { prevDeleteFeeTypeResp, prevMasterFeeSettingsErrorResp, prevAddTermResp, prevUpdateTermResp } = termsRespRef.current;
        if (deleteFeeTypeResp && deleteFeeTypeResp !== prevDeleteFeeTypeResp) {
            setDelTermsModalState((prevState: any) => ({ ...prevState, showModal: false, feeTypeId: "" }));
            getFeeTypesApiCall(filterState);
            toast.success("Term deleted successfully.")
        }
        else if (masterFeeSettingsErrorResp && masterFeeSettingsErrorResp !== prevMasterFeeSettingsErrorResp) {
            const { details }: any = masterFeeSettingsErrorResp;
            toast.error(details);
        }
        termsRespRef.current.prevDeleteFeeTypeResp = deleteFeeTypeResp;
        termsRespRef.current.prevMasterFeeSettingsErrorResp = masterFeeSettingsErrorResp;
    }, [deleteFeeTypeResp, masterFeeSettingsErrorResp]);

    function addTermHndlr() {
        setTermsModalState((prevState: any) => ({ ...prevState, showModal: true, feeTypeId: undefined, modalData: undefined }))
    }
    const toggleTermModalHndlr = useCallback((apiCall?: boolean) => {
        setTermsModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
        if (typeof (apiCall) === "boolean" && apiCall) {
            getFeeTypesApiCall();
        }
    }, [feeTypesResp]);

    function editAcademicTermHndlr(event: any) {
        const feeTypeId = event.currentTarget.getAttribute("data-id");
        let modalData: any = feeTypesResp?.find((item: any) => item.feeTypeId === +feeTypeId);
        if (modalData) {
            setTermsModalState((prevState: any) => ({ ...prevState, showModal: true, feeTypeId, modalData }))
        }
    }

    function deleteAcademicTermHndlr(event: any) {
        const feeTypeId: string = event.currentTarget.getAttribute("data-id");
        if (feeTypeId)
            setDelTermsModalState((prevState: any) => ({ ...prevState, showModal: true, feeTypeId }));
    }

    const menuOptions = useMemo((): IOptionsHrtl[] => ([
        {
            id: "edit",
            actionIcon: <i className="text-primary ri-pencil-fill fs-16"></i>,
            actionName: "Edit",
            onClickHndlr: editAcademicTermHndlr,
        },
        {
            id: "delete",
            actionIcon: <i className="text-danger ri-delete-bin-5-fill fs-16"></i>,
            actionName: "Delete",
            onClickHndlr: deleteAcademicTermHndlr
        }]), [feeTypesResp]);


    function getFeeTypesApiCall(otherProps?: any) {
        const sortingParams = getSortingKeys(sortingDetailRef.current);
        const payload = {
            instituteId, ...filterState, ...otherProps,
            ...sortingParams
        };
        // payload.sortBy === "" && delete payload.orderBy
        // payload.sortBy === "" && delete payload.sortBy
        dispatch(getFeeTypesAct(generateActionPayload("get_fee_types", undefined, payload)));
    }

    function delModalCancelHndlr() {
        setDelTermsModalState((prevState: any) => ({ ...prevState, showModal: false, academicYearId: "" }));
    }

    function delModalSubmitHndlr() {
        const { feeTypeId } = delTermsModalState;
        dispatch(deleteFeeTypeAct(generateActionPayload("delete_fee_type", { feeTypeId })));
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        paginationDetailRef.current = paginationInfo;
        getFeeTypesApiCall();
    }

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        getFeeTypesApiCall({ [name]: value });
    }

    function sortingHandler(sortingKeys: any) {
        if (sortingDetailRef.current && sortingDetailRef.current !== sortingKeys) {
            sortingDetailRef.current = sortingKeys;
            getFeeTypesApiCall();
            //Testing
        } else {
            sortingDetailRef.current = sortingKeys;
        }
    }

    const feeTermsColumns = useMemo(() => generateColumns(menuOptions), [feeTypesResp]);
    return (
        <React.Fragment>
            <div className="tw-rounded-lg tw-shadow-md tw-bg-white tw-overflow-hidden">
                <div className="tw-px-6 tw-py-4 tw-border-b">
                    <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-0 tw-flex-grow">
                        Fee Types
                    </h4>
                </div>
                <div className="tw-p-0">
                    <div className="tw-py-3 tw-px-3">
                        <form onClick={e => e.preventDefault()}>
                            <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                                <div className="tw-col-span-4">
                                    <TextIconInput
                                        formgroupClassName="search-box"
                                        name="search"
                                        value={filterState.search}
                                        placeHolder="Search"
                                        labelText="Search"
                                        floatingLabel
                                        onChange={onChangeFilterHndlr}
                                    >
                                        <i className="ri-search-line search-icon"></i>
                                    </TextIconInput>
                                </div>
                                <div className="tw-col-span-8 tw-ml-auto">
                                    <Button
                                    variant="primary"
                                        onClick={addTermHndlr}
                                    >
                                        Add New
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <TableContainer
                        columns={feeTermsColumns || []}
                        data={Array.isArray(feeTypesResp) ? feeTypesResp : []}
                        divClass="tw-overflow-x-auto"
                        theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                        showPagination={false}
                        totalPages={1}
                        totalRecords={Array.isArray(feeTypesResp) ? feeTypesResp.length : 0}
                        callbackPaginationHndlr={paginationHndlr}
                        currentPageNumber={0}
                        manualSorting={true}
                        sortingHandler={sortingHandler}
                    />
                </div>
            </div>
            <ModalComponent
                id="add-branch-modal"
                modalSize="md"
                modalBodyClass="px-0"
                modalTitle={termsModalState.feeTypeId ? "Edit Fee Type" : "Add Fee Type"}
                isOpen={termsModalState.showModal}
                toggle={toggleTermModalHndlr}
                submitTitle={termsModalState.feeTypeId ? "Update" : "Submit"}
                cancelHndlr={toggleTermModalHndlr}
                formId="add-terms"
            >
                <AddEditAcademicTerms
                    formId="add-terms"
                    instituteId={instituteId}
                    feeTypeId={termsModalState.feeTypeId}
                    editModalData={termsModalState.modalData}
                    toggle={toggleTermModalHndlr}
                />
            </ModalComponent>
            <ConfirmationModal
                id="delete-inst-academic-terms"
                isOpen={delTermsModalState.showModal}
                confirmMessage="Are you sure you want to delete this term ?"
                cancelHndlr={delModalCancelHndlr}
                confirmHndlr={delModalSubmitHndlr}
            />
        </React.Fragment >
    )
}

export default FeeTypes;