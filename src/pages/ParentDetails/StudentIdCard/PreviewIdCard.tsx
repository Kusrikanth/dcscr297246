import { useEffect, useRef } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { setTcRequestPreviewRes } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useAppSelector } from "../../../hooks/storehook";
import { printDocumentHandler } from "../../../utility/commonutility";
import { default as PrintSvg } from "../../../assets/imagesdps/academics/PrintSvg.svg?react";
import { previewStudentIdCardAct } from "../../../store/academic/languages/languagesactions";
import Button from "../../../Components/Common/Button";

const PreviewIdCard = (props: any) => {
    const printDivRef = useRef<any>(null);
    const { showApiLoader, currentBranchIdResp: branchId, currentInstIdResp: instituteId,
        previewStudentIdcardResp } =
        useAppSelector(({ appData, globalData, languagesInfo }) => ({
            showApiLoader: globalData.showApiLoader,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            previewStudentIdcardResp: languagesInfo.previewStudentIdcardResp,
        }), shallowEqual);

    const dispatch = useDispatch();

    useEffect(() => {
        const { idCardNo, isOpen } = props;
        if (idCardNo && isOpen) {
            dispatch(previewStudentIdCardAct(generateActionPayload("preview_idcard", { studentId: idCardNo })));
        }
    }, [props.idCardNo, props.isOpen])

    function printReceiptHndlr() {
        const innerHTMLContent: string = printDivRef.current?.innerHTML || "";
        printDocumentHandler(innerHTMLContent);
    }

    return (<div className="tw-p-3">
        <div className="tw-flex tw-flex-col tw-items-center tw-justify-center">
            {previewStudentIdcardResp && <div ref={printDivRef} dangerouslySetInnerHTML={{ __html: previewStudentIdcardResp }}></div>}
        </div>
        <div className="tw-flex tw-justify-center tw-p-3">
            <Button
                onClick={printReceiptHndlr}
                variant="warning"
            >
                <PrintSvg className="tw-mr-2 tw-inline-block" stroke="#FFFFFF" />
                Print ID Card
            </Button>
        </div>
    </div>)
}

export default PreviewIdCard;