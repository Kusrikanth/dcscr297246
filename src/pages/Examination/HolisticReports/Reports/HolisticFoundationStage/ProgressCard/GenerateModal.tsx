import { shallowEqual } from "react-redux";
import { useAppSelector } from "../../../../../../hooks/storehook";
import { useEffect, useState } from "react";
import { default as ApproveSvg } from "../../../../../../assets/imagesdps/academics/ApproveSvg.svg?react";


const GenerateModal = ({ previewProgressCardsForCbse, isSingleStu, id }: any) => {
    
    const [systemFileId, setSystemFileId] = useState<string | undefined>(undefined);  
    useEffect(() => {
        if (id) {
            setSystemFileId(id);
        }
    }, [id]);

    const {
        showApiLoader
    } = useAppSelector(
        ({ globalData }) => ({
            showApiLoader: globalData.showApiLoader,
        }),
        shallowEqual
    );

    return (
        <>
            <div className="modal-body">
                <div className="mt-2 text-center">
                    <div className="fs-15">
                        {<div className="d-flex mb-3 justify-content-center"> <ApproveSvg fill="#0ab39c" width={"70px"} height="70px" /> </div>}
                        <h4>{"Are you sure?"}</h4>
                        <p className="text-muted mb-0">
                            You want to proceed with this action ?
                        </p>
                    </div>
                </div>
            </div>
            <div className="row w-100 d-flex justify-content-center pb-4">
                <div className="d-flex gap-2 w-auto justify-content-center mx-4 my-3">
                    <button
                        disabled={showApiLoader}
                        className="btn btn-info me-2"
                        onClick={() => previewProgressCardsForCbse("PREVIEW", {}, systemFileId, isSingleStu)}
                    >
                        View
                    </button>
                    <button
                        disabled={showApiLoader}
                        className="btn btn-success"
                        onClick={() => previewProgressCardsForCbse("DOWNLOAD", {}, systemFileId, isSingleStu)}
                    >
                        Download
                    </button>
                </div>
            </div>
        </>
    );
};

export default GenerateModal;
