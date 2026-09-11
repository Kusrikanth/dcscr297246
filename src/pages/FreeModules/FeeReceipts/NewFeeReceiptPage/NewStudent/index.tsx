import { useFormik } from "formik";
import React, { useMemo, useState } from "react";
import {
  SelectInput,
  TextInput,
  UserDetails,
  TextIconInput,
} from "../../../../../Components/Common";
import {
  generateColumns,
  NewStudentData,
  selectData1,
  selectData2,
  selectData3,
  selectData4,
} from "./helper";
import { NewStudentDataTypes } from "./newStudentTypes";
import avatar1 from "../../../../../assets/images/users/avatar-1.jpg";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { default as RupeeSvg } from "../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";

const initialValues: NewStudentDataTypes = {
  receiptNo: "#VL25000355",
  date: "July,03 2022",
  receiptType: "School",
  academicYear: "2022-23",
  curriculum: "CBSE",
  registrationNo: "RGOO01",
  studentName: "Lingam Prkruth",

  paymentDetails: {
    method: "Payment Method",
    price: "0.0",
  },
  remarks: "",

  totalActualAmount: "0.0",
  totalFine: undefined,
  previousPaidAmount: undefined,
  amountToPay: undefined,
  currentPaidAmount: undefined,
  balanceToPay: undefined,
  cashToReturn: undefined,
  fine: undefined,
  bankCharges: undefined,
  cashAmount: "0.0",
};

export const Data1 = [
  {
    key: "Class",
    value: "VII",
  },
  {
    key: "Section",
    value: "VII A",
  },
];

const NewStudent = () => {
  const [newStudentDataState, setnNewStudentDataState] =
    useState<NewStudentDataTypes>(initialValues);

  const NewStudentForm = useFormik({
    enableReinitialize: true,
    initialValues: newStudentDataState,
    onSubmit: (values) => {},
  });

  const roleColumns = useMemo(() => generateColumns(), []);

  return (
    <>
      <div className="card">
        <form onSubmit={NewStudentForm.handleSubmit}>
          <div className="inline-block w-100 border-bottom">
            <div className="inline-block w-100 p-3">
              <div className="row">
                <div className="col-xs-12 col-md-3">
                  <TextInput
                    name="receiptNo"
                    labelText="Receipt No"
                    value={NewStudentForm.values.receiptNo}
                    onChange={NewStudentForm.handleChange}
                    isReadOnly={true}
                    inputClassName="bg-light"
                  />
                </div>
                <div className="col-xs-12 col-md-3">
                  <TextInput
                    name="date"
                    labelText="Date"
                    value={NewStudentForm.values.date}
                    onChange={NewStudentForm.handleChange}
                    isReadOnly={true}
                    inputClassName="bg-light"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-xs-12 col-md-3">
                  <SelectInput
                    name="receiptType"
                    labelText="Receipt Type"
                    value={NewStudentForm.values.receiptType}
                    onChange={NewStudentForm.handleChange}
                    menuItems={selectData1}
                    valueKey="receiptType"
                    textKey="receiptType"
                  />
                </div>
                <div className="col-xs-12 col-md-3">
                  <SelectInput
                    name="academicYear"
                    labelText="Academic Year"
                    value={NewStudentForm.values.academicYear}
                    onChange={NewStudentForm.handleChange}
                    menuItems={selectData2}
                    valueKey="academicYearType"
                    textKey="academicYearType"
                  />
                </div>
                <div className="col-xs-12 col-md-3">
                  <SelectInput
                    name="curriculum"
                    labelText="Curriculum"
                    value={NewStudentForm.values.curriculum}
                    onChange={NewStudentForm.handleChange}
                    menuItems={selectData3}
                    valueKey="curriculumType"
                    textKey="curriculumType"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-xs-12 col-md-3">
                  <TextInput
                    name="registrationNo"
                    labelText="Registration No."
                    value={NewStudentForm.values.registrationNo}
                    onChange={NewStudentForm.handleChange}
                  />
                </div>
                <div className="col-xs-12 col-md-3">
                  <TextInput
                    name="studentName"
                    labelText="Student Name"
                    value={NewStudentForm.values.studentName}
                    onChange={NewStudentForm.handleChange}
                    isReadOnly={true}
                    inputClassName="bg-light"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="d-inline-block w-100 border-bottom">
            <div className="d-inline-block w-100 p-4">
              <div className="row mb-3">
                <div className="col-xs-12 col-xxl-7">
                  <div className="d-inline-block w-100 border-bottom pb-2">
                    <div className="row mb-2">
                      <div className="col-7">
                        <div
                          className="card rounded-4"
                          style={{ boxShadow: "0px 3px 3px #00000029" }}
                        >
                          <div className="d-flex flex-column p-3">
                            <div className="d-inline-block w-100 mb-3">
                              <UserDetails
                                imageUrl={avatar1}
                                displayName="Lingam Prkruth"
                                displayId="ENNHO01"
                              />
                            </div>

                            {Data1 &&
                              Data1.map((item, index) => (
                                <div className="d-flex" key={index}>
                                  <h6 className="card-title">{`${item?.key}: `}</h6>
                                  <h6 className="card-title text-muted">
                                    {item?.value}
                                  </h6>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                      <div className="col-5" />
                    </div>

                    <TableContainer
                      columns={roleColumns || []}
                      data={NewStudentData}
                      divClass="table-responsive mb-1"
                      theadClass="table-light text-muted align-middle"
                      showCheckbox={true}
                    />
                  </div>

                  <div className="row mt-4">
                    <div className="col-xs-12 col-md-6">
                      <SelectInput
                        name="paymentDetails.method"
                        labelText="Payment Details"
                        value={NewStudentForm.values.paymentDetails.method}
                        onChange={NewStudentForm.handleChange}
                        menuItems={selectData4}
                        valueKey="methodType"
                        textKey="methodType"
                      />

                      <TextIconInput
                        name="paymentDetails.price"
                        value={NewStudentForm.values.paymentDetails.price}
                        onChange={NewStudentForm.handleChange}
                      >
                        <i className="ri-pencil-line text-muted"></i>
                      </TextIconInput>
                    </div>
                  </div>

                  <div className="row mt-2">
                    <div className="col-xs-12 col-md-6">
                      <TextInput
                        name="remarks"
                        labelText="Remarks"
                        value={NewStudentForm.values.remarks}
                        onChange={NewStudentForm.handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-xs-12 col-xxl-5">
                  <div className="row align-items-center">
                    <div className="col-5">
                      <h6>Total Actual Amount</h6>
                    </div>
                    <div className="col-6">
                      <TextIconInput
                        name="totalActualAmount"
                        value={NewStudentForm.values.totalActualAmount}
                        onChange={NewStudentForm.handleChange}
                        inputClassName="bg-light"
                        isReadOnly={true}
                      >
                        <i className="ri-pencil-line text-muted"></i>
                      </TextIconInput>
                    </div>
                  </div>

                  <div className="row align-items-center">
                    <div className="col-5">
                      <h6>Total Fine</h6>
                    </div>
                    <div className="col-6">
                      <TextInput
                        name="totalFine"
                        value={NewStudentForm.values.totalFine}
                        onChange={NewStudentForm.handleChange}
                        isReadOnly={true}
                        inputClassName="bg-light"
                      />
                    </div>
                  </div>

                  <div className="row align-items-center">
                    <div className="col-5">
                      <h6>Previous Paid Amount</h6>
                    </div>
                    <div className="col-6">
                      <TextInput
                        name="previousPaidAmount"
                        value={NewStudentForm.values.previousPaidAmount}
                        onChange={NewStudentForm.handleChange}
                        isReadOnly={true}
                        inputClassName="bg-light"
                      />
                    </div>
                  </div>

                  <div className="row align-items-center">
                    <div className="col-5">
                      <h6>Amount to Pay</h6>
                    </div>
                    <div className="col-6">
                      <TextInput
                        name="amountToPay"
                        value={NewStudentForm.values.amountToPay}
                        onChange={NewStudentForm.handleChange}
                        isReadOnly={true}
                        inputClassName="bg-light"
                      />
                    </div>
                  </div>

                  <div className="row align-items-center">
                    <div className="col-5">
                      <h6>Balance to Pay</h6>
                    </div>
                    <div className="col-6">
                      <TextInput
                        name="balanceToPay"
                        value={NewStudentForm.values.balanceToPay}
                        onChange={NewStudentForm.handleChange}
                        isReadOnly={true}
                        inputClassName="bg-light"
                      />
                    </div>
                  </div>

                  <div className="row align-items-center">
                    <div className="col-5">
                      <h6>Cash to Return</h6>
                    </div>
                    <div className="col-6">
                      <TextInput
                        name="cashToReturn"
                        value={NewStudentForm.values.cashToReturn}
                        onChange={NewStudentForm.handleChange}
                        isReadOnly={true}
                        inputClassName="bg-light"
                      />
                    </div>
                  </div>

                  <div className="row align-items-center">
                    <div className="col-5">
                      <h6>Fine</h6>
                    </div>
                    <div className="col-6">
                      <TextInput
                        name="fine"
                        value={NewStudentForm.values.fine}
                        onChange={NewStudentForm.handleChange}
                        isReadOnly={true}
                        inputClassName="bg-light"
                      />
                    </div>
                  </div>

                  <div className="row align-items-center">
                    <div className="col-5">
                      <h6>Current Paid Amount</h6>
                    </div>
                    <div className="col-6">
                      <TextInput
                        name="currentPaidAmount"
                        value={NewStudentForm.values.currentPaidAmount}
                        onChange={NewStudentForm.handleChange}
                      />
                    </div>
                  </div>

                  <div className="row align-items-center">
                    <div className="col-5">
                      <h6>Bank Charges</h6>
                    </div>
                    <div className="col-6">
                      <TextInput
                        name="bankCharges"
                        value={NewStudentForm.values.bankCharges}
                        onChange={NewStudentForm.handleChange}
                      />
                    </div>
                  </div>

                  <div className="row align-items-center">
                    <div className="col-5">
                      <h6>Cash Amount</h6>
                    </div>
                    <div className="col-6">
                      <TextIconInput
                        name="cashAmount"
                        value={NewStudentForm.values.cashAmount}
                        onChange={NewStudentForm.handleChange}
                      >
                        <i className="ri-pencil-line text-muted"></i>
                      </TextIconInput>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hstack gap-2 justify-content-end">
                <button type="button" className="btn btn-light">
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default NewStudent;
