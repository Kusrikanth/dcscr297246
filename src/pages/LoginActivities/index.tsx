import React, { useCallback, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Card, CardHeader, CardBody, Row, Col, Button, Input } from "reactstrap";
import { shallowEqual } from "react-redux";
import classnames from "classnames";
import { toast } from "react-toastify";
//Common Component
import TableContainer from "../../Components/Common/TableContainer";
import { ConfirmationModal, TextIconInput, DateInput, ModalContainerUpdated } from "../../Components/Common";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { generateColumns } from "./helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import { useEffect, useRef } from "react";

//Action Generator
import { generateActionPayload } from "../../utility/reduxutility";
import { getInstBranchesAct, updateMainBranchAct, deleteBranchAct } from "../../store/mastersettings/branch/branchactions";
import { getInstituteListAct } from "../../store/mastersettings/instituteinfo/instituteinfoactions";
import { getRoleTypeUserByIdAct, getUserLoginActivityAct } from "../../store/usermanagement/usermanagementactions";
// Component
import LoginUserInfoCard from "./LoginUserInfoCard";
//
// Interface & Types
import { IBranchInfo } from "../../store/mastersettings/branch/branchtypes";
import { IOptionsHrtl } from "../../Components/Common/MenuOptions";
import { IPaginationState } from "../../Components/Common/Pagination";

//Utility
import { Current_Date_DDMMYYYY, Current_Date_YYYYMMDD, Current_Date, getYyyyMmDdFormat } from "../../utility/dateutility";
import { setLoginActivityForUserDetailsAct } from "../../store/appdata/appdataactions";

import ChangePassword from "./ChangePassword";

const todayDate = new Date();
todayDate.setDate(todayDate.getDate() + 1);
const tomorrowDate = getYyyyMmDdFormat(todayDate);

export default function LoginActivities() {
    const [filterState, setFilterState] = useState({
        startDate: Current_Date_YYYYMMDD,
        endDate: tomorrowDate
    });
    const [changePwdModalState, setChangePwdModalState] = useState({
        showModal: false,
        userIds: undefined
    });
    const dispatch = useAppDispatch();
    const { getLoginActivityForUserDetails, roleTypeUserByIdResp, userLoginActivityResp, userManagementErrorResp } = useAppSelector(({ appData, userManagement }) => ({
        getLoginActivityForUserDetails: appData.getLoginActivityForUserDetails,
        roleTypeUserByIdResp: userManagement.roleTypeUserByIdResp,
        userLoginActivityResp: userManagement.userLoginActivityResp,
        userManagementErrorResp: userManagement.userManagementErrorResp
    }), shallowEqual);

    const loginActivityRespRef = useRef({
        prevRoleTypeUserByIdResp: roleTypeUserByIdResp,
        prevUserLoginActivityResp: userLoginActivityResp,
        prevUserManagementErrorResp: userManagementErrorResp
    });

    const paginationDetailRef = useRef<any>({
        pageNo: 0,
        pageSize: 10,
    });
    useEffect(() => {
        const { prevUserManagementErrorResp } = loginActivityRespRef.current || {};
        if (userManagementErrorResp && userManagementErrorResp !== prevUserManagementErrorResp) {
            const { message, details } = userManagementErrorResp;
            toast.error(message || details);
        }
        loginActivityRespRef.current.prevUserManagementErrorResp = userManagementErrorResp;
    }, [userManagementErrorResp]);

    useEffect(() => {
        const { userId, roleType } = getLoginActivityForUserDetails || {};
        if (userId && roleType) {
            const params = {
                roleType, userId
            }
            dispatch(getRoleTypeUserByIdAct(generateActionPayload("loggedin_user_details", params)));
            getUserLoginActivityApiCall();
        }
        // return () => { dispatch(setLoginActivityForUserDetailsAct(undefined)) }
    }, [getLoginActivityForUserDetails]);

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState(prevState => ({ ...prevState, [name]: value }));
        getUserLoginActivityApiCall({ [name]: value });
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        paginationDetailRef.current = paginationInfo;
        getUserLoginActivityApiCall();
    }

    function getUserLoginActivityApiCall(otherProps?: any) {
        const { pageNo, pageSize } = paginationDetailRef.current || {};
        const { userId } = getLoginActivityForUserDetails || {},
            activityPayload = { userId, ...filterState, ...otherProps, pageNo: (Number(pageNo) + 1), pageSize: pageSize, isPageable: true };
        dispatch(getUserLoginActivityAct(generateActionPayload("get_login_activity", undefined, activityPayload)));
    }

    function changePasswordHndlr() {
        const { userId } = getLoginActivityForUserDetails || {};
        if (userId) {
            setChangePwdModalState((prevState: any) => ({
                ...prevState,
                showModal: true,
                userIds: [userId],

            }))
        }
    }
    const toggleChangePwdHandler = useCallback((apiCall?: boolean) => {
        setChangePwdModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
    }, []);


    const activityColumns = useMemo(() => generateColumns(), []);
    const { data: activityTableData, totalElements, pageNumber, totalPages } = userLoginActivityResp || {};
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Login Activities" pageTitle="User Management" />
                    <div className="row gx-3">
                        <div className="col-xs-12 col-md-5 col-lg-4">
                            <LoginUserInfoCard
                                userDetails={roleTypeUserByIdResp}
                                changePasswordHndlr={changePasswordHndlr}
                            />
                        </div>
                        <div className="col-xs-12 col-md-7 col-lg-8">
                            <div className="card mb-0">
                                <div className="card-header">
                                    <div className="row">
                                        <div className="col-xs-6 col-lg-4">
                                            <DateInput
                                                name="startDate"
                                                value={filterState.startDate}
                                                formgroupClassName="mb-0"
                                                onChange={onChangeFilterHndlr}
                                                maxDate={Current_Date_YYYYMMDD}
                                                labelText="Start Date"
                                                floatingLabel
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body p-0">

                                    <TableContainer
                                        columns={activityColumns || []}
                                        data={Array.isArray(activityTableData) ? activityTableData : []}
                                        divClass="table-responsive mb-1"
                                        theadClass="table-light text-muted align-middle"
                                        showPagination={true}
                                        totalPages={totalPages}
                                        totalRecords={totalElements < 0 ? 0 : totalElements}
                                        callbackPaginationHndlr={paginationHndlr}
                                        currentPageNumber={pageNumber}
                                    // thClass="text-dark"
                                    // showCheckbox={true}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="change-password-modal"
                modalSize="md"
                modalTitle="Change Password"
                isOpen={changePwdModalState.showModal}
                toggle={toggleChangePwdHandler}
            >
                <ChangePassword
                    toggle={toggleChangePwdHandler}
                    userIds={changePwdModalState.userIds}
                />
            </ModalContainerUpdated>

        </React.Fragment>
    )
}