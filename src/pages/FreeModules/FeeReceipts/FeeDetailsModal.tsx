import { useMemo } from "react";
import DefaultStudentImage from "../../../assets/imagesdps/student-default-img.png";
import {
  generateFeeDetailsModalColumns,
} from "./helper";
import { getDdMmYyyyFormat } from "../../../utility/dateutility";

import TableContainer from "../../../Components/Common/TableContainer";
import Button from "../../../Components/Common/Button";

const FeeDetailsModal = (props: any) => {
  const feeDetailsColumns = useMemo(() => generateFeeDetailsModalColumns(), []);
  const { receiptDetails } = props,
    { feeDetailVOList } = receiptDetails || {};

  function editReceiptHndlr(event: any) {
    props.toggle();
    props.editFeeDetailsHndlr(event);
  }
  return (
    <>
      <div className="tw-py-2 tw-px-0">
        <div className="tw-flex">

          <div className="tw-flex tw-flex-col tw-items-center tw-px-5">
            <div className="tw-w-16 tw-h-16 tw-rounded-full tw-shadow-md tw-p-1 tw-mb-2">
              <img
                src={DefaultStudentImage}
                className="tw-w-full tw-h-full tw-object-cover tw-rounded-full"
              />
            </div>

            <span className="tw-block tw-font-medium">
              {receiptDetails?.studentDetail?.name || "-"}
            </span>

            <span className="tw-block tw-text-xs tw-text-primary tw-mb-2">
              {receiptDetails?.studentDetail?.shortName || "-"}
            </span>
          </div>

          <div className="tw-flex-1 tw-grid tw-grid-cols-12 tw-gap-3 tw-px-4 tw-pb-2">

            <div className="tw-col-span-12 lg:tw-col-span-4">
              <div className="tw-grid tw-grid-cols-12 tw-mb-1">
                <label className="tw-col-span-3 tw-font-bold">Class:</label>
                <span className="tw-col-span-9">
                  {receiptDetails?.className || "n/a"}
                </span>
              </div>

              <div className="tw-grid tw-grid-cols-12">
                <label className="tw-col-span-3 tw-font-bold">Section:</label>
                <span className="tw-col-span-9">
                  {receiptDetails?.sectionName || "n/a"}
                </span>
              </div>
            </div>

            <div className="tw-col-span-12 lg:tw-col-span-5">
              <div className="tw-grid tw-grid-cols-12 tw-mb-1">
                <label className="tw-col-span-4 tw-font-bold">Receipt No:</label>
                <span className="tw-col-span-8">
                  {receiptDetails?.receiptNumber || "n/a"}
                </span>
              </div>

              <div className="tw-grid tw-grid-cols-12">
                <label className="tw-col-span-4 tw-font-bold">Receipt Date:</label>
                <span className="tw-col-span-8">
                  {getDdMmYyyyFormat(receiptDetails?.receiptDate) || "n/a"}
                </span>
              </div>
            </div>

            <div className="tw-col-span-12">
              <div className="tw-flex tw-items-center">

                <div className="tw-flex tw-items-center tw-justify-center tw-px-2 tw-py-1 tw-bg-red-100 tw-rounded-md tw-mr-3 tw-cursor-pointer">
                  <i className="ri-mail-line tw-text-red-600" />
                </div>

                {props?.from !== "feeSummary" && (
                  <div
                    data-id={receiptDetails?.id}
                    onClick={editReceiptHndlr}
                    className="tw-flex tw-items-center tw-justify-center tw-px-2 tw-py-1 tw-bg-yellow-100 tw-rounded-md tw-mr-3 tw-cursor-pointer"
                  >
                    <i className="ri-pencil-fill tw-text-yellow-600" />
                  </div>
                )}

                <div
                  data-id={receiptDetails?.id}
                  onClick={props.printReceiptHndlr}
                  className="tw-flex tw-items-center tw-justify-center tw-px-2 tw-py-1 tw-bg-green-100 tw-rounded-md tw-cursor-pointer"
                >
                  <i className="ri-printer-line tw-text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <TableContainer
          columns={feeDetailsColumns || []}
          data={Array.isArray(feeDetailVOList) ? feeDetailVOList : []}
          divClass="tw-overflow-x-auto tw-mb-1"
          tableClass="tw-mb-0"
          theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
        />
      </div>

      <div className="tw-border-t tw-shadow-inner">
        <div className="tw-flex tw-justify-end tw-gap-2 tw-p-3">
          <Button
            type="button"
            variant="secondary"
            onClick={props.toggle}
          >
            Close
          </Button>
        </div>
      </div>
    </>
  );
};

export default FeeDetailsModal;
