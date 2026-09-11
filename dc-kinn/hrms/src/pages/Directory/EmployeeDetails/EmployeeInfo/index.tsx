import React, { useEffect, useMemo, useState } from "react";
import { employeeSection } from "./helper";
//Section Component
import DocumentDetails from "./DocumentDetails";
import { useDispatch } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import EmployeeDetails from "./EmployeeDetails";
import EducationDetails from "./EducationDetails";
import ContactDetails from "./ContactDetails";
import DependenciesDetails from "./DependenciesDetails";
import EmergencyContacts from "./EmergencyContacts";
import MarriageInfo from "./MarriageInfo";
import CurrentJob from "./CurrentJob";
import DesignationDetails from "./DesignationDetails";
import PreviousExperience from "./PreviousExperience";
import BankDetails from "./BankDetails";
import SalaryDetails from "./SalaryDetails";
import { getEmployeeByIdAct, setGetEmployeeByIdAct } from "../../../../store/directory/employeemanagement/employeemanagementactions";
import StudentImage from "../../../../assets/imagesdps/student-default-img.png";
import { AccordionItem, UncontrolledAccordion } from "reactstrap";
import { useAppSelector } from "../../../../hooks/storehook";
import { UploadImage, UserDetails } from "../../../../Components/Common";
import { calculateAge } from "../../../../utility/dateutility";
import classnames from "classnames";
import { UserProfile } from "../../../../Components/Common/UserProfile";

import {
    HugeiconsIcon
} from "@hugeicons/react";
import {
    UserSettings01Icon, MailAtSign01Icon, Call02Icon, GlobalEditingIcon,
    Calendar03Icon, UserCheck01Icon, TimeQuarter02Icon
} from "@hugeicons-pro/core-stroke-standard";
interface IEmployeeInfo {
    canCreateAndUpdate?: boolean,
    employeeId: number;
    instituteId: number;
    branchId: number;
    activeTabId: string | null;
}

function getActiveMenuComponent(menuId: string | null) {
    switch (menuId) {
        case "personal-info":
            return PersonalInfo
        case "job-info":
            return JobInfo
        case "salary-info":
            return SalaryInfo
        case "documents":
            return Documents
        default:
            return null;
    }
}

export default function EmployeeInfo(props: IEmployeeInfo) {
    const [activeSectionState, setActiveSectionState] = useState<string>("personal-info");
    const dispatch = useDispatch();
    const { branchId, employeeId, instituteId, activeTabId, canCreateAndUpdate } = props
    useEffect(() => {
        dispatch(getEmployeeByIdAct(generateActionPayload("get_employee_byid", { employeeId: props.employeeId })));
        return () => { dispatch(setGetEmployeeByIdAct(null)) }
    }, [props.employeeId]);
    function changeSectionHndlr(event: React.MouseEvent<HTMLLIElement>) {
        const sectionId = event.currentTarget.getAttribute("data-id");

        // var scrolledY = window.scrollY;

        // if (scrolledY) {
        //     window.scroll(0, scrolledY - 64);
        // }
        if (sectionId) {
            setActiveSectionState(sectionId);
            const sectionDivId = document.getElementById(sectionId);
            if (sectionDivId) {
                window.scrollTo({
                    behavior: 'smooth',
                    top: sectionDivId.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 64
                })
            }
        }
    }

    const { getEmployeeByIdResp, nationalityResp, genderListResp, employeeCategoriesResp } = useAppSelector(({ directoryEmployee, masterData }) => ({
        getEmployeeByIdResp: directoryEmployee.getEmployeeByIdResp,
        genderListResp: masterData.genderListResp,
        nationalityResp: masterData.nationalityResp,
        employeeCategoriesResp: masterData.employeeCategoriesResp,
    }))

    const { data: nationalityData } = nationalityResp || {}
    const { employeeCode, contactNo, employeeName, fullImageBase64, nationalityId, workEmailId, dob, empStatus
    } = getEmployeeByIdResp?.employeeBasicDetails || {}
    const { employeeType } = getEmployeeByIdResp?.employeeCurrentJob || {}
    const { employeeCategoryName
    } = getEmployeeByIdResp?.employeeDesignationDetails || {}


    const nationalityName = nationalityData?.find((ele: any) => ele.nationalityId === nationalityId)?.nationalityName

    const activeComponent = useMemo(() => {
        const TabComponent: any = getActiveMenuComponent(activeTabId);

        if (TabComponent) {
            return <TabComponent instituteId={instituteId}
                canCreateAndUpdate={canCreateAndUpdate}
                branchId={branchId} employeeId={employeeId}></TabComponent>
        }
    }, [employeeId, activeTabId, canCreateAndUpdate, getActiveMenuComponent])

    const employeeAge = calculateAge(dob)

    return (<>
        <div className="employee-management-details-container tw-flex tw-flex-wrap tw-mx-2 tw-gap-y-4 tw-mb-4">
            <div className="tw-w-full lg:tw-w-3/12 xxl:tw-w-3/12 tw-px-2">
                <div className="employee-profile-details">
                    <div className="tw-bg-white tw-shadow tw-rounded-lg tw-overflow-hidden">
                        <div className="employee-details-header">
                            <div className="employee-img-container">
                                <UserProfile displayName={employeeName} size="md"></UserProfile>
                            </div>
                        </div>

                        <div className="employee-details-content tw-p-3 tw-pt-2 tw-pl-4">
                            <div className="tw-flex tw-flex-wrap tw--mx-2">
                                <div className="tw-w-full tw-px-2 tw-mb-3 tw-mt-5">
                                    <div className="tw-flex tw-mb-1 tw-flex-col tw-mt-5">
                                        <h5 className="tw-text-xl tw-font-semibold tw-mb-1 tw-mr-3">{employeeName}</h5>
                                    </div>

                                    <div>
                                        <p className="tw-mb-0 tw-text-sm tw-font-semibold employe-id tw-rounded tw-inline tw-mr-2">
                                            {employeeCode}
                                        </p>
                                    </div>
                                </div>

                                <div className="tw-w-full tw-px-2">
                                    <div className="tw-flex tw-items-center tw-gap-4 tw-mb-4">
                                        <div className="tw-mr-3 icon tw-rounded-full tw-flex tw-items-center tw-justify-center">
                                            <HugeiconsIcon icon={UserSettings01Icon}
                                                size={18}
                                            />
                                        </div>
                                        <div>
                                            <p className="tw-mb-0 tw-text-sm tw-font-semibold">Employee Category</p>
                                            <p className="employee-role tw-text-blue-600 bg-soft-info tw-inline tw-text-xs tw-rounded">
                                                {employeeCategoryName}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="tw-flex tw-items-center tw-gap-4 tw-mb-4">
                                        <div className="tw-mr-3 icon tw-rounded-full tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
                                            <HugeiconsIcon
                                                icon={MailAtSign01Icon}
                                                size={18}
                                            />
                                        </div>
                                        <div style={{ width: "80%" }}>
                                            <p className="tw-mb-0 tw-text-sm tw-font-semibold">Email</p>
                                            <p className="tw-mb-0 tw-text-gray-500 tw-overflow-hidden tw-whitespace-nowrap tw-truncate">{workEmailId}</p>
                                        </div>
                                    </div>
                                    <div className="tw-flex tw-items-center tw-gap-4 tw-mb-4">
                                        <div className="tw-mr-3 icon tw-rounded-full tw-flex tw-items-center tw-justify-center">
                                            <HugeiconsIcon icon={Call02Icon}
                                                size={18}
                                            />
                                        </div>

                                        <div>
                                            <p className="tw-mb-0 tw-text-sm tw-font-semibold">Mobile No</p>
                                            <p className="tw-mb-0 tw-text-gray-500">{contactNo}</p>
                                        </div>
                                    </div>
                                    <div className="tw-flex tw-items-center tw-gap-4 tw-mb-4">
                                        <div className="tw-mr-3 icon tw-rounded-full tw-flex tw-items-center tw-justify-center">
                                            <HugeiconsIcon
                                                icon={GlobalEditingIcon}
                                                size={18}
                                            />
                                        </div>

                                        <div>
                                            <p className="tw-mb-0 tw-text-sm tw-font-semibold">Nationality</p>
                                            <p className="tw-mb-0 tw-text-gray-500">{nationalityName}</p>
                                        </div>
                                    </div>
                                    <div className="tw-flex tw-items-center tw-gap-4 tw-mb-4">
                                        <div className="tw-mr-3 icon tw-rounded-full tw-flex tw-items-center tw-justify-center">
                                            <HugeiconsIcon
                                                icon={Calendar03Icon}
                                                size={18}
                                            />
                                        </div>
                                        <div>
                                            <p className="tw-mb-0 tw-text-sm tw-font-semibold">Age</p>
                                            <p className="tw-mb-0 tw-text-gray-500">{employeeAge}</p>
                                        </div>
                                    </div>
                                    <div className="tw-flex tw-items-center tw-gap-4 tw-mb-4">
                                        <div className="tw-mr-3 icon tw-rounded-full tw-flex tw-items-center tw-justify-center">
                                            <HugeiconsIcon
                                                icon={UserCheck01Icon}
                                                size={18}
                                            />
                                        </div>
                                        <div>
                                            <p className="tw-mb-0 tw-text-sm tw-font-semibold">Status</p>
                                            <p className={classnames("tw-mb-0", {
                                                "tw-text-green-600": empStatus === "Active",
                                                'tw-text-red-600': empStatus === 'Resigned',
                                                "tw-text-yellow-600": empStatus === "Paid Leave of Absence" || empStatus === 'Unpaid Leave of Absence',
                                            })}>{empStatus}</p>
                                        </div>
                                    </div>
                                    <div className="tw-flex tw-items-center tw-gap-4 tw-mb-4">
                                        <div className="tw-mr-3 icon tw-rounded-full tw-flex tw-items-center tw-justify-center">
                                            <HugeiconsIcon
                                                icon={TimeQuarter02Icon}
                                                size={18}
                                            />
                                        </div>
                                        <div>
                                            <p className="tw-mb-0 tw-text-sm tw-font-semibold">Type of Hire</p>
                                            <p className="tw-mb-0 tw-text-gray-500">{employeeType?.split("_")?.join(" ")}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="tw-w-full lg:tw-w-9/12 xxl:tw-w-9/12 tw-px-2 employee-complete-details">
                {activeComponent}
            </div>
        </div>
    </>
    )
}

function PersonalInfo({ instituteId, branchId, employeeId, canCreateAndUpdate }: any) {
    return <>
        <UncontrolledAccordion open="basic-info" defaultOpen={["basic-info"]} stayOpen>
            <AccordionItem>
                <EmployeeDetails divId="basic_information" branchId={branchId}
                    canCreateAndUpdate={canCreateAndUpdate}
                    instituteId={instituteId} employeeId={employeeId} />
            </AccordionItem>
            <AccordionItem>
                <EducationDetails divId="education" branchId={branchId}
                    canCreateAndUpdate={canCreateAndUpdate}
                    instituteId={instituteId} employeeId={employeeId} />
            </AccordionItem>
            <AccordionItem>
                <ContactDetails divId="contact_details" branchId={branchId}
                    canCreateAndUpdate={canCreateAndUpdate}
                    instituteId={instituteId} employeeId={employeeId} />
            </AccordionItem>
            <AccordionItem>
                <EmergencyContacts divId="emergency_contacts" branchId={branchId}
                    canCreateAndUpdate={canCreateAndUpdate}
                    instituteId={instituteId} employeeId={employeeId} />
            </AccordionItem>
            <AccordionItem>
                <MarriageInfo divId="marriage_info" branchId={branchId}
                    canCreateAndUpdate={canCreateAndUpdate}
                    instituteId={instituteId} employeeId={employeeId} />
            </AccordionItem>
        </UncontrolledAccordion>
    </>
}
function JobInfo({ instituteId, branchId, employeeId, canCreateAndUpdate }: any) {
    return <>
        <UncontrolledAccordion open="current-job" defaultOpen={["current-job"]} stayOpen>
            <AccordionItem>
                <CurrentJob divId="current_job" branchId={branchId}
                    canCreateAndUpdate={canCreateAndUpdate}
                    instituteId={instituteId} employeeId={employeeId} />
            </AccordionItem>
            <AccordionItem>
                <PreviousExperience divId="previous_experience" branchId={branchId}
                    canCreateAndUpdate={canCreateAndUpdate}
                    instituteId={instituteId} employeeId={employeeId} />
            </AccordionItem>
        </UncontrolledAccordion>
    </>
}
function SalaryInfo({ instituteId, branchId, employeeId, canCreateAndUpdate }: any) {
    return <>
        <UncontrolledAccordion open="salary-details" defaultOpen={["salary-details"]} stayOpen>
            <AccordionItem>
                <SalaryDetails divId="salary_details" branchId={branchId}
                    canCreateAndUpdate={canCreateAndUpdate}
                    instituteId={instituteId} employeeId={employeeId} />
            </AccordionItem>
            <AccordionItem>
                <BankDetails divId="bank_details" branchId={branchId}
                    canCreateAndUpdate={canCreateAndUpdate}
                    instituteId={instituteId} employeeId={employeeId} />
            </AccordionItem>
        </UncontrolledAccordion>
    </>
}
function Documents({ instituteId, branchId, employeeId, canCreateAndUpdate }: any) {
    return <>
        <UncontrolledAccordion open="dependencies" defaultOpen={["dependencies",]} stayOpen>
            <AccordionItem>
                <DependenciesDetails divId="dependencies" branchId={branchId}
                    canCreateAndUpdate={canCreateAndUpdate}
                    instituteId={instituteId} employeeId={employeeId} />
            </AccordionItem>
            <AccordionItem>
                <DesignationDetails divId="designation_details" branchId={branchId}
                    canCreateAndUpdate={canCreateAndUpdate}
                    instituteId={instituteId} employeeId={employeeId} />
            </AccordionItem>
            <AccordionItem>
                <DocumentDetails divId="documents" branchId={branchId}
                    canCreateAndUpdate={canCreateAndUpdate}
                    instituteId={instituteId} employeeId={employeeId} />
            </AccordionItem>
        </UncontrolledAccordion>
    </>
}