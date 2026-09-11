import React, { useEffect, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { resetUploadDocumentPreviewAct } from "../../../store/academic/academicRequest/academicrequestslice";
import { default as PrintSvg } from "../../../assets/imagesdps/academics/PrintSvg.svg?react";
import NoDataComp from "../../../Components/Common/NoDataComp";
import Button from "../../../Components/Common/Button";

const PreviewUploadDocuments: React.FC<any> = (props) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previousUrl = useRef<string | null>(null);
  const dispatch = useAppDispatch();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const { getUploadDocumentPreviewResp } = useAppSelector(
    ({ academicRequest }) => ({
      getUploadDocumentPreviewResp: academicRequest.getUploadDocumentPreviewResp,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (getUploadDocumentPreviewResp) {
      const { fileBase64, fileUrl, fileType } = getUploadDocumentPreviewResp;

      if (previousUrl.current) URL.revokeObjectURL(previousUrl.current);

      if (fileBase64) {
        const byteCharacters = atob(fileBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], {
          type:
            fileType === ".pdf"
              ? "application/pdf"
              : fileType.startsWith(".jp")
                ? "image/jpeg"
                : fileType.startsWith(".png")
                  ? "image/png"
                  : "application/octet-stream",
        });

        const blobUrl = URL.createObjectURL(blob);
        setPreviewUrl(blobUrl);
        previousUrl.current = blobUrl;
      } else if (fileUrl) {
        setPreviewUrl(fileUrl);
        previousUrl.current = fileUrl;
      } else {
        setPreviewUrl(null);
      }
    }
  }, [getUploadDocumentPreviewResp]);

  useEffect(() => {
    return () => {
      if (previousUrl.current) URL.revokeObjectURL(previousUrl.current);
      dispatch(resetUploadDocumentPreviewAct(undefined));
    };
  }, [dispatch]);

  const printBase64File = () => {
    const { fileBase64, fileType } = getUploadDocumentPreviewResp || {};
    if (!fileBase64 || fileType === ".pdf") return;

    const mimeType = fileType.startsWith(".jp")
      ? "image/jpeg"
      : fileType.startsWith(".png")
        ? "image/png"
        : "application/octet-stream";

    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
      <html>
        <head><title>Print Document</title></head>
        <body style="margin:0;padding:0;display:flex;justify-content:center;align-items:center;">
          <img src="data:${mimeType};base64,${fileBase64}" style="width:100%;height:auto;display:block;margin:auto;" />
        </body>
      </html>
    `);
    doc.close();

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    };
  };

  const isPdf = getUploadDocumentPreviewResp?.fileType === ".pdf";

  return (
    <div
      className={`tw-flex tw-flex-col tw-items-center tw-justify-center tw-overflow-auto ${isPdf ? "tw-p-2" : "tw-p-4 tw-pb-0"
        }`}
      style={{
        maxHeight: "80vh",
        width: "100%",
      }}
    >
      {previewUrl ? (
        <>
          {isPdf ? (
            <iframe
              src={previewUrl}
              width="100%"
              height="600px"
              className="tw-border tw-rounded-md"
              title="Document Preview"
            />
          ) : (
            <div
              className="tw-flex tw-justify-center tw-items-center tw-w-full"
              style={{ maxHeight: "70vh", overflow: "hidden" }}
            >
              <img
                src={previewUrl}
                alt={getUploadDocumentPreviewResp?.fileName || "Document Preview"}
                className="tw-w-full tw-h-auto tw-rounded-lg tw-shadow-md"
                style={{
                  maxHeight: "70vh",
                  objectFit: "contain",
                }}
              />
            </div>
          )}
        </>
      ) : (
        <NoDataComp />
      )}
      {getUploadDocumentPreviewResp?.fileBase64 && !isPdf && (
        <div className="tw-flex tw-justify-center tw-w-full tw-p-3 tw-pr-0">
          <Button
            type="button"
            variant="warning"
            onClick={printBase64File}
          >
            <PrintSvg className="tw-mr-2" stroke="#FFFFFF" />
            Print Document
          </Button>
        </div>
      )}
      <iframe
        ref={iframeRef}
        className="tw-hidden"
        title="print-frame"
      />
    </div>
  );
};

export default PreviewUploadDocuments;
