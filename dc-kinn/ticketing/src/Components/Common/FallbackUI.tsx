import React from "react";
import { Spinner } from "reactstrap";

const Fallback = () => {
    return (
        <div className="vh-100 tw-flex tw-flex-col tw-items-center tw-justify-center" style={{ width: "calc(100vw-220px)", background: "#f1f1f1" }}>
            <Spinner color="success"> Loading... </Spinner>
        </div>
    );
};

export default Fallback;
