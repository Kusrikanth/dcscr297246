import { useFormik } from "formik";
import React, { useState } from "react";
import { TextArea, TextInput } from "../../../../../Components/Common";
import NewHorizontalTab from "../../../../../Components/Common/NewHorizontalTab";
import { IMenuOptions, RefundDetailsDataTypes } from "../feeRefundPageTypes";
import Adjustment from "./Adjustment";
import Cash from "./Cash";
import Cheque from "./Cheque";

const initialValues: RefundDetailsDataTypes = {
  refundableAmount: "2000.00",
};

export const MenuOptions: Array<IMenuOptions> = [
  {
    id: "cash",
    labelName: "Cash",
  },
  {
    id: "cheque",
    labelName: "Cheque",
  },
  {
    id: "adjustment",
    labelName: "Adjustment",
  },
  {
    id: "online",
    labelName: "Online",
  },
];

const RefundDetails = () => {
  function getActiveMenuComponent(menuId: string | null) {
    switch (menuId) {
      case "cash":
        return Cash;
      case "cheque":
        return Cheque;
      case "adjustment":
        return Adjustment;
      case "online":
        return Cash;
    }
  }

  const [refundDetailsDataState, setRefundDetailsDataState] =
    useState<RefundDetailsDataTypes>(initialValues);

  const RefundDetailsForm = useFormik({
    enableReinitialize: true,
    initialValues: refundDetailsDataState,
    onSubmit: (values) => {},
  });

  return (
    <>
      <div className="d-inline-block w-100">
        <div className="card p-4">
          <div className="row">
            <div className="col-12 col-lg-12 col-xl-7">
              <div className="row" style={{ marginBottom: "40px" }}>
                <div className="col-12 col-lg-6">
                  <div className="row align-items-center">
                    <div className="col-5">
                      <h6 className="fs-16">Refundable Amount</h6>
                    </div>

                    <div className="col-7">
                      <TextInput
                        name="refundableAmount"
                        value={RefundDetailsForm.values.refundableAmount}
                        onChange={RefundDetailsForm.handleChange}
                        isReadOnly={true}
                        inputClassName="bg-light border-0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-12 col-xl-5" />
          </div>

          <div className="d-inline-block w-100">
            <span className="fs-16 fw-bold" style={{ float: "left" }}>
              Payment Mode
            </span>

            <div>
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
      </div>
    </>
  );
};

export default RefundDetails;
