import { useState } from "react";
import PopOver from "./PopOver";
import { shallowEqual, useDispatch } from "react-redux";

import { useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getPreliminaryScrutinyById } from "../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { default as IButton } from "../../../../assets/imagesdps/I_Button_svg.svg?react";


interface IStatusLabel {
  id: string,
  index:number,
  type: string,
  labelName: string,
  studentRegistrationId?: any,
}

export const StatusLabelWithStepper = ({ id,index, type, labelName, studentRegistrationId }: IStatusLabel) => {
  const dispatch = useDispatch();

  const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, tcReqLogRes }: any =
    useAppSelector(
      ({ appData, instAcademics, branchAcademics, classroomManagmentInfo, applicationSale }) => ({
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,
        tcReqLogRes: classroomManagmentInfo.tcReqLogRes,
        preliminaryScrutinyById: applicationSale.preliminaryScrutinyById,
      }),
      shallowEqual
    );

  const [popOver, setPopOver] = useState(false);
  // const [openPopOver, setOpenPopOver] = useState<>([]);
  const [logDetails, setLogDetails] = useState({})
  if (!type || typeof (type) !== "string") {
    return null;
  }
  const toggle = (event: any) => {
    event.preventDefault();
    // const id=event.currentTarget.getAttribute('data-id');
    if (popOver === false) {
      let payload={}
      if(id!=="null"){
        payload={ scrutinyId: id, studentRegId: studentRegistrationId }
      }
      else{
        payload={studentRegId: studentRegistrationId}
      }
      dispatch(getPreliminaryScrutinyById(generateActionPayload("priliminary_scrutiny_by_id", undefined, payload)));

    }

    if (event.type === "blur") {
      setPopOver(false);
    }
    else {
      //   dispatch(getTcReqLogRes(generateActionPayload('get_tc_req_log',{tcRequestId:id})))
      setPopOver(prev => !prev);
    }
  }
  switch (type.toLowerCase()) {
    case "on_hold":
      return <div style={{minWidth : "7rem"}}>
        <button data-id={index} className="badge text-uppercase badge-soft-warning border-0 p-2 me-2"> {labelName} </button>
        
        <button style={{border:"none",background:"white"}} onClick={toggle} onBlur={toggle}><IButton className="cursor-pointer" id={`testing-${index}`} /></button>
        <PopOver data={tcReqLogRes && tcReqLogRes.data} popOver={popOver} index={index} />
      </div>;
    case "accepted":
      return <div style={{minWidth : "7rem"}}>
          <button data-id={index} className="badge text-uppercase badge-soft-success border-0 p-2 me-2"> {labelName} </button>
          <button style={{border:"none",background:"white"}} onClick={toggle} onBlur={toggle}><IButton className="cursor-pointer" id={`testing-${index}`} /></button>
          <PopOver data={tcReqLogRes && tcReqLogRes.data} popOver={popOver} index={index} />
      </div>;
    case "rejected":
      return <div style={{minWidth : "7rem"}}>
        <button data-id={index} className="badge text-uppercase badge-soft-danger border-0 p-2 me-2"> {labelName} </button>
        <button style={{border:"none",background:"white"}} onClick={toggle} onBlur={toggle}><IButton className="cursor-pointer" id={`testing-${index}`} /></button>
        <PopOver data={tcReqLogRes && tcReqLogRes.data} popOver={popOver} index={index} />
      </div>;
    case "document_resubmission_pending":
      return <div style={{minWidth : "7rem"}}>
        <button data-id={index} className="badge text-uppercase badge-soft-info border-0 p-2 me-2"> {labelName} </button>
        <button style={{border:"none",background:"white"}} onClick={toggle} onBlur={toggle}><IButton className="cursor-pointer" id={`testing-${index}`} /></button>
        <PopOver data={tcReqLogRes && tcReqLogRes.data} popOver={popOver} index={index} />
      </div>;
    case "document_approval_pending":
      return <div style={{minWidth : "7rem"}}>
        <button data-id={index} style={{ color: "#F7904B", backgroundColor: "#F6E6DB" }} className="badge text-uppercase border-0 p-2 me-2"> {labelName} </button>
        <button style={{border:"none",background:"white"}} onClick={toggle} onBlur={toggle}><IButton className="cursor-pointer" id={`testing-${index}`} /></button>
        <PopOver data={tcReqLogRes && tcReqLogRes.data} popOver={popOver} index={index} />
      </div>;
    case "document_approved":
      return <div style={{minWidth : "7rem"}}>
        <button data-id={index} style={{ color: "#299CDB", backgroundColor: "#D2DDE4" }} className="badge text-uppercase border-0 p-2 me-2"> {labelName} </button>
        <button style={{border:"none",background:"white"}} onClick={toggle} onBlur={toggle}><IButton className="cursor-pointer" id={`testing-${index}`} /></button>
        <PopOver data={tcReqLogRes && tcReqLogRes.data} popOver={popOver} index={index} />
      </div>;
    case "document_resubmitted":
      return <div style={{minWidth : "7rem"}}>
        <button data-id={index} style={{ color: "#405189", backgroundColor: "#D4D6DB" }} className="badge text-uppercase border-0 p-2 me-2"> {labelName} </button>
        <button style={{border:"none",background:"white"}} onClick={toggle} onBlur={toggle}><IButton className="cursor-pointer" id={`testing-${index}`} /></button>
        <PopOver data={tcReqLogRes && tcReqLogRes.data} popOver={popOver} index={index} />
      </div>;
    case "profile_approval_pending":
      return <div style={{minWidth : "7rem"}}>
        <button data-id={index} style={{ color: "#299CDB", backgroundColor: "#CDE9F8" }} className="badge text-uppercase border-0 p-2 me-2"> {labelName} </button>
        <button style={{border:"none",background:"white"}} onClick={toggle} onBlur={toggle}><IButton className="cursor-pointer" id={`testing-${index}`} /></button>
        <PopOver data={tcReqLogRes && tcReqLogRes.data} popOver={popOver} index={index} />
      </div>;
      case "profile_approval_rejected":
        return <div style={{minWidth : "7rem"}}>
          <button data-id={index} className="badge text-uppercase badge-soft-danger border-0 p-2 me-2"> {labelName} </button>
          <button style={{border:"none",background:"white"}} onClick={toggle} onBlur={toggle}><IButton className="cursor-pointer" id={`testing-${index}`} /></button>
          <PopOver data={tcReqLogRes && tcReqLogRes.data} popOver={popOver} index={index} />
        </div>;
    case "profile_approved":
      return <div style={{minWidth : "7rem"}}>
        <button data-id={index} style={{ color: "#0F7B9B", backgroundColor: "#C8E0E8" }} className="badge text-uppercase border-0 p-2 me-2"> {labelName} </button>
        <button style={{border:"none",background:"white"}} onClick={toggle} onBlur={toggle}><IButton className="cursor-pointer" id={`testing-${index}`} /></button>
        <PopOver data={tcReqLogRes && tcReqLogRes.data} popOver={popOver} index={index} />
      </div>;
    case "head_department_approval_pending":
      return <div style={{minWidth : "7rem"}}>
        <button data-id={index} style={{ color: "#DD9E0A", backgroundColor: "#E4DFD2" }} className="badge text-uppercase border-0 p-2 me-2"> {labelName} </button>
        <button style={{border:"none",background:"white"}} onClick={toggle} onBlur={toggle}><IButton className="cursor-pointer" id={`testing-${index}`} /></button>
        <PopOver data={tcReqLogRes && tcReqLogRes.data} popOver={popOver} index={index} />
      </div>;
      case "head_dept_approval_rejected":
        return <div style={{minWidth : "7rem"}}>
          <button data-id={index} className="badge text-uppercase badge-soft-danger border-0 p-2 me-2"> {labelName} </button>
          <button style={{border:"none",background:"white"}} onClick={toggle} onBlur={toggle}><IButton className="cursor-pointer" id={`testing-${index}`} /></button>
          <PopOver data={tcReqLogRes && tcReqLogRes.data} popOver={popOver} index={index} />
        </div>;
    default:
      return <div style={{minWidth : "7rem"}}>
        <button data-id={index} className="badge text-uppercase badge-soft-warning border-0 p-2 me-2"> {labelName} </button>
        <button style={{border:"none",background:"white"}} onClick={toggle} onBlur={toggle}><IButton className="cursor-pointer" id={`testing-${index}`} /></button>
        <PopOver data={tcReqLogRes && tcReqLogRes.data} popOver={popOver} index={index} />
      </div>;
  }
}