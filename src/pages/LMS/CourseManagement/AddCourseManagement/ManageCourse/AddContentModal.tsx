import {
  File01Icon,
  File01StrokeStandard,
  Grid02Icon,
  TextAlignCenterIcon,
  UserQuestion01Icon,
  Video01Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import React, { useState } from "react";

type ContentType = "Video" | "Blocks" | "Text" | "Assignment" | "Quiz" | "Document";

interface Props {
  onSelect: (type: ContentType) => void;
  onClose: () => void;
}

const contentOptions: {
  label: ContentType;
  bgColor: string;
  icon: typeof Video01Icon;
}[] = [
  { label: "Video", bgColor: "#fde2e4", icon: Video01Icon },
  { label: "Blocks", bgColor: "#d0f4de", icon: Grid02Icon },
  { label: "Text", bgColor: "#fef9c3", icon: TextAlignCenterIcon },
  { label: "Assignment", bgColor: "#e0e7ff", icon: File01Icon },
  { label: "Quiz", bgColor: "#e0f2fe", icon: UserQuestion01Icon },
  { label: "Document", bgColor: "#ede9fe", icon: File01StrokeStandard },
];

const AddContentModal = () => {
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);

  return (
    <div className="p-4" style={{ zIndex: "1000000" }}>
      <div className="container">
        <div className="row">
          {contentOptions.map((option) => (
            <div key={option.label}   onClick={() => setSelectedOption(option.label)} className="col-4 mb-3 d-flex justify-content-center">
              <div
                className="d-flex flex-column justify-content-center align-items-center"
                style={{
                  backgroundColor: option.bgColor,
                  borderRadius: "10px",
                  height: "90px",
                  width: "100%",
                  maxWidth: "150px",
                }}
              >
                <div
                  className="d-flex justify-content-center align-items-center mb-2"
                  style={{
                    backgroundColor: "white",
                    width: "32px",
                    height: "32px",
                    borderRadius: "25px",
                  }}
                >
                  <HugeiconsIcon
                    icon={option.icon}
                    size={16}
                    style={{ cursor: "pointer", marginBottom: "0.25rem" }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-800 text-center w-100">
                  {option.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddContentModal;
