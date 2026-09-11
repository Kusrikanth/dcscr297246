import { IOptionsHrtl, MoreActions } from "../../../Components/Common/MenuOptions";
import { StatusLabel, UserDetails } from "../../../Components/Common";
import { convertUTCToISTTimeOnly, getDisplayDateForTableFormat, getFormattedDateddMMMYYYY } from "../../../utility/dateutility";

export function generateColumns(actionList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Employee Name",
            accessor: "employeeName",
            columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
            Cell: ({ row: { original } }: any) => {
                const { employeeCode, employeeName, employeeBase64Image } = original,
                    imageBaseUrl = employeeBase64Image ? `data:image/jpeg;base64, ${employeeBase64Image}` : "";
                return (
                    <UserDetails
                        imageUrl={imageBaseUrl}
                        displayName={employeeName}
                        displayId={employeeCode}
                        defaultImgType="employee"
                        size="xs"
                    />
                )
            }
        },
        {
            Header: "Employee Type",
            accessor: "transportEmployeeType",
            disableSortBy: true,
        },
        {
            Header: "DOB",
            accessor: "dob",
            disableSortBy: true,
            columnClassName: "tw-text-nowrap",
            Cell: ({ value }: any) => {
                return (<span>{getDisplayDateForTableFormat(value)}</span>)
            }
        },
        {
            Header: "License Number",
            accessor: "licenseNumber",
            disableSortBy: true,
        },
        {
            Header: "License Expiry Date",
            accessor: "licenseExpiryDate",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                return (<span>{getDisplayDateForTableFormat(value)}</span>)
            }
        },
        {
            Header: "Contact Number",
            accessor: "contactNo",
            disableSortBy: true,
        },
        {
            Header: "Biometric ID",
            accessor: "employeeCode",
            disableSortBy: true,
        },
        {
            Header: "Agency Employee ID",
            accessor: "agencyEmployeeId",
            disableSortBy: true,
            Cell:({row:{original}}:any)=>{
                return <div>{original.agencyEmployeeId ? original.agencyEmployeeId : "-"}</div>
            }
        },
        {
            Header:"Created By",
            accessor:"createdBy",
            disableSortBy:true,
            Cell:({row:{original}}:any)=>{
                return <span>{original.createdBy ? original.createdBy : "-"}</span>
            }
        },
        {
            Header: "Created Date",
            accessor: "createdAt",
            disableSortBy: true,
            Cell:({row:{original}}:any)=>{
                const [date,time] = original?.createdAt?.split("T") ?? [];
                return <UserDetails
                displayName={ date ? getFormattedDateddMMMYYYY(date) : "-"}
                displayId={ time ? convertUTCToISTTimeOnly(time) : "-"}
                showAvatar={false}
                ></UserDetails>
            }
        },
        {
            Header: "Status",
            accessor: "employeeActiveStatus",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                const employeeActiveStatus = value || "";
                return (
                    <StatusLabel type={employeeActiveStatus} labelName={employeeActiveStatus} />
                );
            },
        },
        {
            Header: "Actions",
            filterable: false,
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const { employeeActiveStatus } = original,
                    updatedActions = actionList.filter(item => {
                        if (employeeActiveStatus?.toLowerCase() === 'active' && item.id === 'activate') {
                            return;
                        }
                        if (employeeActiveStatus?.toLowerCase() === 'inactive' && item.id === 'deactivate') {
                            return;
                        }
                        return item;
                    });
                return (
                    <MoreActions actionOptions={updatedActions} rowId={original.employeeId} isHorizontal={true} />
                );
            },
        },
    ]);
}

export const trueFalseOptions = [
    {
        id: "true",
        name: "Yes",
    },
    {
        id: "false",
        name: "No",
    }
]

export const employeeTypes = [{ id: 'DRIVER', name: 'Driver' },
{ id: 'ATTENDER', name: 'Attender' }];

export const employeeActiveStatus = [{ id: 'ACTIVE', name: 'Active' },
{ id: 'INACTIVE', name: 'Inactive' }];


export const acceptedImageFile = ["image/jpeg", "image/jpg", "image/png", 'application/pdf'];
export function uploadFileErrorHndlr(fileSize: any, fileType: string) {
    if (!acceptedImageFile.includes(fileType)) {
        return `Upload file should be of format ${acceptedImageFile.join(',')}`;
    }
    if (!isNaN(fileSize) && (Math.ceil(fileSize / (1024 * 1024)) > 1)) {
        return "Upload file should be less than 1Mb.";
    }
    return "";
}