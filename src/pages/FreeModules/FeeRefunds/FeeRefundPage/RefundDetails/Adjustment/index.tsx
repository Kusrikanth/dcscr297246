import { useFormik } from "formik";
import React, { useMemo, useState } from "react";
import { TextArea, TextInput } from "../../../../../../Components/Common";
import TableContainer from "../../../../../../Components/Common/TableContainer";
import { AdjustmentTableData, generateColumns } from "../helper";
import { AdjustmentDataTypes } from "../refundDetailsType";

const initialValues: AdjustmentDataTypes = {
  adjustAmount: "",

  studentIdAdjusted: "",
  studentNameAdjusted: "",

  finalRefundAmount: "",
  remarks: "",
};

const Adjustment = () => {
  const [adjustmentDataState, setAdjustmentDataState] =
    useState<AdjustmentDataTypes>(initialValues);

  const AdjustmentForm = useFormik({
    enableReinitialize: true,
    initialValues: adjustmentDataState,
    onSubmit: (values) => {},
  });

  const roleColumns = useMemo(() => generateColumns(), []);

  return (
    <>
      <div className="d-inline-block w-100 mt-5">
        <div className="row">
          <div className="col-12 col-lg-12 col-xl-7">
            <div className="row">
              <div className="col-12 col-xl-6">
                <div className="row align-items-center mb-4">
                  <div className="col-4">
                    <h6 className="fs-16">Adjust Amount (₹)</h6>
                  </div>

                  <div className="col-1"></div>

                  <div className="col-7">
                    <TextInput
                      name="adjustAmount"
                      value={AdjustmentForm.values.adjustAmount}
                      onChange={AdjustmentForm.handleChange}
                      formgroupClassName="mb-0"
                      isReadOnly={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-12 col-xl-5" />
        </div>

        <div className="row mb-4">
          <div className="col-12 col-xl-7">
            <div className="row">
              <div className="col-12 col-xl-6">
                <div className="row align-items-center mb-4">
                  <div className="col-5">
                    <h6 className="fs-16">Student Id(Adjusted To)</h6>
                  </div>

                  <div className="col-7">
                    <TextInput
                      name="studentIdAdjusted"
                      value={AdjustmentForm.values.studentIdAdjusted}
                      onChange={AdjustmentForm.handleChange}
                      formgroupClassName="mb-0"
                    />
                  </div>
                </div>
              </div>

              <div className="col-12 col-xl-6">
                <div className="row align-items-center mb-4">
                  <div className="col-5">
                    <h6 className="fs-16">Student Name(Adjusted To)</h6>
                  </div>

                  <div className="col-7">
                    <TextInput
                      name="studentNameAdjusted"
                      value={AdjustmentForm.values.studentNameAdjusted}
                      onChange={AdjustmentForm.handleChange}
                      formgroupClassName="mb-0"
                      isReadOnly={true}
                      inputClassName="bg-light border-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-xl-1" />

          <div className="col-12 col-xl-4"></div>
        </div>

        <div className="d-inline-block w-100 mb-4">
          <h6 className="mb-3 fs-16">Applicable On</h6>
          <TableContainer
            columns={roleColumns || []}
            data={AdjustmentTableData}
            divClass="table-responsive mb-1"
            theadClass="table-light text-muted align-middle"
            showCheckbox={true}
          />
        </div>

        <div className="row">
          <div className="col-12 col-xl-7"></div>

          <div className="col-12 col-xl-5">
            <div className="row align-items-center mb-4">
              <div className="col-5">
                <h6 className="fs-16 me-2">Final Refund Amount (₹)</h6>
              </div>

              <div className="col-7">
                <TextInput
                  name="finalRefundAmount"
                  value={AdjustmentForm.values.finalRefundAmount}
                  onChange={AdjustmentForm.handleChange}
                  formgroupClassName="mb-0"
                />
              </div>
            </div>

            <div className="row align-items-center mb-4">
              <div className="col-5">
                <h6 className="fs-16 me-2">Remarks</h6>
              </div>

              <div className="col-7">
                <TextArea
                  name="remarks"
                  value={AdjustmentForm.values.remarks}
                  onChange={AdjustmentForm.handleChange}
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

export default Adjustment;
