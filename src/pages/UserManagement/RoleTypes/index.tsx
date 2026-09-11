import React, { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { ConfirmationModal, TextIconInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Common Component
import TableContainer from "../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";


//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { deleteInstRoleTypeAct, getInstRoleTypeAct } from "../../../store/mastersettings/instituteinfo/instituteinfoactions";


import { default as UserLockSvg } from "../../../assets/imagesdps/academics/UserLockSvg.svg?react";
import { default as EditSvg } from "../../../assets/imagesdps/academics/EditSvg.svg?react";
import AssignModule from './AssignModule';
//Common Utility
import { getSortingKeys } from "../../../utility/commonutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon, UserUnlock01StrokeStandard } from "@hugeicons-pro/core-stroke-standard";

const filterData = {
    searchString: ""
}
const RoleTypes = () => {
    const [filterState, setFilterState] = useState(filterData);
    const [assignModuleModalState, setAssignModuleModuleState] = useState({
        showModal: false
    })
    const paginationDetailRef = useRef<any>({
        pageNo: 0,
        pageSize: 10,
    });
    const sortingDetailRef = useRef<any>(undefined);

    const dispatch = useAppDispatch();
    const { currentInstIdResp: instituteId, instRoleTypeListResp, deleteInstRoleTypeResp, instInfoError } = useAppSelector(({ appData, instituteInfo }) => ({
        currentInstIdResp: appData.currentInstIdResp,
        instRoleTypeListResp: instituteInfo.instRoleTypeListResp,
        deleteInstRoleTypeResp: instituteInfo.deleteInstRoleTypeResp,
        instInfoError: instituteInfo.instInfoError
    }), shallowEqual);

    useEffect(() => {
        if (instituteId) {
            getRoleTypeApiCall();
        }
    }, [instituteId]);

    function showAssignModuleHndlr() {
        setAssignModuleModuleState((prevState: any) => ({ ...prevState, showModal: true }))
    }

    function toggleModuleHndlr() {
        setAssignModuleModuleState((prevState: any) => ({ ...prevState, showModal: false }))
    }

    const menuOptions = useMemo(() => [
        {
            id: "setPermission",
            actionIcon: <HugeiconsIcon
                icon={UserUnlock01StrokeStandard}
                className="tw-mr-2 tw-text-gray-500"
                size={18}
            />,
            actionName: "Set Permission",
            onClickHndlr: showAssignModuleHndlr,
        },
        {
            id: "edit",
            actionIcon: <HugeiconsIcon
                icon={PencilEdit02Icon}
                className="tw-mr-2 tw-text-gray-500" size={18}
            />,
            actionName: "Edit",
            // onClick: () => { },
        }
    ],
        []
    );

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        //Resest page number to 0 if filters are applied
        paginationDetailRef.current.pageNo = 0;
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        getRoleTypeApiCall({ [name]: value });
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

    function setPermssionHndlr() {
        setAssignModuleModuleState((prevState: any) => ({ ...prevState, showModal: true }))
    }

    const roleColumns = useMemo(() => generateColumns(menuOptions, setPermssionHndlr), [instRoleTypeListResp]),
        { data: roleTypeList, pageNumber, totalPages, totalElements } = instRoleTypeListResp || {};
    return (
        <React.Fragment>
            <div className="page-content free_payment_record_wrapper">
                <div className="container-fluid">
                    <BreadCrumb title="Role Type" pageTitle="User Management" />
                    <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-mb-6">
                        <div className="tw-border-b tw-px-4 tw-py-3">
                            <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                Role Type
                            </h4>
                        </div>
                        <div className="tw-p-0">
                            <div className="tw-px-4 tw-py-4">
                                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                                    <div className="tw-col-span-12 md:tw-col-span-4">
                                        <TextIconInput
                                            formgroupClassName="search-box tw-mb-0"
                                            name="searchString"
                                            value={filterState.searchString}
                                            placeHolder="Search"
                                            labelText="Search"
                                            floatingLabel
                                            onChange={onChangeFilterHndlr}
                                        >
                                            <i className="ri-search-line search-icon"></i>
                                        </TextIconInput>
                                    </div>
                                </div>
                            </div>
                            <TableContainer
                                columns={roleColumns || []}
                                data={roleTypeList || []}
                                divClass="tw-overflow-x-auto tw-mb-3"
                                theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                                showPagination={true}
                                totalPages={totalPages}
                                totalRecords={totalElements}
                                callbackPaginationHndlr={() => { }}
                                currentPageNumber={pageNumber}
                                manualSorting={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <AssignModule
                isOpen={assignModuleModalState.showModal}
                toggle={toggleModuleHndlr}
            />
        </React.Fragment>
    )
}

export default RoleTypes
