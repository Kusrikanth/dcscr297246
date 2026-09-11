import React from "react";
import classNames from "classnames";

interface PassFailToggleProps {
  value: string | null; // "Pass", "Fail", or null
  onChange: (value: string | null) => void;
}

export const PassFailToggle: React.FC<PassFailToggleProps> = ({ value, onChange }) => {
  const handleToggle = () => {
    if (value === null) {
      onChange("Pass");
    } else if (value === "Pass") {
      onChange("Fail");
    } else {
      onChange("Pass");
    }
  };

  const isActive = value === "Pass" || value === "Fail";

  return (
    <div className="d-flex align-items-center" style={{ width: "fit-content" }}>
      <div
        className={classNames(
          "d-flex align-items-center rounded-pill p-1 cursor-pointer position-relative",
          {
            "bg-success": value === "Pass",
            "bg-danger": value === "Fail",
            "bg-light border": !isActive
          }
        )}
        style={{
          width: "35px",
          height: "20px",
          cursor: "pointer",
          transition: "all 0.3s ease"
        }}
        onClick={handleToggle}
      >
        {/* Toggle Circle */}
        <div
          className="rounded-circle bg-white shadow position-absolute"
          style={{
            width: "15px",
            height: "15px",
            left: value === "Pass" ? "16px" : "4px",
            transition: "all 0.3s ease"
          }}
        />
      </div>

      {/* Label - only show when active */}
      {isActive && (
        <span
          className={classNames(
            "ms-2 small fw-medium",
            {
              "text-success": value === "Pass",
              "text-danger": value === "Fail"
            }
          )}
          style={{ fontSize: "12px" }}
        >
          {value}
        </span>
      )}
    </div>
  );
};