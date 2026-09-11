
import { IOptionsHrtl, MenuOptionHrtl } from "../../../Components/Common/MenuOptions";
import { convertTo12HourFormat, convertTo24HourFormat } from "../../../utility/dateutility";

function getInchargeMembers(options: (Array<any> | null)) {
    if (Array.isArray(options) && options.length > 0) {
      return (
        <div className="tw-flex tw-flex-wrap tw-gap-1">
          {options.map((item, index) => {
            return (
              <span key={item?.inchargeId} title={item?.inchargeId} className="badge text-uppercase bg-light text-muted tw-p-2">{item?.inchargeName}</span>
            )
          })}
        </div>
      )
    } else {
      return (<span className="">-</span>)
    }
  }

export function generateColumns(actionsList: Array<IOptionsHrtl>,toggleShowStudentModal:any) {
    return [
        {
            Header: "Route Name",
            accessor: "routeName",
            disableSortBy: true,
        },
        {
            Header:"Vehicle Number",
            accessor:"vehicleNumber",
            disableSortBy: true,
        },
        {
            Header:"Capacity",
            accessor:"vehicleCapacity",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <span className="tw-underline tw-text-blue-500 tw-cursor-pointer" onClick={()=>toggleShowStudentModal(original?.routeId)}>
                  {original?.capacityOccupied || "0"} / {original?.vehicleCapacity || "0"}
                    </span>
                );
            },
        },
        {
            Header: "Driver Name",
            accessor: "driverName",
            disableSortBy: true,
          //   Cell: ({ row: { original } }: any) => {
          //     return (
          //       <span className="badge text-uppercase bg-light text-muted p-2">{original?.driverName}</span>
          //     );
          // },
        },
        {
            Header: "Attender Name",
            accessor: "attenderName",
            disableSortBy: true,
          //   Cell: ({ row: { original } }: any) => {
          //     return (
          //       <span className="badge text-uppercase bg-light text-muted p-2">{original?.attenderName}</span>
          //     );
          // },
        },
        {
            Header: "Incharge Members",
            accessor: "inchargeName",
            disableSortBy: true,
            Cell: ({ row }: any) => {
              const { original } = row,
                { inchargeDtos } = original || {};
              return (
                getInchargeMembers(inchargeDtos)
              );
            },
          },
        {
          Header: () => {
            return (
              <div className="tw-flex tw-flex-col">
                <span>Trip 1</span>
                <span>Pick Up Start / End Time</span>
                <span>Drop Start / End Time</span>
              </div>
            )
          },
            accessor: "trip1PickupStartTime",
            disableSortBy: true,
            Cell : ({row : {original}} : any)=>{
                return (
                  <div style={{whiteSpace:"nowrap"}}>
                    <div>{original?.trip1PickupStartTime && `${original?.trip1PickupStartTime} / ${original?.trip1PickupEndTime}`} </div>
                    <div> {original?.trip1DropStartTime && `${original?.trip1DropStartTime} / ${original?.trip1DropEndTime}`} </div>
                  </div>
                )
            }
        },
        {
          Header: () => {
            return (
              <div className="tw-flex tw-flex-col">
                <span>Trip 2</span>
                <span>Pick Up Start / End Time</span>
                <span>Drop Start / End Time</span>
              </div>
            )
          },
            accessor: "trip2PickupStartTime",
            disableSortBy: true,
            Cell : ({row : {original}} : any)=>{
                return (
                  <div style={{whiteSpace:"nowrap"}}>
                    <div>{original?.trip2PickupStartTime && `${original?.trip2PickupStartTime} / ${original?.trip2PickupEndTime}`} </div>
                    <div>{original?.trip2DropStartTime && `${original?.trip2DropStartTime} / ${original?.trip2DropEndTime}`} </div>
                  </div>
                )
            }
        },
        {
          Header: () => {
            return (
              <div className="tw-flex tw-flex-col">
                <span>Trip 3</span>
                <span>Pick Up Start / End Time</span>
                <span>Drop Start / End Time</span>
              </div>
            )
          },
            accessor: "trip3ickupStartTime",
            disableSortBy: true,
            Cell : ({row : {original}} : any)=>{
                return (
                  <div style={{whiteSpace:"nowrap"}}>
                    <div>{original?.trip3PickupStartTime && `${original?.trip3PickupStartTime} / ${original?.trip3PickupEndTime}`} </div>
                    <div>{original?.trip3DropStartTime && `${original?.trip3DropStartTime} / ${original?.trip3DropEndTime}`} </div>
                  </div>
                )
            }
        },
       
        {
            Header: "Actions",
            filterable: false,
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
              return (
              <MenuOptionHrtl actionOptions={actionsList} rowId={original.routeId}  />
              );
            },
          },
    ];
}
export function generateStudentsColumns() {
    return [
        {
            Header: "Code",
            accessor: "studentCode",
            disableSortBy: true,
            Cell : ({row : {original}} : any)=>{
              const { studentId , studentCode , employeeCode } = original;
              return (
                <span>{ studentId ? studentCode : employeeCode}</span>
              )
            }
        },
        {
            Header:"Name",
            accessor:"studentName",
            disableSortBy: true,
            Cell : ({row : {original}} : any)=>{
              const { studentId , studentName , employeeName } = original;
              return (
                <span>{ studentId ? studentName : employeeName}</span>
              )
            }
        },
        {
            Header:"Stop Name",
            accessor:"stopName",
            disableSortBy: true,
        },

    ];
}

export function renderValueEmployee(selectedItems: any, removeItemHandler: any) {
  if (Array.isArray(selectedItems)) {
    return (<div className="selected-container">
      {
        selectedItems.map((item, index) => {
          return (<div key={`item-${item?.id}`} className="selectedoption-item">
            <span>{item?.employeeName}</span>
            <span data-id={item?.id} onClick={removeItemHandler} className="remove-icon">
              <i className="ri-close-line"></i>
            </span>

          </div>)
        })
      }
    </div>)
  }
}

export function renderOptionsEmployee(item: any) {
  return `${item?.employeeName} - ${item?.employeeCode}`;
}

export function renderOptionsVehicle(item: any) {
  return item?.vehicleNo;
}

export function renderValueVehicle(selectedItems: any) {
  return selectedItems?.vehicleNo;
}

export const tripDetailsMenu = [
  {
    pickUpStartTime : "trip1PickupStartTime",
    pickUpEndTime : "trip1PickupEndTime",
    dropStartTime : "trip1DropStartTime",
    dropEndTime : "trip1DropEndTime",
    name : "Trip 1",
  },
  {
    pickUpStartTime : "trip2PickupStartTime",
    pickUpEndTime : "trip2PickupEndTime",
    dropStartTime : "trip2DropStartTime",
    dropEndTime : "trip2DropEndTime",
    name : "Trip 2",
  },
  {
    pickUpStartTime : "trip3PickupStartTime",
    pickUpEndTime : "trip3PickupEndTime",
    dropStartTime : "trip3DropStartTime",
    dropEndTime : "trip3DropEndTime",
    name : "Trip 3",
  }
]

export const convertTimeTrips = (format:any , data :any)=>{

    const convertTime = format === "12Hours" ? convertTo12HourFormat : convertTo24HourFormat;

    return tripDetailsMenu.reduce((acc: any, item: any) => {
      const { pickUpStartTime, pickUpEndTime, dropStartTime, dropEndTime } = item;
  
      acc[pickUpStartTime] = convertTime(data[pickUpStartTime]);
      acc[pickUpEndTime] = convertTime(data[pickUpEndTime]);
      acc[dropStartTime] = convertTime(data[dropStartTime]);
      acc[dropEndTime] = convertTime(data[dropEndTime]);
  
      return { ...acc };
    }, {});
}
