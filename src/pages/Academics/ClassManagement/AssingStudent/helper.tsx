import { ITabItem } from "../../../../Components/Common/Tabs";
import { IMoreActions, IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { StatusLabel, MoreActions, UserDetails } from "../../../../Components/Common";
import { Input } from "reactstrap";

//import images
import AvatarImage from "../../../../assets/images/users/avatar-1.jpg";
import React from "react";

export function generateColumns() {
    return ([
        {
            Header: "Student Name",
            accessor: "studentName",
            Cell: ({ row: { original } }: any) => {
                return (
                    <React.Fragment>
                        <UserDetails
                            displayId={original.studentId}
                            displayName={original.studentName}
                            imageUrl={AvatarImage}
                        />
                    </React.Fragment>
                );
            },
        },
        {
            Header: "Select",
            Cell: () => {
                return (<div className="form-check form-check-info tw-mb-2">
                    <Input className="form-check-input" type="checkbox" id="formCheck11" />
                </div>)
            }
        }
    ])
}

export interface IStudentInfo {
    id: number,
    studentId: string | undefined,
    studentName: string | undefined,
}

export const studentData: Array<IStudentInfo> = [
    {
        id: 1,
        studentId: "ENH001",
        studentName: "Lingam Prkruth",
    },
    {
        id: 2,
        studentId: "ENH002",
        studentName: "M Sudhanshu",
    },
    {
        id: 3,
        studentId: "ENH004",
        studentName: "Gitika Kalasthi",
    },
    {
        id: 4,
        studentId: "ENH005",
        studentName: "Lingam Prkruth",
    },
]