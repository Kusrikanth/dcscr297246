import React, { useEffect, useMemo, useRef } from 'react'
import TableContainer from '../../../../Components/Common/TableContainer'
import { generateColumns } from './helper';
import { getPaymentReconciliationAct, getPaymentReconciliationDetailsByIdAct } from '../../../../store/fee/feecollections/feecollectionactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { dateFormatter } from '../All/helper';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { IPaginationState } from '../../../../Components/Common/Pagination';
import { useModal } from '../../../../hooks/modalhook';
import classnames from "classnames";
import { ModalContainerUpdated } from '../../../../Components/Common';
import ViewReconciliationDetailsModel from '../All/ViewReconciliationDetailsModel';
import { toast } from 'react-toastify';
import { HugeiconsIcon } from '@hugeicons/react';
import { EyeIcon } from "@hugeicons-pro/core-stroke-standard";

interface AllProps {
  filterState: {
    date_from: string;
    date_to: string;
  };
}

function Matched({ filterState }: AllProps) {
  const dispatch = useAppDispatch();
  const { closeModal: closeViewReconciliationDetailsModal, modalState: viewReconciliationDetailsModelState, openModal: openViewReconciliationDetailsModal } = useModal();

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  });

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    getPaymentReconciliationResp,
    feeCollectionErrorResp,

  } = useAppSelector(
    ({
      appData, feeCollections,
    }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getPaymentReconciliationResp: feeCollections.getPaymentReconciliationResp,
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

  const getPaymentReconciliationApiCall = (otherProps?: any) => {
    let payload = {
      date_from: filterState.date_from ? dateFormatter(filterState.date_from) : '',
      date_to: filterState.date_to ? dateFormatter(filterState.date_to) : '',
      recon_status: "VERIFIED",
      ...otherProps,
    };
    dispatch(
      getPaymentReconciliationAct(
        generateActionPayload('get_payment_reconciliation_details', { branchId }, payload)
      )
    );
  };

  const menuOptions = useMemo(
    () => [
      {
        id: "view",
        actionIcon: <HugeiconsIcon icon={EyeIcon} className="text-muted" size={18} />,
        actionName: "View Details",
        onClickHndlr: (event: any) => {
          const orderRef = event.currentTarget.getAttribute("data-id");
          dispatch(getPaymentReconciliationDetailsByIdAct(generateActionPayload("get_payment_reconciliation_details_by_id", { branchId, orderRef })));
          openViewReconciliationDetailsModal(orderRef);
        }
      }
    ],
    [getPaymentReconciliationResp]
  );


  useEffect(() => {
    getPaymentReconciliationApiCall();
  }, [filterState.date_from, filterState.date_to]);

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    getPaymentReconciliationApiCall(paginationInfo);
  }
  const columns = useMemo(() => generateColumns(menuOptions), [getPaymentReconciliationResp]);
  const { totalElements, totalPages, pageable } = getPaymentReconciliationResp || {};


  return (
    <div>
      <TableContainer
        columns={columns || []}
        data={Array.isArray(getPaymentReconciliationResp?.content) ? getPaymentReconciliationResp?.content : []}
        divClass="tw-overflow-x-auto tw-mb-3"
        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
        showCheckbox={false}
        showPagination={true}
        totalPages={totalPages || 0}
        totalRecords={totalElements || 0}
        callbackPaginationHndlr={paginationHndlr}
        currentPageNumber={pageable?.pageNumber || 0}
      />
      <ModalContainerUpdated
        id="reconcilation-details"
        isOpen={viewReconciliationDetailsModelState.showModal}
        toggle={() => closeViewReconciliationDetailsModal()}
        modalTitle={"View Reconciliation Details"}
        modalSize="lg"
      >
        <ViewReconciliationDetailsModel
          id={viewReconciliationDetailsModelState.modalData}
          isOpen={false}
          toggle={() => closeViewReconciliationDetailsModal()}
          modalTitle="Create Detail"
        />
      </ModalContainerUpdated>
    </div>
  )
}

export default Matched
