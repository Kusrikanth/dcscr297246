
import { isBefore, isToday, isValid, isWithinInterval, parseISO } from "date-fns";
import { StatusLabel, TextInput, UserDetails } from "../../../Components/Common";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { default as ApproveSvg } from "../../../assets/imagesdps/academics/ApproveSvg.svg?react";
import { getDateWithTimeFormat } from "../../../utility/dateutility";
import Button from "../../../Components/Common/Button";

export const PresentMark = () => {
  return (
    <div style={{ background: "#9AE99A", width: "34px", height: "34px", padding: "6px 9px", borderRadius: "10px" }}>
      <ApproveSvg fill="#46D846" width={"17px"} height="17px" />
    </div>
  )
}

export const AbsentMark = () => {
  return (
    <div style={{ background: "#FADBD3", width: "34px", height: "34px", padding: "6px 9px", borderRadius: "10px" }}>
      <ApproveSvg fill="#FD7553" width={"17px"} height="17px" />
    </div>
  )
}

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.studentName}
              displayId={original?.studentCode}
              imageUrl={original?.studentImageS3URL}
              size={"xs"}
              defaultImgType="student"
            //   contentNotCenter={true}
            //   paddingTop={"pt-2"}
            />
          </>
        );
      },
    },
    {
      Header: "Roll Number",
      accessor: "rollNo",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <span>{original?.rollNo || "N/A"}</span>
          </>
        );
      },
    },
    {
      Header: "Attendance Status",
      accessor: "attendance",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const status = original?.attendance;
        return <StatusLabel type={status} labelName={status} />;
      }
    },
    {
      Header: "Created / Modified Date",
      accessor: "modifiedDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const status = original?.attendance;
          return status !== "NOT_MARKED" && <span className="tw-text-nowrap">{original?.modifiedDate ? getDateWithTimeFormat(`${original?.modifiedDate}Z`) : "-"}</span>
      },
    },
    {
      Header: "Modified By",
      accessor: "modifiedBy",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const status = original?.attendance;
        return status !== "NOT_MARKED" && <span>{original?.modifiedBy || "-"}</span>;
      }
    },
    {
      Header: "Remarks",
      accessor: "remarks",
      disableSortBy: true,
    },
    // {
    //   Header: "Actions",
    //   filterable: false,
    //   disableSortBy: true,
    //   Cell: ({ row: { original } }: any) => {
    //     return (
    //       <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
    //     );
    //   },
    // },
  ];
}

const InputComponent = ({
  row: { index, original },
  onChangeInputHndlr,
}: any) => {
  return (
    <TextInput
      name="remarks"
      // labelText="Bank Address"
      inputClassName="tw-mt-0"
      maxLength={500}
      value={original?.remarks}
      // isDisabled={!original?.isSelected}
    onChange={(event:any)=>onChangeInputHndlr(original?.studentId,"remarks",event)}
    />
  )
}

export function addStuAttGenerateColumns(allStudentCheckHndlr: any, singleStudentCheckHndlr: any, allStudentSelectedState: any) {
  return [
    // {
    //   Header: () => {
    //     return (
    //       <InputCheckbox
    //         name={"all-student"}
    //         // labelName={shortName}
    //         value={allStudentSelectedState}
    //         onChange={allStudentCheckHndlr}
    //         formgroupClassName="mb-0"
    //       />
    //     )
    //   },
    //   accessor: "isStudentChecked",
    //   columnClassName: "w-5",
    //   disableSortBy: true,
    //   Cell: ({ row: { original } }: any) => {
    //     const { studentId, isSelected } = original;
    //     return (
    //       <>
    //         <InputCheckbox
    //           name={`student-${studentId}`}
    //           // labelName={shortName}
    //           value={isSelected}
    //           onChange={singleStudentCheckHndlr}
    //           dataId={studentId}
    //           formgroupClassName="mb-0"
    //         />
    //       </>
    //     )
    //   }
    // },
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.studentName}
              displayId={original?.studentCode}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Roll Number",
      accessor: "rollNo",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <span>{original?.rollNo || "N/A"}</span>
          </>
        );
      },
    },
    {
      Header: "Attendance",
      accessor: "attendance",
      disableSortBy: true,
      Cell: ({ row: { original },onChangeInputHndlr , rowDataInfo : { isDisabled } }: any) => {
        const changeAttndanceHndler = (event:any,name:string)=>{
          event.preventDefault();
          onChangeInputHndlr(original?.studentId,name)
        }
        return (
          <>
            {(original?.attendance === "ABSENT" || original?.attendance === "PRESENT") ?
            <>
              <div className="tw-flex tw-gap-2">

                {original?.attendance === "PRESENT" ? <PresentMark /> : <AbsentMark />}
                <Button variant="soft"  onClick={((event:any)=>changeAttndanceHndler(event,"RESET"))}  >Reset</Button>
              </div>

            </> : <div className="tw-flex tw-gap-2" style={{ width: "12rem" }}>
              <Button variant="primary"   onClick={((event:any)=>changeAttndanceHndler(event,"PRESENT"))} style={{ width: "5rem", height: "2rem" }}> Present </Button>
              <Button variant="reject"   onClick={((event:any)=>changeAttndanceHndler(event,"ABSENT"))}  style={{ width: "5rem", height: "2rem" }}  > Absent </Button>
            </div>}

          </>

        )

      }
    },
    {
      Header: "Remarks",
      accessor: "remarks",
      disableSortBy: true,
      Cell: InputComponent,
    },
    // {
    //     Header: "Actions",
    //     filterable: false,
    //     disableSortBy: true,
    //     Cell: ({ row: { original } }: any) => {
    //       return (
    //       <MenuOptionHrtl actionOptions={actionsList} rowId={original.id}  />
    //       );
    //     },
    //   },
  ];
}

export const computeSubmitButtonError = (studentList: any) => {
  let newArr :any = []
  if (studentList?.length) {
    studentList?.map((item: any) => {
      let submitErr: any = true
        if ((item?.attendance === "ABSENT") || (item?.attendance === "PRESENT") || (item?.attendance === "NOT_MARKED")) {
          submitErr = false
        } 
        newArr.push(submitErr)
    })
  }
  if(newArr.length === 0){return true}
  else if (newArr.some((element:any) => element === true)) {return true}
  else return false
}

export function checkWithinTheRange ( currentDate:any, startDateString:any,endDateString:any){

const startDate = new Date(startDateString);
const endDate = new Date(endDateString);

// Check if the current date is within the interval
if(isValid(startDate) && isValid(endDate)){
  const isWithinRange = isWithinInterval(new Date(currentDate), { start: startDate, end: endDate });
  
  return isWithinRange;
}
return false
}

export function isDateNotValid(dateStr:any) {
  if (!dateStr) {
    return false;
  }

  const date = new Date(dateStr);

  if (isToday(date)) {
    return false;
  }

  return  !isBefore(date, new Date());
}