import avatar1 from "../../../../../assets/images/users/avatar-1.jpg";
import { StudentSubjectDataTypes, } from "./StudentSubjectTypes";
import { MenuOptionHrtl, UserDetails } from "../../../../../Components/Common";
import { IOptionsHrtl } from "../../../../../Components/Common/MenuOptions";

export function generateColumns() {
    return [
        {
            Header: "Assement Objective",
            accessor: "class",
            disableSortBy: true,
        },
        {
        Header: "Grading",
        accessor: "endDateverbalLanguage",
        disableSortBy: true,
        // columnClassName: "w-70",
        Cell: ({ row: { original } }: any) => {
          return (
            <div className="d-flex">
            <button  className="btn btn-outline-success btn-sm btn-icon rounded-circle mx-1"></button>
            <button  className="btn btn-outline-warning btn-sm btn-icon rounded-circle mx-1"></button>
            <button  className="btn btn-outline-danger btn-sm btn-icon rounded-circle mx-1"></button>
            </div>
              );
        },
        
    },
    ];
}
export const StudentSubjectTableData: Array<StudentSubjectDataTypes> =
[
{
  id: 1,

  class: "Analyse, evaluate and develop facts, ideas and opinions, using appropriate support from the text.",
  },
  {
    id: 2,

    class: "Demonstrate understanding of how writers achieve effects and influnce readersions, using appropriate support from the text",
    },
    {
        id: 3,
   
        class: "Sequence facts, ideas and opinions support from the text",
        },
];