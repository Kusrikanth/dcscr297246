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
  const { receiptDetails } = props;
    // { feeDetailVOList } = receiptDetails || {};

  return (
    <>
      <div className="modal-body tw-py-2 tw-px-0">
        <div className="tw-flex">
          <div className="tw-flex tw-flex-col tw-items-center tw-px-5">
            <div className="tw-flex-shrink-0 tw-w-16 tw-h-16 tw-rounded-full tw-shadow-md tw-p-1 tw-mb-2">
              <img
                src={DefaultStudentImage}
                className="tw-w-full tw-h-full tw-object-cover tw-rounded-full"
                alt="Student"
              />
            </div>
            <span className="tw-block tw-font-semibold">{receiptDetails?.studentDetail?.name || "-"}</span>
            <span className="tw-block tw-text-xs tw-text-blue-600 tw-mb-2">
              {receiptDetails?.studentDetail?.shortName || "-"}
            </span>
          </div>

          <div className="tw-flex-1 tw-grid tw-grid-cols-12 tw-gap-3 tw-px-4 tw-pb-2">
            <div className="tw-col-span-4">
              <div className="tw-flex tw-mb-1">
                <label className="tw-font-bold tw-w-1/3">Class:</label>
                <span className="tw-w-2/3">{receiptDetails?.className || "n/a"}</span>
              </div>
              <div className="tw-flex">
                <label className="tw-font-bold tw-w-1/3">Section:</label>
                <span className="tw-w-2/3">{receiptDetails?.sectionName || "n/a"}</span>
              </div>
            </div>

            <div className="tw-col-span-5">
              <div className="tw-flex tw-mb-1">
                <label className="tw-font-bold tw-w-1/3">Receipt No:</label>
                <span className="tw-w-2/3">{receiptDetails?.receiptNumber || "n/a"}</span>
              </div>
              <div className="tw-flex">
                <label className="tw-font-bold tw-w-1/3">Receipt Date:</label>
                <span className="tw-w-2/3">{getDdMmYyyyFormat(receiptDetails?.receiptDate) || "n/a"}</span>
              </div>
            </div>

            <div className="tw-col-span-12 tw-flex tw-items-center tw-gap-3">
              <div className="tw-flex tw-items-center tw-justify-center tw-px-2 tw-py-1 tw-bg-red-100 tw-rounded-lg tw-cursor-pointer">
                <i className="ri-mail-line tw-text-red-600"></i>
              </div>
              <div
                data-id={receiptDetails?.id}
                onClick={props.printReceiptHndlr}
                className="tw-flex tw-items-center tw-justify-center tw-cursor-pointer tw-px-2 tw-py-1 tw-bg-green-100 tw-rounded-lg"
              >
                <i className="ri-printer-line tw-text-green-600"></i>
              </div>
            </div>
          </div>
        </div>

        <TableContainer
          columns={feeDetailsColumns || []}
          data={Array.isArray([receiptDetails]) ? [receiptDetails] : []}
          divClass="tw-overflow-x-auto tw-mb-1"
          tableClass="tw-w-full tw-mb-0"
          theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
        />

        <div className="tw-modal-footer tw-shadow-inner tw-flex tw-justify-end tw-p-2">
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
