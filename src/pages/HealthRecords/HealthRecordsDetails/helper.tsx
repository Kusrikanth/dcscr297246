
import { UserDetails } from "../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../Components/Common/MenuOptions";
import { convertUTCToISTTimeOnly, getDdMmYyyyFormat, getFormattedDateddMMMYYYY } from "../../../utility/dateutility";


export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return [
        {
            Header: "Name",
            accessor: "studentName",
            disableSortBy: true,
            columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
            Cell: ({ row: { original } }: any) => {
                return (
                    <>
                    <UserDetails
                       displayName={original?.employeeDto?.employeeId  ? original?.employeeName : original?.studentName}
                       displayId={original?.employeeDto?.employeeId  ? original?.employeeCode : original?.studentCode}
                       showAvatar={false}
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
            Header:"MI Room",
            accessor:"miRoomName",
            disableSortBy: true,
        },
        {
            Header:"Class",
            accessor:"className",
            disableSortBy: true,
        },
        {
            Header:"Section",
            accessor:"sectionName",
            disableSortBy: true,
        },
        {
            Header:"Date",
            accessor:"createdDate",
            disableSortBy: true,
            Cell : ({ row: { original } }: any) => {
                return <span className="tw-text-nowrap">{getDdMmYyyyFormat(original?.date)}</span>
            }
        },
        {
            Header:"Time",
            accessor:"time",
            disableSortBy: true,
        },
        {
            Header:"Age",
            accessor:"age",
            disableSortBy: true,
        },
        {
            Header:"Gender",
            accessor:"gender",
            disableSortBy: true,
        },
        {
            Header:"Pulse Rate (BMP)",
            accessor:"pulseRate",
            disableSortBy: true,
        },
        {
            Header:"BP (MM HG)",
            accessor:"bp",
            disableSortBy: true,
        },
        {
            Header:"Respiratory",
            accessor:"respiratory",
            disableSortBy: true,
        },
        {
            Header:"Temperature",
            accessor:"temperature",
            disableSortBy: true,
        },
        {
            Header:"Weight",
            accessor:"weight",
            disableSortBy: true,
        },
        {
            Header:"Height",
            accessor:"height",
            disableSortBy: true,
        },
        {
            Header:"Present Complaints",
            accessor:"presentComplaints",
            disableSortBy: true,
        },
        {
            Header:"Treatment Given",
            accessor:"treatmentGiven",
            disableSortBy: true,
        },
        {
            Header: "Remarks",
            accessor: "remarks",
            disableSortBy: true,
        },
        {
            Header:"Created By",
            accessor:"createdBy",
            disableSortBy:true,
            Cell:({row:{original}}:any)=>{
              return <span>{original.createdBy ? original.createdBy : "-"}</span>
            }
        },
        {
            Header: "Actions",
            filterable: false,
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
              return (
              <MenuOptionHrtl actionOptions={actionsList} rowId={original.healthRecordId}  />
              );
            },
          },
    ];
}
export const MenuOptions: Array<any> = [
    {
      id: "STUDENT",
      labelName: "Student",
      customPadding: "0px 20px",
    },
    {
      id: "EMPLOYEE",
      labelName: "Employee",
      customPadding: "0px 20px",
    },
  
  ];

  const STUDENT = "STUDENT";
  const EMPLOYEE = "EMPLOYEE";
  
  export const getUserTypeId = (userType: any) => {
      switch (userType) {
          case "STUDENT":
              return STUDENT;
          case "EMPLOYEE":
              return EMPLOYEE;
          default:
              return STUDENT;
      }
  };

  export const ignoredKeys = ["searchString", "academicYearId", "curriculumId","fromDate"]