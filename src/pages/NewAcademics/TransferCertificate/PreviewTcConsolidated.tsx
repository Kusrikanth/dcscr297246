import { shallowEqual } from "react-redux";
import { useAppSelector } from "../../../hooks/storehook";
import { printDocumentHandler } from "../../../utility/commonutility";

const PreviewTcConsolidated = (props: any) => {
    const {getCustomTcCertificateResp }: any =
        useAppSelector(
            ({ classroomManagmentInfo }) => ({
                getCustomTcCertificateResp: classroomManagmentInfo.getCustomTcCertificateResp,

            }),
            shallowEqual
        ); 

    return (<>
        <div className="tw-flex tw-flex-col tw-items-center tw-justify-center">
            {getCustomTcCertificateResp && (
                <iframe
                    src={`data:application/pdf;base64,${getCustomTcCertificateResp.pdfBase64}`}
                    width="100%"
                    height="500px"
                    title="TC Preview"
                    style={{ border: "none" }}
                />
            )}
        </div>
    </>)
}

export default PreviewTcConsolidated;