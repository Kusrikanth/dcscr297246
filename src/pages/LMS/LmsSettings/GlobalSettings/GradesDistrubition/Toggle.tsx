import classNames from "classnames";

interface PassFailToggleProps {
  value: string | null; // "Pass", "Fail", or null
  onChange: (value: string | null) => void;
}

export const PassFailToggle: React.FC<PassFailToggleProps> = ({ value, onChange }) => {
  const handleClick = (newValue: "Pass" | "Fail") => {
    // Toggle off if clicked again
    if (value === newValue) {
      onChange(null);
    } else {
      onChange(newValue);
    }
  };

  return (
    <div className="d-flex rounded bg-light px-3 py-2" style={{ width: "fit-content" }}>
      <button
        type="button"
        className={classNames(
          "btn btn-sm rounded me-1",
          value === "Pass" ? "btn-white fw-bold Shadow-lg" : "btn-light text-muted"
        )}
        onClick={() => handleClick("Pass")}
      >
        Pass
      </button>
      <button
        type="button"
        className={classNames(
          "btn btn-sm rounded",
          value === "Fail" ? "btn-white fw-bold Shadow-lg" : "btn-light text-muted"
        )}
        onClick={() => handleClick("Fail")}
      >
        Fail
      </button>
    </div>
  );
};
