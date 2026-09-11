import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { StatusLabel, MenuOptionHrtl } from "../../../Components/Common";
import { UserDetails } from "../../../Components/Common";
import { IAdvanceFilterState, IFilterPayload, IFilterState } from "./types";

export function generateColumns(actionsList: Array<IOptionsHrtl>, redirectUrlHndler: any, showInstituteAdminUI: boolean) {
    return ([
        {
            Header: "Student Name",
            accessor: "studentName",
            columnClassName: "tw-sticky tw-left-0 tw-min-w-[200px] tw-w-[200px] tw-max-w-[200px]",
            Cell: ({ row: { original } }: any) => {
                const { studentCode, studentName, studentImageBase64 } = original,
                    imageBaseUrl = studentImageBase64 ? `data:image/jpeg;base64, ${studentImageBase64}` : "";
                return (
                    <UserDetails
                        imageUrl={imageBaseUrl}
                        displayName={studentName}
                        redirectUrl={redirectUrlHndler(original?.studentId)}
                        displayId={studentCode}
                        size="xs"
                        isBranchAdmin={!showInstituteAdminUI}
                    />
                )
            }
        },
        {
            Header: "Branch Name",
            accessor: "branchName",
            disableSortBy: true,
        },
        {
            Header: "Curriculum",
            accessor: "curriculumName",
            columnClassName: "tw-w-[20%]",
            disableSortBy: true,
            Cell: ({ value }: any) => <>{value || '-'}</>
        },
        {
            Header: "Class",
            accessor: "className",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const { className, groupName } = original;
                return (
                    <div className="">
                        <span className="tw-block">{className}</span>
                        {groupName && <span className="tw-text-sm text-muted user-name-sub-text tw-text-info">
                            {groupName}</span>}
                    </div>
                )
            }
        },
        {
            Header: "Section",
            accessor: "sectionName",
            disableSortBy: true,
            Cell: ({ value }: any) => <>{value || '-'}</>
        },
        {
            Header: "Admission No",
            accessor: "admissionNo",
            disableSortBy: true,
            Cell: ({ value }) => (value && value.trim() !== "" ? value : "-"),
        },
        {
            Header: "Student Type",
            accessor: "newOrExistingStudent",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const { newOrExistingStudent, admissionType } = original

                return (
                    <UserDetails
                        displayName={newOrExistingStudent}
                        displayId={admissionType}
                        size="xs"
                        showAvatar={false}
                    />
                )
            }
        },
        {
            Header: "Parent Name",
            accessor: "parentName",
            disableSortBy: true,
        },
        {
            Header: "Phone Number",
            accessor: "phoneNumber",
            disableSortBy: true,
        },
        {
            Header: "WhatsApp Number",
            accessor: "whatsappNo",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                let savedWhatsappNo = "";
                const { primaryContact, whatsappNo, fatherWhatsappNo, motherWhatsappNo, guardianWhatsappNo } = original;
                if (primaryContact?.toString().toLowerCase() === "father" && fatherWhatsappNo) {
                    savedWhatsappNo = fatherWhatsappNo;
                } else if (primaryContact?.toString().toLowerCase() === "mother" && motherWhatsappNo) {
                    savedWhatsappNo = motherWhatsappNo;
                } else if (primaryContact?.toString().toLowerCase() === "guardian" && guardianWhatsappNo) {
                    savedWhatsappNo = guardianWhatsappNo;
                } else {
                    savedWhatsappNo = whatsappNo;
                }
                return (
                    <span>{savedWhatsappNo || "-"}</span>
                )
            }
        },
        {
            Header: "JODO Student Id",
            accessor: "jodoStudentId",
            disableSortBy: true,
        },
        {
            Header: "Email Id",
            accessor: "email",
            disableSortBy: true,
        },
        {
            Header: "Transport Route",
            accessor: "transportRoute",
            disableSortBy: true,
            columnClassName: "text-center",
            Cell: ({ value }: any) => <>{value || "Own Transport"}</>
        },
        {
            Header: "Status",
            accessor: "status",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                const statusValue = value || "";
                return (
                    <StatusLabel type={statusValue} labelName={statusValue} />
                );
            },
        },
        {
            Header: "Actions",
            accessor: "actions",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original?.studentId} />
                );
            },
        },
    ])
}


export const statusFilter = [
    {
        id: "ACTIVE",
        name: "Active"
    },
    {
        id: "INACTIVE",
        name: "Inactive"
    },
    {
        id: "NOT_REPORTING",
        name: "Not Reporting"
    }
]

export const AdmissionTypeMenuOptions = [
    {
        id: "Residential",
        value: "Residential"
    },
    {
        id: "Non-Residential",
        value: "Non-Residential"
    },

]

export const studentTypeMenuOptions = [
    {
        id: "NEW_ADMISSION",
        value: "NEW ADMISSION"
    },
    {
        id: "OLD_ADMISSION",
        value: "OLD ADMISSION"
    },

]

export function hasStateChanged(newState: any) {
    let count: any = 0;
    let showState: boolean = false;
    for (const key in newState) {
        const newValue = newState[key];
        if (newValue) {
            showState = true;
            if (!(key === "searchString" || key === "academicYearId" || key === "status"))
                count += 1;
        }
    }
    if (count > 0) { return { stateChange: showState, count: count } }
    else { return { stateChange: showState, count: count } }
}

export function getAppliedFiltersInfo(appliedFilters: IFilterPayload, currentAcademicYear: string | undefined, userRole: string) {
    const basicFilterKeys = Object.keys(initialFilterState) as (keyof IFilterState)[];
    const advncFilterKeys = Object.keys(initialAdvanceFilterState) as (keyof IAdvanceFilterState)[];
    let isFilterApplied = false;
    for (const key of basicFilterKeys) {
        if (key === 'branchId') {
            if (userRole === 'INSTITUTE_ADMIN' && !!appliedFilters[key]) {
                isFilterApplied = true;
                break;
            } else {
                continue;
            }
        }
        if (key === 'academicYearId') {
            if (appliedFilters.academicYearId?.toString() !== currentAcademicYear) {
                isFilterApplied = true;
                break;
            } else {
                continue;
            }
        }
        if (!!appliedFilters[key]) {
            isFilterApplied = true;
            break;
        }
        continue;
    }
    let count: number = 0;
    for (const key of advncFilterKeys) {
        if (!!appliedFilters[key]) {
            count += 1;
            if (!isFilterApplied) {
                isFilterApplied = true;
            }
        }
    }
    return {
        count,
        canClearFilter: isFilterApplied
    }
}

export const initialFilterState = {
    branchId: undefined,
    studentIds: undefined,
    academicYearId: undefined,
    status: undefined,
};

export const initialAdvanceFilterState = {
    classId: undefined,
    sectionId: undefined,
    curriculumId: undefined,
    admissionType: undefined,
    studentType: undefined,
    sectionAllocation: undefined,
    startDate: undefined,
    endDate: undefined
};


export const searchInputOptions = [
    { id: 'global', name: 'Global Search' },
    { id: 'studentName', name: 'Student Name' },
    { id: 'studentCode', name: 'Student Code' },
    { id: 'admissionNo', name: 'Admission Number' },
    { id: 'fatherName', name: 'Father Name' },
    { id: 'fatherMobile', name: 'Father Mobile' },
    { id: 'fatherEmailId', name: 'Father Email' },
    { id: 'motherName', name: 'Mother Name' },
    { id: 'motherMobile', name: 'Mother Mobile' },
    { id: 'motherEmailId', name: 'Mother Email' },
    { id: 'parentCode', name: 'Parent Code' },
    { id: 'guardianName', name: 'Guardian Name' },
    { id: 'guardianContact', name: 'Guardian Mobile' },
    { id: 'smsPriorityNo', name: 'SMS Priority Number' },
    { id: 'whatsappNo', name: 'WhatsApp Number' },
    { id: 'emailId', name: 'Email ID' },
    { id: 'rfid', name: 'RFID' },
]