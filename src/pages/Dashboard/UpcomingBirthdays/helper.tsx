import { IUpcomingBirthDaysData } from "./UpcomingBirthdays";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";
import { UserDetails } from "../../../Components/Common";


export function generateColumns() {
    return [
      {
        Header: "Student Name",
        accessor: "studentName",
        Cell: ({ row: { original } }: any) => {
            return (
              <UserDetails
                imageUrl={original?.studentName?.imgUrl}
                displayName={original?.studentName?.name}
                displayId={original?.studentName?.dep_id}
              />
            );
          },
      },
      {
        Header: "Class",
        accessor: "class",
      },
      {
        Header: "Section",
        accessor: "section",
      },
      {
        Header: "Birth Date",
        accessor: "birthDate",
      },
    ];
  }

  export const UpcomingBirthDayData: Array<IUpcomingBirthDaysData> = [
    {
      id: 1,
      studentName: {
        name: "User1",
        dep_id: "DCIP000001",
        imgUrl: avatar1,
      },
      class: "XII-SCI",
      section:"VII-A",
      birthDate:"06 January",
    },
    {
      id: 2,
      studentName: {
        name: "User2",
        dep_id: "DCIP000002",
        imgUrl: avatar1,
      },
      class: "XII-SCI",
      section:"VII-A",
      birthDate:"06 January",
    },
    {
      id: 3,
      studentName: {
        name: "User3",
        dep_id: "DCIP000003",
        imgUrl: avatar1,
      },
      class: "XII-SCI",
      section:"VII-A",
      birthDate:"06 January",
    },
  ]