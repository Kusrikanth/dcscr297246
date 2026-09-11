import { useEffect, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { useAppSelector } from "../../../../hooks/storehook";

const PrintStudentFeeLedgerModal = (props: any) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [pdfUrl, setPdfUrl] = useState<string>("");

    const { printStudentLedgerDetailsResp }: any =
        useAppSelector(
            ({ feeCollections }) => ({
                printStudentLedgerDetailsResp: feeCollections.printStudentLedgerDetailsResp,
            }),
            shallowEqual
        );

    useEffect(() => {
        if (printStudentLedgerDetailsResp) {
            const url = URL.createObjectURL(printStudentLedgerDetailsResp);
            setPdfUrl(url);

            return () => {
                URL.revokeObjectURL(url);
                setPdfUrl("");
            };
        }
    }, [printStudentLedgerDetailsResp]);

    return (
        <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-3">
            {pdfUrl && (
                <iframe
                    ref={iframeRef}
                    src={pdfUrl}
                    width="100%"
                    height="500px"
                    title="TC Preview"
                    style={{ border: "none" }}
                />
            )}
        </div>
    );
};

export default PrintStudentFeeLedgerModal;