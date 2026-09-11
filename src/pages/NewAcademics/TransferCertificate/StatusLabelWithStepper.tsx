import { useState } from "react";
import { Popover, PopoverBody, PopoverHeader } from "reactstrap";
import PopOver from "./PopOver";
import { shallowEqual, useDispatch } from "react-redux";
import { getTcReqLogRes } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useAppSelector } from "../../../hooks/storehook";

interface IStatusLabel {
  id: string,
  type: string,
  labelName: string,
}

export const StatusLabelWithStepper = ({ id, type, labelName }: IStatusLabel) => {
  const dispatch = useDispatch();

  const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, tcReqLogRes }: any =
    useAppSelector(
      ({ appData, instAcademics, branchAcademics, classroomManagmentInfo }) => ({
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,
        tcReqLogRes: classroomManagmentInfo.tcReqLogRes,
      }),
      shallowEqual
    );

  const [popOver, setPopOver] = useState(false);
  if (!type || typeof (type) !== "string") {
    return null;
  }
  const toggle = (event: any) => {
    event.preventDefault();
    const id = event.currentTarget.getAttribute('data-id');
    if (event.type === "blur") {
      setPopOver(false);
    }
    else {
      dispatch(getTcReqLogRes(generateActionPayload('get_tc_req_log', { tcRequestId: id })))
      setPopOver(prev => !prev);
    }
  }
  switch (type.toLowerCase()) {
    case "yet to prepare":
      return <div>
        <button data-id={id} id={`testing-${id}`} className="badge tw-text-uppercase badge-soft-warning tw-border-0 tw-p-2" onClick={toggle} onBlur={toggle}> {labelName} </button>
        <PopOver data={tcReqLogRes && tcReqLogRes.data} popOver={popOver} id={id} />
      </div>;
    case "prepared":
      return <div>
        <button data-id={id} id={`testing-${id}`} className="badge tw-text-uppercase badge-soft-success tw-border-0 tw-p-2" onClick={toggle} onBlur={toggle} > {labelName} </button>
        <PopOver data={tcReqLogRes && tcReqLogRes.data} popOver={popOver} id={id} />
      </div>;
    case "issued":
      return <div>
        <button data-id={id} id={`testing-${id}`} className="badge tw-text-uppercase badge-soft-info tw-border-0 tw-p-2" onClick={toggle} onBlur={toggle} > {labelName} </button>
        <PopOver data={tcReqLogRes && tcReqLogRes.data} popOver={popOver} id={id} />
      </div>;
    case "cancelled":
      return <span className="badge tw-text-uppercase badge-soft-danger"> {labelName} </span>;
    default:
      return <span className="badge tw-text-uppercase badge-soft-warning"> {labelName} </span>;
  }
}