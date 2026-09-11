import { useFormik } from "formik";
import React, { useState } from "react";
import {
  DateInput,
  SelectInput,
  TextInput,
} from "../../../../../../Components/Common";
import { selectData1 } from "../helper";
import { CheckDetailsDataTypes } from "../ReceiptDetailsTypes";

const initialValues: CheckDetailsDataTypes = {
  inTheName: "BALAJEE ARUN EDUCATIONAL SOCIETY",
  bankName: "",
  chequeDate: "",
  chequeNo: "",
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
    <div className="d-inline-block w-100 mt-5 mb-5">
      <div className="row mb-3">
        <div className="col-12 col-lg-6">
          <div className="row align-items-center">
            <div className="col-5">
              <h6 className="fs-16">In the Name of</h6>
            </div>

            <div className="col-7">
              <TextInput
                name="inTheName"
                value={CheckDetailsForm.values.inTheName}
                onChange={CheckDetailsForm.handleChange}
              />
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="row align-items-center">
            <div className="col-5">
              <h6 className="fs-16">Bank Name</h6>
            </div>

            <div className="col-7">
              <SelectInput
                name="bankName"
                value={CheckDetailsForm.values.bankName}
                onChange={CheckDetailsForm.handleChange}
                menuItems={selectData1}
                valueKey="bankNameType"
                textKey="bankNameType"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-lg-6">
          <div className="row align-items-center">
            <div className="col-5">
              <h6 className="fs-16">Cheque Date</h6>
            </div>

            <div className="col-7">
              <DateInput
                name="chequeDate"
                value={CheckDetailsForm.values.chequeDate}
                onChange={CheckDetailsForm.handleChange}
              />
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="row align-items-center">
            <div className="col-5">
              <h6 className="fs-16">Cheque No</h6>
            </div>

            <div className="col-7">
              <TextInput
                name="chequeNo"
                value={CheckDetailsForm.values.chequeNo}
                onChange={CheckDetailsForm.handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cheque;
