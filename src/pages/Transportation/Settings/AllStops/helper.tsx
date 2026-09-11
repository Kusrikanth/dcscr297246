
import {
  MenuOptionHrtl,
} from "../../../../Components/Common/MenuOptions";
import { default as LocationSvg } from "../../../../assets/imagesdps/transportation/GreenLocationSvg.svg?react";
import { PopoverBody, PopoverHeader, UncontrolledPopover } from "reactstrap";

const PopOverComponent = ({
  row: { index, original },
  onChangeInputHndlr,
  rowDataInfo,
}: any) => {
  return  (  <>

    <div className="tw-text-blue-500 text-decoration-underline cursor-pointer" id="PopoverLegacy" style={{width:"1.5rem"}} >
    <span onClick={()=>onChangeInputHndlr(original?.routeId)}>
       {original.noOfStops}
      </span>
    </div>
      <UncontrolledPopover
        placement="right"
        target="PopoverLegacy"
        trigger="legacy"
        
      >
        <PopoverHeader>
          Stops
        </PopoverHeader>
        <PopoverBody style={{maxHeight:"15rem",overflowY:"scroll"}}>
          {rowDataInfo?.map((item:any)=>(
            <div key={item?.stopId} className="tw-mt-2 tw-flex">
             <span className="tw-me-3"> <LocationSvg /></span>
            <span>{item?.stopName} <br/> </span>
            </div>
          ))}

        </PopoverBody>
      </UncontrolledPopover> 
  </>)
}



export function GenerateColumns({
  actionList,
  popoverOpen,
  setPopoverOpen,
  selectedStop,
  setSelectedStop,
}: any) {
  const togglePopover = (stop: any) => {
    setSelectedStop(stop);
    setPopoverOpen(!popoverOpen);
  };

  return [
    {
      Header: "S.No",
      disableSortBy: true,
      Cell: ({ row: { index } }: any) => {
        return (
          <span className="tw-text-nowrap">{(index + 1)}</span>
        )
      }
    },
    {
      Header: "Route Name",
      disableSortBy: true,
      accessor: "routeName",
    },
    {
      Header: "No. of Stops",
      disableSortBy: true,
      accessor: "noOfStops",
      Cell:PopOverComponent
    },
    {
      Header: "Action",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionList} rowId={original.routeId} />
        );
      },
    },
  ];
}

