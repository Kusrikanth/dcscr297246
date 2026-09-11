import { useEffect, useState, useRef } from "react";

const PreviewProgressCardModel = ({ modalData, isOpen, toggle }) => {
    const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
    const previousUrl = useRef<string | null>(null);

    useEffect(() => {
        return () => {
            if (previousUrl.current) URL.revokeObjectURL(previousUrl.current);
        };
    }, []);

    useEffect(() => {
        const { pdfBase64 } = modalData || {};
        if (pdfBase64) {
            const byteCharacters = atob(pdfBase64);
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
    }, [modalData]);

    return (
        <div className="tw-flex tw-flex-col tw-items-center tw-justify-center">
            {pdfBlobUrl ? (
                <iframe
                    src={pdfBlobUrl}
                    width="100%"
                    height="600px"
                    className="tw-mb-4"
                    title="Progress Card"
                ></iframe>
            ) : (
                <p className="tw-mt-3">No data available</p>
            )}
        </div>
    );
};

export default PreviewProgressCardModel;
