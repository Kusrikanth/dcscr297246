import { useEffect, useRef, useState } from "react";
import { Button, ConfirmationModal, StatusLabel } from "../../../../Components/Common";
import { useModal } from "../../../../hooks/modalhook";
import { getDateWithTimeFormat } from "../../../../utility/dateutility";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { getPreviewFolderFileDetailsAct, restoreBranchStorageFileAct } from "../../../../store/branchstorage/branchstoragemanagement/branchstoragemanagementactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";

const Versions = ({ previewDetails }: any) => {
    const dispatch = useAppDispatch();
    const { closeModal: closeDownloadProgressCardModal, modalState: downloadProgressCardModalState, openModal: openDownloadProgressCardModal } = useModal();
    const [selectedVersion, setSelectedVersion] = useState<any>(null);

    const versionList = previewDetails?.versions || [];

    const { restoreBranchStorageFileResp } = useAppSelector(
        ({ branchStorageManagement }) => ({
            restoreBranchStorageFileResp:
                branchStorageManagement.restoreBranchStorageFileResp,
        }),
        shallowEqual
    );

    const versionRef = useRef({
        prevRestoreBranchStorageFileResp: restoreBranchStorageFileResp,
    });

    useEffect(() => {
        const { prevRestoreBranchStorageFileResp } = versionRef.current;

        if (restoreBranchStorageFileResp && restoreBranchStorageFileResp !== prevRestoreBranchStorageFileResp) {
            toast.success(restoreBranchStorageFileResp?.data?.message || restoreBranchStorageFileResp.message || "File Restored successfully.");
            closeDownloadProgressCardModal();
            setSelectedVersion(null);
            const restoredFileId =
                restoreBranchStorageFileResp?.data?.fileId ??
                restoreBranchStorageFileResp?.fileId ??
                selectedVersion?.fileId;
            if (restoredFileId) {
                dispatch(
                    getPreviewFolderFileDetailsAct(
                        generateActionPayload("preview_folder_file_details", {
                            id: restoredFileId,
                        })
                    )
                );
            }
        }

        versionRef.current.prevRestoreBranchStorageFileResp =
            restoreBranchStorageFileResp;
    }, [restoreBranchStorageFileResp]);


    function restoreFileVersionSubmitHndlr() {
        if (!selectedVersion) return;

        const payload = {
            fileId: selectedVersion.fileId,
            folderId: previewDetails?.folderId,
            versionId: selectedVersion.id,
        };

        dispatch(
            restoreBranchStorageFileAct(
                generateActionPayload(
                    "restore_branch_storage_file_version",
                    { fileId: selectedVersion?.fileId, versionId: selectedVersion.id }
                )
            )
        );
    }
    return (
        <>
            <div className="tw-px-6">
                {versionList.map((item: any, index: number) => (
                    <div
                        key={item.id}
                        className={`tw-py-4 ${index !== versionList.length - 1
                            ? "tw-border-b tw-border-[#E5E7EB]"
                            : ""
                            }`}
                    >
                        <div className="tw-flex tw-items-start tw-justify-between">
                            <div>
                                <div className="tw-flex tw-items-center tw-gap-2 tw-mb-1">
                                    <span className="tw-text-[16px] tw-font-semibold tw-text-[#374151]">
                                        v{item.versionNo}.0
                                    </span>

                                    {item.isCurrentVersion && (
                                        <StatusLabel
                                            type="issued"
                                            labelName="Current"
                                        />
                                    )}
                                </div>

                                <div className="tw-text-[14px] tw-text-[#6B7280]">
                                    by {item.createdByName}
                                </div>

                                <div className="tw-text-[13px] tw-text-[#9CA3AF]">
                                    {item.createdAt
                                        ? getDateWithTimeFormat(`${item.createdAt}Z`)
                                        : "-"}{" "}
                                    · {item.sizeBytesConversion}
                                </div>
                            </div>

                            {!item.isCurrentVersion && (
                                <Button
                                    type="button"
                                    variant="sidebarMenu"
                                    className="tw-border-0 tw-bg-transparent tw-p-0 tw-text-[14px] tw-font-semibold tw-text-[#0AB39C]"
                                    onClick={() => {
                                        setSelectedVersion(item);
                                        openDownloadProgressCardModal();
                                    }}
                                >
                                    Restore
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <ConfirmationModal
                id="download-progress-card-modal"
                isOpen={downloadProgressCardModalState.showModal}
                confirmMessage={`Are you sure you want to restore version v${selectedVersion?.versionNo}.0?`}
                cancelHndlr={closeDownloadProgressCardModal}
                confirmHndlr={restoreFileVersionSubmitHndlr}
                showImgIcon={true}
                iconType="approve"
                btnClassName="!tw-bg-[#0ab39c] tw-text-white tw-w-24 tw-py-2 tw-rounded-md"
            />
        </>
    );
};

export default Versions