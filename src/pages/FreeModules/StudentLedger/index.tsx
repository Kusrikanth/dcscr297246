import { useFormik } from "formik";
import React, { useState } from "react";
import {
  SelectInput,
  TextInput,
} from "../../../Components/Common";

import BreadCrumb from "../../../Components/Common/BreadCrumb";

import FeePaymentsRecords from "./FeePaymentsRecords";
import {
  selectData1,
} from "../FeePaymentsRecords/PaymentReceived/helper";
import { StudentLedgerTypes } from "./StudentLedgerTypes";
import StudentDetails from "../../../Components/Common/StudentDetails";

const initialValues: StudentLedgerTypes = {
  year: "",
  studentID: "",
  studentName: "",
};
const StudentData = {
  class: "VII",
  parentName: "L.Krishna",
  phoneNo: "+91 9851236545",
  section: "VII A",
  email: "Superadmin@gmail.com",
  admissionDate: "02 April,2021",
  totalFeeYear: "2,11,040.00",
  totalConcession: "1,20,080.00",
  totalFeePaid: "00.00",
  totalAmountDue: "11600.00",
};
const StudentLedger = () => {
  const [studentLedgerState, setStudentLedgerState] =
    useState<StudentLedgerTypes>(initialValues);

  const StudentLedgerForm = useFormik({
    enableReinitialize: true,
    initialValues: studentLedgerState,
    onSubmit: (values) => {},
  });

  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb title="Student Ledger" pageTitle="Fee" />
        <div className="card">
          <div className="card-header">
            <div className="row align-items-center">
              <div className="col">
                <h4 className="card-title mb-0 flex-grow-1">Student Ledger</h4>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="d-inline-block w-100 mt-2">
              <form onSubmit={StudentLedgerForm.handleSubmit}>
                <div className="row g-3">
                  <div className="col-12 col-lg-3 col-xl-2">
                    <SelectInput
                      name="year"
                      value={StudentLedgerForm.values.year}
                      onChange={StudentLedgerForm.handleChange}
                      menuItems={selectData1}
                      valueKey="yearType"
                      textKey="yearType"
                      inputClassName="bg-soft-light"
                      formgroupClassName="mb-0"
                      labelText="Academic Year"
                    />
                  </div>

                  <div className="col-12 col-lg-3 col-xl-2">
                    <div className="d-flex flex-column">
                      <label>Student ID</label>
                      <div className="search-box">
                        <TextInput
                          name="search"
                          value={StudentLedgerForm.values.studentID}
                          onChange={StudentLedgerForm.handleChange}
                          formgroupClassName="mb-0"
                        />

                        <i className="ri-search-line search-icon"></i>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-lg-3 col-xl-2">
                    <TextInput
                      name="feeName"
                      value={StudentLedgerForm.values.studentName}
                      onChange={StudentLedgerForm.handleChange}
                      inputClassName="bg-light"
                      formgroupClassName="mb-0"
                      labelText="Student Name"
                      isReadOnly={true}
                    />
                  </div>

                  <div className="col-auto ms-auto align-self-end">
                    <button className="btn button-info text-white float-end d-flex align-items-center">
                      Get Ledger Details
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <StudentDetails StudentData={StudentData} />

        <div className="row">
          <div className="col">
            <FeePaymentsRecords />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLedger;
