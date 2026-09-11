import { useEffect, useMemo, useRef, useState } from "react";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import StudentPerformanceTable from "./StudentPerformanceTable";

const StudentReportGradeBook = () => {

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Examination" pageTitle="Examination" />
          <div
            className="card overflow-hidden"
            style={{ borderTopRightRadius: "0px", borderTopLeftRadius: "0px" }}
          >
            <StudentPerformanceTable />
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentReportGradeBook;
