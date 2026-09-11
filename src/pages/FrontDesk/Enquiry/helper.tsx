import { StatusLabel, UserDetails } from "../../../Components/Common";
import { IOptionsHrtl, MoreActions } from "../../../Components/Common/MenuOptions";
import { getDdMmYyyyWithMonthNameFormat } from "../../../utility/dateutility";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return [
        {
            Header: "Enquiry Date",
            accessor: "enquiryDate",
            disableSortBy: true,
            columnClassName: "!tw-text-nowrap",
            Cell: ({ row: { original } }: any) => {
                return (<span>{getDdMmYyyyWithMonthNameFormat(original.enquiryDate)}</span>)
            },
        },
        {
            Header: "Student Name",
            accessor: "studentName",
            disableSortBy: true,
        },
        {
            Header: "Date of Birth",
            accessor: "dob",
            disableSortBy: true,
            columnClassName: "!tw-text-nowrap",
            Cell: ({ row: { original } }: any) => {
                return (<span>{getDdMmYyyyWithMonthNameFormat(original.dob)}</span>)
            },
        },
        {
            Header: "Contact Person Name",
            accessor: "parentName",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <UserDetails
                        displayName={original?.parentName}
                        displayId={original?.contactNumber}
                        showAvatar={false}
                    />
                )
            }
        },
        {
            Header: "Email",
            accessor: "emailId",
            disableSortBy: true,
        },
        {
            Header: "Curriculum",
            accessor: "curriculumName",
            disableSortBy: true,
            columnClassName: "!tw-text-nowrap",
        },
        {
            Header: "Admission for Class",
            accessor: "admissionFor",
            disableSortBy: true,
        },
        {
            Header: "Eligible Status",
            accessor: "status",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const status = original?.isAdmissionEligible ? "Eligible" : "Not Eligible"
                return <StatusLabel type={status} labelName={status} />
            }
        },
        {
            Header: "Status",
            accessor: "enquiryStatus",
            disableSortBy: true,
            columnClassName: "!tw-text-nowrap",
            Cell: ({ row: { original } }: any) => {
                return original?.enquiryStatus?.split("_")?.join(" ")
            }
        },
        {
            Header: "Remarks",
            accessor: "remarks",
            columnClassName: "w-200px min-w-200px max-w-200px",
            disableSortBy: true,
        },
        {
            Header: "Actions",
            filterable: false,
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const updatedAction = actionsList.filter((action: any) => {
                    if(action.id === "sendAppSaleFormLink"){
                        return !original?.applicationSaleId
                    }
                    else if(action.id === "sendPaymentLink"){
                        return original?.applicationSaleId
                    }
                    return action
                })
                return (
                    <MoreActions
                        actionOptions={updatedAction}
                        rowId={original.enquiryId}
                        isHorizontal={true}
                    />
                );
            },
        },
    ];
}


// Commented out static data - now using API call
// export const SourceList = [
//     {
//         source: "News"
//     },
//     {
//         source: "Social Media"
//     }
// ]
export const StatusOptions = [
    {
        text:"Pending",
        value: "PENDING"
    },
    {
        text:"Close",
        value: "CLOSE"
    }
]

export const eligibleOptions = [
    {
        name : "YES",
        key : true,
    },{
        name : "NO",
        key : false
    }
]

export const ignoredKeys = ["searchString", "academicYearId", "curriculumId","classId","startDate", "enquiryStatus"];

export const newStatusOptions = [
    { id: "OPEN", name: "NO STATUS" },
    { id: "APPLICATION_DONE", name: "APPLICATION DONE" },
    { id: "NOT_INTERESTED", name: "NOT INTERESTED" },
    { id: "NEED_FOLLOW_UP", name: "NEED FOLLOW UP" }
]
  