import Email from "../../assets/imagesdps/authiconV1/login-2.png";
import DPSLogo from "../../assets/imagesdps/dps-logo.png";
import PallaviLogo from "../../assets/imagesdps/pallavi-logo.png";
import {WHATSAPP_LINK} from "../../Components/constants/common"

const FacingLoginIssue = () => {
  return (
    <div className="contact-container mt-5 d-flex flex-column align-items-center justify-content-center">
      <p className="text-dark fs-7 mb-2">
        <span className="me-2" style={{ lineHeight: "0px" }}>
          <img
            className="img-fluid"
            style={{ height: "1.8rem", width: "1.8rem" }}
            src={Email}
          />
        </span>
        <span style={{ display: "inline-block" }}>
          Facing login issues? Click here
        </span>
      </p>
      <div className="branch-whatsapp-container d-flex align-items-center justify-content-center w-100">
        <div className="card px-2 py-1 border me-3 mb-0 branch-card">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-decoration-none"
          >
            <div className="d-flex flex-row align-items-center">
              <div className="branch-logo me-2">
                <img src={DPSLogo} alt="dps-logo" className="img-fluid"></img>
              </div>
              <p className="mb-0 me-2 text-dark">DPS</p>
              <i
                className="ri-whatsapp-line fs-18"
                style={{ color: "green" }}
              ></i>
            </div>
          </a>
        </div>
        <div className="card px-2 py-1 border mb-0 branch-card">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-decoration-none"
          >
            <div className="d-flex flex-row align-items-center">
              <div className="branch-logo me-2">
                <img
                  src={PallaviLogo}
                  alt="pallavi-logo"
                  className="img-fluid branch-logo"
                ></img>
              </div>
              <p className="mb-0 me-2 text-dark">PALLAVI</p>
              <i
                className="ri-whatsapp-line fs-18"
                style={{ color: "green" }}
              ></i>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FacingLoginIssue;
