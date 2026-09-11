import React, { useCallback, useMemo, useState } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Common Component
import TableContainer from "../../../../Components/Common/TableContainer";
import { Button, ConfirmationModal, TextIconInput } from "../../../../Components/Common";
import { generateColumns, departmentData } from "./helper";

//Modal Component
import AddFeeTypeModal from "./AddFeeTypeModal";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { useEffect, useRef } from "react";

//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getInstDepartmentAct, deleteInstDepartmentAct } from "../../../../store/mastersettings/instituteinfo/instituteinfoactions";
// Interface & Types
import { IInstDepartmentInfo, IUpdateInstDepartmentResp } from "../../../../store/mastersettings/instituteinfo/instituteinfotypes";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { IPaginationState } from "../../../../Components/Common/Pagination";


const FeeTypes: React.FC<any> = ({ instituteId, instituteName }) => {
    const [addFeeTypeModalState, setAddFeeTypeModalState] = useState<any>({
        showModal: false, feeTypeId: ""
    });
    const [delDepartmentModalState, setDelDepartmentModalState] = useState<any>({
        showModal: false,
        feeTypeId: ""
    })
    const [filterState, setFilterState] = useState<any>({
        departmentName: undefined
    });

    const dispatch = useAppDispatch();
    const { instDepartmentResp, deleteInstDepartmentResp, instInfoError } = useAppSelector(({ instituteInfo }) => ({
        instDepartmentResp: instituteInfo.instDepartmentResp,
        deleteInstDepartmentResp: instituteInfo.deleteInstDepartmentResp,
        instInfoError: instituteInfo.instInfoError
    }), shallowEqual);

    const departmentRespRef = useRef<any>({
        prevDeleteInstDepartmentResp: deleteInstDepartmentResp,
        prevInstInfoError: instInfoError
    });

    useEffect(() => {
        if (instituteId) {
            getFeeTypeApiCall();
        }
    }, [instituteId]);

    useEffect(() => {
        const { prevDeleteInstDepartmentResp, prevInstInfoError } = departmentRespRef.current;
        if (deleteInstDepartmentResp && prevDeleteInstDepartmentResp !== deleteInstDepartmentResp) {
            setDelDepartmentModalState((prevState: any) => ({ ...prevState, showModal: false, feeTypeId: "" }));
            getFeeTypeApiCall();
            toast.success("Department deleted successfully.");
        } else if (instInfoError && instInfoError !== prevInstInfoError) {
            const { message }: any = instInfoError;
            toast.error(message);
        }
        departmentRespRef.current.prevDeleteInstDepartmentResp = deleteInstDepartmentResp;
        departmentRespRef.current.prevInstInfoError = instInfoError;
    }, [deleteInstDepartmentResp, instInfoError]);

    const toggleFeeTypeHndlr = useCallback((apiCall?: boolean) => {
        setAddFeeTypeModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
        if (typeof (apiCall) === "boolean" && apiCall) {
            getFeeTypeApiCall();
        }
    }, [instituteId, instDepartmentResp]);

    function addDepartmentHndlr() {
        setAddFeeTypeModalState((prevState: any) => ({ ...prevState, showModal: true, feeTypeId: "", modalData: undefined }));
    }

    function editDepartmentHndlr(event: any) {
        const feeTypeId = event.currentTarget.getAttribute("data-id"),
            modalData: (IInstDepartmentInfo | undefined) = instDepartmentResp?.data.find((item: any) => item.id === feeTypeId);
        if (modalData) {
            setAddFeeTypeModalState((prevState: any) => ({ ...prevState, showModal: true, feeTypeId, modalData }));
        }
    }

    function deleteDepartmentHndlr(event: any) {
        const feeTypeId = event.currentTarget.getAttribute("data-id");
        if (feeTypeId)
            setDelDepartmentModalState((prevState: any) => ({ ...prevState, showModal: true, feeTypeId }));
    }

    const menuOptions = useMemo((): IOptionsHrtl[] => ([{
        id: "edit",
        actionIcon: <i className="tw-text-[#1bb3a6] ri-pencil-fill tw-text-base"></i>,
        actionName: "Edit",
        onClickHndlr: editDepartmentHndlr,
    }, {
        id: "delete",
        actionIcon: <i className="tw-text-red-500 ri-delete-bin-5-fill tw-text-base"></i>,
        actionName: "Delete",
        onClickHndlr: deleteDepartmentHndlr
    }]), [instDepartmentResp]);

    function delModalCancelHndlr() {
        setDelDepartmentModalState((prevState: any) => ({ ...prevState, showModal: false }));
    }
    function delModalSubmitHndlr() {
        const { feeTypeId } = delDepartmentModalState;
        dispatch(deleteInstDepartmentAct(generateActionPayload("delete_inst_department", { feeTypeId })));
    }
    function paginationHndlr(paginationInfo: IPaginationState) {
        getFeeTypeApiCall(paginationInfo);
    }

    function getFeeTypeApiCall(otherProps?: (IPaginationState | any)) {
        const payload = { ...filterState, ...otherProps },
            params = { instituteId };
        dispatch(getInstDepartmentAct(generateActionPayload("get_inst_departments", params, payload)));
    }
    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        getFeeTypeApiCall({ "departmentName": value });
    }

    const departmentColumns = useMemo(() => generateColumns(menuOptions), [instDepartmentResp]),
        { data: departmentList, pageNumber, totalPages, totalRecords } = instDepartmentResp || {};
    return (
        <React.Fragment>
            <div className="tw-py-3 tw-px-3">
                <form onClick={e => e.preventDefault()}>
                    <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                        <div className="tw-col-span-12 md:tw-col-span-4">
                            <div className="tw-relative search-box">
                                <TextIconInput
                                    formgroupClassName="search-box"
                                    name="departmentName"
                                    value={filterState.departmentName}
                                    placeHolder="Search..."
                                    onChange={onChangeFilterHndlr}
                                />
                                <i className="ri-search-line tw-absolute tw-left-3 tw-top-[10px] tw-text-gray-400"></i>
                            </div>
                        </div>
                        <div className="tw-col-span-12 md:tw-col-span-8 tw-flex tw-justify-end">
                            <Button variant="primary" onClick={addDepartmentHndlr}>Add Fee Type</Button>
                        </div>
                    </div>
                </form>
            </div>
            <TableContainer
                columns={departmentColumns || []}
                data={departmentData}
                divClass="table-responsive tw-mb-1"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                showPagination={true}
                totalPages={1}
                totalRecords={3}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={1}
            />

            <AddFeeTypeModal
                isOpen={addFeeTypeModalState.showModal}
                toggle={toggleFeeTypeHndlr}
                modalTitle={addFeeTypeModalState.feeTypeId ? "Edit Fee Type" : "Add Fee Type"}
                instituteId={instituteId}
                feeTypeId={addFeeTypeModalState.feeTypeId}
                editDepartmentDetails={addFeeTypeModalState.modalData}
            />
            <ConfirmationModal
                id="delete-branch-modal"
                isOpen={delDepartmentModalState.showModal}
                confirmMessage="Are you sure you want to delete this fee type?"
                cancelHndlr={delModalCancelHndlr}
                confirmHndlr={delModalSubmitHndlr}
            />
        </React.Fragment>
    )
}

export default FeeTypes;