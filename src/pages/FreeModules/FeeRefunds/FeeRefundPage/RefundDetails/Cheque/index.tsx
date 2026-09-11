import { useFormik } from "formik";
import React, { useState } from "react";
import {
  DateInput,
  SelectInput,
  TextArea,
  TextInput,
} from "../../../../../../Components/Common";

import { CheckDetailsDataTypes } from "../refundDetailsType";

const initialValues: CheckDetailsDataTypes = {
  inTheName: "BALAJEE ARUN EDUCATIONAL SOCIETY",
  bankName: "",
  chequeDate: "",
  chequeNo: "",

  finalRefundAmount: "",
  remarks: "",
};

const Cheque = () => {
  const [checkDetailsDataState, setCheckDetailsDataState] =
    useState<CheckDetailsDataTypes>(initialValues);

  const CheckDetailsForm = useFormik({
    enableReinitialize: true,
    initialValues: checkDetailsDataState,
    onSubmit: (values) => {},
  });

  return (
    <>
      <div className="d-inline-block w-100 mt-5">
        <div className="row">
          <div className="col-12 col-xl-7">
            <div className="row">
              <div className="col-12 col-xl-6">
                <div className="row align-items-center mb-4">
                  <div className="col-5">
                    <h6 className="fs-16">In the Name of</h6>
                  </div>

                  <div className="col-7">
                    <TextInput
                      name="inTheName"
                      value={CheckDetailsForm.values.inTheName}
                      onChange={CheckDetailsForm.handleChange}
                      formgroupClassName="mb-0"
                    />
                  </div>
                </div>
              </div>

              <div className="col-12 col-xl-6">
                <div className="row align-items-center mb-4">
                  <div className="col-5">
                    <h6 className="fs-16">Bank Name</h6>
                  </div>

                  <div className="col-7">
                    <SelectInput
                      name="bankName"
                      value={CheckDetailsForm.values.bankName}
                      onChange={CheckDetailsForm.handleChange}
                      menuItems={[]}
                      valueKey="bankNameType"
                      textKey="bankNameType"
                      formgroupClassName="mb-0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-xl-6">
                <div className="row align-items-center mb-4">
                  <div className="col-5">
                    <h6 className="fs-16">Cheque Date</h6>
                  </div>

                  <div className="col-7">
                    <DateInput
                      name="chequeDate"
                      value={CheckDetailsForm.values.chequeDate}
                      onChange={CheckDetailsForm.handleChange}
                      formgroupClassName="mb-0"
                    />
                  </div>
                </div>
              </div>

              <div className="col-12 col-xl-6">
                <div className="row align-items-center mb-4">
                  <div className="col-5">
                    <h6 className="fs-16">Cheque No</h6>
                  </div>

                  <div className="col-7">
                    <TextInput
                      name="chequeNo"
                      value={CheckDetailsForm.values.chequeNo}
                      onChange={CheckDetailsForm.handleChange}
                      formgroupClassName="mb-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-xl-1">
            <div className="cheque_input_divider" />
          </div>

          <div
            className="col-12 col-xl-4 ps-5"
            style={{ borderLeft: "2px solid rgba(56, 65, 74, 0.10) " }}
          >
            <div className="row align-items-center mb-4">
              <div className="col-5">
                <h6 className="fs-16">Final Refund Amount (₹)</h6>
              </div>

              <div className="col-7">
                <TextInput
                  name="finalRefundAmount"
                  value={CheckDetailsForm.values.finalRefundAmount}
                  onChange={CheckDetailsForm.handleChange}
                  formgroupClassName="mb-0"
                />
              </div>
            </div>

            <div className="row align-items-center mb-4">
              <div className="col-5">
                <h6 className="fs-16">Remarks</h6>
              </div>

              <div className="col-7">
                <TextArea
                  name="remarks"
                  value={CheckDetailsForm.values.remarks}
                  onChange={CheckDetailsForm.handleChange}
                  formgroupClassName="mb-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cheque;
