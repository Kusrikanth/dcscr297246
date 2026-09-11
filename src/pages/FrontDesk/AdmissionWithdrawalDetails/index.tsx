
import React, { ReactHTML, useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, DateInput, ModalContainerUpdated, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";

// import { StudentConcessionFilterhProps } from "./studentConcessionsTypes";
import { useHistory } from "react-router-dom";
import { shallowEqual, useDispatch } from "react-redux";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { IPaginationState } from "../../../Components/Common/Pagination";

import { exportChangeStudentListAct, getAllChangeStudentsListAct, sendNotifiChangeStuDetailAct } from "../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { toast } from "react-toastify";
import { generateColumns } from "./helper";
import AddAdmissionWithdrawalDetails from "./AddAdmissionWithdrawalDetails";
import { deleteAdmissionWithdrawalAct, getAdmissionWithdrawalAct, setGetAdmissionWithdrawalAct } from "../../../store/FrontDesk/AdmissionSettings/admissionsettingaction";
import { debounce, sanitizeUrlParams } from "../../../utility/commonutility";
import TcRequestsRejectModal from "../../FreeModules/TransferRequestApprovals/TcRequests/TcRequestsRejectModal";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../Components/Common/Button";

const initialValues = {
    searchString: "",
    academicYearId: "",
    startDate: "",
    endDate: "",
    curriculumId: "",
};

const AdmissionWithdrawalDetails = () => {
    const [admWithModalState, setAdmWithModalState] = useState({
        showModal: false,
        admissionWithdrawalId: undefined
    });
    const [delWithdrawalState, setDelWithdrawalState] = useState({
        showModal: false,
        admissionWithdrawalId: undefined
    })

    const [admWithFilterState, setAdmWithFilterState] = useState(initialValues);
    const paginationRef = useRef<IPaginationState>({
        pageNo: 0,
        pageSize: 10
    })
    const dispatch = useAppDispatch();
    const {
        academicYearListResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        brchCurriculumResp,
        getAdmissionWithdrawalResp,
        deletAdmissionWithdrawalResp,
        admissionSettingErrorResp
    } = useAppSelector(
        ({ globalData, instAcademics, branchAcademics, appData, admissionSettingRequest
        }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            getAdmissionWithdrawalResp: admissionSettingRequest.getAdmissionWithdrawalResp,
            showApiLoader: globalData.showApiLoader,
            deletAdmissionWithdrawalResp: admissionSettingRequest.deletAdmissionWithdrawalResp,
            admissionSettingErrorResp: admissionSettingRequest.admissionSettingErrorResp,
        }),
        shallowEqual
    );

    const admissionWithdrawRespRef = useRef({
        prevAdmissionSettingErrorResp: admissionSettingErrorResp,
        prevDeletAdmissionWithdrawalResp: deletAdmissionWithdrawalResp,
        prevAcademicYearListResp: academicYearListResp
    });

    useEffect(() => {
        const { prevAcademicYearListResp,
            prevDeletAdmissionWithdrawalResp,
            prevAdmissionSettingErrorResp } = admissionWithdrawRespRef.current;
        if (academicYearListResp && prevAcademicYearListResp !== academicYearListResp) {
            if (Array.isArray(academicYearListResp?.data)) {
                const { academicYearId = "", startDate } = academicYearListResp.data?.find((year: any) => year.isAdmissionDefault) || {};
                setAdmWithFilterState(prevState => ({ ...prevState, academicYearId }));
                getAdmissionWithdrawalApiCall({ academicYearId });
                getCurriculumApiCall({ academicYearId })
            }
        } else if (deletAdmissionWithdrawalResp && prevDeletAdmissionWithdrawalResp !== deletAdmissionWithdrawalResp) {
            toast.success("Admission withdrawal deleted successfully.");
            delWithdrawalCancelHndlr();
            getAdmissionWithdrawalApiCall();
        }
        else if (admissionSettingErrorResp && admissionSettingErrorResp !== prevAdmissionSettingErrorResp) {
            const { message } = admissionSettingErrorResp;
            toast.error(message || "Something went wrong.");
        }
        admissionWithdrawRespRef.current.prevAdmissionSettingErrorResp = admissionSettingErrorResp;
        admissionWithdrawRespRef.current.prevAcademicYearListResp = academicYearListResp;
        admissionWithdrawRespRef.current.prevDeletAdmissionWithdrawalResp = deletAdmissionWithdrawalResp;
    }, [academicYearListResp, deletAdmissionWithdrawalResp, admissionSettingErrorResp]);

    const toggleAddDailyAttModal = (apiCall?: any) => {
        if (typeof apiCall === "boolean" && apiCall) {
            getAdmissionWithdrawalApiCall();
        }
        // history.push("/student-concessions/create-concession", { id: id });
        setAdmWithModalState((prev: any) => ({ ...prev, showModal: !prev.showModal }))
    };

    function addAdmissionWithdrawalHndlr() {
        setAdmWithModalState((prev: any) => ({ ...prev, showModal: true, admissionWithdrawalId: "" }))
    }

    function editAdmissionWithdrawalHndlr(event: any) {
        const admissionWithdrawalId = event.currentTarget.getAttribute("data-id");
        setAdmWithModalState(prevState => ({ ...prevState, showModal: true, admissionWithdrawalId: admissionWithdrawalId }));
    }

    function deleteStudentHndlr(event: any) {
        const admissionWithdrawalId = event.currentTarget.getAttribute("data-id");
        setDelWithdrawalState(prevState => ({ ...prevState, showModal: true, admissionWithdrawalId }));
    }

    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={18} />,
                actionName: "Edit",
                onClickHndlr: editAdmissionWithdrawalHndlr
            },
            {
                id: "delete",
                actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
                actionName: "Delete",
                onClickHndlr: deleteStudentHndlr,
            }
        ],
        [getAdmissionWithdrawalResp]
    );

    useEffect(() => {
        const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
        dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));

    }, []);
    function search(value: string) {
        getAdmissionWithdrawalApiCall({ searchString: value });
    }
    const debounceFun = debounce(search, 400);
    function onSearchHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setAdmWithFilterState(prevState => ({ ...prevState, [name]: value }));
        paginationRef.current.pageNo = 0;
        debounceFun(value);
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: admWithFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    const onChangeAcademicYearHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        paginationRef.current.pageNo = 0;
        getCurriculumApiCall({ academicYearId: value });
        if (value) {
            const { startDate } = academicYearListResp?.data?.find((year: any) => year.academicYearId.toString() === value) || {};
            getAdmissionWithdrawalApiCall({ academicYearId: value });
            setAdmWithFilterState((prevState) => ({ ...prevState, [name]: value }));
        } else {
            setAdmWithFilterState((prevState) => ({ ...prevState, [name]: "" }));
            dispatch(setGetAdmissionWithdrawalAct(null));
        }

    }


    function onChangeFilterHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setAdmWithFilterState(prevState => ({ ...prevState, [name]: value }));
        paginationRef.current.pageNo = 0;
        getAdmissionWithdrawalApiCall({ [name]: value });
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        paginationRef.current = paginationInfo;
        getAdmissionWithdrawalApiCall();
    }

    function getAdmissionWithdrawalApiCall(otherProps?: any) {
        const payload = {
            branchId,
            ...admWithFilterState,
            ...otherProps,
            ...paginationRef.current
        }
        dispatch(getAdmissionWithdrawalAct(generateActionPayload("get_admission_withdrawal", undefined, payload)));
    }

    function delWithdrawalCancelHndlr() {
        setDelWithdrawalState(prevState => ({ ...prevState, showModal: false }));
    }

    function delWithdrawalSubmissionHandlr() {
        const { admissionWithdrawalId } = delWithdrawalState,
            params = { admissionWithdrawalId };
        paginationRef.current.pageNo = 0;
        dispatch(deleteAdmissionWithdrawalAct(generateActionPayload("delete_admissionwithdrawal", params)));
    }

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {};
    const admissionWithColumns = useMemo(() => generateColumns(menuOptions), [getAdmissionWithdrawalResp]);
    const { data: admissionWithTableData, totalPages, totalElements, pageNumber } = getAdmissionWithdrawalResp || {};
    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb pageTitle="Admissions" />
                    <div className="tw-bg-white tw-rounded-lg tw-shadow">
                        <div className="tw-border-b tw-border-gray-200 tw-py-2 tw-px-4">
                            <div className="tw-flex tw-flex-col lg:tw-flex-row tw-items-center">
                                <div className="tw-w-full lg:tw-w-1/2">
                                    <h4 className="card-title !tw-mb-0 tw-flex-grow tw-justify-center">
                                        Admission Withdrawal Details List
                                    </h4>
                                </div>
                                <div className="tw-w-auto tw-ml-auto">
                                    <div className="tw-flex">
                                        <Button
                                        variant="primary"
                                            onClick={addAdmissionWithdrawalHndlr}
                                        >
                                            Add New
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="tw-p-4">
                            {/* <form onSubmit={StudentConcessionFilterForm.handleSubmit}> */}
                            <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
                                    <div className="search-box tw-relative">
                                        <TextInput
                                            name="searchString"
                                            value={admWithFilterState.searchString}
                                            onChange={onSearchHandler}
                                            inputClassName="tw-bg-gray-50"
                                            formgroupClassName="tw-mb-0"
                                            placeHolder="Search..."
                                            labelText="Search"
                                            floatingLabel
                                        />

                                        <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 tw-transform tw--translate-y-1/2 tw-text-gray-400"></i>
                                    </div>
                                </div>

                                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="academicYearId"
                                        value={admWithFilterState.academicYearId}
                                        onChange={onChangeAcademicYearHandler}
                                        menuItems={academicYearList || []}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        // inputClassName="border-0"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Academic Year"
                                        floatingLabel
                                    />
                                </div>
                                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="curriculumId"
                                        value={admWithFilterState.curriculumId}
                                        onChange={onChangeFilterHandler}
                                        menuItems={curriculumTypes}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        // inputClassName="border-0"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Curriculum"
                                        floatingLabel
                                    />
                                </div>
                            </div>
                        </div>

                        <TableContainer
                            columns={admissionWithColumns}
                            data={Array.isArray(admissionWithTableData) ? admissionWithTableData : []}
                            divClass="tw-overflow-x-auto tw-mb-3"
                            theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                            // showCheckbox={true}
                            showPagination={true}
                            totalPages={totalPages}
                            totalRecords={totalElements}
                            callbackPaginationHndlr={paginationHndlr}
                            currentPageNumber={pageNumber || 0}
                        />
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="avc"
                isOpen={admWithModalState.showModal}
                toggle={toggleAddDailyAttModal}
                modalTitle="Admission Withdrawal"
                modalSize="lg"
            >
                <AddAdmissionWithdrawalDetails
                    isOpen={admWithModalState.showModal}
                    toggle={toggleAddDailyAttModal}
                    academicYearId={admWithFilterState?.academicYearId}
                    branchId={branchId}
                    instituteId={instituteId}
                    admissionWithdrawalId={admWithModalState.admissionWithdrawalId}
                />
            </ModalContainerUpdated>

            <ConfirmationModal
                id="delete-admissionwithdrawal-modal"
                isOpen={delWithdrawalState.showModal}
                confirmMessage="Are you sure you want to delete this admission withdrawal for student?"
                cancelHndlr={delWithdrawalCancelHndlr}
                confirmHndlr={delWithdrawalSubmissionHandlr}
                showImgIcon={true}
                iconType="reject"
            />
        </>
    );
};

export default AdmissionWithdrawalDetails;
