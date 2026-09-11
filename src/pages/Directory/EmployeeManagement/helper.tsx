import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { StatusLabel, MenuOptionHrtl } from "../../../Components/Common";
import { getDdMmYyyyWithMonthNameFormat } from "../../../utility/dateutility";
import { UserDetails } from "../../../Components/Common";

export const searchInputOptions = [
    { id: 'global', name: 'Global Search' },
    { id: 'employeeName', name: 'Employee Name' },
    { id: 'employeeCode', name: 'Employee Code' },
    { id: 'workEmailId', name: 'Working Email' },
    { id: 'personalEmailId', name: 'Personal Email' },
    { id: 'biometricId', name: 'Biometric' },
    { id: 'contactNumber', name: 'Phone' },
    { id: 'rfid', name: 'RFID' }
]

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Employee Name",
            accessor: "employeeName",
            columnClassName: "sticky-left tw-w-[300px] tw-min-w-[300px] tw-max-w-[300px]",
            Cell: ({ row: { original } }: any) => {
                const { employeeCode, employeeName, base64Image } = original,
                    imageBaseUrl = base64Image ? `data:image/jpeg;base64, ${base64Image}` : "";
                return (
                    <UserDetails
                        imageUrl={imageBaseUrl}
                        displayName={employeeName}
                        displayId={employeeCode}
                        displayNameClass="text-truncate"
                        defaultImgType="employee"
                        size="xs"
                        redirectUrl={`/employee-management/edit-employee/${original?.id}`}
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
            Header: "Employee Category",
            accessor: "categoryName",
            disableSortBy: true,
        },
        {
            Header: "Department",
            accessor: "empDepartmentName",
            disableSortBy: true,
        },
        // {
        //     Header: "Reporting Class Divisions",
        //     accessor: "reportingClassDivision",
        //     disableSortBy: true,
        // },
        {
            Header: "DOB",
            accessor: "dob",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                return (<span>{getDdMmYyyyWithMonthNameFormat(value)}</span>)
            }
        },
        {
            Header: "Date of Joining",
            accessor: "doj",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                return (<span>{getDdMmYyyyWithMonthNameFormat(value)}</span>)
            }
        },
        {
            Header: "Biometric ID",
            accessor: "biometricId",
            disableSortBy: true,
        },
        {
            Header: "Contact Details",
            accessor: "contactNumber",
            disableSortBy: true,
            columnClassName: "tw-w-[250px] tw-min-w-[250px] tw-max-w-[250px]",
            Cell: ({ row: { original } }: any) => {
              return (
                <>
                  <UserDetails
                    displayName={original?.contactNumber || "-"}
                    displayId={original?.workEmailId || "-"}
                    showAvatar={false}
                  />
                </>
              );
            },
          },
        // {
        //     Header: "Email Id",
        //     accessor: "emailId",
        // },
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
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
                );
            },
        },
    ])
}

export const activeFilterOptions = [
    {
        id: "active",
        name: "Active"
    },
    {
        id: "inactive",
        name: "Inactive"
    }
]
