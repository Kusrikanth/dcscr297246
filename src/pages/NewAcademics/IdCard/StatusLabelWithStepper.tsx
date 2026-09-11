import { useState } from "react";
import { Popover, PopoverBody, PopoverHeader } from "reactstrap";
import { shallowEqual, useDispatch } from "react-redux";
import { getTcReqLogRes } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useAppSelector } from "../../../hooks/storehook";
import PopOver from "./PopOver";
import { getIdCardLogsRes } from "../../../store/academic/notreportingstudents/notreportingstudentsactions";

interface IStatusLabel {
  id:string,
  type: string,
  labelName: string,
  idCardStatus: string,
}

export const StatusLabelWithStepper = ({ id,type, labelName, idCardStatus }: IStatusLabel) => {
  const dispatch=useDispatch();

  const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, getIdCardLogsResp }: any =
    useAppSelector(
      ({ appData, instAcademics, branchAcademics, notReportingStu }) => ({
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,
        getIdCardLogsResp: notReportingStu.getIdCardLogsResp,
      }),
      shallowEqual
    );

  const [popOver, setPopOver] = useState(false);
  if (!type || typeof (type) !== "string") {
    return null;
  }
  const toggle=(event:any)=>{
    event.preventDefault();
    const id=event.currentTarget.getAttribute('data-id');
    if(event.type==="blur"){
      setPopOver(false);
    }
    else{
      dispatch(getIdCardLogsRes(generateActionPayload('get_stu_id_card_log',{idCadrNo:id})))
      setPopOver(prev=>!prev);
    }
  }
  switch (type.toLowerCase()) {
    case "yet_to_prepare":
      return (
        <div>
          <button
            data-id={id}
            id={`testing-${id}`}
            className="badge text-uppercase badge-soft-warning border-0 p-2"
            onClick={toggle}
            onBlur={toggle}
          >
            {labelName}
          </button>
          <PopOver
            data={getIdCardLogsResp && getIdCardLogsResp}
            popOver={popOver}
            id={id}
            idCardStatus={idCardStatus}
          />
        </div>
      );
    
    case "prepared":
      return <div>
      <button data-id={id} id={`testing-${id}`} className="badge text-uppercase badge-soft-success border-0 p-2" onClick={toggle} onBlur={toggle} > {labelName} </button>
      <PopOver data={getIdCardLogsResp&&getIdCardLogsResp} popOver={popOver} id={id} idCardStatus={idCardStatus}/>
    </div>;
    case "issued":
      return <div>
      <button data-id={id} id={`testing-${id}`} className="badge text-uppercase badge-soft-info border-0 p-2" onClick={toggle} onBlur={toggle} > {labelName} </button>
      <PopOver data={getIdCardLogsResp&&getIdCardLogsResp} popOver={popOver} id={id} idCardStatus={idCardStatus}/>
    </div>;
    case "cancelled":
      return <div>
      <button data-id={id} id={`testing-${id}`} className="badge text-uppercase badge-soft-danger border-0 p-2" onClick={toggle} onBlur={toggle} > {labelName} </button>
      <PopOver data={getIdCardLogsResp&&getIdCardLogsResp} popOver={popOver} id={id} idCardStatus={idCardStatus}/>
    </div>;
    default:
      return <span className="badge text-uppercase badge-soft-warning"> {labelName} </span>;
  }
}