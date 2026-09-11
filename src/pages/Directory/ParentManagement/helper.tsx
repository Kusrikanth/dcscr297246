import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { StatusLabel, MenuOptionHrtl, InputCheckbox } from "../../../Components/Common";
import { Link } from "react-router-dom";
import { UserDetails } from "../../../Components/Common";
import { getDateWithTimeFormat, getDdMmYyyyFormat } from "../../../utility/dateutility";

export const searchInputOptions = [
    { id: 'global', name: 'Global Search' },
    { id: 'studentName', name: 'Student Name' },
    { id: 'studentCode', name: 'Student Code' },
    { id: 'admissionNo', name: 'Admission No' },
    { id: 'parentCode', name: 'Parent Code' },
    { id: 'fatherName', name: 'Father Name' },
    { id: 'fatherMobile', name: 'Father Mobile' },
    { id: 'fatherEmail', name: 'Father Email' },
    { id: 'fatherWhatsapp', name: 'Father Whatsapp' },
    { id: 'motherName', name: 'Mother Name' },
    { id: 'motherMobile', name: 'Mother Mobile' },
    { id: 'motherEmail', name: 'Mother Email' },
    { id: 'motherWhatsapp', name: 'Mother Whatsapp' },
    { id: 'guardianName', name: 'Guardian Name' },
    { id: 'guardianEmail', name: 'Guardian Email' },
    { id: 'guardianWhatsapp', name: 'Guardian Whatsapp' },
    { id: 'emailId', name: 'Email' },
    { id: 'smsPriorityNumber', name: 'SMS Priority Number' },
]

export function generateColumns(actionsList: Array<IOptionsHrtl>, viewParentChildHandler: any, allStudentCheckHndlr: any, singleStudentCheckHndlr: any, allStudentSelectedState: any) {
    return ([
        {
            Header: () => {
                return (
                    <InputCheckbox
                        name={"all-parent"}
                        // labelName={shortName}
                        value={allStudentSelectedState}
                        onChange={allStudentCheckHndlr}
                        formgroupClassName="tw-mb-0"
                    />
                )
            },
            accessor: "isStudentChecked",
            columnClassName: "w-5",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const { id, isSelected } = original;
                return (
                    <>
                        <InputCheckbox
                            name={`student-${id}`}
                            // labelName={shortName}
                            value={isSelected}
                            onChange={singleStudentCheckHndlr}
                            dataId={id}
                            formgroupClassName="tw-mb-0"
                        />
                    </>
                )
            }
        },
        {
            Header: "Parent Name",
            accessor: "fatherName",
            columnClassName: 'tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]',
            Cell: ({ row: { original } }: any) => {
                const { parentCode, fatherName, motherName, guardianName, studentImageBase64, primaryContactPerson } = original,
                    imageBaseUrl = studentImageBase64 ? `data:image/jpeg;base64, ${studentImageBase64}` : "";

                const parentName = primaryContactPerson ? (primaryContactPerson?.toLowerCase() === "father" ? fatherName : primaryContactPerson?.toLowerCase() === "mother" ? motherName : guardianName) : fatherName
                return (
                    <UserDetails
                        imageUrl={imageBaseUrl}
                        displayName={parentName}
                        displayId={parentCode}
                        displayNameClass="text-truncate"
                        size="xs"
                        defaultImgType="user"
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
            Header: "Phone No",
            accessor: "smsPriorityNumber",
            disableSortBy: true,
        },
        {
            Header: "WhatsApp Number",
            accessor: "whatsappNo",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                let savedWhatsappNo = "";
                const { primaryContactPerson, whatsappNo, fatherWhatsappNo, motherWhatsappNo, guardianWhatsappNo } = original;
                if (primaryContactPerson === "Father" && fatherWhatsappNo) {
                    savedWhatsappNo = fatherWhatsappNo;
                } else if (primaryContactPerson === "Mother" && motherWhatsappNo) {
                    savedWhatsappNo = motherWhatsappNo;
                } else if (primaryContactPerson === "Guardian" && guardianWhatsappNo) {
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
            Header: "Username",
            accessor: "userName",
            disableSortBy: true,
            columnClassName: 'tw-w-[150px] tw-min-w-[150px] tw-max-w-[150px]'
        },
        {
            Header: "Email",
            accessor: "emailId",
            disableSortBy: true,
        },
        {
            Header: "Last Logged In",
            accessor: "lastLoggedIn",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                return <span className="tw-text-nowrap">{value ? getDateWithTimeFormat(`${value}Z`) : "-"}</span>
            },
        },
        {
            Header: "No Of Childs",
            accessor: "students",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (<span data-id={original?.id}
                    onClick={viewParentChildHandler}
                    className="tw-text-blue-600 tw-cursor-pointer" > 0{original?.students}</span>)
            }
        },
        {
            Header: "Status",
            accessor: "status",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                const statusValue = value || "Active";
                return (
                    <StatusLabel type={statusValue} labelName={statusValue} />
                );
            },
        },
        {
            Header: "Actions",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original?.id} />
                );
            },
        },
    ])
}

export function generateStudentModalColumns() {
    return (
        [{
            Header: "Student Name",
            accessor: "studentName",
            Cell: ({ row: { original } }: any) => {
                const { childName, childCode, studentImageBase64 } = original,
                    imageBaseUrl = studentImageBase64 ? `data:image/jpeg;base64, ${studentImageBase64}` : "";
                return (
                    <UserDetails
                        imageUrl={imageBaseUrl}
                        displayName={childName}
                        displayId={childCode || "-"}
                        size="xs"
                        defaultImgType="student"
                    />
                )
            }
        },
        {
            Header: "Curriculum",
            accessor: "curriculumName",
            columnClassName: "w-20",
            disableSortBy: true,
        },
        {
            Header: "Class",
            accessor: "className",
            disableSortBy: true,
        },
        {
            Header: "Section",
            accessor: "sectionName",
            disableSortBy: true,
        },
        {
            Header: "Student Type",
            accessor: "studentType",
            disableSortBy: true,
        }]
    )
}

export const statusFilter = [
    {
        id: "ACTIVE",
        name: "Active"
    },
    {
        id: "INACTIVE",
        name: "Inactive"
    }
]

export const sendNotificationDisabled = (panelIntResData: any) => {
    if (panelIntResData?.length) {
        let findErr: any = true;
        panelIntResData?.map((item: any) => {
            if (item?.isSelected) findErr = false;
        })
        if (findErr) return true
        else return false;
    } else {
        return true
    }
}