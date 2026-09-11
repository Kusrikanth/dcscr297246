import React, { useEffect, useRef } from "react";
import { ModalContainer } from "../../../../../Components/Common";
import { default as ConfirmationIcon } from "../../../../../assets/imagesdps/academics/confirmation-icon.svg?react";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { default as ApproveSvg } from "../../../../../assets/imagesdps/academics/ApproveSvg.svg?react";
import { saveEnquiryAppSaleAct } from "../../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";


interface ConfirmationModalProps {
  toggle: any;
  instituteId: string;
  branchId: string;
  academicYearId: string;
  contactNumber: string;
  confirmationMessage: any;
}

const ConfirmationModal = (props: ConfirmationModalProps) => {
  const history = useHistory();
  const { instituteId, branchId, contactNumber, academicYearId } = props;
  const dispatch = useAppDispatch();
  const { showApiLoader, saveEnquiryAppSaleResp } = useAppSelector(
    ({ globalData, applicationSale }) => ({
      showApiLoader: globalData.showApiLoader,
      saveEnquiryAppSaleResp: applicationSale.saveEnquiryAppSaleResp,
    }),
    shallowEqual
  );
  const confirmModalRespRef = useRef({
    prevSaveEnquiryAppSaleResp: saveEnquiryAppSaleResp
  });
  useEffect(() => {
    const { prevSaveEnquiryAppSaleResp } = confirmModalRespRef.current;
    if (saveEnquiryAppSaleResp && prevSaveEnquiryAppSaleResp !== saveEnquiryAppSaleResp) {
      toast.success("Your enquiry has been saved successfully.");
      props.toggle(true);
    }
    confirmModalRespRef.current.prevSaveEnquiryAppSaleResp = saveEnquiryAppSaleResp;
  }, [saveEnquiryAppSaleResp]);


  function mayBeLaterHandler() {
    dispatch(saveEnquiryAppSaleAct(generateActionPayload("save_enquiry_app_sale_login",
      undefined, {
      branchId, academicYearId, contactNumber
    })));
  }
  function processHandler() {
    props.toggle(true);
    history.push({
      pathname: '/online-application-sale',
      search: `?branchId=${branchId}&instituteId=${instituteId}&academicYearId=${academicYearId}`,
      state: { phoneNumber: contactNumber }
    })
  }

  return (
    <>

      <div className="tw-p-5">
        <div className="tw-flex tw-flex-col tw-items-center">
          <div className="tw-flex tw-mb-3">
            <ApproveSvg fill="#0ab39c" width={"70px"} height="70px" />
          </div>
          <h5 className="tw-mb-2 tw-text-lg tw-font-semibold">Are you sure?</h5>
          <span className="tw-font-normal tw-text-center">{props.confirmationMessage}</span>
        </div>

        <div className="tw-flex tw-justify-center tw-gap-3 tw-py-3 tw-mt-2" >
          <button
            type="button"
            className="btn w-sm btn-light m-0"
            onClick={mayBeLaterHandler}
            disabled={showApiLoader}
          >
            May Be Later
          </button>
          <button
            type="button"
            className="btn w-sm btn-success m-0"
            onClick={processHandler}
            disabled={showApiLoader}
          >
            Proceed
          </button>
        </div>
      </div>

    </>
  );
};

export default ConfirmationModal;
