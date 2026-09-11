import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../../utility/dateutility";
import { StatusLabel } from "../../../../../Components/Common";
import Button from "../../../../../Components/Common/Button";

interface IExaminationMarksProps {
  id: any;
  isOpen: boolean,
  toggle: any,
  modalTitle?: string,
}

const ViewReconciliationDetailsModel: React.FC<IExaminationMarksProps> = (props) => {

  const dispatch = useAppDispatch();
  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    getPaymentReconciliationDetailsByIdResp,
    feeCollectionErrorResp,
  } = useAppSelector(
    ({
      appData, feeCollections,
    }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getPaymentReconciliationDetailsByIdResp: feeCollections.getPaymentReconciliationDetailsByIdResp,
      feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,
    }),
    shallowEqual
  );

  const reconciliationRef = useRef({
    prevFeeCollectionErrorResp: feeCollectionErrorResp,
  });

  useEffect(() => {
    const { prevFeeCollectionErrorResp } = reconciliationRef.current;
    if (feeCollectionErrorResp && prevFeeCollectionErrorResp !== feeCollectionErrorResp) {
      const { details, errors, message } = feeCollectionErrorResp || {};
      toast.error(errors?.[0] || details || message || "Something went wrong");
    }

    reconciliationRef.current.prevFeeCollectionErrorResp = feeCollectionErrorResp;
  }, [feeCollectionErrorResp])

  const orderRef = getPaymentReconciliationDetailsByIdResp?.orderRef;
  const type = getPaymentReconciliationDetailsByIdResp?.identifier?.type;
  const initiatedAt = getPaymentReconciliationDetailsByIdResp?.order?.initiatedAt;
  const orderStatus = getPaymentReconciliationDetailsByIdResp?.order?.orderStatus;
  const reconStatus = getPaymentReconciliationDetailsByIdResp?.order?.reconStatus;
  const bankReferenceNumber = getPaymentReconciliationDetailsByIdResp?.order?.bankReferenceNumber;
  const paymentMode = getPaymentReconciliationDetailsByIdResp?.order?.paymentMode;
  const transactionCompletedAt = getPaymentReconciliationDetailsByIdResp?.order?.transactionCompletedAt;

  const formattedInitiatedAt = getDdMmYyyyWithMonthNameFormat(initiatedAt);
  const formattedTransactionCompletedAt = getDdMmYyyyWithMonthNameFormat(transactionCompletedAt);

  return (
    <>
      <div className="tw-flex tw-flex-col tw-items-center">
        <div className="tw-w-full tw-px-4 tw-mt-2 tw-py-2">
          
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
            <div className="tw-p-2">
              <div className="tw-grid tw-grid-cols-12 tw-gap-2 tw-items-center">
                <div className="tw-col-span-6 md:tw-col-span-4">
                  <h6 className="tw-mb-0">
                    <span className="tw-font-bold">Order Ref : </span>
                  </h6>
                </div>
                <div className="tw-col-span-6 md:tw-col-span-8">
                  <h6 className="tw-mb-0">
                    <span className="tw-font-bold tw-text-gray-500">{orderRef ? orderRef : '-'}</span>
                  </h6>
                </div>
              </div>
            </div>
            <div className="tw-p-2">
              <div className="tw-grid tw-grid-cols-12 tw-gap-2 tw-items-center">
                <div className="tw-col-span-6">
                  <h6 className="tw-mb-0">
                    <span className="tw-font-bold">Type : </span>
                  </h6>
                </div>
                <div className="tw-col-span-6">
                  <h6 className="tw-mb-0">
                    <span className="tw-font-bold tw-text-gray-500">{type ? type : '-'}</span>
                  </h6>
                </div>
              </div>
            </div>
          </div>

          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
            <div className="tw-p-2">
              <div className="tw-grid tw-grid-cols-12 tw-gap-2 tw-items-center">
                <div className="tw-col-span-6 md:tw-col-span-4">
                  <h6 className="tw-mb-0">
                    <span className="tw-font-bold">Initiated Date  : </span>
                  </h6>
                </div>
                <div className="tw-col-span-6 md:tw-col-span-8">
                  <h6 className="tw-mb-0">
                    <span className="tw-font-bold tw-text-gray-500">{formattedInitiatedAt ? formattedInitiatedAt : '-'}</span>
                  </h6>
                </div>
              </div>
            </div>
            <div className="tw-p-2">
              <div className="tw-grid tw-grid-cols-12 tw-gap-2 tw-items-center">
                <div className="tw-col-span-6">
                  <h6 className="tw-mb-0">
                    <span className="tw-font-bold">Transaction Date : </span>
                  </h6>
                </div>
                <div className="tw-col-span-6">
                  <h6 className="tw-mb-0">
                    <span className="tw-font-bold tw-text-gray-500">{formattedTransactionCompletedAt ? formattedTransactionCompletedAt : '-'}</span>
                  </h6>
                </div>
              </div>
            </div>
          </div>

          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
            <div className="tw-p-2">
              <div className="tw-grid tw-grid-cols-12 tw-gap-2 tw-items-center">
                <div className="tw-col-span-6 md:tw-col-span-4">
                  <h6 className="tw-mb-0">
                    <span className="tw-font-bold">Payment Mode : </span>
                  </h6>
                </div>
                <div className="tw-col-span-6 md:tw-col-span-8">
                  <h6 className="tw-mb-0">
                    <span className="tw-font-bold tw-text-gray-500">{paymentMode ? paymentMode : '-'}</span>
                  </h6>
                </div>
              </div>
            </div>
            <div className="tw-p-2">
              <div className="tw-grid tw-grid-cols-12 tw-gap-2 tw-items-center">
                <div className="tw-col-span-6">
                  <h6 className="tw-mb-0">
                    <span className="tw-font-bold">Bank Reference Number : </span>
                  </h6>
                </div>
                <div className="tw-col-span-6">
                  <h6 className="tw-mb-0">
                    <span className="tw-font-bold tw-text-gray-500">{bankReferenceNumber ? bankReferenceNumber : '-'}</span>
                  </h6>
                </div>
              </div>
            </div>
          </div>

          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
            <div className="tw-p-2">
              <div className="tw-grid tw-grid-cols-12 tw-gap-2 tw-items-center">
                <div className="tw-col-span-6 md:tw-col-span-4">
                  <h6 className="tw-mb-0">
                    <span className="tw-font-bold">Order Status  : </span>
                  </h6>
                </div>
                <div className="tw-col-span-6 md:tw-col-span-8">
                  <StatusLabel type={orderStatus || '-'} labelName={orderStatus || '-'} />
                </div>
              </div>
            </div>
            <div className="tw-p-2">
              <div className="tw-grid tw-grid-cols-12 tw-gap-2 tw-items-center">
                <div className="tw-col-span-6">
                  <h6 className="tw-mb-0">
                    <span className="tw-font-bold">Reconciliation Status : </span>
                  </h6>
                </div>
                <div className="tw-col-span-6">
                  <StatusLabel type={reconStatus || '-'} labelName={reconStatus || '-'} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tw-w-full">
          <div className="tw-flex tw-justify-center tw-gap-2 tw-mx-4 tw-my-3">
            <Button variant="secondary" onClick={props.toggle}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewReconciliationDetailsModel;
