import React, { useCallback, useMemo, useState } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Common Component
import TableContainer from "../../../Components/Common/TableContainer";
import { ConfirmationModal, ModalContainerUpdated, TextIconInput } from "../../../Components/Common";
import { generateColumns } from "./helper";

//Modal Component
import AddEditDepartment from "./AddEditDepartment";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { useEffect, useRef } from "react";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { getInstDepartmentAct, deleteInstDepartmentAct } from "../../../store/mastersettings/instituteinfo/instituteinfoactions";
// Interface & Types
import { IAddDepartmentModalState, IDepartmentsProps, IDelDepartmentModalState, IDepartmentRespRef, IFilterDepartmentState } from "./departementtypes";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { IPaginationState } from "../../../Components/Common/Pagination";

//Common Utility
import { getSortingKeys } from "../../../utility/commonutility";
import Button from "../../../Components/Common/Button";

const Departments: React.FC<IDepartmentsProps> = ({ instituteId, instituteName }) => {
    const [addModalState, setAddModalState] = useState<IAddDepartmentModalState>({
        showModal: false, departmentId: ""
    });
    const [delDepartmentModalState, setDelDepartmentModalState] = useState<IDelDepartmentModalState>({
        showModal: false,
        departmentId: ""
    })
    const [filterState, setFilterState] = useState<IFilterDepartmentState>({
        departmentName: undefined
    });
    const paginationDetailRef = useRef<any>({
        pageNo: 0,
        pageSize: 10,
    });
    const sortingDetailRef = useRef<any>(undefined);

    const dispatch = useAppDispatch();
    const { instDepartmentResp, deleteInstDepartmentResp, instInfoError } = useAppSelector(({ instituteInfo }) => ({
        instDepartmentResp: instituteInfo.instDepartmentResp,
        deleteInstDepartmentResp: instituteInfo.deleteInstDepartmentResp,
        instInfoError: instituteInfo.instInfoError
    }), shallowEqual);

    const departmentRespRef = useRef<IDepartmentRespRef>({
        prevDeleteInstDepartmentResp: deleteInstDepartmentResp,
        prevInstInfoError: instInfoError
    });

    useEffect(() => {
        if (instituteId) {
            getDepartmentsApiCall();
        }
    }, [instituteId]);

    useEffect(() => {
        const { prevDeleteInstDepartmentResp, prevInstInfoError } = departmentRespRef.current;
        if (deleteInstDepartmentResp && prevDeleteInstDepartmentResp !== deleteInstDepartmentResp) {
            setDelDepartmentModalState(prevState => ({ ...prevState, showModal: false, departmentId: "" }));
            getDepartmentsApiCall();
            toast.success("Department deleted successfully.");
        } else if (instInfoError && instInfoError !== prevInstInfoError) {
            const { details }: any = instInfoError;
            toast.error(details || "Something went wrong.");
        }
        departmentRespRef.current.prevDeleteInstDepartmentResp = deleteInstDepartmentResp;
        departmentRespRef.current.prevInstInfoError = instInfoError;
    }, [deleteInstDepartmentResp, instInfoError]);

    const toggleDepartmentModal = useCallback((apiCall?: boolean) => {
        setAddModalState(prevState => ({ ...prevState, showModal: !prevState.showModal }))
        if (typeof (apiCall) === "boolean" && apiCall) {
            getDepartmentsApiCall();
        }
    }, [instituteId, instDepartmentResp]);

    function addDepartmentHndlr() {
        setAddModalState(prevState => ({ ...prevState, showModal: true, departmentId: "", modalData: undefined }));
    }

    function editDepartmentHndlr(event: any) {
        const departmentId = parseInt(event.currentTarget.getAttribute("data-id"));
        let modalData: any = instDepartmentResp?.data.find((item: any) => item.departmentId === departmentId);

        if (modalData) {
            setAddModalState((prevState: any) => ({ ...prevState, showModal: true, departmentId, modalData }));
        }
    }

    function deleteDepartmentHndlr(event: any) {
        const departmentId = event.currentTarget.getAttribute("data-id");
        if (departmentId)
            setDelDepartmentModalState(prevState => ({ ...prevState, showModal: true, departmentId }));
    }

    const menuOptions = useMemo((): IOptionsHrtl[] => ([{
        id: "edit",
        actionIcon: <i className="text-primary ri-pencil-fill fs-16"></i>,
        actionName: "Edit",
        onClickHndlr: editDepartmentHndlr,
    }, {
        id: "delete",
        actionIcon: <i className="text-danger ri-delete-bin-5-fill fs-16"></i>,
        actionName: "Delete",
        onClickHndlr: deleteDepartmentHndlr
    }]), [instDepartmentResp]);

    function delModalCancelHndlr() {
        setDelDepartmentModalState(prevState => ({ ...prevState, showModal: false }));
    }
    function delModalSubmitHndlr() {
        const { departmentId } = delDepartmentModalState;
        dispatch(deleteInstDepartmentAct(generateActionPayload("delete_inst_department", { departmentId })));
    }
    function paginationHndlr(paginationInfo: IPaginationState) {
        if (paginationInfo.pageNo === 2) {
            return;
        }
        paginationDetailRef.current = paginationInfo;
        getDepartmentsApiCall();
    }

    function getDepartmentsApiCall(otherProps?: any) {
        const sortingParams = getSortingKeys(sortingDetailRef.current);
        const payload = {
            ...filterState, ...otherProps, instituteId, isFeeDepartment: 0, ...paginationDetailRef.current,
            ...sortingParams
        };
        dispatch(getInstDepartmentAct(generateActionPayload("get_inst_departments", undefined, payload)));
    }
    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        //Resest page number to 0 if filters are applied
        paginationDetailRef.current.pageNo = 0;
        setFilterState(prevState => ({ ...prevState, [name]: value }));
        getDepartmentsApiCall({ "departmentName": value });
    }

    function sortingHandler(sortingKeys: any) {
        if (sortingDetailRef.current && sortingDetailRef.current !== sortingKeys) {
            sortingDetailRef.current = sortingKeys;
            getDepartmentsApiCall();
            //Testing
        } else {
            sortingDetailRef.current = sortingKeys;
        }
    }


    const departmentColumns = useMemo(() => generateColumns(menuOptions), [instDepartmentResp]),
        { data: departmentList, pageNumber, totalPages, totalElements } = instDepartmentResp || {};
    return (
        <React.Fragment>
            <div className="tw-bg-white tw-rounded-lg tw-shadow">
                <div className="tw-px-4 tw-py-3 tw-border-b">
                    <div className="tw-flex tw-items-center">
                        <div className="tw-flex-1">
                            <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                Department
                            </h4>
                        </div>
                        <div className="tw-ml-auto">
                            <Button
                            variant="primary"
                                onClick={addDepartmentHndlr}
                            >
                                Add Department
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="tw-p-0">
                    <div className="tw-px-3 tw-py-3">
                        <form onClick={e => e.preventDefault()}>
                            <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                                <div className="tw-col-span-12 lg:tw-col-span-4">
                                    <TextIconInput
                                        formgroupClassName="search-box"
                                        name="departmentName"
                                        value={filterState.departmentName}
                                        placeHolder="Search"
                                        onChange={onChangeFilterHndlr}
                                        labelText="Search"
                                        floatingLabel
                                    >
                                        <i className="ri-search-line search-icon"></i>
                                    </TextIconInput>
                                </div>
                            </div>
                        </form>
                    </div>

                    <TableContainer
                        columns={departmentColumns || []}
                        data={departmentList || []}
                        divClass="tw-overflow-x-auto tw-mb-1"
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
            <ModalContainerUpdated
          id="add-department-admin"
          isOpen={addModalState.showModal}
          toggle={toggleDepartmentModal}
          modalTitle={addModalState.departmentId ? "Edit Department" : "Add Department"}
          modalSize="md"
            > 
            <AddEditDepartment
                isOpen={addModalState.showModal}
                toggle={toggleDepartmentModal}
                instituteId={instituteId}
                departmentId={addModalState.departmentId}
                editDepartmentDetails={addModalState.modalData}
            />
             </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-branch-modal"
                isOpen={delDepartmentModalState.showModal}
                confirmMessage="Are you sure you want to delete this department ?"
                cancelHndlr={delModalCancelHndlr}
                confirmHndlr={delModalSubmitHndlr}
            />
        </React.Fragment>
    )
}

export default Departments;