import { ITabItem } from "../../../Components/Common/Tabs";
import { IMoreActions, IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { StatusLabel, MoreActions, UserDetails } from "../../../Components/Common";

//import images
import AvatarImage from "../../../assets/images/users/avatar-1.jpg";
import React from "react";


export function generateColumns(actionsList: Array<IOptionsHrtl>, assignRoomHndlr: any, assignTeacherHndlr: any,
    assignStudentHndlr: any) {
    return ([
        {
            Header: "Section Name",
            accessor: "sectionName",
        },
        {
            Header: "Room No.",
            accessor: "roomNo",
            Cell: ({ value }: any) => {
                return (
                    <React.Fragment>
                        {value ? (value) : <span className="tw-text-blue-500 tw-cursor-pointer"
                            onClick={assignRoomHndlr}>Assign Room No.</span>}
                    </React.Fragment>
                );
            },
        },
        {
            Header: "Class Teacher",
            accessor: "classTeacher",
            Cell: ({ row: { original } }: any) => {
                return (
                    <React.Fragment>
                        {original.userId ? <UserDetails
                            displayId={original.userId}
                            displayName={original.userName}
                            imageUrl={AvatarImage}
                        /> : <span onClick={assignTeacherHndlr} className="tw-text-blue-500 tw-cursor-pointer">Assign Class Teacher</span>}
                    </React.Fragment>
                );
            },
        },
        {
            Header: "No. Of Students",
            accessor: "noOfStudents",
            Cell: ({ value }: any) => {
                return (
                    <React.Fragment>
                        {value ? (value) : <span onClick={assignStudentHndlr} className="tw-text-blue-500 tw-cursor-pointer">00</span>}
                    </React.Fragment>
                );
            },
        },
        {
            Header: "Actions",
            filterable: false,
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MoreActions actionOptions={actionsList} rowId={original.id} isHorizontal={true} />
                );
            },
        },
    ])
}

export interface IClassDetails {
    id: number,
    sectionName: string,
    roomNo: string | undefined,
    userId: string | undefined,
    userName: string | undefined,
    noOfStudents: string | undefined,
}

export const branchData: Array<IClassDetails> = [
    {
        id: 1,
        sectionName: "VII-A",
        roomNo: "201",
        userId: "DCIP000001",
        userName: "Donald Risher",
        noOfStudents: "40",
    },
    {
        id: 2,
        sectionName: "VI-A",
        roomNo: undefined,
        userId: undefined,
        userName: undefined,
        noOfStudents: undefined,
    },
    {
        id: 3,
        sectionName: "V-A",
        roomNo: undefined,
        userId: undefined,
        userName: undefined,
        noOfStudents: undefined,
    },
    {
        id: 4,
        sectionName: "IV-A",
        roomNo: undefined,
        userId: undefined,
        userName: undefined,
        noOfStudents: undefined,
    }
]