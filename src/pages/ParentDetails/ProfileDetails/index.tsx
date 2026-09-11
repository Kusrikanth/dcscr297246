
import React, { useEffect, useMemo, useRef, useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

import { CropModal, ModalContainerUpdated, SelectInput, StatusLabel, Tabs, UploadImage } from "../../../Components/Common";
import { Categories, tabsOptions } from "./helper";
//Assets
import DefaultStudentImage from "../../../assets/imagesdps/student-default-img.png";

// import StudentInfo from "./StudentInfo";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { getCurrentTimezoneYyyyMmDdFormat, getUpdatedMonthDateFormat } from "../../../utility/dateutility";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ParentProfile from "./ParentProfile/index"
import { getBranchClassAct, getBrchSectionsAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { details } from "./ParentProfile/Overview/helper";
import { getParentChildrensAct, getStudentByIdAct, setGetStudentByIdAct, updateStudentAct } from "../../../store/directory/studentmanagement/studentmanagementactions";
import { uploadImageFileErrorHndlr } from "../../../utility/commonutility";

import { getLedgerDetailsAct } from "../../../store/fee/feecollections/feecollectionactions";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { useModal } from "../../../hooks/modalhook";
import UpdateWhatsappNumber from "./UpdateWhatsappNumber";
import Attendance from "./Attendance/index";
import ExaminationInfo from "./Examination";
import TimeTable from "../../TimeTableManagement/PreviewTimeTable";

// import { getUpdatedMonthDateFormat } from "../../../../utility/dateutility";

const ParentProfileDetails = () => {
    const [activeTabId, setActiveTabId] = useState<string | null>("overview");
    const [userImageState, setUserImageState] = useState<any>("");
    const [userImageErrorState, setUserImageErrorState] = useState<any>("");
    const [sectionList, setSectionList] = useState<any>([]);

    const { modalState: whatsappNoModalState, closeModal: closeWhatsappModalHndlr,
        openModal: openWhatsappModalHndlr
    } = useModal();

    const { closeModal: closeCropModalState, modalState: cropModalState, openModal: openCropModalState } = useModal();

    const dispatch = useDispatch();
    const params: any = useParams();

    function tabChangeHndlr(tabId: string) {
        setActiveTabId(tabId);
    }


    const { getStudentByIdResp, updateStudentResp, affectedSection, addTcReqRes,
        currentInstIdResp: instituteId,
        currentBranchIdResp: branchId, studentManagementErrorResp, classroomManagmentErrorResp, branchClassResp, brchSectionsResp, userMeResp, parentChildrensResp, currentStudentId, academicYearListResp } = useAppSelector(
            ({ directoryStudent, appData, branchAcademics, classroomManagmentInfo, login, instAcademics }) => ({
                getStudentByIdResp: directoryStudent.getStudentByIdResp,
                updateStudentResp: directoryStudent.updateStudentResp,
                affectedSection: directoryStudent.affectedSection,
                studentManagementErrorResp: directoryStudent.studentManagementErrorResp,
                branchClassResp: branchAcademics.branchClassResp,
                brchSectionsResp: branchAcademics.brchSectionsResp,
                addTcReqRes: classroomManagmentInfo.addTcReqRes,
                classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
                currentInstIdResp: appData.currentInstIdResp,
                currentBranchIdResp: appData.currentBranchIdResp,
                currentStudentId: appData.currentStudentId,
                parentChildrensResp: directoryStudent.parentChildrensResp,
                userMeResp: login.userMeResp,
                academicYearListResp: instAcademics.academicYearListResp,
            }),
            shallowEqual
        );
    const StudentDetailsRef = useRef<any>({
        prevErrorStudentRep: studentManagementErrorResp
    });
    const studentDetailsRespRef = useRef<any>({
        preUpdateStudentDetails: updateStudentResp,
        prevAddTcReqRes: addTcReqRes,
        prevCurrentStudentId: undefined,
        prevClassroomManagmentErrorResp: classroomManagmentErrorResp
    });

    useEffect(() => {
        const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
        dispatch(
            getInstAcademicYearAct(
                generateActionPayload("get_inst_academic_year", undefined, payload)
            )
        );
        return () => {
            dispatch(setGetStudentByIdAct(undefined));
        }
    }, [])

    useEffect(() => {
        const { prevCurrentStudentId } = studentDetailsRespRef.current;
        if (currentStudentId && prevCurrentStudentId !== currentStudentId) {
            if (Array.isArray(parentChildrensResp) && parentChildrensResp.length > 0) {
                const { academicYearId } = parentChildrensResp.find(item => item.childId?.toString() === currentStudentId?.toString());
                dispatch(getStudentByIdAct(generateActionPayload("get_students_by_id",
                    { studentId: currentStudentId }, { academicYearId: academicYearId })));
                studentDetailsRespRef.current.prevCurrentStudentId = currentStudentId;
            }
        }
    }, [parentChildrensResp, currentStudentId]);

    useEffect(() => {
        const { prevErrorStudentRep } = StudentDetailsRef.current;
        if (studentManagementErrorResp &&
            prevErrorStudentRep !== studentManagementErrorResp) {
            // if (affectedSection === "Employee Details") {
            const { details } = studentManagementErrorResp;
            toast.error(details);
            // UpdateHandler();
            // }
        }
        StudentDetailsRef.current.prevErrorStudentRep = studentManagementErrorResp;
    }, [studentManagementErrorResp]);

    useEffect(() => {

        const { preUpdateStudentDetails, prevAddTcReqRes, prevClassroomManagmentErrorResp } =
            studentDetailsRespRef.current;

        if (updateStudentResp &&
            preUpdateStudentDetails !== updateStudentResp) {
            if (affectedSection === "Profile Picture") {
                const { data } = updateStudentResp,
                    { studentDetails } = data,
                    { imageBase64 } = studentDetails || {};
                toast.success('Student profile photo updated successfully.');
                if (imageBase64) {
                    setUserImageState(`data:image/png;base64,${imageBase64}`);
                }
            }
        }
        else if (classroomManagmentErrorResp && classroomManagmentErrorResp !== prevClassroomManagmentErrorResp) {
            const { details } = classroomManagmentErrorResp;
            toast.error(details);
        }
        studentDetailsRespRef.current.preUpdateStudentDetails = updateStudentResp;
        studentDetailsRespRef.current.prevAddTcReqRes = addTcReqRes;
        studentDetailsRespRef.current.prevClassroomManagmentErrorResp = classroomManagmentErrorResp;
    }, [updateStudentResp, addTcReqRes, affectedSection, classroomManagmentErrorResp]);


    // useEffect(() => {
    //     setUserImageState(getStudentByIdResp && getStudentByIdResp?.studentPhoto?.s3URL ? `${getStudentByIdResp?.studentPhoto?.s3URL}` : StudentImageStatic)
    // }, [getStudentByIdResp])

    useEffect(() => {
        if (getStudentByIdResp) {
            const { studentDetails } = getStudentByIdResp,
                { studentImageBase64 } = studentDetails || {};
            if (studentImageBase64) {
                setUserImageState(`data:image/png;base64,${studentImageBase64}`);
            }
        }
        // setUserImageState(getStudentByIdResp && getStudentByIdResp?.studentPhoto?.s3URL ? `${getStudentByIdResp?.studentPhoto?.s3URL}` : StudentImageStatic)
    }, [getStudentByIdResp])

    useEffect(() => {
        if (getStudentByIdResp) {
            const payload = { branchId, curriculumId: getStudentByIdResp?.studentAcademicDetails?.curriculumId, pageNo: 0, pageSize: 100, sortBy: "className", orderBy: "asc" };
            dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            const { academicYearId } = parentChildrensResp.find(item => item.childId?.toString() === currentStudentId?.toString());
            const payload1 = { branchId, academicYearId , branchCurriculumId: getStudentByIdResp?.studentAcademicDetails?.curriculumId, classId: getStudentByIdResp?.studentAcademicDetails?.classId, sortBy: "sectionName", orderBy: "asc", pageNo: 0, pageSize: 100 };
            dispatch(getBrchSectionsAct(generateActionPayload("get_brch_sections", undefined, payload1)));

            let newpayload = {
                studentId: getStudentByIdResp?.studentDetails?.id,
                branchId: branchId,
                academicYearId: params.academicYearId || 9,
                studentInfo: "studentInfo",
                allowStudentConcession: "",
                allowEmployeeConcession: "",
                allowRefund: "",
                feeType: [],
                // instituteDeptId: [1, 4],
                instituteDeptNames: ["ACADEMICS", "TRANSPORT"],
                paymentStatus: ""
            }
            dispatch(getLedgerDetailsAct(generateActionPayload('ledger_details', undefined, newpayload)));

        }
    }, [getStudentByIdResp]);

    function handleFileUploadHnlr(event: any) {
        const file = event.target.files[0];
        event.currentTarget.value = null;
        let error = uploadImageFileErrorHndlr(file.size, file.type);
        // branchLogoFileRef.current = event.target.files[0];
        if (error === "") {
            // setUserImageState(URL.createObjectURL(file));
            setUserImageErrorState('');
            const previewUrl = URL.createObjectURL(file);
            const image = new Image();
            image.src = previewUrl;
            image.onload = () => {
                openCropModalState({
                    imageName: file?.name,
                    imageType: file.type,
                    imageSrc: previewUrl || ''
                });
            };
        }
        else {
            // if(!(file.type==="image/jpeg"||file.type==="image/png")){
            //     setUserImageErrorState('please select only png or jpeg format')
            // }
            // else if(file.size>1000000){
            //     setUserImageErrorState('please select less than 1MB sized image')
            // }
            setUserImageErrorState(error);
        }

    }

    function uploadCroppedImgHndlr(blobFile: any) {
        const imgUrl = URL.createObjectURL(blobFile);
        const newImage = new File([blobFile], blobFile.name, { type: blobFile.type });
        
        setUserImageState(imgUrl);
        
        const formData = new FormData();
        const data: any = details(getStudentByIdResp, {}, { branchId, instituteId })
        formData.append("studentRequest", JSON.stringify(data));
        formData.append("studentImage", newImage);
        dispatch(updateStudentAct(generateActionPayload('update_students_by_id', undefined, formData, {
            affectedSection: "Profile Picture"
        })));
        
        closeCropModalState();
    }

    function getActiveMenuComponent(menuId: string | null) {
        switch (menuId) {
            case "overview":
                return ParentProfile;
            case "attendance":
                return Attendance;
            case "examination":
                return ExaminationInfo;
            case "timetable":
                return TimeTable;

        }
    }

    useEffect(() => {
        brchSectionsResp && setSectionList(brchSectionsResp.data.find((section: any) => section.branchClassId === getStudentByIdResp?.studentAcademicDetails?.classId)?.sectionsResponse)
    }, [brchSectionsResp])

    const selectedChild = useMemo(() => {
        if (Array.isArray(parentChildrensResp) && parentChildrensResp.length > 0) {
            return parentChildrensResp.find(item => item.childId?.toString() === currentStudentId?.toString());
        }
        return null;
    }, [parentChildrensResp, currentStudentId]);

    const activeComponent = useMemo(() => {
        const TabComponent: any = getActiveMenuComponent(activeTabId);
        if (selectedChild) {
            return (
                <TabComponent branchId={selectedChild?.childBranchId}
                    instituteId={instituteId} studentId={currentStudentId}
                    academicYearId={selectedChild?.academicYearId} />
            );
        }

    }, [activeTabId, selectedChild, academicYearListResp]);

    function onCloseWhatsappModalHndlr(apiCall: any) {
        if (typeof apiCall === 'boolean' && apiCall) {
            let academicYearId: any = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT")?.academicYearId
            dispatch(getStudentByIdAct(generateActionPayload("get_students_by_id",
                { studentId: currentStudentId }, { academicYearId: academicYearId })));
        }
        closeWhatsappModalHndlr();
    }

    const { studentDetails } = getStudentByIdResp || {},
        { whatsappNo } = studentDetails || {};
    return (
        <>
            <div className="page-content student-detail-container">
                <div className="container-fluid">
                    <BreadCrumb title="Student Details" pageTitle="Parent" />
                    {getStudentByIdResp && !whatsappNo && (
                        <div className="marquee-container tw-bg-[#405189] tw-text-white tw-overflow-hidden tw-relative tw-py-2">
                            <div className="tw-whitespace-nowrap tw-animate-[marquee_15s_linear_infinite]">
                                Update your WhatsApp number to receive notifications directly on WhatsApp.
                                <span onClick={openWhatsappModalHndlr} className="tw-text-blue-500 tw-ml-1 tw-cursor-pointer">Click here.</span>
                            </div>
                        </div>)}
                    <div className="tw-grid tw-grid-cols-12">
                        <div className="tw-col-span-12">
                            <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-3">
                                <div className="tw-p-0">
                                    <div
                                        className="tw-px-4 tw-flex tw-items-center tw-rounded-t-lg tw-relative tw-w-full tw-min-h-[97px]"
                                        style={{ backgroundColor: "#405367" }}
                                    >
                                        <div className="tw-flex tw-items-center tw-absolute tw-w-full tw-top-[14px]">
                                            <div className="tw-flex tw-items-center">
                                                {/* <div
                                                className="avatar-md bg-white flex-shrink-0 avatar-shadow rounded-circle p-1 me-2"> */}
                                                {/* <img
                                                    src={getStudentByIdResp && getStudentByIdResp.studentDetails.studentImageBase64 ? `data:image/png;base64,${getStudentByIdResp.studentDetails.studentImageBase64}` : StudentImage}
                                                    className="img-fluid d-block rounded-circle h-100"
                                                /> */}
                                                 <UploadImage
                                                    name="user-image"
                                                    acceptFileFormat="image/png, image/jpeg"
                                                    value={userImageState || DefaultStudentImage}
                                                    onChange={handleFileUploadHnlr}
                                                    invalid={true}
                                                    error={userImageErrorState}
                                                    isDisabled={false}
                                                />
                                                {/* </div> */}
                                            </div>
                                            <div className="tw-flex tw-flex-col tw-text-white tw-ml-3">
                                                <h5 className="tw-text-white tw-mb-0 tw-font-normal">
                                                    {getStudentByIdResp &&
                                                        getStudentByIdResp.studentDetails.studentName}
                                                </h5>
                                                <span>
                                                    {getStudentByIdResp &&
                                                        getStudentByIdResp.studentDetails.studentCode}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tw-flex tw-bg-white tw-rounded-b-lg tw-px-4 tw-pb-3 tw-pt-[26px]">
                                        <div className="tw-flex tw-flex-wrap tw-flex-1 tw-mr-2 tw-gap-y-2">
                                            <span className="tw-flex tw-items-center tw-mr-4">
                                                <span className="tw-text-sm tw-mr-1 tw-font-bold">
                                                    Admission Number:
                                                </span>
                                                <span>
                                                    {getStudentByIdResp &&
                                                        getStudentByIdResp.studentDetails.admissionNo}
                                                </span>
                                            </span>

                                            <span className="tw-flex tw-items-center tw-mr-4">
                                                <span className="tw-text-sm tw-mr-1 tw-font-bold">
                                                    Class:
                                                </span>
                                                <span>
                                                    {getStudentByIdResp &&
                                                        branchClassResp &&
                                                        branchClassResp.content.find(
                                                            (cls: any) =>
                                                                cls.id ===
                                                                getStudentByIdResp.studentAcademicDetails.classId
                                                        )?.shortName}
                                                </span>
                                            </span>
                                            <span className="tw-flex tw-items-center tw-mr-4">
                                                <span className="tw-text-sm tw-mr-1 tw-font-bold">
                                                    Section:
                                                </span>
                                                <span>
                                                    {getStudentByIdResp &&
                                                        sectionList &&
                                                        sectionList.find(
                                                            (section: any) =>
                                                                section.sectionId ===
                                                                getStudentByIdResp.studentAcademicDetails.sectionId
                                                        )?.sectionName}
                                                </span>
                                            </span>
                                            <span className="tw-flex tw-items-center tw-mr-4">
                                                <span className="tw-text-sm tw-mr-1 tw-font-bold tw-whitespace-nowrap">
                                                    Roll Number:
                                                </span>
                                                <span>
                                                    {getStudentByIdResp &&
                                                        getStudentByIdResp.studentAcademicDetails.rollNo}
                                                </span>
                                            </span>
                                            <span className="tw-flex tw-items-center tw-mr-4">
                                                <span className="tw-text-sm tw-mr-1 tw-font-bold tw-whitespace-nowrap">
                                                    Date Of Birth:
                                                </span>
                                                <span className="tw-whitespace-nowrap">
                                                    {getStudentByIdResp &&
                                                        getCurrentTimezoneYyyyMmDdFormat(
                                                            getStudentByIdResp.studentDetails.dob
                                                        )}
                                                </span>
                                            </span>
                                            <span className="tw-flex tw-items-center tw-mr-4">
                                                <span className="tw-text-sm tw-mr-1 tw-font-bold tw-whitespace-nowrap">
                                                    JODO Student Id:
                                                </span>
                                                <span>
                                                    {getStudentByIdResp &&
                                                        getStudentByIdResp.studentAcademicDetails.jodoStudentId}
                                                </span>
                                            </span>

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="tw-grid tw-grid-cols-1">
                        <div className="tw-col-span-1">
                            <Tabs
                                activeTabId={activeTabId}
                                tabChangeHndlr={tabChangeHndlr}
                                tabsList={tabsOptions}
                                navContainerClass="nav-tabs tw-mb-2"
                            />
                        </div>
                    </div>

                    {activeComponent}
                </div>
            </div>

            <ModalContainerUpdated
                id="updatewhatsappno-modal"
                isOpen={whatsappNoModalState.showModal}
                toggle={closeWhatsappModalHndlr}
                modalTitle="Update Whatsapp Number"
                modalSize="md"
            >
                <UpdateWhatsappNumber
                    studentId={studentDetails?.id}
                    closeModal={onCloseWhatsappModalHndlr}
                />
            </ModalContainerUpdated>

            <ModalContainerUpdated
                id="upload-new-image-modal"
                isOpen={cropModalState.showModal}
                toggle={closeCropModalState}
                modalTitle="Upload Image"
                modalSize="md"
            >
                <CropModal
                    closeModalHndler={closeCropModalState}
                    modalData={cropModalState.modalData}
                    uploadCroppedImgHndlr={uploadCroppedImgHndlr}
                />
            </ModalContainerUpdated>

        </>
    )
}

export default ParentProfileDetails;