import React, { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardBody, Row, Col, Input } from "reactstrap";
import { ConfirmationModal, TextIconInput } from "../../../Components/Common";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Common Component
import TableContainer from "../../../Components/Common/TableContainer";
import { generateColumns, roleTypeData } from "./helper";

//Modal Component
import AddEditRoleModal from "./AddEditRoleModal";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";


//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { deleteInstRoleTypeAct, getInstRoleTypeAct } from "../../../store/mastersettings/instituteinfo/instituteinfoactions";


//Common Utility
import { getSortingKeys } from "../../../utility/commonutility";

//types
import { IRoleTypesProps, IRoleModalState, IDelRoleModalState } from "./roletypes";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { setAutoFreeze } from "immer";

const RoleTypes: React.FC<IRoleTypesProps> = ({ instituteId, instituteName }) => {
    const [roleModalState, setRoleModalState] = useState<IRoleModalState>({ showModal: false, roleId: undefined, modalData: undefined });
    const [delRoleModalState, setDelRoleModalState] = useState<any>({
        showModal: false,
        delModalData: undefined
    });
    const [filterState, setFilterState] = useState<any>({
        searchString: undefined
    });
    const paginationDetailRef = useRef<any>({
        pageNo: 0,
        pageSize: 10,
    });
    const sortingDetailRef = useRef<any>(undefined);

    const dispatch = useAppDispatch();
    const { instRoleTypeListResp, deleteInstRoleTypeResp, instInfoError } = useAppSelector(({ instituteInfo }) => ({
        instRoleTypeListResp: instituteInfo.instRoleTypeListResp,
        deleteInstRoleTypeResp: instituteInfo.deleteInstRoleTypeResp,
        instInfoError: instituteInfo.instInfoError
    }), shallowEqual);

    const departmentRespRef = useRef<any>({
        prevDeleteInstRoleTypeResp: deleteInstRoleTypeResp,
        prevInstInfoError: instInfoError
    });

    useEffect(() => {
        if (instituteId) {
            getRoleTypeApiCall();
        }
    }, [instituteId]);

    useEffect(() => {
        const { prevDeleteInstRoleTypeResp, prevInstInfoError } = departmentRespRef.current;
        if (deleteInstRoleTypeResp && prevDeleteInstRoleTypeResp !== deleteInstRoleTypeResp) {
            setDelRoleModalState((prevState: any) => ({ ...prevState, showModal: false, modalData: undefined }));
            getRoleTypeApiCall();
            toast.success("Role type deleted successfully.");
        } else if (instInfoError && instInfoError !== prevInstInfoError) {
            const { details }: any = instInfoError;
            toast.error(details || "Something went wrong.");
        }
        departmentRespRef.current.prevDeleteInstRoleTypeResp = deleteInstRoleTypeResp;
        departmentRespRef.current.prevInstInfoError = instInfoError;
    }, [deleteInstRoleTypeResp, instInfoError]);

    const toggleRoleTypeModal = useCallback((apiCall?: boolean) => {
        setRoleModalState(prevState => ({ ...prevState, showModal: !prevState.showModal }))
        if (typeof (apiCall) === "boolean" && apiCall) {
            getRoleTypeApiCall();
        }
    }, [instituteId, instRoleTypeListResp]);

    function addRoleTypeHndlr() {
        setRoleModalState(prevState => ({ ...prevState, showModal: true, roleId: "", modalData: undefined }));
    }

    function editRoleTypeHndlr(event: any) {
        const roleId = event.currentTarget.getAttribute("data-id"),
            modalData: any = instRoleTypeListResp?.data.find((item: any) => item.id === Number(roleId));
        if (modalData) {
            setRoleModalState(prevState => ({ ...prevState, showModal: true, roleId, modalData }));
        }
    }

    function deleteDepartmentHndlr(event: any) {
        const roleId = event.currentTarget.getAttribute("data-id"),
            modalData: any = instRoleTypeListResp?.data.find((item: any) => item.id === Number(roleId));
        if (modalData)
            setDelRoleModalState((prevState: any) => ({ ...prevState, showModal: true, delModalData: modalData }));
    }

    const menuOptions = useMemo((): IOptionsHrtl[] => ([
        {
            id: "edit",
            actionIcon: <i className="text-primary ri-pencil-fill fs-16"></i>,
            actionName: "Edit",
            onClickHndlr: editRoleTypeHndlr,
        },
        {
            id: "delete",
            actionIcon: <i className="text-danger ri-delete-bin-5-fill fs-16"></i>,
            actionName: "Delete",
            onClickHndlr: deleteDepartmentHndlr
        }]), [instRoleTypeListResp]);


    function delModalCancelHndlr() {
        setDelRoleModalState((prevState: any) => ({ ...prevState, showModal: false, delModalData: undefined }));
    }
    function delModalSubmitHndlr() {
        const { delModalData } = delRoleModalState,
            { id: roleId, roleType } = delModalData;
        if (roleId && roleType) {
            dispatch(deleteInstRoleTypeAct(generateActionPayload("delete_inst_role_type", { roleType, roleId })));
        }
    }
    function paginationHndlr(paginationInfo: any) {
        paginationDetailRef.current = paginationInfo;
        getRoleTypeApiCall();
    }

    function getRoleTypeApiCall(otherProps?: any) {
        const { pageNo, pageSize } = paginationDetailRef.current || {};
        const sortingParams = getSortingKeys(sortingDetailRef.current);
        const payload = {
            instituteId, ...filterState, ...otherProps, is_predefined: false,
            pageNo: (Number(pageNo) + 1), pageSize: pageSize, isPageable: true,
            ...sortingParams
        };
        const params = { roleType: "all" };
        dispatch(getInstRoleTypeAct(generateActionPayload("get_inst_role_type", params, payload)));
    }
    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        //Resest page number to 0 if filters are applied
        paginationDetailRef.current.pageNo = 0;
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        getRoleTypeApiCall({ [name]: value });
    }

    function sortingHandler(sortingKeys: any) {
        if (sortingDetailRef.current && sortingDetailRef.current !== sortingKeys) {
            sortingDetailRef.current = sortingKeys;
            getRoleTypeApiCall();
            //Testing
        } else {
            sortingDetailRef.current = sortingKeys;
        }
    }


    const roleColumns = useMemo(() => generateColumns(menuOptions), [instRoleTypeListResp]),
        { data: roleTypeList, pageNumber, totalPages, totalElements } = instRoleTypeListResp || {};
    return (
        <React.Fragment>
            <Card>
                <CardHeader>
                    <h4 className="card-title mb-0 flex-grow-1">Role Types</h4>
                </CardHeader>
                <CardBody className="p-0">
                    <div className="py-3 px-3">
                        <form onClick={e => e.preventDefault()}>
                            <Row className="g-3">
                                <Col xl={4}>
                                    <TextIconInput
                                        formgroupClassName="search-box"
                                        name="searchString"
                                        value={filterState.searchString}
                                        placeHolder="Search..."
                                        onChange={onChangeFilterHndlr}
                                    ><i className="ri-search-line search-icon"></i></TextIconInput>
                                </Col>
                                <Col xl={"auto"} className="ms-auto">
                                    <button className="btn btn-success float-end px-4" onClick={addRoleTypeHndlr}>Add Role</button>
                                </Col>
                            </Row>
                        </form>
                    </div>
                    <TableContainer
                        columns={roleColumns || []}
                        data={roleTypeList || []}
                        divClass="table-responsive mb-1"
                        theadClass="table-light text-muted align-middle"
                        showPagination={true}
                        totalPages={totalPages}
                        totalRecords={totalElements}
                        callbackPaginationHndlr={paginationHndlr}
                        currentPageNumber={pageNumber}
                        manualSorting={true}
                        sortingHandler={sortingHandler}
                    />
                </CardBody>
            </Card>
            <AddEditRoleModal
                isOpen={roleModalState.showModal}
                toggle={toggleRoleTypeModal}
                modalTitle={roleModalState.roleId ? "Edit Role" : "Add Role"}
                roleId={roleModalState.roleId}
                instituteId={instituteId}
                editRoleDetails={roleModalState.modalData}
            />
            <ConfirmationModal
                id="delete-role-modal"
                isOpen={delRoleModalState.showModal}
                confirmMessage="Are you sure you want to delete this role ?"
                cancelHndlr={delModalCancelHndlr}
                confirmHndlr={delModalSubmitHndlr}
            />
        </React.Fragment >
    )
}

export default RoleTypes;