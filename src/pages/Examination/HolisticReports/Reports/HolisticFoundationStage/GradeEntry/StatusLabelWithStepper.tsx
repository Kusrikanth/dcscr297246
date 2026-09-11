import { useState } from "react";
import { useDispatch } from "react-redux";
import PopOver from "./PopOver";
import { generateActionPayload } from "../../../../../../utility/reduxutility";
import { getLogActivityStatusAct, setLogActivityStatusAct } from "../../../../../../store/examination/examinationmanagement/examinationmanagementactions";

interface IStatusLabel {
  id: string;
  type: string;
  labelName: string;
  steps: any;
  entryId: any;
}

export const StatusLabelWithStepper = ({
  id,
  type,
  labelName,
  steps,
  entryId,
}: IStatusLabel) => {
  const dispatch = useDispatch();  

  const [popOver, setPopOver] = useState(false);
  if (!type || typeof type !== "string") {
    return null;
  }
  const toggle = (event: any) => {
    event.preventDefault();
    
    if (popOver === false) {
      dispatch(setLogActivityStatusAct(undefined))

      if (entryId && (type.toLowerCase() === "completed" || type.toLowerCase() === "inprogress")) {
        dispatch(getLogActivityStatusAct(generateActionPayload('get_log_activity_status', { id: entryId }, undefined)));
      }
    }
    
    if (event.type === "blur") {
      setPopOver(false);
    } else {
      setPopOver(prev => !prev);
    }
  };

  const renderStatusButton = (className: string) => (
    <div>
      <button
        data-id={id}
        id={`testing-${id}`}
        className={`badge text-uppercase ${className} border-0 p-2`}
        onClick={toggle}
        onBlur={toggle}
      >
        {" "}
        {labelName}
      </button>
      <PopOver
        data={steps}
        popOver={popOver}
        id={id}
        entryId={entryId}
        onClose={() => setPopOver(false)}
      />
    </div>
  );

  switch (type.toLowerCase()) {
    case "pending":
      return renderStatusButton("badge-soft-warning");
    case "completed":
      return renderStatusButton("badge-soft-success");
    case "inprogress":
      return renderStatusButton("badge-soft-primary");
    default:
      return null;
  }
};