import { useEffect, useState, useRef } from "react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { downloadAdmitCardAct, resetsetDownloadAdmitCardAct } from "../../../store/examination/examinationmanagement/examinationmanagementactions";
import { generateActionPayload } from "../../../utility/reduxutility";

const PreviewAdmitCardModel = ({ data, isOpen, toggle }: any) => {
  const dispatch = useAppDispatch();
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const previousUrl = useRef<string | null>(null);

  const { downloadAdmitCardResp, parentChildrensResp, currentStudentId } =
    useAppSelector(
      ({ examinationManagement, directoryStudent, appData }) => ({
        downloadAdmitCardResp: examinationManagement.downloadAdmitCardResp,
        parentChildrensResp: directoryStudent.parentChildrensResp,
        currentStudentId: appData.currentStudentId,
      }),
      shallowEqual
    );


  useEffect(() => {
    const base64 = downloadAdmitCardResp?.pdfBase64;
    if (base64) {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length)
        .fill(0)
        .map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);

      if (previousUrl.current) URL.revokeObjectURL(previousUrl.current);
      previousUrl.current = blobUrl;
      setPdfBlobUrl(blobUrl);
    } else {
      setPdfBlobUrl(null);
    }
  }, [downloadAdmitCardResp]);

  useEffect(() => {
    return () => {
      dispatch(resetsetDownloadAdmitCardAct(undefined));
      if (previousUrl.current) URL.revokeObjectURL(previousUrl.current);
    };
  }, []);
  
  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-justify-center">
      {pdfBlobUrl ? (
        <iframe
          src={pdfBlobUrl}
          width="100%"
          height="600px"
          className="mb-4"
          title="Admit Card"
        ></iframe>
      ) : (
        <p className="tw-mt-3">No Data Found.</p>
      )}
    </div>
  );
};

export default PreviewAdmitCardModel;
