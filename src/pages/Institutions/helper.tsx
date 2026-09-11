import { IOptionsHrtl, MoreActions } from "../../Components/Common/MenuOptions";
import { StatusLabel, MenuOptionHrtl, UserDetails } from "../../Components/Common";
import classnames from "classnames";

export function generateBranchesColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Institute Name",
            accessor: "branchName",
            Cell: ({ row: { original } }: any) => {
                return (
                    <UserDetails
                        displayId={original.shortName}
                        displayName={original.instituteName}
                        imageUrl={original.logo}
                        displayNameClass="tw-text-nowrap"
                    />
                );
            },
        },
        {
            Header: "Contact Person",
            accessor: "contactPerson",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const { contactPersonFirstName, contactPersonLastName } = original || {};
                return (
                    <span>{`${contactPersonFirstName} ${contactPersonLastName}` || "n/a"}</span>
                );
            },
        },
        {
            Header: "Email",
            accessor: "emailId",
            disableSortBy: true,
        },
        {
            Header: "Phone Number",
            accessor: "institutionPhoneNo",
            disableSortBy: true,
        },
        {
            Header: "Location",
            accessor: "address",
            disableSortBy: true,
        },
        {
            Header: "Actions",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
                );
            },
        },
    ])
}
export function generateBranchAdminListColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Admin Name",
            accessor: "adminName",
            Cell: ({ row: { original } }: any) => {
                return (
                    <UserDetails
                        displayId={original.adminName.useId}
                        displayName={original.adminName.userName}
                        imageUrl={original.adminName.img}
                    />
                );
            },
        },
        {
            Header: "Email",
            accessor: "email",
        },
        {
            Header: "Phone No.",
            accessor: "phoneNo",
        },
        {
            Header: "Branches",
            accessor: "branches",
            Cell: ({ value }: any) => {
                const branches = value.map((b: any, index: number) => <span key={`branch${index}`} className="badge tw-uppercase badge-soft-info tw-me-2"> {b} </span>)
                return branches;
            },
        },
        {
            Header: "Actions",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MoreActions actionOptions={actionsList} rowId={original.branchId} isHorizontal={false} />
                );
            },
        },
    ])
}

export const BranchAdminListData = [{
    adminName: {
        userName: 'Ishita',
        userId: "nhtr0002",
        img: null
    },
    email: "ishita@gmail.com",
    phoneNo: "1234567890",
    branches: ['Dav-122']
}]