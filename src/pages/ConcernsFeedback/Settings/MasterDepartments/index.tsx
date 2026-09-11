
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ModalContainerUpdated, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { toast } from "react-toastify";
import { getMasterComplaintDeptListAct } from "../../../../store/concernsfeedback/complaintdepartment/complaintdepartmentaction";
import AddMasterDeptModal from "./AddMasterDeptModal";
import { useModal } from "../../../../hooks/modalhook";
import Button from "../../../../Components/Common/Button";

const initialValues: any = {
    searchString: "",
};

const MasterDepartment = () => {

    const dispatch = useDispatch()
    const [filterState, setFilterState] = useState<any>(initialValues);
    
     const { modalState: duedateSmsModalState, closeModal: closeDuedateSmsModalHndlr,
            openModal: openDuedateSmsModalHndlr
        } = useModal();

    const paginationDetailRef = useRef<any>({   
        pageNo: 0,
        pageSize: 10,
    });

    const { currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getMasterComplaintDeptListResp,
        saveMasterComplaintDeptResp,
        complaintDepartmentErrResp,
        loggedInUserRole,
        virtualRoleResp
    }: any = useAppSelector(({ appData, globalData, complaintDepartment }) => ({

        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,
        showApiLoader: globalData.showApiLoader,
        getMasterComplaintDeptListResp: complaintDepartment.getMasterComplaintDeptListResp,
        saveMasterComplaintDeptResp: complaintDepartment.saveMasterComplaintDeptResp,
        complaintDepartmentErrResp: complaintDepartment.complaintDepartmentErrResp,
        loggedInUserRole: appData.loggedInUserRole,
        virtualRoleResp: appData.virtualRoleResp


    }), shallowEqual);

    const showInstituteAdminUI = loggedInUserRole === 'INSTITUTE_ADMIN' && !virtualRoleResp;

    const addMasterComplaintRef = React.useRef<any>({
        prevSaveMasterComplaintDeptResp: saveMasterComplaintDeptResp,
        prevComplaintDepartmentErrResp: complaintDepartmentErrResp,
    });
    
    React.useEffect(() => {
        const { prevComplaintDepartmentErrResp, prevSaveMasterComplaintDeptResp } = addMasterComplaintRef.current;

        if (complaintDepartmentErrResp && prevComplaintDepartmentErrResp !== complaintDepartmentErrResp) {
            const { details } = complaintDepartmentErrResp;
            toast.error(details)
        }
        else if (saveMasterComplaintDeptResp && prevSaveMasterComplaintDeptResp !== saveMasterComplaintDeptResp) {
            toast.success("Complaint Department Added Successfully")
            getAllMasterDeptList()
            closeDuedateSmsModalHndlr();
        }

        addMasterComplaintRef.current.prevSaveMasterComplaintDeptResp = saveMasterComplaintDeptResp;
        addMasterComplaintRef.current.prevComplaintDepartmentErrResp = complaintDepartmentErrResp;

    }, [saveMasterComplaintDeptResp, complaintDepartmentErrResp]);

    function getMasterDeptList(otherProps?: any) {
        const payload = { ...paginationDetailRef.current, branchId, ...otherProps }
        dispatch(getMasterComplaintDeptListAct(generateActionPayload("get_master_complaint_dept_list", undefined, { ...payload })));
    }

    function getAllMasterDeptList(otherProps?: any) {
        const payload = { ...paginationDetailRef.current, instituteId, ...otherProps }
        dispatch(getMasterComplaintDeptListAct(generateActionPayload("get_master_complaint_dept_list_all", undefined, { ...payload })));
    }


    const menuOptions = useMemo((): any[] => ([
        {
            id: "edit",
            actionIcon: <i className="text-primary ri-pencil-fill fs-16"></i>,
            actionName: "Edit",
            onClickHndlr: (event: any) => {
                const id = event.currentTarget.getAttribute("data-id");
                openDuedateSmsModalHndlr(id);
            },
        }
    ]), []);

    useEffect(() => {
        if(showInstituteAdminUI){
            getAllMasterDeptList()
        }
        else{
            getMasterDeptList()
        }
    }, [])

    function paginationHndlr(paginationInfo: any) {
        paginationDetailRef.current = paginationInfo;
        if (showInstituteAdminUI) {
            getAllMasterDeptList(paginationInfo)
        } else {
            getMasterDeptList(paginationInfo)
        }
    }

    const filterHndler = (event: any) => {
        const { value, name } = event.target
        setFilterState((prev: any) => ({ ...prev, [name]: value }))
        paginationDetailRef.current.pageNo = 0
        if (showInstituteAdminUI) {
            getAllMasterDeptList({ [name]: value })
        } else {
            getMasterDeptList({ [name]: value })
        }
    }

    const roleColumns = useMemo(() => generateColumns(menuOptions, showInstituteAdminUI, paginationDetailRef), [getMasterComplaintDeptListResp, showInstituteAdminUI, paginationDetailRef]);

    const { totalElements: totalRecords, totalPages, pageNumber } = getMasterComplaintDeptListResp || {}

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Students Management" pageTitle="Helpdesk Settings" />

                    <div className="tw-mt-4">
                        <div className="tw-w-full">
                            <div className="tw-bg-white tw-rounded-lg tw-shadow" id="tasksList">

                                <div className="tw-border-b tw-px-4 tw-py-3">
                                    <div className="tw-flex tw-items-center">
                                        <h4 className="tw-text-lg tw-font-semibold tw-flex-grow tw-mb-0">
                                            Departments
                                        </h4>

                                        {showInstituteAdminUI && (
                                            <div className="tw-flex-shrink-0 tw-text-center">
                                                <Button
                                                    variant="primary"
                                                    onClick={() => openDuedateSmsModalHndlr()}
                                                >
                                                    <i className="ri-add-line" />
                                                    <span>Add New</span>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="tw-p-0">
                                    <div className="tw-px-4 tw-py-3">
                                        <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                                            <div className="tw-col-span-12">
                                                <div className="tw-grid tw-grid-cols-12 tw-gap-3">

                                                    <div className="tw-col-span-6 xl:tw-col-span-4">
                                                        <div className="tw-relative">
                                                            <TextInput
                                                                name="searchString"
                                                                value={filterState.searchString}
                                                                onChange={filterHndler}
                                                                inputClassName="tw-bg-gray-100"
                                                                formgroupClassName="tw-mb-0"
                                                                placeHolder="Search"
                                                                labelText="Search"
                                                                floatingLabel
                                                            />
                                                            <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <TableContainer
                                        columns={roleColumns}
                                        data={getMasterComplaintDeptListResp?.data || []}
                                        divClass="tw-overflow-x-auto tw-mb-3"
                                        tableClass="tw-w-full tw-whitespace-nowrap"
                                        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                                        showPagination={true}
                                        totalPages={totalPages}
                                        totalRecords={totalRecords}
                                        callbackPaginationHndlr={paginationHndlr}
                                        currentPageNumber={pageNumber}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="add-master-complaint-dept"
                isOpen={duedateSmsModalState.showModal}
                toggle={closeDuedateSmsModalHndlr}
                modalTitle={duedateSmsModalState.modalData ? "Edit Master Complaint Department" : "Add Master Complaint Department"}
                modalSize="md"
            >
                <AddMasterDeptModal
                    isOpen={duedateSmsModalState.showModal}
                    toggle={closeDuedateSmsModalHndlr}
                    id={duedateSmsModalState.modalData}
                />
            </ModalContainerUpdated>
        </>
    );
};

export default MasterDepartment;
