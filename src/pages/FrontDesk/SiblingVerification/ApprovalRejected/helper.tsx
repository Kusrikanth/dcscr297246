import { UserDetails } from "../../../../Components/Common";
import { IOptionsHrtl, MoreActions } from "../../../../Components/Common/MenuOptions";
import { getAmountValueWithDecimal } from "../../../../utility/commonutility";
import { getDateMonthYearFormat } from "../../../../utility/dateutility";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return [
      {
        Header: "Registration ID",
        accessor: "studentRegNo",
        disableSortBy: true,
      },
      {
        Header: "Student Name",
        accessor: "studentName",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
          return (
            <>
              <UserDetails
                displayName={original?.studentName}
                showAvatar={false}
              />
            </>
          );
        },
      },
      {
        Header: "Class",
        accessor: "classShortName",
        disableSortBy: true,
      },
      {
        Header: "Contact Person Name",
        accessor: "contactPersonName",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
          return (
            <>
              <div>{original?.contactPersonName}</div>
            </>
          );
        },
      },
      {
        Header: "Phone",
        accessor: "phoneNo",
        disableSortBy: true,
      },
      {
        Header: "Email",
        accessor: "email",
        disableSortBy: true,
      },
      {
        Header: "Sibling Student ID",
        accessor: "siblingStudentCode",
        disableSortBy: true,
      },
      {
        Header: "Sibling Campus",
        accessor: "siblingCampus",
        disableSortBy: true,
      },
      {
        Header: "Sibling Curriculum",
        accessor: "siblingCurriculumName",
        disableSortBy: true,
      },
      {
        Header: "Sibling Class",
        accessor: "siblingClassShortName",
        disableSortBy: true,
      },
      {
        Header: "Sibling Section",
        accessor: "siblingSectionName",
        disableSortBy: true,
      },
      {
        Header: "Remarks",
        accessor: "remarks",
        disableSortBy: true,
        columnClassName: "max-w-200px",
      },
      // {
      //   Header: "Actions",
      //   filterable: false,
      //   disableSortBy: true,
      //   Cell: ({ row: { original } }: any) => {
      //     return (
      //       <MoreActions actionOptions={actionsList} rowId={original.id} isHorizontal={true}/>
      //     );
      //   },
      // },
    ];
  }
