import { StatusLabel, UserDetails } from "../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return [
        {
            Header: "Student Name",
            accessor: "studentName",
            columnClassName: "tw-min-w-[200px] tw-max-w-[200px] ",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <>
                      <UserDetails
                          imageUrl={original?.studentImageURL}
                          displayName={original?.studentName}
                          displayId={original?.registrationNo}
                          size="xs"
                          defaultImgType="student"
                        />
                    </>
                );
            },
        },
        {
            Header:"Curriculum",
            accessor:"curriculumName",
            disableSortBy: true,
        },
        {
            Header: "Class",
            accessor: "className",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
              return (<div>
                <span>{original?.className}</span>
                <span className="tw-flex tw-text-gray-600" style={{minWidth:"4rem"}}>{original?.groupName}</span>
              </div>)
            }
          }, 
        {
            Header: "Father Name",
            accessor: "fatherName",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
              return (<div>
                <span>{original?.fatherName}</span>
                <span className="tw-flex tw-text-gray-600" style={{minWidth:"4rem"}}>{original?.phoneNo}</span>
              </div>)
            }
          }, 
          {
            Header:"Email",
            accessor:"email",
            disableSortBy: true,
        }, 
          {
            Header:"Status",
            accessor:"followUpStatus",
            disableSortBy: true,
        }, 
          {
            Header:"Remarks",
            accessor:"followUpRemarks",
            disableSortBy: true,
        }, 
          {
            Header:"From Campus",
            accessor:"fromCampus",
            disableSortBy: true,
        }, 
        {
            Header:"To Campus",
            accessor:"recommendedToCampus",
            disableSortBy: true,
        },
        {
            Header:"New Registration No",
            accessor:"newRegistrationNo",
            disableSortBy: true,
        },
        {
            Header:"New Application No",
            accessor:"newApplicationNo",
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
    ];
}

export const statusList = [
    {
        id: "ADMITTED",
        name: "ADMITTED",
    },
    {
        id: "NEED_FOLLOW_UP",
        name: "NEED FOLLOW UP",
    },
    {
        id: "NOT_INTERESTED",
        name: "NOT INTERESTED",
    },
]