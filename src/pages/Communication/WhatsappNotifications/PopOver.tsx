import { Popover, PopoverBody, PopoverHeader } from 'reactstrap'
import { useAppDispatch } from '../../../hooks/storehook';
import { useModal } from '../../../hooks/modalhook';
import { ModalContainerUpdated } from '../../../Components/Common';
import ShowStudents from './ShowStudents';

const fontColor = (type: string) => {
    switch (type?.toLowerCase()) {
        case "success":
            return "#0AB39C";
        case "total":
            return "#299CDB";
        case "failed":
            return "#f06548";
        default:
            return "#212529";
    }
};

const PopOver = (props: any) => {
    const dispatch = useAppDispatch();
    const { modalState: collectedStatusModalState, closeModal: closeCollectedStatusHndlr, openModal: openCollectedStatusHndlr } = useModal();
    return (
        <>
            <Popover
                placement="right"
                target={`testing-${props.id}`}
                isOpen={props.popOver}
            >
                <PopoverBody className="p-0">
                    <table className="table mb-0">
                        <tbody>
                            <tr className="bg-light">
                                <th className="p-2">Overview Stats</th>
                                <th></th>
                            </tr>
                            {/* <tr>
                            <td
                                className="p-2"
                                style={{ color: fontColor("total") }}
                            >
                                Total :
                            </td>
                            <td
                                className="p-2"
                                style={{ color: fontColor("total") }}
                            >
                                {props?.data?.Total ?? 0}
                            </td>
                        </tr> */}
                            <tr>
                                <td
                                    className="p-2"
                                    style={{ color: fontColor("success") }}
                                >
                                    Success :
                                </td>
                                <td
                                    className="p-2 cursor-pointer"
                                    style={{ color: fontColor("success") }}
                                    onClick={() =>
                                        openCollectedStatusHndlr({
                                            waOrderRef: props.waOrderRef,
                                            recipientType: props.recipientType,
                                            status: "SENT",
                                        })
                                    }
                                >
                                    {props?.data?.Success ?? 0}
                                </td>
                            </tr>
                            <tr>
                                <td
                                    className="p-2"
                                    style={{ color: fontColor("failed") }}
                                >
                                    Failed :
                                </td>
                                <td
                                    className="p-2 cursor-pointer"
                                    style={{ color: fontColor("failed") }}
                                    onClick={() =>
                                        openCollectedStatusHndlr({
                                            waOrderRef: props.waOrderRef,
                                            recipientType: props.recipientType,
                                            status: "FAILED",
                                        })
                                    }
                                >
                                    {props?.data?.Failed ?? 0}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </PopoverBody>
            </Popover>
            <ModalContainerUpdated
                id="sms-confirmation-modal"
                isOpen={collectedStatusModalState.showModal}
                toggle={closeCollectedStatusHndlr}
                modalTitle="WhatsApp Campaign Recipients List"
                modalSize="lg"
            >
                <ShowStudents
                    isOpen={collectedStatusModalState.showModal}
                    toggle={closeCollectedStatusHndlr}
                    modalData={collectedStatusModalState.modalData}
                />
            </ModalContainerUpdated>
        </>
    );
};

export default PopOver
