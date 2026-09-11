import { useEffect } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { getCustomTcCertificateAct, setBonafideCumStudyCertificateRes } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useAppSelector } from "../../../hooks/storehook";
import { printDocumentHandler } from "../../../utility/commonutility";
import { default as PrintSvg } from "../../../assets/imagesdps/academics/PrintSvg.svg?react";
import { Button } from "../../../Components/Common";

const BonafideCumStudyCertiModal = (props: any) => {

    const { bonafideCerificates  }: any =
        useAppSelector(
            ({ classroomManagmentInfo, appData }) => ({
                 bonafideCerificates: classroomManagmentInfo.bonafideCerificates,

            }),
            shallowEqual
        );
    const dispatch = useDispatch();
    useEffect(() => {
        if (props.tcId && props.isOpen) {
            dispatch(setBonafideCumStudyCertificateRes(generateActionPayload('study_cum_bonafide',
                { tcRequestId: props.tcId, digitalSign: props.digitalSigned })))
        }
}, [props.tcId])

function printReceiptHndlr() {
        const innerHTMLContent: string = bonafideCerificates || "";
        printDocumentHandler(innerHTMLContent);
    }
    return (
        <>
            <div className='tw-flex tw-flex-col tw-items-center tw-justify-center tw-p-4'>
                {bonafideCerificates && (
                    <div
                        dangerouslySetInnerHTML={{ __html: bonafideCerificates }}
                        className='tw-mb-4 tw-w-full'
                    ></div>
                )}

                <Button
                    onClick={printReceiptHndlr}
                    variant="soft"
                >
                    <PrintSvg className="tw-inline-block tw-stroke-white" /> Print
                </Button>
            </div>
        </>
    )
}

export default BonafideCumStudyCertiModal;