import { useEffect, useState, useRef } from "react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { downloadAdmitCardAct, resetsetDownloadAdmitCardAct } from "../../../../store/examination/examinationmanagement/examinationmanagementactions";
import { generateActionPayload } from "../../../../utility/reduxutility";

const PreviewAdmitCardModel = (props: any) => {
  const dispatch = useAppDispatch();
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const previousUrl = useRef<string | null>(null);

  const { downloadAdmitCardResp } = useAppSelector(
    ({ examinationManagement }) => ({
      downloadAdmitCardResp: examinationManagement.downloadAdmitCardResp,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (props.isOpen && props.data) {
      confirmViewAdmitCardHndler(props.data);
    }
  }, [props.isOpen, props.data]);

  const confirmViewAdmitCardHndler = (rowData: any) => {
    const { examinationId, branchId } = rowData;
    const {  academicYearId, curriculumId, classId, sectionId } = props.selectedClassId;

    const payload = {
      academicYearId,
      studentId: props.studentId,
      examinationId,
      viewType: "VIEW",
      branchId,
      curriculumId,
      classId,
      sectionId,
      ...(props.shouldIncludeClassSequence && {
        classSequence: rowData.classSequence,
      }),
    };

    dispatch(
      downloadAdmitCardAct(
        generateActionPayload("download_admit_card", undefined, payload)
      )
    );
  };

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
      if (previousUrl.current) {
        URL.revokeObjectURL(previousUrl.current);
      }
      dispatch(resetsetDownloadAdmitCardAct(undefined));
    };
  }, [dispatch]);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      {pdfBlobUrl ? (
        <iframe
          src={pdfBlobUrl}
          width="100%"
          height="600px"
          className="mb-4"
          title="Admit Card"
        ></iframe>
      ) : (
        <p className="mt-3">No Data Found</p>
      )}
    </div>
  );
};

export default PreviewAdmitCardModel;
