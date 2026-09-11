import { useFormik } from "formik";
import React, { useMemo, useState } from "react";
import { SelectInput, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns, PaymentReceivedData, selectData4 } from "./helper";
import { PaymentReceivedFilterhProps } from "./PaymentReceivedTypes";

const initialValues: PaymentReceivedFilterhProps = {
  search: "",
  date: "",
  status: "",
};

const PaymentReceived = () => {
  const [paymentReceivedFilterState, setPaymentReceivedFilterState] =
    useState<PaymentReceivedFilterhProps>(initialValues);

  const PaymentReceivedFilterForm = useFormik({
    enableReinitialize: true,
    initialValues: paymentReceivedFilterState,
    onSubmit: (values) => {},
  });

  const roleColumns = useMemo(() => generateColumns(), []);

  return (
    <div className="tw-inline-block tw-w-full tw-mt-3">
      <form
        onSubmit={PaymentReceivedFilterForm.handleSubmit}
        className="tw-mb-3 tw-px-3"
      >
        <div className="tw-grid tw-grid-cols-12 tw-gap-3">
          <div className="tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
            <div className="search-box">
              <TextInput
                name="search"
                value={PaymentReceivedFilterForm.values.search}
                onChange={PaymentReceivedFilterForm.handleChange}
                inputClassName="tw-bg-gray-100"
                formgroupClassName="tw-mb-0"
                placeHolder="Search..."
              />

              <i className="ri-search-line search-icon"></i>
            </div>
          </div>

          <div className="tw-col-span-12 lg:tw-col-span-3">
            <TextInput
              name="date"
              value={PaymentReceivedFilterForm.values.date}
              onChange={PaymentReceivedFilterForm.handleChange}
              inputClassName="tw-bg-gray-100 tw-text-gray-500"
              formgroupClassName="tw-mb-0"
              placeHolder="Select date range"
            />
          </div>
          <div className="tw-col-span-12 lg:tw-col-span-3">
            <SelectInput
              name="class"
              value={PaymentReceivedFilterForm.values.status}
              onChange={PaymentReceivedFilterForm.handleChange}
              menuItems={selectData4}
              valueKey="status"
              textKey="status"
              inputClassName="tw-bg-gray-100"
              formgroupClassName="tw-mb-0"
            />
          </div>

          {/* <div className="col-auto ms-auto">
            <button className="btn button-info w-100 d-flex justify-content-center">
              Apply Filter
            </button>
          </div> */}
        </div>
      </form>

      <TableContainer
        columns={roleColumns || []}
        data={PaymentReceivedData}
        divClass="table-responsive tw-mb-3"
        theadClass="table-light tw-text-gray-500 tw-align-middle"
        showCheckbox={true}
        showPagination={true}
        totalPages={10}
        totalRecords={10}
        callbackPaginationHndlr={() => {}}
        currentPageNumber={0}
      />
    </div>
  );
};

export default PaymentReceived;
