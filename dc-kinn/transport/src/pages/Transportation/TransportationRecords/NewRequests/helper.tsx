import {
  StatusLabel,
  TextInput,
  UserDetails,
} from "../../../../Components/Common";
import { convertUTCToISTTimeOnly, getDisplayDateForTableFormat, getFormattedDateddMMMYYYY } from "../../../../utility/dateutility";
import { IOptionsHrtl, MoreActions } from "../../../../Components/Common/MenuOptions";

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
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      disableSortBy: true,
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
      Header: "Request For",
      accessor: "transportRequestFor",
      disableSortBy: true,
    },
    {
      Header: "New Route",
      accessor: "routeName",
      disableSortBy: true,
    },
    {
      Header: "Pick Up Point",
      accessor: "pickUpPoint",
      disableSortBy: true,
      columnClassName: "tw-w-[300px] tw-min-w-[300px]  tw-max-w-[300px]",
    },
    {
      Header: "Drop Point",
      accessor: "dropPoint",
      disableSortBy: true,
      columnClassName: "tw-w-[300px] tw-min-w-[300px]  tw-max-w-[300px]",
    },
    {
      Header: "Slab",
      accessor: "slabName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <div style={{minWidth:"4rem"}}>
          <UserDetails
              displayName={original?.slabName}
              displayId={ original?.slabDistanceFrom && `${original?.slabDistanceFrom?.toFixed(0) || ""} - ${original?.slabDistanceTo?.toFixed(0) || ""} Km`}
              showAvatar={false}
            />
          </div>
        );
      },
    },
    {
      Header: "Request Mode",
      accessor: "transportRequestMode",
      disableSortBy: true,
    },
    {
      Header: "Contact Number",
      accessor: "contactNo",
      disableSortBy: true,
    },
    {
      Header: "Alternate Number",
      accessor: "alternativePhoneNo",
      disableSortBy: true,
    },
    {
      Header: "Address",
      accessor: "address",
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      disableSortBy: true,
    },
    {
      Header: "Location",
      accessor: "location",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { latitude, longitude } = original;
        if (latitude && longitude) {
          return (
            <span className="tw-text-blue-500 tw-cursor-pointer tw-underline" onClick={()=>toggleMapModal(latitude,longitude,original)}>View</span>
          )
        } else {
          return "-";
        }
      }
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

export function generateApplicableTermsTableColumns() {
  return [
    {
      Header: "Terms",
      accessor: "termName",
      disableSortBy: true
    },
    {
      Header: "From Date",
      accessor: "fromDate",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        return (<span className="tw-text-nowrap">{getDisplayDateForTableFormat(value)}</span>)
      },
    },
    {
      Header: "To Date",
      accessor: "toDate",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        return (<span className="tw-text-nowrap">{getDisplayDateForTableFormat(value)}</span>)
      },
    },
  ];
}

export function createNewRequestPayload(formData: any, otherProps: any) {
  const payload = { ...formData, ...otherProps };
  payload.alternativePhoneNo = payload.alternatePhoneNo;
  delete payload.curriculumName;
  delete payload.className;
  delete payload.slabDistance;
  delete payload.pickUpTime;
  delete payload.dropTime;
  delete payload.capacity;
  delete payload.requestNo;
  delete payload.alternatePhoneNo;

  if(payload.transportRequestFor === "STUDENT"){
    delete payload.employeeId;
    delete payload.employeeName;
  }else{
    delete payload.studentId;
    delete payload.studentName;
  }
  return payload;
}

export function renderOptionsRoute(item: any) {
  return `${item?.routeName}`;
}

export function renderValueRoute(selectedItems: any) {
  return `${selectedItems?.routeName}`;
}