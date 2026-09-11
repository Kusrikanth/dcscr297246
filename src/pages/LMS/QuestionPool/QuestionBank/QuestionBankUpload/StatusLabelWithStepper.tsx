import { useState } from "react";
import PopOver from "./PopOver";
import { default as IButton } from "../../../../../assets/imagesdps/I_Button_svg.svg?react";

interface IStatusLabelWithStepperProps {
  index: number;
  labelName: string;
  badgeClass: string;
  version: string;
  createdDate: string;
  createdBy: string;
  modifiedDate: string;
  modifiedBy: string;
}

export const StatusLabelWithStepper = ({
  index,
  labelName,
  badgeClass,
  version,
  createdDate,
  createdBy,
  modifiedDate,
  modifiedBy,
}: IStatusLabelWithStepperProps) => {
  const [popOver, setPopOver] = useState(false);
  const toggle = () => setPopOver((prev) => !prev);

  return (
    <div style={{ minWidth: "7rem" }}>
      <button
        className={`badge text-uppercase ${badgeClass} border-0 p-2 me-2`}
      >
        {labelName}
      </button>
      <button
        style={{ border: "none", background: "white" }}
        onClick={toggle}
      >
        <IButton className="cursor-pointer" id={`testing-${index}`} />
      </button>
      <PopOver
        index={index}
        popOver={popOver}
        toggle={toggle}
        version={version}
        createdDate={createdDate}
        createdBy={createdBy}
        modifiedDate={modifiedDate}
        modifiedBy={modifiedBy}
      />
    </div>
  );
};
