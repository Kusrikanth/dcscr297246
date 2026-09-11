import React, { useCallback, useEffect, useMemo, useRef } from "react";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import AoSelection from "../../EarlyYears/Management/AoSelection";


const IGSEAoSelection = () => {

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Examination" pageTitle="Examination" />

          <div>
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">Ao Selection</h4>
                </div>
              </div>
            </div>
            <div>
              <AoSelection />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IGSEAoSelection;
