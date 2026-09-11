import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { StatusLabel, MenuOptionHrtl, UserDetails, SelectInput } from "../../../../Components/Common";
import classnames from "classnames";

export function generateColumns() {
    return ([
        {
            Header: "Field Name",
            accessor: "fieldName"
        },
        {
            Header: "System Field Name",
            accessor: "systemFieldName",
            Cell: () => {
                return (<SelectInput
                    name="branchTypeId"
                    // labelText="Branch Type"
                    value={""}
                    onChange={() => { }}
                    menuItems={[]}
                    defaultSelect="Select Field"
                    formgroupClassName="tw-mb-0"
                    valueKey="id"
                    textKey="name"
                />)
            }
        },
        {
            Header: "Initial Values",
            accessor: "initialValues",
        }
    ])
}

export const mappingData: any = [
    {
        fieldName: "Student ID",
        systemFieldName: "",
        initialValues: "ST0001, ST20001"
    },
    {
        fieldName: "Student Name",
        systemFieldName: "",
        initialValues: "Rakesh, Abhay"
    },
    {
        fieldName: "Roll No.",
        systemFieldName: "",
        initialValues: "001,002"
    },
    {
        fieldName: "Email",
        systemFieldName: "",
        initialValues: "demo@gmail.com, demo@gmail.com"
    },
    {
        fieldName: "Class",
        systemFieldName: "",
        initialValues: "VII,VII"
    },
    {
        fieldName: "Gender",
        systemFieldName: "",
        initialValues: "Male, Female"
    },
    {
        fieldName: "Nationality",
        systemFieldName: "",
        initialValues: "Indian, Indian"
    },
    {
        fieldName: "Cast",
        systemFieldName: "",
        initialValues: "Reddy,Reddy"
    },
    {
        fieldName: "Mother Tongue",
        systemFieldName: "",
        initialValues: "Telugu,Hindi"
    }
]
