import {
  InputCheckbox,
  StatusLabel,
  TextInput,
  UserDetails,
} from "../../../../Components/Common";
import { IOptionsHrtl, MoreActions } from "../../../../Components/Common/MenuOptions";
import {  convertUTCToISTTimeOnly, getDdMmYyyyFormat, getFormattedDateddMMMYYYY } from "../../../../utility/dateutility";

export const statusData = [
{
  name: "PENDING", id: "PENDING"
},
{
  name: "ACCEPTED", id: "ACCEPTED",
}, 
{
  name: "REJECTED", id: "REJECTED"
},
// {
//   name: "SUBMITTED", id: "SUBMITTED"
// },
]

export const requestTypeData = [
  {
    name :"STUDENT",id:"STUDENT"
  },
  {
    name :"EMPLOYEE",id:"EMPLOYEE"
  },
]

export const requestModeData = [
  {
    name :"OFFLINE",id:"OFFLINE"
  },
  {
    name :"ONLINE",id:"ONLINE"
  },
]

export const requestForData = [
  {
    name: "STUDENT", id: "STUDENT"
  },
  {
    name: "EMPLOYEE", id: "EMPLOYEE"
  },
]

const InputComponentForPinCode = ({
  row: { index, original },
  onChangeInputHndlr,
}: any) => {
  const onChangeHndler = (event:any)=>{
    if(event.target.value.length < 7){
      onChangeInputHndlr(event)
    }
  }
  return (
      <div style={{minWidth:"6rem"}}>
      <TextInput
      name="pinCode"
      inputType="number"
      inputClassName=""
      value={original?.pinCode}
      onChange={onChangeHndler}
      />
      </div>
  )
}
const InputComponentForPinAddress = ({
  row: { index, original },
  onChangeInputHndlr,
}: any) => {
  return (
      <div style={{minWidth:"6rem"}}>
      <TextInput
      name="residentialAddress"
      inputClassName=""
      value={original?.residentialAddress}
      onChange={(event:any)=>onChangeInputHndlr(event)}
      maxLength={150}
      />
      </div>
  )
}

export function generateStudentDetailColumn() {
  return ([
    {
      Header: "Name",
      accessor: "studentName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span>
              {original?.studentName|| original?.employeeName}
          </span>
        );
      },
    },
    {
      Header: "Mobile No",
      accessor: "mobileNumber",
      disableSortBy: true,
    },
    {
      Header: "Alternate No",
      accessor: "alternatePhoneNo",
      disableSortBy: true,
    },
    {
      Header: "PIN Code",
      accessor: "pinCode",
      disableSortBy: true,
      Cell :InputComponentForPinCode,
    },
    {
      Header: "Residential Address",
      accessor: "residentialAddress",
      disableSortBy: true,
      Cell : InputComponentForPinAddress,
    },
  ])
}

export function generateColumns(actionsList: Array<IOptionsHrtl>,toggleMapModal:any) {
  return [
    {
      Header: "Request No.",
      accessor: "requestNumber",
      disableSortBy: true,
    },
    {
      Header: "Name",
      accessor: "studentName",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      Cell: ({ row: { original } }: any) => {
        const { studentBase64ImageUrl,employeeBase64ImageUrl } = original,
          imageBaseUrl = (studentBase64ImageUrl || employeeBase64ImageUrl) ? `data:image/jpeg;base64, ${studentBase64ImageUrl || employeeBase64ImageUrl}` : "";
        return (
          <>
            <UserDetails
              imageUrl={imageBaseUrl}
              defaultImgType="student"
              displayName={original?.transportRequestFor === "EMPLOYEE" ? original?.employeeName : original?.studentName}
              displayId={original?.transportRequestFor === "EMPLOYEE" ? original?.employeeCode : original?.studentCode}
              size="xs"
            />
          </>
        );
      },
    },
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
    },
    {
      Header: "New Route",
      accessor: "routeName",
      disableSortBy: true,
    },
    {
      Header: "Status",
      accessor: "transportRequestStatus",
      disableSortBy: true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.transportRequestStatus} labelName={original.transportRequestStatus} />
        );
      },
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
        Header: "Created Date",
        accessor: "createdAt",
        disableSortBy: true,
        Cell:({row:{original}}:any)=>{
            const [date,time] = original?.createdAt?.split("T") ?? [];
            return <UserDetails
            displayName={date ? getFormattedDateddMMMYYYY(date) : "-"}
            displayId={time ? convertUTCToISTTimeOnly(time) : "-"}
            showAvatar={false}
            ></UserDetails>
        }
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { transportRequestStatus } = original;
        if(!(transportRequestStatus?.toLowerCase() === "pending")){
          return null;
        }
        let udpatedActions: any = [...actionsList];
        
        return (
          <MoreActions actionOptions={udpatedActions} rowId={original.requestId} isHorizontal={true} />
        );
      },
    },
  ];
}


export function createNewRequestPayload(formData: any, otherProps: any,termsForTermiResp:any) {
  const { branchId, academicYearId,curriculumId,classId,studentId,employeeId,willEffectFromDate,transportRequestFor,pinCode,address,approval,alternatePhoneNo}:any = { ...formData, ...otherProps };
 
  const payload = {
    branchId, academicYearId,curriculumId,classId,studentId,employeeId,willEffectFromDate,transportRequestFor,pinCode,address,approval, alternativePhoneNo:alternatePhoneNo, ledgerIds:termsForTermiResp?.filter((i:any)=>i.isSelected)?.map((i:any)=>i.studentLedgerId)
  }
  return payload;
}

export function generateLedgerColumns(allStudentCheckHndlr:any, singleStudentCheckHndlr:any, allStudentSelectedState:any) {
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
      columnClassName: "tw-w-5",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { studentLedgerId, isSelected } = original;
        return (
          <>
            <InputCheckbox
              name={`student-${studentLedgerId}`}
              // labelName={shortName}
              isDisabled={original?.paymentStatus?.toLowerCase() === "paid" && true} 
              value={isSelected}
              onChange={singleStudentCheckHndlr}
              dataId={studentLedgerId}
              formgroupClassName="tw-mb-0"
            />
          </>
        )
      }
    },
      {
          Header: "Fee Details",
          accessor: "feeDetails",
          disableSortBy: true,
          columnClassName: "tw-w-[200px] tw-min-w-[200px]",
      },
      {
          Header: "From Date",
          accessor: "startDate",
          disableSortBy: true,
          Cell: ({ row: { original } }: any) => {
            return (
              <span>{getDdMmYyyyFormat(new Date(original?.startDate))}</span>
            );
          },
      },
      {
          Header: "To Date",
          accessor: "endDate",
          disableSortBy: true,
          Cell: ({ row: { original } }: any) => {
            return (
              <span>{getDdMmYyyyFormat(new Date(original?.endDate))}</span>
            );
          },
      },
      {
          Header: "Route",
          accessor: "routeName",
          disableSortBy: true,
      },
      {
          Header: "Stop Name",
          accessor: "stopName",
          disableSortBy: true,
      },
      {
        Header: "Status",
        accessor: "paymentStatus",
        disableSortBy: true,
        filterable: false,
        Cell: ({ row: { original } }: any) => {
          return (
            <StatusLabel type={original.paymentStatus} labelName={original.paymentStatus} />
          );
        },
      },
  ])
}