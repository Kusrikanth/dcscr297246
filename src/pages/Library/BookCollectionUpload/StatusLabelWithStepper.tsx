import { useState } from "react";
import BookCountPopover from "./BookCountModal";
import { HugeiconsIcon } from "@hugeicons/react";
import { Book02Icon } from "@hugeicons-pro/core-stroke-standard";

interface IStatusLabel {
  id: string;
  data?: any;
}

export const StatusLabelWithStepper = ({ id, data }: IStatusLabel) => {
  const [popOver, setPopOver] = useState(false);

  const toggle = (event: any) => {
    event.preventDefault();
    if (event.type === "blur") {
      setPopOver(false);
    } else {
      setPopOver((prev) => !prev);
    }
  };

  return (
    <div>
      <button
        id={`testing-${id}`}
        className=""
        onClick={toggle}
        onBlur={toggle}
      >
        <HugeiconsIcon icon={Book02Icon} size={22} />
      </button>
      <BookCountPopover data={data} popOver={popOver} id={id} toggle={toggle} />
    </div>
  );
};
