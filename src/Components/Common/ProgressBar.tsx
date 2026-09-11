import { Progress } from "reactstrap";
import { default as RupeeSvg } from "../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";

const ProgressBar = () => {
  return (
    <>
      <Progress multi className="progress_bar_wrap">
        <Progress bar color="success" value="60">
          <div className="progress_bar_candel">
            <div className="progress_bar_candel_content">
              <span className="me-2 progress_name">FEE COLLECTED:</span>
              <RupeeSvg width="12px" height="12px" fill="#0ab39c" />
              <span className="progress_amount_collected">222.89k</span>
            </div>
          </div>
        </Progress>

        <Progress bar color="danger" value="40">
          <div className="progress_bar_candel">
            <div className="progress_bar_candel_content">
              <span className="me-2 progress_name">FEE DUE:</span>
              <RupeeSvg width="12px" height="12px" fill="#f06548" />
              <span className="progress_amount_due">12.07</span>
            </div>
          </div>
        </Progress>
      </Progress>
    </>
  );
};

export default ProgressBar;
