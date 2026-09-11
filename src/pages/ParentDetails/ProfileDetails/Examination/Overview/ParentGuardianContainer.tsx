import React, { useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { ConfirmationModal } from "../../../../../Components/Common";
import NoDataComp from "../../../../../Components/Common/NoDataComp";
import Admitcard from "../../../../../assets/imagesdps/modulesettings/admitcard.svg";
import { useModal } from "../../../../../hooks/modalhook";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { downloadAdmitCardAct, getAdmitCardDetailsAct } from "../../../../../store/examination/examinationmanagement/examinationmanagementactions";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import Button from "../../../../../Components/Common/Button";

interface IAcademicDetails {
    studentId: number;
    academicYearId: string;
    branchId: number;
    instituteId: number;
    divId: string;
}

const colorsList = [
    { color: "#4A90E2", bgIconColor: "#E5EFFF80" },
    { color: "#B97DFA", bgIconColor: "#F8F2FE" },
    { color: "#69D6A2", bgIconColor: "#ECFCF5" },
    { color: "#FA6A92", bgIconColor: "#FEEEF6" },
];

const ParentGuardianCard: React.FC<IAcademicDetails> = ({ divId }) => {

    const dispatch = useAppDispatch();
    const { closeModal: closeDownloadAdmitCardModal, modalState: downloadAdmitCardModalState, openModal: openDownloadAdmitCardModal } = useModal()

    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, currentStudentId, parentChildrensResp, userMeResp, getAdmitCardDetailsResp, showApiLoader, downloadAdmitCardResp, examinationManagementErrorResp } =
        useAppSelector(
            ({ appData, directoryStudent, login, examinationManagement, globalData }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                currentStudentId: appData.currentStudentId,
                parentChildrensResp: directoryStudent.parentChildrensResp,
                userMeResp: login.userMeResp,
                getAdmitCardDetailsResp: examinationManagement.getAdmitCardDetailsResp,
                downloadAdmitCardResp: examinationManagement.downloadAdmitCardResp,
                examinationManagementErrorResp: examinationManagement.examinationManagementErrorResp,
                showApiLoader: globalData.showApiLoader,
            }),
            shallowEqual
        );

    const admitCardRef = useRef({
        prevExaminationManagementErrorResp: examinationManagementErrorResp,
        prevDownloadAdmitCardResp: downloadAdmitCardResp,
    })

    useEffect(() => {
        const { prevDownloadAdmitCardResp, prevExaminationManagementErrorResp } = admitCardRef.current || {}

        if (downloadAdmitCardResp && prevDownloadAdmitCardResp !== downloadAdmitCardResp) {
            const { fileURL } = downloadAdmitCardResp || {}
            if (fileURL) {
                toast.success("Admit Card Downloaded Successfully")
                window.open(fileURL, "_blank")
            }
            closeDownloadAdmitCardModal()
        }
        else if (examinationManagementErrorResp && prevExaminationManagementErrorResp !== examinationManagementErrorResp) {
            const { details } = examinationManagementErrorResp || {}
            toast.error(details || "Something went wrong")
        }

        admitCardRef.current.prevDownloadAdmitCardResp = downloadAdmitCardResp;
        admitCardRef.current.prevExaminationManagementErrorResp = examinationManagementErrorResp;
    }, [downloadAdmitCardResp, examinationManagementErrorResp])

    useEffect(() => {
        if (parentChildrensResp) {
            parentChildrensResp?.map((item: any) => {
                if (+item?.childId === +currentStudentId) {
                    const { academicYearId, childBranchId, childId, classId, curriculumId, instituteId } = item || {}
                    const payload = {
                        branchId: childBranchId, academicYearId, curriculumId, instituteId, classId, studentId: childId, pageNo: 0, pageSize: 100,
                    };
                    dispatch(getAdmitCardDetailsAct(generateActionPayload("get_cbse_admit_card_details", undefined, payload)))
                }
            })
        }
    }, [parentChildrensResp])

    const confirmDonloadAdmitCardHndler = () => {
        const findData = parentChildrensResp?.find((item: any) => +item?.childId === +currentStudentId);
        const { academicYearId, childBranchId, childId, classId, curriculumId, instituteId } = findData || {};
        const { examinationId } = downloadAdmitCardModalState.modalData || {};
        const payload = { branchId: childBranchId, academicYearId, curriculumId, instituteId, classId, studentId: childId,examinationId, viewType: "DOWNLOAD",sourceType : "parent" };
        dispatch(downloadAdmitCardAct(generateActionPayload("download_admit_card", undefined, payload)));
    }

    return (
        <div id={divId}>
            <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 xl:tw-grid-cols-4 tw-gap-4 tw-w-full tw-pb-4 tw-pt-1 tw-mb-2">
                {Array.isArray(getAdmitCardDetailsResp?.content) && getAdmitCardDetailsResp?.content?.length > 0 ? (
                    getAdmitCardDetailsResp?.content?.map((item: any, index: number) => (
                        <div
                            key={`${item?.admitCardNo}-${index}`}
                            className="tw-overflow-x-auto tw-whitespace-nowrap tw-p-[10px]"
                        >
                            <div className="tw-flex" style={{ gap: "10px" }}>
                                <div
                                    className="tw-relative tw-p-3 tw-rounded-2xl tw-shadow-lg tw-border-0 tw-overflow-hidden"
                                    style={{ minWidth: "290px" }}
                                >
                                    <div
                                        className="tw-px-1 tw-py-2 tw-flex tw-justify-center tw-rounded-xl"
                                        style={{ backgroundColor: colorsList[index % 4].bgIconColor, display: "inline-block", width: "22%" }}
                                    >
                                        <div
                                            className="tw-p-2 tw-flex tw-justify-center tw-rounded-xl"
                                            style={{ backgroundColor: colorsList[index % 4].color, display: "inline-block", width: "70%" }}
                                        >
                                            <img src={Admitcard} alt="test-icon" width="25" height="25" />
                                        </div>
                                    </div>
                                    <div className="tw-my-3">
                                        <h5 className="tw-text-[17px] tw-mb-1 tw-font-semibold">{item?.examinationName || "-"}</h5>
                                        <p className="tw-text-gray-500 tw-mb-3">{item?.date}</p>
                                    </div>
                                    <Button
                                    variant="soft"
                                        onClick={() => openDownloadAdmitCardModal(item)}
                                        style={{ width: "40%", borderRadius: "10px" }}
                                    >
                                        Download
                                    </Button>
                                    <div
                                        className="tw-absolute"
                                        style={{
                                            width: "150px",
                                            height: "150px",
                                            background: `radial-gradient(circle, rgba(255, 255, 255, 0.2) 1%, ${colorsList[index % 4].color} 50%)`,
                                            borderRadius: "50%",
                                            opacity: "0.2",
                                            bottom: "-20px",
                                            right: "-20px",
                                            transform: "translate(20%, 20%)",
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <NoDataComp />
                )}
            </div>
            <ConfirmationModal
                id="download-admit-card-parent-modal"
                isOpen={downloadAdmitCardModalState.showModal}
                confirmMessage={`Are you sure you want to Download Admit Card ?`}
                cancelHndlr={closeDownloadAdmitCardModal}
                confirmHndlr={confirmDonloadAdmitCardHndler}
                isDisble={showApiLoader}
                showImgIcon={true}
                iconType="approve"
                btnClassName="btn w-sm btn-success"
            />
        </div>
    );
};

export default ParentGuardianCard;
