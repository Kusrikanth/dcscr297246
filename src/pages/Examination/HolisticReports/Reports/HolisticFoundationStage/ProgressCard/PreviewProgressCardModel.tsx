import { useEffect, useState, useRef } from "react";
import { shallowEqual } from "react-redux";
import { useAppSelector, useAppDispatch } from "../../../../../../hooks/storehook";
import {
  setDownloadCbseProgressCardsAct,
  setPreviewProgressCard,
} from "../../../../../../store/examination/examinationmanagement/examinationmanagementslice";

const PreviewProgressCardModel = (props: any) => {
  const { isEarlyYearsManagement } = props || {};
  const dispatch = useAppDispatch();
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const previousUrl = useRef<string | null>(null);

  const { previewProgressCardActResp, downloadCbseProgressCardsActResp } =
    useAppSelector(
      ({ examinationManagement }) => ({
        previewProgressCardActResp:
          examinationManagement.previewProgressCardActResp,
        downloadCbseProgressCardsActResp:
          examinationManagement.downloadCbseProgressCardsActResp,
      }),
      shallowEqual
    );

  useEffect(() => {
    return () => {
      dispatch(setPreviewProgressCard(undefined));
      dispatch(setDownloadCbseProgressCardsAct(undefined));
      if (previousUrl.current) URL.revokeObjectURL(previousUrl.current);
    };
  }, []);

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
    <div className="d-flex flex-column align-items-center justify-content-center">
      {pdfBlobUrl ? (
        <iframe
          src={pdfBlobUrl}
          width="100%"
          height="600px"
          className="mb-4"
          title="Progress Card"
        ></iframe>
      ) : (
        <p className="mt-3">No data available</p>
      )}
    </div>
  );
};

export default PreviewProgressCardModel;
