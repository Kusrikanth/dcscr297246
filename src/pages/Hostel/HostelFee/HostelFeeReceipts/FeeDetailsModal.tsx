import React, { useMemo } from "react";
import { ModalContainer } from "../../../../Components/Common";
import DefaultStudentImage from "../../../../assets/imagesdps/student-default-img.png";
import {
  generateFeeDetailsModalColumns,
} from "./helper";
import { getDdMmYyyyFormat } from "../../../../utility/dateutility";

import TableContainer from "../../../../Components/Common/TableContainer";
import Button from "../../../../Components/Common/Button";

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
            <div className="tw-flex-shrink-0 tw-h-16 tw-w-16 tw-rounded-full tw-p-1 tw-me-2 tw-mb-2 tw-shadow">
              <img
                src={DefaultStudentImage}
                className="tw-h-full tw-w-full tw-rounded-full tw-object-cover tw-block"
              />
            </div>

            <span className="tw-block tw-text-sm tw-font-medium">
              {receiptDetails?.studentName || "-"}
            </span>

            <span className="tw-block tw-text-xs tw-text-primary tw-mb-2">
              {receiptDetails?.studentCode || "-"}
            </span>
          </div>

          <div className="tw-flex-grow tw-grid tw-grid-cols-12 tw-gap-x-3 tw-px-4 tw-pb-2">
            <div className="tw-col-span-4">
              <div className="tw-flex tw-flex-wrap">
                <div className="tw-w-3/12">
                  <label className="tw-font-bold">Class:</label>
                </div>
                <div className="tw-w-9/12">
                  <span>{receiptDetails?.className || "n/a"}</span>
                </div>
              </div>

              <div className="tw-flex tw-flex-wrap">
                <div className="tw-w-3/12">
                  <label className="tw-font-bold">Section:</label>
                </div>
                <div className="tw-w-9/12">
                  <span>{receiptDetails?.sectionName || "n/a"}</span>
                </div>
              </div>
            </div>

            <div className="tw-col-span-5">
              <div className="tw-flex tw-flex-wrap">
                <div className="tw-w-4/12">
                  <label className="tw-font-bold">Receipt No:</label>
                </div>
                <div className="tw-w-8/12">
                  <span>{receiptDetails?.receiptNo || "n/a"}</span>
                </div>
              </div>

              <div className="tw-flex tw-flex-wrap">
                <div className="tw-w-4/12">
                  <label className="tw-font-bold">Receipt Date:</label>
                </div>
                <div className="tw-w-8/12">
                  <span>
                    {getDdMmYyyyFormat(receiptDetails?.receiptDate) || "n/a"}
                  </span>
                </div>
              </div>
            </div>

            <div className="tw-col-span-12">
              <div className="tw-flex tw-items-center">
                <div className="tw-flex tw-items-center tw-justify-center tw-px-2 tw-py-1 tw-bg-red-100 tw-rounded-lg tw-me-3 tw-cursor-pointer">
                  <i className="ri-mail-line tw-text-red-600"></i>
                </div>

                {props?.from !== "feeSummary" && (
                  <div
                    data-id={receiptDetails?.feeReceiptId}
                    onClick={editReceiptHndlr}
                    className="tw-flex tw-items-center tw-justify-center tw-px-2 tw-py-1 tw-bg-yellow-100 tw-rounded-lg tw-me-3 tw-cursor-pointer"
                  >
                    <i className="ri-pencil-fill tw-text-yellow-600"></i>
                  </div>
                )}

                <div
                  data-id={receiptDetails?.feeReceiptId}
                  onClick={props.printReceiptHndlr}
                  className="tw-flex tw-items-center tw-justify-center tw-px-2 tw-py-1 tw-bg-green-100 tw-rounded-lg tw-cursor-pointer"
                >
                  <i className="ri-printer-line tw-text-green-600"></i>
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
          theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
        />
      </div>

      <div className="tw-border-t tw-shadow-sm">
        <div className="tw-flex tw-gap-2 tw-justify-end">
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
