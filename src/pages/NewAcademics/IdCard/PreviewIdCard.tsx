import { useEffect, useRef } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useAppSelector } from "../../../hooks/storehook";
import { printDocumentHandler } from "../../../utility/commonutility";
import { default as PrintSvg } from "../../../assets/imagesdps/academics/PrintSvg.svg?react";
import { previewIssuedIdCardAct } from "../../../store/academic/notreportingstudents/notreportingstudentsactions";

const PreviewIdCard = (props: any) => {
    const printDivRef = useRef<any>(null);
    const { showApiLoader, currentBranchIdResp: branchId, currentInstIdResp: instituteId,
        previewIssuedIdcardResp } =
        useAppSelector(({ appData, globalData, notReportingStu }) => ({
            showApiLoader: globalData.showApiLoader,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            previewIssuedIdcardResp: notReportingStu.previewIssuedIdcardResp,
        }), shallowEqual);

    const dispatch = useDispatch();
    
    useEffect(() => {
        const { idCardNo, isOpen } = props;
        if (idCardNo && isOpen) {
            dispatch(previewIssuedIdCardAct(generateActionPayload("preview_issued_id_card", idCardNo)));
        }
    }, [props.idCardNo, props.isOpen])

    function printReceiptHndlr() {
        const innerHTMLContent: string = printDivRef.current?.innerHTML || "";
        printDocumentHandler(innerHTMLContent);
    }
    
    return (<div className="modal-body p-3">
        <div className='d-flex flex-column align-items-center justify-content-center'>
            {previewIssuedIdcardResp && <div ref={printDivRef} dangerouslySetInnerHTML={{ __html: previewIssuedIdcardResp }}></div>}
        </div>
        <div className="d-flex justify-content-center p-3">
            <button onClick={printReceiptHndlr} className="btn btn-danger px-4 me-2">
                <PrintSvg className="me-2 d-inline-block" stroke="#FFFFFF" />Print ID Card
            </button>
        </div>
    </div>)
}

export default PreviewIdCard;