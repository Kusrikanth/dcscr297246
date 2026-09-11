import { IOptionsHrtl, MoreActions } from "../../../../Components/Common/MenuOptions";
import { InputCheckbox, MenuOptionHrtl, UserDetails } from "../../../../Components/Common";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";

interface IRoleTypesTableData {
    id: number,
    roleName: string
}

export function generateColumnsForStudent(actionsList: Array<IOptionsHrtl>, allStudentCheckHndlr: any, singleStudentCheckHndlr: any, allStudentSelectedState: any) {
    return ([
      {
        Header: () => {
          return (
            <InputCheckbox
              name={"all-student"}
              // labelName={shortName}
              value={allStudentSelectedState}
              onChange={allStudentCheckHndlr}
              formgroupClassName="tw-mb-0"
            />
          )
        },
        accessor: "isStudentChecked",
        columnClassName: "tw-w-[5%]",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
          const { studentRegId, isSelected } = original;
          return (
            <>
              <InputCheckbox
                name={`student-${studentRegId}`}
                // labelName={shortName}
                value={isSelected}
                onChange={singleStudentCheckHndlr}
                dataId={studentRegId}
                formgroupClassName="tw-mb-0"
              />
            </>
          )
        }
      },
        {
            Header: "Student Name",
            accessor: "studentName",
            disableSortBy: true,
            columnClassName: "tw-min-w-[200px] tw-max-w-[200px] ",
            Cell: ({ row: { original } }: any) => {
              return (
                <>
                  <UserDetails
                    imageUrl={original?.imageUrl}
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
            Header: "Curriculum",
            accessor: "curriculum",
            disableSortBy: true,
          },
          {
            Header: "Class",
            accessor: "classShortName",
            disableSortBy: true,
          },
          {
            Header: "Father Name",
            accessor: "fatherName",
            disableSortBy: true,
          },
          {
            Header: "Contact No",
            accessor: "contactNo",
            disableSortBy: true,
          },
          {
            Header: "Email Id",
            accessor: "email",
            disableSortBy: true,
          },
          {
            Header: "Admission Type",
            accessor: "admissionType",
            disableSortBy: true,
          },
          {
            Header: "Admission Status",
            accessor: "admissionStatus",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                  <>
                    {original?.admissionStatus ? original?.admissionStatus?.split("_")?.join(" ") : ""}
                  </>
                );
              },
          },
          {
            Header: "SMS Sent Date",
            accessor: "smsSendDate",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
              return original?.smsSendDate ? getDdMmYyyyWithMonthNameFormat(new Date(original?.smsSendDate)) : "-";
            },
          },
          {
            Header: "Email Sent Date",
            accessor: "mailSendDate",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
              return original?.mailSendDate ? getDdMmYyyyWithMonthNameFormat(new Date(original?.mailSendDate)) : "-";
            },
          },
          {
            Header: "SMS & Email",
            filterable: false,
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
              return (
                <MoreActions actionOptions={actionsList} rowId={original.studentRegId} isHorizontal={true}/>
              );
            },
          },
    ])
}
export function generateColumnsForFeedback() {
    return ([
        {
            Header: "Student Name",
            accessor: "studentName",
            disableSortBy: true,
            columnClassName: "tw-min-w-[200px] tw-max-w-[200px] ",
            Cell: ({ row: { original } }: any) => {
              return (
                <>
                  <UserDetails
                    imageUrl={original?.imageUrl}
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
            Header: "Curriculum",
            accessor: "curriculum",
            disableSortBy: true,
          },
          {
            Header: "Class",
            accessor: "classShortName",
            disableSortBy: true,
          },
          {
            Header: "Father Name",
            accessor: "fatherName",
            disableSortBy: true,
          },
          {
            Header: "Contact No",
            accessor: "contactNo",
            disableSortBy: true,
          },
          {
            Header: "Email Id",
            accessor: "email",
            disableSortBy: true,
          },
          {
            Header: "Admission Type",
            accessor: "admissionType",
            disableSortBy: true,
          },
          {
            Header: "Admission Status",
            accessor: "admissionStatus",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                  <>
                    {original?.admissionStatus ? original?.admissionStatus?.split("_")?.join(" ") : ""}
                  </>
                );
              },
          },
          {
            Header: () => {
              return (
                <div className="tw-flex tw-flex-col">
                  <span>Are you given the</span>
                  <span>necessary information</span>
                  <span>about admission process ?</span>
                </div>
              )
            },
            accessor: "necessaryInfo",
            disableSortBy: true,
          },
          {
            Header: () => {
              return (
                <div className="tw-flex tw-flex-col">
                  <span>Do you require any</span>
                  <span>details further ?</span>
                  <span>if Yes, please mention</span>
                </div>
              )
            },
            accessor: "furtherDetail",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
              let detail:any = original?.furtherDetail ;
              if(original?.furtherDetail === "YES"){
                if(original?.furtherDetYesInfo === "OTHERS"){
                  detail = original?.furtherDetYesOtherInfo
                }else{
                  detail = original?.furtherDetYesInfo
                }
              }
              return (
                <>
                  {detail || ""}
                </>
              );
            },
          },
          {
            Header: () => {
              return (
                <div className="tw-flex tw-flex-col">
                  <span>Are you interested to</span>
                  <span>proceed further for admission ?</span>
                  <span>if Need time, please mention</span>
                </div>
              )
            },
            accessor: "proceedAdmission",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
              return (<>
              {original?.proceedAdmission === "NEED TIME" ? original?.proceedAdmissionNeedTimeInfo : original?.proceedAdmission}
              </>)
            },
          },
          {
            Header: () => {
              return (
                <div className="tw-flex tw-flex-col">
                  <span>We will be happy to note</span>
                  <span>suggestions from you , if any</span>
                </div>
              )
            },
            accessor: "suggestions",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
              return (<>
              {original?.suggestions || "-"}
              </>)
            },
          },
          {
            Header: "User Date",
            accessor: "userDate",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
              return <div style={{minWidth:"5rem"}}>{original?.userDate ?  getDdMmYyyyWithMonthNameFormat(new Date(original?.userDate)) : ""}</div>
            },
          },
    ])
}


export const roleTypeData: Array<IRoleTypesTableData> = [
    {
        id: 1,
        roleName: "Admin"
    }, {
        id: 2,
        roleName: "Teacher"
    },
    {
        id: 3,
        roleName: "Accountant"
    },
    {
        id: 4,
        roleName: "Librarian"
    },
    {
        id: 5,
        roleName: "Students"
    },
    {
        id: 6,
        roleName: "Parents"
    }
]

export const userRoleTypes = [
    {
        id: "STUDENT",
        name: "Student"
    },
    {
        id: "PARENT",
        name: "Parent"
    },
    {
        id: "EMPLOYEE",
        name: "Employee"
    }
]

export const AdmissionTypeMenuOptions = [
    {
      id: "Residential",
      value: "Residential"
    },
    {
      id: "Non-Residential",
      value: "Non-Residential"
    },
  
  ]
  
  export function hasStateChanged(newState: any) {
    let count: any = 0;
    let showState: boolean = false;
    for (const key in newState) {
      const newValue = newState[key];
      if (newValue) {
        showState = true;
        if (key === "admissionType" || key === "startDate"){
          count += 1;
        }
      }
    }
    if (count > 0) { return { stateChange: showState, count: count } }
    else { return { stateChange: showState, count: count } }
  }

  export const MenuOptions: Array<any> = [
    {
      id: "studentNotificaionDetails",
      labelName: "Student Notification Details",
      customPadding: "0px 20px",
    },
    {
      id: "feedbackReport",
      labelName: "Feedback Report",
      customPadding: "0px 20px",
    },
  
  ];