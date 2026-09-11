import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { StatusLabel, MenuOptionHrtl, UserDetails, SelectInput } from "../../../../Components/Common";
import classnames from "classnames";

export function generateColumns() {
    return ([
        {
            Header: "Student ID",
            accessor: "studentId"
        },
        {
            Header: "Student Name",
            accessor: "studentName"
        },
        {
            Header: "Class",
            accessor: "class"
        },
        {
            Header: "Section",
            accessor: "section"
        },
        {
            Header: "Student Type",
            accessor: "studentType"
        },
        {
            Header: "Parent Name",
            accessor: "parentName"
        },
        {
            Header: "Phone No.",
            accessor: "phoneNumber"
        },
        {
            Header: "Email Id",
            accessor: "emailId"
        }
    ])
}

export const mappingData: any = [
    {
        studentId: "ENNH001",
        studentName: "Lingam Prkruth",
        class: "NUR",
        section: "NUR-A",
        studentType: "Non-Residential",
        parentName: "KB Varunmadhan",
        phoneNumber: "+91 981232545256",
        emailId: "Sravani.Kk@gmail.com"
    }, {
        studentId: "ENNH001",
        studentName: "Lingam Prkruth",
        class: "NUR",
        section: "NUR-A",
        studentType: "Non-Residential",
        parentName: "KB Varunmadhan",
        phoneNumber: "+91 981232545256",
        emailId: "Sravani.Kk@gmail.com"
    }, {
        studentId: "ENNH001",
        studentName: "Lingam Prkruth",
        class: "NUR",
        section: "NUR-A",
        studentType: "Non-Residential",
        parentName: "KB Varunmadhan",
        phoneNumber: "+91 981232545256",
        emailId: "Sravani.Kk@gmail.com"
    }, {
        studentId: "ENNH001",
        studentName: "Lingam Prkruth",
        class: "NUR",
        section: "NUR-A",
        studentType: "Non-Residential",
        parentName: "KB Varunmadhan",
        phoneNumber: "+91 981232545256",
        emailId: "Sravani.Kk@gmail.com"
    }, {
        studentId: "ENNH001",
        studentName: "Lingam Prkruth",
        class: "NUR",
        section: "NUR-A",
        studentType: "Non-Residential",
        parentName: "KB Varunmadhan",
        phoneNumber: "+91 981232545256",
        emailId: "Sravani.Kk@gmail.com"
    }, {
        studentId: "ENNH001",
        studentName: "Lingam Prkruth",
        class: "NUR",
        section: "NUR-A",
        studentType: "Non-Residential",
        parentName: "KB Varunmadhan",
        phoneNumber: "+91 981232545256",
        emailId: "Sravani.Kk@gmail.com"
    }, {
        studentId: "ENNH001",
        studentName: "Lingam Prkruth",
        class: "NUR",
        section: "NUR-A",
        studentType: "Non-Residential",
        parentName: "KB Varunmadhan",
        phoneNumber: "+91 981232545256",
        emailId: "Sravani.Kk@gmail.com"
    },
]
