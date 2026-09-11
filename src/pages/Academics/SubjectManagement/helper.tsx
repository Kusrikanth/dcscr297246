import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { StatusLabel, MenuOptionHrtl, UserDetails } from "../../../Components/Common";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Subject Name",
            accessor: "subjectName",
            Cell: ({ row: { original } }: any) => {
                return (
                    <span className="tw-flex tw-items-center">

                        <div className="tw-flex tw-items-center tw-justify-center tw-flex-shrink-0 tw-bg-blue-100 tw-w-10 tw-h-10 tw-rounded-md tw-p-1 tw-mr-2">
                            <i
                                style={{ fontSize: "2rem" }}
                                className="ri-book-mark-line tw-text-blue-600"
                            ></i>
                        </div>

                        {/* <img className="tw-rounded-full tw-w-8 tw-h-8" src={userDetails.imageUrl} alt="Pic" /> */}

                        <span className="tw-text-left">
                            <span className="tw-block tw-text-blue-600 tw-font-medium">
                                {original.subjectName}
                            </span>
                            <span className="tw-block tw-text-xs tw-text-gray-500">
                                {original.subjectId}
                            </span>
                        </span>
                    </span>
                );
            },
        },
        {
            Header: "Teacher Name",
            accessor: "teacherName",
            Cell: ({ row: { original } }: any) => {
                return (
                    <UserDetails
                        displayId={original.teacherId}
                        displayName={original.teacherName}
                    />
                );
            },
        },
    ])
}

export interface ISubjectInfo {
    id: number,
    subjectId: string,
    subjectName: string,
    teacherId: string,
    teacherName: string,
}

export const branchData: Array<ISubjectInfo> = [
    {
        id: 1,
        subjectId: "Core",
        subjectName: "English",
        teacherId: "DCIP0001",
        teacherName: "Donald Risher"
    },
    {
        id: 2,
        subjectId: "Core",
        subjectName: "Hindi",
        teacherId: "DCIP0001",
        teacherName: "Donald Risher"
    },


]