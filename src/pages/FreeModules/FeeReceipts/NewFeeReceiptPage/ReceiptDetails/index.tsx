import { useFormik } from "formik";
import React, { useState } from "react";
import {
  DateInput,
  TextArea,
  TextInput,
} from "../../../../../Components/Common";
import NewHorizontalTab from "../../../../../Components/Common/NewHorizontalTab";
import { IMenuOptions, ReceiptDetailsDataTypes } from "../../FeeReceiptsTypes";
import ExistingStudent from "../ExistingStudent";
import Cash from "./Cash";
import Cheque from "./Cheque";

const initialValues: ReceiptDetailsDataTypes = {
  receiptNo: "",
  date: "",

  totalActualAmount: "0.0",
  totalFine: "",
  previousPaidAmount: "",
  amountToPay: "",
  currentPaidAmount: "",
  balanceToPay: "",
  cashToReturn: "",
  fine: "",
  bankCharges: "",
  chequeAmount: "0.00",
  actualPaidAmount: "0.00",
  remarks: "",
};

export const MenuOptions: Array<IMenuOptions> = [
  {
    id: "cash",
    labelName: "Cash",
    className: "col",
  },
  {
    id: "cheque",
    labelName: "Cheque",
    className: "col",
  },
  {
    id: "online",
    labelName: "Online",
    className: "col",
  },
  {
    id: "dd",
    labelName: "DD",
    className: "col",
  },
  {
    id: "cardPayment",
    labelName: "Card Payment",
    className: "col",
  },
];

const ReceiptDetails = () => {
  function getActiveMenuComponent(menuId: string | null) {
    switch (menuId) {
      case "cash":
        return Cash;
      case "cheque":
        return Cheque;
      case "online":
        return Cash;
      case "dd":
        return ExistingStudent;
      case "cardPayment":
        return Cash;
    }
  }

  const [receiptDetailsDataState, setReceiptDetailsDataState] =
    useState<ReceiptDetailsDataTypes>(initialValues);

  const ReceiptDetailsForm = useFormik({
    enableReinitialize: true,
    initialValues: receiptDetailsDataState,
    onSubmit: (values) => {},
  });

  return (
    <>
      <div className="d-inline-block w-100">
        <div className="card p-4">
          <div className="row">
            <div className="col-12 col-lg-12 col-xl-6">
              <div className="row" style={{ marginBottom: "40px" }}>
                <div className="col-12 col-lg-6">
                  <div className="row align-items-center">
                    <div className="col-5">
                      <h6 className="fs-16">Receipt No.</h6>
                    </div>

                    <div className="col-7">
                      <TextInput
                        name="totalFine"
                        value={ReceiptDetailsForm.values.receiptNo}
                        onChange={ReceiptDetailsForm.handleChange}
                        isReadOnly={true}
                        inputClassName="bg-light border-0"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-6">
                  <div className="row align-items-center">
                    <div className="col-5">
                      <h6 className="fs-16">Date</h6>
                    </div>

                    <div className="col-7">
                      <DateInput
                        name="date"
                        value={ReceiptDetailsForm.values.date}
                        onChange={ReceiptDetailsForm.handleChange}
                        isReadOnly={true}
                        inputClassName="bg-light border-0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row payment_mode_row_wrapper">
                <span
                  className="fs-16 col-12 col-lg-3 bold"
                  style={{ float: "left" }}
                >
                  Payment Mode
                </span>

                <NewHorizontalTab
                  MenuOptions={MenuOptions}
                  getActiveMenuComponent={(menuId: any) =>
                    getActiveMenuComponent(menuId)
                  }
                  horizontalClass={"col-12 col-lg-9"}
                  activeTabId="cash"
                />
              </div>

              {/* <div className="row">
                <div className="col-11">
                  <div className="row align-items-center">
                    <div className="col-3">
                      <h6 className="fs-16">Receipt No.</h6>
                    </div>

                    <div className="col-9 ps-0">
                      <NewHorizontalTab
                        MenuOptions={MenuOptions}
                        getActiveMenuComponent={(menuId: any) =>
                          getActiveMenuComponent(menuId)
                        }
                        activeTabId="cash"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-1"></div>
              </div> */}
            </div>

            <div className="col-0 col-xl-1" />

            <div className="col-12 col-lg-12 col-xl-4">
              <div className="row align-items-center mb-3">
                <div className="col-5">
                  <h6 className="fs-16 me-2">Total Actual Amount</h6>
                </div>

                <div className="col-1">
                  <h6 className="d-flex fs-16 fw-bold">(₹)</h6>
                </div>

                <div className="col-1" />

                <div className="col-5">
                  <TextInput
                    name="totalActualAmount"
                    value={ReceiptDetailsForm.values.totalActualAmount}
                    onChange={ReceiptDetailsForm.handleChange}
                    isReadOnly={true}
                    formgroupClassName="mb-0"
                    inputClassName="bg-light border-0"
                  />
                </div>
              </div>

              <div className="row align-items-center mb-3">
                <div className="col-5">
                  <h6 className="fs-16 me-2">Total Fine</h6>
                </div>

                <div className="col-1">
                  <h6 className="d-flex fs-16 fw-bold">(₹)</h6>
                </div>

                <div className="col-1" />

                <div className="col-5">
                  <TextInput
                    name="totalFine"
                    value={ReceiptDetailsForm.values.totalFine}
                    onChange={ReceiptDetailsForm.handleChange}
                    isReadOnly={true}
                    formgroupClassName="mb-0"
                    inputClassName="bg-light border-0"
                  />
                </div>
              </div>

              <div className="row align-items-center mb-3">
                <div className="col-5">
                  <h6 className="fs-16 me-2">Previous Paid Amount</h6>
                </div>

                <div className="col-1">
                  <h6 className="d-flex fs-16 fw-bold">(₹)</h6>
                </div>

                <div className="col-1" />

                <div className="col-5">
                  <TextInput
                    name="previousPaidAmount"
                    value={ReceiptDetailsForm.values.previousPaidAmount}
                    onChange={ReceiptDetailsForm.handleChange}
                    isReadOnly={true}
                    formgroupClassName="mb-0"
                    inputClassName="bg-light border-0"
                  />
                </div>
              </div>

              <div className="row align-items-center mb-3">
                <div className="col-5">
                  <h6 className="fs-16 me-2">Amount to Pay</h6>
                </div>

                <div className="col-1">
                  <h6 className="d-flex fs-16 fw-bold">(₹)</h6>
                </div>

                <div className="col-1" />

                <div className="col-5">
                  <TextInput
                    name="amountToPay"
                    value={ReceiptDetailsForm.values.amountToPay}
                    onChange={ReceiptDetailsForm.handleChange}
                    isReadOnly={true}
                    formgroupClassName="mb-0"
                    inputClassName="bg-light border-0"
                  />
                </div>
              </div>

              <div className="row align-items-center mb-3">
                <div className="col-5">
                  <h6 className="fs-16 me-2">Current Paid Amount</h6>
                </div>

                <div className="col-1">
                  <h6 className="d-flex fs-16 fw-bold">(₹)</h6>
                </div>

                <div className="col-1" />

                <div className="col-5">
                  <TextInput
                    name="currentPaidAmount"
                    value={ReceiptDetailsForm.values.currentPaidAmount}
                    onChange={ReceiptDetailsForm.handleChange}
                    isReadOnly={true}
                    formgroupClassName="mb-0"
                    inputClassName="bg-light border-0"
                  />
                </div>
              </div>

              <div className="row align-items-center mb-3">
                <div className="col-5">
                  <h6 className="fs-16 me-2">Balance to Pay</h6>
                </div>

                <div className="col-1">
                  <h6 className="d-flex fs-16 fw-bold">(₹)</h6>
                </div>

                <div className="col-1" />

                <div className="col-5">
                  <TextInput
                    name="balanceToPay"
                    value={ReceiptDetailsForm.values.balanceToPay}
                    onChange={ReceiptDetailsForm.handleChange}
                    isReadOnly={true}
                    formgroupClassName="mb-0"
                    inputClassName="bg-light border-0"
                  />
                </div>
              </div>

              <div className="row align-items-center mb-3">
                <div className="col-5">
                  <h6 className="fs-16 me-2">Cash to Return</h6>
                </div>

                <div className="col-1">
                  <h6 className="d-flex fs-16 fw-bold">(₹)</h6>
                </div>

                <div className="col-1" />

                <div className="col-5">
                  <TextInput
                    name="cashToReturn"
                    value={ReceiptDetailsForm.values.cashToReturn}
                    onChange={ReceiptDetailsForm.handleChange}
                    isReadOnly={true}
                    formgroupClassName="mb-0"
                    inputClassName="bg-light border-0"
                  />
                </div>
              </div>

              <div className="row align-items-center mb-3">
                <div className="col-5">
                  <h6 className="fs-16 me-2">Fine</h6>
                </div>

                <div className="col-1">
                  <h6 className="d-flex fs-16 fw-bold">(₹)</h6>
                </div>

                <div className="col-1" />

                <div className="col-5">
                  <TextInput
                    name="fine"
                    value={ReceiptDetailsForm.values.fine}
                    onChange={ReceiptDetailsForm.handleChange}
                    formgroupClassName="mb-0"
                  />
                </div>
              </div>

              <div className="row align-items-center mb-3">
                <div className="col-5">
                  <h6 className="fs-16 me-2">Bank Charges</h6>
                </div>

                <div className="col-1">
                  <h6 className="d-flex fs-16 fw-bold">(₹)</h6>
                </div>

                <div className="col-1" />

                <div className="col-5">
                  <TextInput
                    name="bankCharges"
                    value={ReceiptDetailsForm.values.bankCharges}
                    onChange={ReceiptDetailsForm.handleChange}
                    formgroupClassName="mb-0"
                  />
                </div>
              </div>

              <div className="row align-items-center mb-5">
                <div className="col-5">
                  <h6 className="fs-16 me-2">Cheque Amount</h6>
                </div>

                <div className="col-1">
                  <h6 className="d-flex fs-16 fw-bold">(₹)</h6>
                </div>

                <div className="col-1" />

                <div className="col-5">
                  <TextInput
                    name="chequeAmount"
                    value={ReceiptDetailsForm.values.chequeAmount}
                    onChange={ReceiptDetailsForm.handleChange}
                    formgroupClassName="mb-0"
                  />
                </div>
              </div>

              <div
                className="row align-items-center mb-4"
                style={{ marginTop: "90px" }}
              >
                <div className="col-5">
                  <h6 className="fs-16 me-2">Actual Paid Amount</h6>
                </div>

                <div className="col-1">
                  <h6 className="d-flex fs-16 fw-bold">(₹)</h6>
                </div>

                <div className="col-1" />

                <div className="col-5">
                  <TextInput
                    name="actualPaidAmount"
                    value={ReceiptDetailsForm.values.actualPaidAmount}
                    onChange={ReceiptDetailsForm.handleChange}
                    isReadOnly={true}
                    formgroupClassName="mb-0"
                    inputClassName="bg-light border-0"
                  />
                </div>
              </div>

              <div className="row align-items-center mb-3">
                <div className="col-5">
                  <h6 className="fs-16 me-2">Remarks</h6>
                </div>

                <div className="col-1" />

                <div className="col-1" />

                <div className="col-5">
                  <TextArea
                    name="remarks"
                    value={ReceiptDetailsForm.values.remarks}
                    onChange={ReceiptDetailsForm.handleChange}
                    formgroupClassName="mb-0"
                  />
                </div>
              </div>
            </div>

            <div className="col-0 col-xl-1" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ReceiptDetails;
