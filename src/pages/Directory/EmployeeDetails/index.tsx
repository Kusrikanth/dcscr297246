
import React, { useEffect, useMemo, useRef, useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import EmployeeImage from "../../../assets/imagesdps/directory/user-img.png";

import { AutoSearchInput, DropDownToggle, SelectInput, Tabs, TextInput, UploadImage } from "../../../Components/Common";
import { tabsOptions } from "./helper";
//Assets

import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import EmployeeInfo from "./EmployeeInfo";
import { useHistory, useParams } from "react-router-dom";
import { IErrorEmployeeRepRef, IUpdateEmployeeRepRef } from "./EmployeeInfo/EmployeeInfoTypes";
import { toast } from "react-toastify";
import { details } from "./EmployeeInfo/helper";
import { updateStudentAct } from "../../../store/directory/studentmanagement/studentmanagementactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { Categories } from "../StudentDetails/helper";
import { getSortingKeys, uploadImageFileErrorHndlr } from "../../../utility/commonutility";
import { Current_Date_YYYYMMDD, getDdMmYyyyWithMonthNameFormat, getDurationBetweenDates } from "../../../utility/dateutility";
import { getEmployeeByFilterAct, getEmployeesListAct } from "../../../store/directory/employeemanagement/employeemanagementactions";
import Button from "../../../Components/Common/Button";

export default function EmployeeDetails() {
    const [activeTabId, setActiveTabId] = useState<string | null>("personal-info");
    const [userImageState, setUserImageState] = useState<any>("");
    const [category, setCategory] = useState('');
    const [userImageErrorState, setUserImageErrorState] = useState<any>("");
    const params: any = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    function tabChangeHndlr(tabId: string) {
        setActiveTabId(tabId);
    }
    const [customActiveTab, setcustomActiveTab] = useState("1");

    const toggleCustom = (tab: any) => {
        if (customActiveTab !== tab) {
            setcustomActiveTab(tab);
        }
    };

    const { currentBranchIdResp: branchId,
        currentInstIdResp: instituteId, virtualRoleResp,
        getEmployeeByIdResp, studentManagementErrorResp, loggedInUserRole, employeeCategoriesResp, hrmDepartmentResp, updateStudentResp, getEmployeesByFilterResp } = useAppSelector(
            ({ appData, directoryEmployee, directoryStudent, masterData }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                getEmployeeByIdResp: directoryEmployee.getEmployeeByIdResp,
                studentManagementErrorResp: directoryStudent.studentManagementErrorResp,
                updateStudentResp: directoryStudent.updateStudentResp,
                employeeCategoriesResp: masterData.employeeCategoriesResp,
                hrmDepartmentResp: masterData.hrmDepartmentResp,
                loggedInUserRole: appData.loggedInUserRole,
                virtualRoleResp: appData.virtualRoleResp,
                getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp
            }),
            shallowEqual
        );

    const canCreateAndUpdate = useMemo(() => {
        if (loggedInUserRole === 'INSTITUTE_ADMIN') {
            return !!virtualRoleResp;
        }
        return loggedInUserRole !== 'ACCOUNT' && loggedInUserRole !== 'ACCOUNT_HEAD'
            && loggedInUserRole !== 'ADM_CONS' && loggedInUserRole !== 'ADM_HEAD';
    }, [loggedInUserRole, virtualRoleResp]);


    const EmployeeDetailsRef = useRef<IErrorEmployeeRepRef>({
        prevErrorEmployeeRep: studentManagementErrorResp
    });
    const EmployeeDetailsRespRef = useRef<IUpdateEmployeeRepRef>({
        prevUpdateEmployeeRep: updateStudentResp
    });
    const EmployeeProfileRef = useRef<any>({
        file: null
    });


    const [filterState, setFilterState] = useState({
        branchId: branchId ? branchId?.toString() : '',
        employeeIds: ""
    });

    const [searchEmployeeState, setSearchEmployeeState] = useState<any>(undefined);

    const sortingRef = useRef(undefined);

    function getEmployeeApiCall(otherProps?: any) {
        const sortingParams = getSortingKeys(sortingRef.current, true);
        const params = {
            instituteId,
            ...filterState, ...otherProps,
            ...sortingParams
        };
        dispatch(getEmployeesListAct(generateActionPayload("get_employees", undefined, params)));
    }

    function selectEmployeeHndlr(selectedEmployee: any) {
        setSearchEmployeeState(selectedEmployee);
        if (selectedEmployee) {
            const { id } = selectedEmployee;
            setFilterState((prevState: any) => ({ ...prevState, employeeIds: id }));
            getEmployeeApiCall({ employeeIds: id });
            if (id) {
                history.push(`/employee-management/edit-employee/${id}`)
            }
        }
    }

    function onInputSearchChange(inputString: any) {
        if (inputString) {
            const params = { searchString: inputString };
            dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, { branchId: filterState.branchId })));
        }
    }

    useEffect(() => {
        const { prevErrorEmployeeRep } = EmployeeDetailsRef.current;
        if (studentManagementErrorResp && prevErrorEmployeeRep !== studentManagementErrorResp) {
            const { details } = studentManagementErrorResp;
            toast.error(details || "Something went wrong.");
        }
        EmployeeDetailsRef.current.prevErrorEmployeeRep = studentManagementErrorResp;
    }, [studentManagementErrorResp]);

    useEffect(() => {
        const { prevUpdateEmployeeRep } = EmployeeDetailsRespRef.current;
        if (updateStudentResp && prevUpdateEmployeeRep !== updateStudentResp) {
            setUserImageState(EmployeeProfileRef.current.file);
        }
        EmployeeDetailsRespRef.current.prevUpdateEmployeeRep = updateStudentResp;
    }, [updateStudentResp]);

    useEffect(() => {
        setUserImageState(getEmployeeByIdResp && getEmployeeByIdResp.employeeBasicDetails.fullImageBase64 ? `data:image/png;base64,${getEmployeeByIdResp.employeeBasicDetails.fullImageBase64}` : EmployeeImage)
    }, [getEmployeeByIdResp]);

    function handleFileUploadHnlr(event: any) {
        const file = event.target.files[0];
        let error = uploadImageFileErrorHndlr(file.size, file.type);
        if (error === "") {
            EmployeeProfileRef.current.file = URL.createObjectURL(file);
            // setUserImageState(URL.createObjectURL(file));
            setUserImageErrorState('')
            // branchLogoFileRef.current = event.target.files[0];
            let formData = new FormData();
            const data: any = details(getEmployeeByIdResp, {}, "Profile Picture", { branchId: 1, instituteId: 1 })
            formData.append("employeeRequest", JSON.stringify(data));
            formData.append("employeeImage", event.target.files[0]);
            dispatch(updateStudentAct(generateActionPayload('add_employee', undefined, formData, {
                affectedSection: "Profile Picture"
            })));
        }
        else {
            setUserImageErrorState(error);
        }
    }

    const dpsExperience = useMemo(() => {
        const { employeeCurrentJob } = getEmployeeByIdResp || {}, { doj } = employeeCurrentJob || {};
        if (doj) {
            const duration = getDurationBetweenDates(doj, Current_Date_YYYYMMDD);
            return duration;
        }
        return "-";
        // const duration = getDurationBetweenDates(value, Current_Date_YYYYMMDD);
    }, [getEmployeeByIdResp]);


    function addEmployeeHndlr() {
        history.push("/employee-management/add-employee");
    }

    return (
        <div className="page-content student-detail-container employee-management-details-container">
            <div className="container-fluid">
                <BreadCrumb title="Employee Details" pageTitle="Directory" />
                <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-bg-white tw-p-4 tw-mb-4 employee-complete-details">
                    <div className="tw-col-span-12 lg:tw-col-span-6 ">
                        <div className="tw-search-box">
                            <AutoSearchInput
                                formgroupClassName="tw-search-box"
                                name="searchString"
                                placeHolder="Search"
                                labelText="Search"
                                floatingLabel
                                onChange={onInputSearchChange}
                                valueKey="id"
                                labelKey="employeeName"
                                subLabelKey="employeeCode"
                                labelHeader="Employee Code"
                                subLabelHeader="Employee Name"
                                options={getEmployeesByFilterResp}
                                selected={searchEmployeeState}
                                selectedOptionCallbck={selectEmployeeHndlr}
                            >
                                <i className="ri-search-line tw-search-icon"></i>
                            </AutoSearchInput>
                        </div>
                    </div>

                    {canCreateAndUpdate && <div className="tw-col-span-12 lg:tw-col-span-6  tw-col-start-auto tw-flex tw-justify-end">
                        <Button
                            variant="primary"
                            onClick={addEmployeeHndlr}
                        >
                            <i className="ri-add-line tw-align-bottom"></i> Add Employee
                        </Button>
                    </div>}

                </div>
                <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-4">
                    <div className="tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3"></div>
                    <div className="tw-col-span-12 lg:tw-col-span-8 xl:tw-col-span-9">
                        <Tabs
                            activeTabId={activeTabId}
                            tabChangeHndlr={tabChangeHndlr}
                            tabsList={tabsOptions}
                            navContainerClass="nav-tabs tw-mb-2"
                        />
                    </div>
                </div>
                <EmployeeInfo
                    canCreateAndUpdate={canCreateAndUpdate}
                    branchId={branchId} instituteId={instituteId} employeeId={params.employeeId} activeTabId={activeTabId} />
            </div>
        </div>
    )
}
