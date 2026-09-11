import { useEffect, useState, useRef } from "react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { setCbseProgressCardStudentAct } from "../../../store/examination/examinationmanagement/examinationmanagementslice";
import { getCbseProgressCardStudentAct } from "../../../store/examination/examinationmanagement/examinationmanagementactions";
import { generateActionPayload } from "../../../utility/reduxutility";

const PreviewProgressCardModel = ({ data, isOpen, toggle }) => {
  // const { isEarlyYearsManagement } = props || {};
  const dispatch = useAppDispatch();
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const previousUrl = useRef<string | null>(null);

  const { getCbseProgressCardStudentActResp, downloadCbseProgressCardsActResp, parentChildrensResp, currentStudentId } =
    useAppSelector(
      ({ examinationManagement, directoryStudent, appData }) => ({
        previewProgressCardActResp:
          examinationManagement.previewProgressCardActResp,
        downloadCbseProgressCardsActResp:
          examinationManagement.downloadCbseProgressCardsActResp,
        getCbseProgressCardStudentActResp:
          examinationManagement.getCbseProgressCardStudentActResp,
        parentChildrensResp: directoryStudent.parentChildrensResp,
        currentStudentId: appData.currentStudentId,
      }),
      shallowEqual
    );

  useEffect(() => {
    return () => {
      dispatch(setCbseProgressCardStudentAct(undefined));
      if (previousUrl.current) URL.revokeObjectURL(previousUrl.current);
    };
  }, []);

  // useEffect(() => {
  //   const base64 = getCbseProgressCardStudentActResp?.pdfBase64;
  //   if (base64) {
  //     const byteCharacters = atob(base64);
  //     const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) =>
  //       byteCharacters.charCodeAt(i)
  //     );
  //     const byteArray = new Uint8Array(byteNumbers);
  //     const blob = new Blob([byteArray], { type: "application/pdf" });
  //     const blobUrl = URL.createObjectURL(blob);
  //     if (previousUrl.current) URL.revokeObjectURL(previousUrl.current);
  //     previousUrl.current = blobUrl;
  //     setPdfBlobUrl(blobUrl);
  //   } else {
  //     setPdfBlobUrl(null);
  //   }
  // }, [getCbseProgressCardStudentActResp]);
  useEffect(() => {
    const base64 = downloadCbseProgressCardsActResp?.pdfBase64;
    if (base64) {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) =>
        byteCharacters.charCodeAt(i)
      );
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      if (previousUrl.current) URL.revokeObjectURL(previousUrl.current);
      previousUrl.current = blobUrl;
      setPdfBlobUrl(blobUrl);
    } else {
      setPdfBlobUrl(null);
    }
  }, [downloadCbseProgressCardsActResp]);

  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-justify-center">
      {pdfBlobUrl ? (
        <iframe
          src={pdfBlobUrl}
          width="100%"
          height="600px"
          className="mb-4"
          title="Progress Card"
        ></iframe>
      ) : (
        <p className="tw-mt-3">No data available</p>
      )}
    </div>
  );
};

export default PreviewProgressCardModel;
