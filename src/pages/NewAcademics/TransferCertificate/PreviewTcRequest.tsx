import { useEffect, useMemo } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { getCustomTcCertificateAct } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useAppSelector } from "../../../hooks/storehook";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.mjs",
//   import.meta.url
// ).toString();
pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PreviewTcRequest = (props: any) => {
  const { currentInstIdResp: instituteId, getCustomTcCertificateResp }: any =
    useAppSelector(
      ({ appData, classroomManagmentInfo }) => ({
        getCustomTcCertificateResp: classroomManagmentInfo.getCustomTcCertificateResp,
        currentInstIdResp: appData.currentInstIdResp,
      }),
      shallowEqual
    );
  const dispatch = useDispatch();

    useEffect(() => {
        if (props.tcId) {
            dispatch(getCustomTcCertificateAct(generateActionPayload('tc_custom_certi_preview', {digitalSign: props.digitalSigned}, { instituteId, requestId: props.tcId, certificateType: "TC" })))
        }
    }, [props.tcId]);

  const fileSource = useMemo(() => {
    if (getCustomTcCertificateResp?.pdfBase64) {
      return `data:application/pdf;base64,${getCustomTcCertificateResp.pdfBase64}`;
    }
    if (getCustomTcCertificateResp?.sURL) {
      return getCustomTcCertificateResp.sURL;
    }
    return null;
  }, [getCustomTcCertificateResp]);

  return (
    <div className="tw-flex tw-items-center tw-justify-center tw-w-full react-pdf-spacing">
      {fileSource && (
        props.tcRequestStatus === "Prepared" ? (
          <Document file={fileSource}>
            <Page pageNumber={1} scale={1.2} />
          </Document>
        ) : (
          <iframe
            src={`data:application/pdf;base64,${getCustomTcCertificateResp.pdfBase64}`}
            width="100%"
            height="800px"
            title="TC Preview"
            style={{ border: "none" }}
          />
        )
      )}
    </div>
  );
};

export default PreviewTcRequest;