import { useState } from "react";
import { Input } from "reactstrap";

const NumberInput = ({ countDown, countUP, numberInputClass, value }: any) => {
  const [defaultCounter, setDefaultCounter] = useState(value);
  return (
    <div
      className={`input-step step-secondary number-input-wapper !tw-justify-center ${numberInputClass}`}
    >
      <button
        type="button"
        className="button"
        onClick={() => {
          countDown(setDefaultCounter, defaultCounter);
        }}
      >
        –
      </button>
      <Input
        type="number"
        className="product-quantity"
        value={defaultCounter}
        min="0"
        max="100"
        readOnly
        style={{ width: "calc(100% - 56px)", minWidth: "45px" }}
      />
      <button
        type="button"
        className="button"
        onClick={() => {
          countUP(setDefaultCounter, defaultCounter);
        }}
      >
        +
      </button>
    </div>
  );
};
export default NumberInput;
