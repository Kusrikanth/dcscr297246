import React, { useMemo, useState, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
//Common Component
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { SelectInput, ConfirmationModal, ModalContainerUpdated, TextInput } from "../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { generateColumns, } from "./helper";
import { generateActionPayload } from "../../../utility/reduxutility";
import { toast } from "react-toastify";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { getEmployeeByFilterAct } from "../../../store/directory/employeemanagement/employeemanagementactions";
import AddComplaintDepartment from "./AddComplaintDepartment";
import { deleteComplaintDeptAct, getComplaintDepartmentListAct, getMasterComplaintDeptListAct } from "../../../store/concernsfeedback/complaintdepartment/complaintdepartmentaction";
import EmployeeDetailModal from "./EmployeeDetailModal";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../Components/Common/Button";

const initialFilterState = {
    searchString: "",
    category: "",
    academicYearId: "",
};

const ComplaintDepartment: React.FC<any> = () => {


    const paginationDetailRef = useRef<IPaginationState>({
        pageNo: 0,
        pageSize: 10,
    });
    const [addComplaintDeptModalState, setAddComplaintDeptModalState] =
        useState({
            showModal: false,
            modalData: "",
        });
        const [employeeDetailModalState, setEmployeeDetailModalState] = useState<any>({
            showModal: false,
            employees: undefined
        })
    const [deleteComplaintDeptModal, setDeleteComplaintDeptModal] =
        useState<any>({
            showModal: false,
            id: "",
            count : "",
        });
    const [searchEmployeeState, setSearchEmployeeState] = useState<any>(undefined);
    const sortingRef = useRef(undefined);
    const [filterState, setFilterState] = useState<any>({ ...initialFilterState });

    const dispatch = useAppDispatch();
    const { academicYearListResp, studentsListResp,
        getEmployeesByFilterResp,
        currentInstIdResp: instituteId, currentBranchIdResp: branchId, showApiLoader, getComplaintDepartmentListResp, complaintDepartmentErrResp, addComplaintDeptResp, editComplaintDeptResp, deleteComplaintDeptResp, } =
        useAppSelector(({ instAcademics, appData, directoryStudent, complaintDepartment, masterData, globalData, directoryEmployee }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            studentsListResp: directoryStudent.studentsListResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
            showApiLoader: globalData.showApiLoader,
            employeeCategoriesResp: masterData.employeeCategoriesResp,
            getComplaintDepartmentListResp: complaintDepartment.getComplaintDepartmentListResp,
            getMasterComplaintDeptListResp: complaintDepartment.getMasterComplaintDeptListResp,
            complaintDepartmentErrResp: complaintDepartment.complaintDepartmentErrResp,
            addComplaintDeptResp: complaintDepartment.addComplaintDeptResp,
            editComplaintDeptResp: complaintDepartment.editComplaintDeptResp,
            deleteComplaintDeptResp: complaintDepartment.deleteComplaintDeptResp,
        }), shallowEqual);

    const complaintDeptRef = useRef<any>({
        prevAddComplaintDeptResp: addComplaintDeptResp,
        prevEditComplaintDeptResp: editComplaintDeptResp,
        prevDeleteComplaintDeptResp: deleteComplaintDeptResp,
        prevComplaintDepartmentErrResp: complaintDepartmentErrResp,
    });

    useEffect(() => {
        const { prevComplaintDepartmentErrResp, prevAddComplaintDeptResp, prevEditComplaintDeptResp, prevDeleteComplaintDeptResp, } = complaintDeptRef.current;
        if (addComplaintDeptResp && addComplaintDeptResp !== prevAddComplaintDeptResp) {
            toast.success("Complaint Department Added Successfully");
            toggleAddComplaintDeptModal();
            getComplaintDeptApiCall()
        }
        else if (editComplaintDeptResp && editComplaintDeptResp !== prevEditComplaintDeptResp) {
            toast.success("Complaint Department Updated Successfully");
            toggleAddComplaintDeptModal();
            getComplaintDeptApiCall()
        }
        else if (deleteComplaintDeptResp && deleteComplaintDeptResp !== prevDeleteComplaintDeptResp) {
            toast.success("Complaint Department Deleted Successfully");
            toggledeleteComplaintDeptModal()
            getComplaintDeptApiCall()
        }
        else if (complaintDepartmentErrResp && complaintDepartmentErrResp !== prevComplaintDepartmentErrResp) {
            const { message , details }: any = complaintDepartmentErrResp;
            toast.error(message || details || "Something went wrong.");
        }

        complaintDeptRef.current.prevAddComplaintDeptResp = addComplaintDeptResp;
        complaintDeptRef.current.prevEditComplaintDeptResp = editComplaintDeptResp;
        complaintDeptRef.current.prevDeleteComplaintDeptResp = deleteComplaintDeptResp;
        complaintDeptRef.current.prevComplaintDepartmentErrResp = complaintDepartmentErrResp;

    }, [addComplaintDeptResp, complaintDepartmentErrResp, editComplaintDeptResp, deleteComplaintDeptResp]);
    
    useEffect(() => {
        const { data } = academicYearListResp || {};
        if (Array.isArray(data) && data.length > 0) {
            let { academicYearId } = data.find((year: any) => year.yearStatus === "CURRENT") || {};
            if (academicYearId) {
                setFilterState((prev: any) => ({ ...prev, academicYearId }));
                getComplaintDeptApiCall({
                    academicYearId,
                });
            }
        }
    }, [academicYearListResp]);

    useEffect(() => {
        if (branchId) {

            dispatch(getMasterComplaintDeptListAct(generateActionPayload("get_master_complaint_dept_list", undefined, { pageNo: 0, pageSize: 100, branchId , sortBy : "departmentName" , orderType : "aesc" })));

            getComplaintDeptApiCall({ branchId });
        }
    }, [branchId]);


    function onInputSearchChange(inputString: any) {
        if (inputString) {
            const params = { searchString: inputString };
            dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, { branchId })));
        }
    }

    function selectEmployeeHndlr(selectedEmployee: any) {
        setSearchEmployeeState(selectedEmployee);
    }

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        //Resest page number to 0 if filters are applied
        paginationDetailRef.current.pageNo = 0;
        getComplaintDeptApiCall({ [name]: value });
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));

    }

    const toggleEmployeeDetailModal = (assignee?: any) => {
        setEmployeeDetailModalState((prev: any) => ({
            ...prev,
            showModal: !prev.showModal,
            employees: assignee?.length > 0 ? assignee : [],
        }))
    }

    const menuOptions = useMemo((): any[] => {
        return ([{
            id: "edit",
            actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={18} />,
            actionName: "Edit",
            onClickHndlr: (event: any) => {
                const id = event.currentTarget.getAttribute("data-id");
                const findData = getComplaintDepartmentListResp?.data?.find((data: any) => +data?.id === +id);
                toggleAddComplaintDeptModal(findData);
            },
        },
         {
            id: "delete",
            actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
            actionName: "Delete",
            onClickHndlr: (event: any) => {
                const id = event.currentTarget.getAttribute("data-id");
                const findData = getComplaintDepartmentListResp?.data?.find((data: any) => +data?.id === +id);
                if(findData){
                    toggledeleteComplaintDeptModal(id,findData?.countOfComplaints)
                }
            }
        }
    ])
    }, [getComplaintDepartmentListResp]);

    function getComplaintDeptApiCall(otherProps?: any) {
        const payload = { branchId, isEdit: true, ...filterState, ...paginationDetailRef.current, ...otherProps };
        dispatch(getComplaintDepartmentListAct(generateActionPayload("get_complaint_dept_list", undefined, { ...payload })));
    }

    function paginationHndlr(paginationInfo: any) {
        paginationDetailRef.current = paginationInfo;
        getComplaintDeptApiCall();
    }

    function sortingHandler(sortingKeys: any) {
        if (sortingRef.current && sortingRef.current !== sortingKeys) {
            sortingRef.current = sortingKeys;
            getComplaintDeptApiCall();
        } else {
            sortingRef.current = sortingKeys;
        }
    }

    const toggleAddComplaintDeptModal = (modalData?: any) => {

        setAddComplaintDeptModalState((prev: any) => ({
            ...prev,
            showModal: !prev.showModal,
            modalData: modalData || "",
        }))
    }

    const toggledeleteComplaintDeptModal = (id?: any , count?:any) => {
        setDeleteComplaintDeptModal((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            id: id || "",
            count: count || "",
        }));
    };

    const deleteComplaintDeptHndler = () => {

        dispatch(deleteComplaintDeptAct(generateActionPayload('delete_complaints_department', { id: deleteComplaintDeptModal.id })))
    }

    const studentColumns = useMemo(() => generateColumns(menuOptions,toggleEmployeeDetailModal), [getComplaintDepartmentListResp]),
        { data: studentList, pageNo: pageNumber, totalPages, totalElements: totalRecords } = getComplaintDepartmentListResp || {};
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Students Management" pageTitle="Helpdesk" />

                    <div className="tw-mb-4">
                        <div className="tw-w-full">
                            <div className="tw-bg-white tw-rounded-lg tw-shadow" id="tasksList">

                                <div className="tw-border-b tw-px-4 tw-py-3">
                                    <div className="tw-flex tw-items-center">
                                        <h4 className="tw-text-base tw-font-semibold tw-flex-grow tw-mb-0">
                                            Complaint Department list
                                        </h4>

                                        <div className="tw-flex-shrink-0">
                                            <Button
                                                variant="primary"
                                                onClick={() => toggleAddComplaintDeptModal()}
                                            >
                                                <i className="ri-add-line" />
                                                <span>Add New</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="tw-p-0">
                                    <div className="tw-px-4 tw-py-3">
                                        <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-pt-3 tw-pb-1">

                                            <div className="tw-col-span-12 xl:tw-col-span-4">
                                                <div className="search-box">
                                                    <TextInput
                                                        name="searchString"
                                                        value={filterState.searchString}
                                                        onChange={onChangeFilterHndlr}
                                                        inputClassName="tw-bg-gray-100"
                                                        formgroupClassName="tw-mb-0"
                                                        placeHolder="Search with Employee"
                                                        labelText="Search with Employee"
                                                        floatingLabel
                                                    />
                                                    <i className="ri-search-line search-icon" />
                                                </div>
                                            </div>

                                            <div className="tw-col-span-6 xl:tw-col-span-2">
                                                <SelectInput
                                                    name="academicYearId"
                                                    value={filterState.academicYearId}
                                                    onChange={onChangeFilterHndlr}
                                                    menuItems={academicYearListResp?.data}
                                                    formgroupClassName="tw-mb-0"
                                                    valueKey="academicYearId"
                                                    textKey="academicYearName"
                                                    labelText="Academic Year"
                                                    floatingLabel
                                                />
                                            </div>

                                            <div className="tw-col-span-6 xl:tw-col-span-2">
                                                <SelectInput
                                                    name="category"
                                                    value={filterState.category}
                                                    onChange={onChangeFilterHndlr}
                                                    formgroupClassName="tw-mb-0"
                                                    labelText="Employee Category"
                                                    floatingLabel
                                                    menuItems={[
                                                        { name: "ACADEMIC", key: "ACADEMIC" },
                                                        { name: "NON ACADEMIC", key: "NON_ACADEMIC" }
                                                    ]}
                                                    valueKey="key"
                                                    textKey="name"
                                                />
                                            </div>

                                        </div>
                                    </div>

                                    <TableContainer
                                        columns={studentColumns}
                                        data={getComplaintDepartmentListResp?.data || []}
                                        divClass="tw-overflow-x-auto tw-mb-3"
                                        tableClass="tw-w-full tw-whitespace-nowrap"
                                        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                                        showPagination={true}
                                        totalPages={totalPages}
                                        totalRecords={totalRecords}
                                        callbackPaginationHndlr={paginationHndlr}
                                        currentPageNumber={pageNumber}
                                        manualSorting={true}
                                        sortingHandler={sortingHandler}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ModalContainerUpdated
                id="add-edit-concern-feedback-modal"
                isOpen={addComplaintDeptModalState.showModal}
                toggle={() => toggleAddComplaintDeptModal()}
                modalTitle={addComplaintDeptModalState?.modalData ? "Update Complaint Department" : "Create Complaint Department"}
                modalSize="md"
            >
                <AddComplaintDepartment
                    toggle={() => toggleAddComplaintDeptModal()}
                    modalData={addComplaintDeptModalState?.modalData}
                />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="application-sale-export-modal"
                isOpen={deleteComplaintDeptModal.showModal}
                confirmMessage={`Total ${deleteComplaintDeptModal?.count || "0"} Complaint are there . Do you want to delete this department ?`}
                cancelHndlr={()=>toggledeleteComplaintDeptModal()}
                confirmHndlr={deleteComplaintDeptHndler}
                isDisble={showApiLoader}
                showImgIcon={true}
                iconType='reject'
                btnClassName='btn w-sm btn-danger'
            />
             <ModalContainerUpdated
                id="all-employees-details"
                isOpen={employeeDetailModalState.showModal}
                toggle={() => toggleEmployeeDetailModal()}
                modalTitle="Assignees Details"
                modalSize="md"
            >
                <EmployeeDetailModal employeeList={employeeDetailModalState?.employees || []} />

            </ModalContainerUpdated>
        </React.Fragment>
    )
}

export default ComplaintDepartment;