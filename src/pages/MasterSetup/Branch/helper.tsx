import { IOptionsHrtl, MoreActions } from "../../../Components/Common/MenuOptions";
import { StatusLabel, MenuOptionHrtl, UserDetails } from "../../../Components/Common";
import classnames from "classnames";

function getAdminDetails(branchId: any, adminDetails: any, assignAdminHndlr: any) {
    if (adminDetails) {
        const { firstName, lastName } = adminDetails;
        return (<span data-id={branchId} onClick={assignAdminHndlr} className="cursor-pointer text-info d-flex text-nowrap">
            {`${firstName} ${lastName}`}
        </span>)
    }
    return (<span data-id={branchId} onClick={assignAdminHndlr} className="cursor-pointer text-info d-flex text-nowrap">
        <i className="ri-user-add-fill me-1 " /> Assign Admin
    </span>);
}

export function generateBranchesColumns(actionsList: Array<IOptionsHrtl>,
    updateMainBranchHndlr: any, assignAdminHndlr: any) {
    return ([
        {
            Header: "Branch Name",
            accessor: "branchName",
            Cell: ({ row: { original } }: any) => {
                const { isMainBranch, branchId } = original;
                return (
                    <div className="tw-flex tw-items-center">
                        <button
                            type="button"
                            data-id={branchId}
                            onClick={updateMainBranchHndlr}
                            className={classnames("btn nav-btn main-branch-btn tw-p-0 tw-me-2", {
                                "active": isMainBranch
                            })}
                        >
                            <i className="tw-text-base ri-star-fill"></i>
                        </button>
                        <UserDetails
                            displayId={original.shortCode}
                            displayName={original.branchName}
                            imageUrl={original.logo}
                        />
                    </div>

                );
            },
        },
        {
            Header: "Short Name",
            accessor: "shortName",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                return (
                    <span>{value || "n/a"}</span>
                );
            },
        },
        {
            Header: "Affliation No",
            accessor: "affiliationNumber",
            disableSortBy: true,
        },
        {
            Header: "Admin",
            accessor: "branchAdminBasicDetails",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const { branchId, branchAdminBasicDetails } = original;
                return (
                    <>
                        {getAdminDetails(branchId, branchAdminBasicDetails, assignAdminHndlr)}
                    </>
                )
            }
        },
        {
            Header: "Status",
            accessor: "status",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                return (
                    <StatusLabel type={value} labelName={value} />
                );
            },

        },
        {
            Header: "Actions",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original.branchId} />
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
                const branches = value.map((b: any, index: number) => <span key={`branch${index}`} className="badge text-uppercase badge-soft-info me-2"> {b} </span>)
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