import { useState } from "react";
import PopOver from "./PopOver";

interface IStatusLabel {
  id: string | number;
  type: string;
  labelName: string;
  overViewStats?: {
    Total?: number;
    Success?: number;
    Failed?: number;
  };
  waOrderRef?: string;
  recipientType?: string;
}

export const StatusLabelWithStepper = ({
  id,
  type,
  labelName,
  overViewStats,
  waOrderRef,
  recipientType,
}: IStatusLabel) => {
  const [popOver, setPopOver] = useState(false);

  const toggle = (event: any) => {
    event.preventDefault();

    if (event.type === "blur") {
      setPopOver(false);
    } else {
      setPopOver((prev) => !prev);
    }
  };

  if (!type) return null;

  return (
    <div>
      <button
        data-id={id}
        id={`testing-${id}`}
        className="badge text-uppercase badge-soft-success border-0 p-2"
        onClick={toggle}
      onBlur={toggle}
      >
        {labelName}
      </button>

      <PopOver
        data={overViewStats}
        popOver={popOver}
        id={id}
        waOrderRef={waOrderRef}
        recipientType={recipientType}
        toggle={() => setPopOver(false)}
      />
    </div>
  );
};