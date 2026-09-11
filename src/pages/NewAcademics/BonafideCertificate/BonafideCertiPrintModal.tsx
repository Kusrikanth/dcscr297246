import React, { useEffect } from "react";
import { ModalPropsType } from "./bonafideCertificateTypes";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getCustomTcCertificateAct, previewBonafideCertificate } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { printDocumentHandler } from "../../../utility/commonutility";
import { default as PrintSvg } from "../../../assets/imagesdps/academics/PrintSvg.svg?react";
import Button from "../../../Components/Common/Button";

const BonafideCertiPrintModal = (props: ModalPropsType) => {

  const { previewBonafideCertiResp }: any =
    useAppSelector(
      ({ classroomManagmentInfo, appData }) => ({
        previewBonafideCertiResp: classroomManagmentInfo.previewBonafideCertiResp,

      }),
      shallowEqual
    );
  const dispatch = useDispatch();
  useEffect(() => {
    if (props.bonafideRequestId) {
      dispatch(previewBonafideCertificate(generateActionPayload('bonafide_certi_preview',
        { bonafideRequestId: props.bonafideRequestId, digitalSign: props.digitalSign })))
    }
  }, [props.bonafideRequestId, props.digitalSign])

  function printReceiptHndlr() {
    const innerHTMLContent: string = previewBonafideCertiResp || "";
    printDocumentHandler(innerHTMLContent);
  }
  return (
    <>
      <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-p-4">

        {previewBonafideCertiResp && (
          <div
            dangerouslySetInnerHTML={{ __html: previewBonafideCertiResp }}
            className="tw-mb-4 tw-w-full"
          />
        )}

        <Button
          onClick={printReceiptHndlr}
          variant="hoverInfo"
        >
          <PrintSvg className="tw-inline-block" stroke="#FFFFFF" />
          Print
        </Button>

      </div>
    </>
  );
};

export default BonafideCertiPrintModal;
