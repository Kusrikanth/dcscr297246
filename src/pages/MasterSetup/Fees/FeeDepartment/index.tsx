import React, { useCallback, useMemo, useState } from "react";
// import {  Row, Col, } from "reactstrap";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Common Component
import TableContainer from "../../../../Components/Common/TableContainer";
import { Button, ConfirmationModal, TextIconInput, TextInput } from "../../../../Components/Common";
import { generateColumns } from "./helper";

//Modal Component
import AddFeeDepartment from "./AddFeeDepartment";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { useEffect, useRef } from "react";

//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getInstFeeDepartmentsAct, deleteInstFeeDepartmentAct } from "../../../../store/mastersettings/feesettings/feesettingsactions";

import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { IPaginationState } from "../../../../Components/Common/Pagination";


const FeeDepartment: React.FC<any> = ({ instituteId, instituteName }) => {
    const [addFeeDeptModalState, setAddFeeDeptModalState] = useState<any>({
        showModal: false, feeDeptId: ""
    });
    const [delFeeDeptModalState, setDelFeeDeptModalState] = useState<any>({
        showModal: false,
        feeDeptId: ""
    })
    const [filterState, setFilterState] = useState<any>({
        departmentName: undefined
    });

    const dispatch = useAppDispatch();
    const { instFeeDepartmentsResp, delInstFeeDepartmentResp, instFeeSettingError } = useAppSelector(({ instFeeSettings }) => ({
        instFeeDepartmentsResp: instFeeSettings.instFeeDepartmentsResp,
        delInstFeeDepartmentResp: instFeeSettings.delInstFeeDepartmentResp,
        instFeeSettingError: instFeeSettings.instFeeSettingError
    }), shallowEqual);

    const feeDepartmentRespRef = useRef<any>({
        prevDelInstFeeDepartmentResp: delInstFeeDepartmentResp,
        prevInstFeeSettingError: instFeeSettingError
    });

    useEffect(() => {
        if (instituteId) {
            getFeeDepartmentsApiCall();
        }
    }, [instituteId]);

    useEffect(() => {
        const { prevDelInstFeeDepartmentResp, prevInstFeeSettingError } = feeDepartmentRespRef.current;
        if (delInstFeeDepartmentResp && prevDelInstFeeDepartmentResp !== delInstFeeDepartmentResp) {
            setDelFeeDeptModalState((prevState: any) => ({ ...prevState, showModal: false, feeDeptId: "" }));
            getFeeDepartmentsApiCall();
            toast.success("Fee Department deleted successfully.");
        } else if (instFeeSettingError && instFeeSettingError !== prevInstFeeSettingError) {
            const { details }: any = instFeeSettingError;
            toast.error(details || "Something went wrong.");
        }
        feeDepartmentRespRef.current.prevDelInstFeeDepartmentResp = delInstFeeDepartmentResp;
        feeDepartmentRespRef.current.prevInstFeeSettingError = instFeeSettingError;
    }, [delInstFeeDepartmentResp, instFeeSettingError]);

    const toggleDepartmentModal = useCallback((apiCall?: boolean) => {
        setAddFeeDeptModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
        if (typeof (apiCall) === "boolean" && apiCall) {
            getFeeDepartmentsApiCall();
        }
    }, [instituteId, instFeeDepartmentsResp]);

    function addFeeDepartmentHndlr() {
        setAddFeeDeptModalState((prevState: any) => ({ ...prevState, showModal: true, feeDeptId: "", modalData: undefined }));
    }

    function editFeeDepartmentHndlr(event: any) {
        const feeDeptId = event.currentTarget.getAttribute("data-id"),
            modalData: any = instFeeDepartmentsResp?.data.find((item: any) => item.departmentId === Number(feeDeptId));
        if (modalData) {
            setAddFeeDeptModalState((prevState: any) => ({ ...prevState, showModal: true, feeDeptId, modalData }));
        }
    }

    function deleteFeeDepartmentHndlr(event: any) {
        const feeDeptId = event.currentTarget.getAttribute("data-id");
        if (feeDeptId)
            setDelFeeDeptModalState((prevState: any) => ({ ...prevState, showModal: true, feeDeptId }));
    }

    const menuOptions = useMemo((): IOptionsHrtl[] => ([{
        id: "edit",
        actionIcon: <i className="tw-text-[#1bb3a6] ri-pencil-fill tw-text-base"></i>,
        actionName: "Edit",
        onClickHndlr: editFeeDepartmentHndlr,
    }, {
        id: "delete",
        actionIcon: <i className="tw-text-red-500 ri-delete-bin-5-fill tw-text-base"></i>,
        actionName: "Delete",
        onClickHndlr: deleteFeeDepartmentHndlr
    }]), [instFeeDepartmentsResp]);

    function delModalCancelHndlr() {
        setDelFeeDeptModalState((prevState: any) => ({ ...prevState, showModal: false }));
    }
    function delModalSubmitHndlr() {
        const { feeDeptId } = delFeeDeptModalState;
        dispatch(deleteInstFeeDepartmentAct(generateActionPayload("del_inst_fee_dept", { departmentId: feeDeptId })));
    }
    function paginationHndlr(paginationInfo: IPaginationState) {
        getFeeDepartmentsApiCall(paginationInfo);
    }

    function getFeeDepartmentsApiCall(otherProps?: (IPaginationState | any)) {
        const params = { instituteId, ...filterState, ...otherProps, isFeeDepartment: 1 };
        dispatch(getInstFeeDepartmentsAct(generateActionPayload("get_inst_fee_dept", undefined, params)));
    }
    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        getFeeDepartmentsApiCall({ "departmentName": value });
    }

    const departmentColumns = useMemo(() => generateColumns(menuOptions), [instFeeDepartmentsResp]),
        { data: feeDepartments, pageNumber, totalPages, totalElements } = instFeeDepartmentsResp || {};
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
                            <Button variant="primary" onClick={addFeeDepartmentHndlr}>Add Department</Button>
                        </div>
                    </div>
                </form>
            </div>
            <TableContainer
                columns={departmentColumns || []}
                data={Array.isArray(feeDepartments) ? feeDepartments : []}
                divClass="table-responsive tw-mb-1"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                showPagination={true}
                totalPages={totalPages}
                totalRecords={totalElements}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber}
            />

            <AddFeeDepartment
                isOpen={addFeeDeptModalState.showModal}
                toggle={toggleDepartmentModal}
                modalTitle={addFeeDeptModalState.feeDeptId ? "Edit Department" : "Add Department"}
                instituteId={instituteId}
                feeDeptId={addFeeDeptModalState.feeDeptId}
                editDepartmentDetails={addFeeDeptModalState.modalData}
            />
            <ConfirmationModal
                id="delete-branch-modal"
                isOpen={delFeeDeptModalState.showModal}
                confirmMessage="Are you sure you want to delete this department ?"
                cancelHndlr={delModalCancelHndlr}
                confirmHndlr={delModalSubmitHndlr}
            />
        </React.Fragment>
    )
}

export default FeeDepartment;