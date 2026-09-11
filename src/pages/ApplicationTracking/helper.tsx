import { getDdMmYyyyFormat } from "../../utility/dateutility";

export function generateColumns(viewStuHndler: any) {
    return [
        {
            Header: "Institute",
            accessor: "instituteName",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return original?.saleFormDetails?.instituteName
            },
        },
        {
            Header: "Branch",
            accessor: "branchName",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return original?.saleFormDetails?.branchName
            },
        },
        {
            Header: "Application No",
            accessor: "applicationNumber",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return original?.saleFormDetails?.applicationNumber
            },
        },
        {
            Header: "Student Name",
            accessor: "fullName",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return original?.saleFormDetails?.fullName
            },
        },
        {
            Header: "Phone",
            accessor: "contactNumber",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return original?.saleFormDetails?.contactNumber
            },
        },
        {
            Header: "Email",
            accessor: "emailId",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return original?.saleFormDetails?.emailId
            },
        },
        {
            Header: "Submission Date",
            accessor: "applicationSaleDate",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return getDdMmYyyyFormat(original?.saleFormDetails?.applicationSaleDate)
            },
        },
        {
            Header: "",
            accessor: "view",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span className="tw-text-blue-600 tw-underline tw-cursor-pointer" onClick={() => viewStuHndler(original?.saleFormDetails?.applicationNumber)}>View</span>
            },
        },
    ];
}

export const getValue = (values:any) => {
    const { searchBy , searchString } = values || {};
    switch (searchBy) {
        case "Application No":
            return { name: "aNo", value: searchString };
        case "Email Id":
            return { name: "eId", value: searchString };
        case "Phone No":
            return { name: "pNo", value: searchString };
        case "pNo":
            return { name: "Phone No", value: searchString };
        case "eId":
            return { name: "Email Id", value: searchString };
        case "aNo":
            return { name: "Application No", value: searchString };
        default:
            return { name: "", value: searchString };
    }
}

export const getParamsValue = (values = {}) => {
    const filledField = Object.entries(values).find(([key, value]) => value);

  if (filledField) {
    const [name, value] = filledField;
    return { name, value };
  } else {
    return { name: "", value: "" };
  }
}

export const menuItems = [
    // { id : "Application No" , name : "Application No"},
    { id : "Email Id" , name : "Email Id"},
    { id : "Phone No" , name : "Phone No"},
]