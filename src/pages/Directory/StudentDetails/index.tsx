
import React, { useEffect, useMemo, useRef, useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import StudentImageStatic from "../../../assets/imagesdps/student-default-img.png";
import StudentBg from "../../../assets/imagesdps/student-bg.webp"

import { ModalContainerUpdated, SelectInput, StatusLabel, Tabs, UploadImage } from "../../../Components/Common";
import { Categories, tabsOptions } from "./helper";
//Assets

import StudentInfo from "./StudentInfo";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { getCurrentTimezoneYyyyMmDdFormat, getUpdatedMonthDateFormat } from "../../../utility/dateutility";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getBranchClassAct, getBrchSectionsAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { details } from "./StudentInfo/helper";
import { updateStudentAct } from "../../../store/directory/studentmanagement/studentmanagementactions";
import { uploadImageFileErrorHndlr } from "../../../utility/commonutility";
import OfflineTransferCertificateModal from "../../NewAcademics/TransferCertificate/OfflineTransferCertificateModal";
import NewBonafideCertificateModal from "../../NewAcademics/BonafideCertificate/NewBonafideCertificateModal";
import ChangeStreamModal from "../../NewAcademics/ChangeStream/ChangeStreamModal";
import ChangeCurriculumModal from "../../NewAcademics/ChangeCurriculum/ChangeCurriculumModal";
import ChangeCampusModal from "../../NewAcademics/ChangeCampus/ChangeCampusModal";
import StudentLedger from "./StudentLedger";
import ParentGuardian from "./ParentGuardian";
import ReportCard from "./ReportCard"
import Attendance from "./Attendance";
import { getLedgerDetailsAct } from "../../../store/fee/feecollections/feecollectionactions";
import { useModal } from "../../../hooks/modalhook";
import StudentImageUploadModal from "./StudentImageUploadModal";
import AcademicPerformance from "./AcademicPerformance";

// import { getUpdatedMonthDateFormat } from "../../../../utility/dateutility";

export default function StudentDetails() {
    const [activeTabId, setActiveTabId] = useState<string | null>("overview");
    const [userImageState, setUserImageState] = useState<any>("");
    const [userImageErrorState, setUserImageErrorState] = useState<any>("");
    const [sectionList, setSectionList] = useState<any>([]);
    const [category, setCategory] = useState('');
    const [openModals, setOpenModals] = useState({
        modalName: "",
        modalData: undefined
    })
    const { pathname } = useLocation();
    const pageTitleName = useMemo(() => {
        if (pathname.includes("student-management")) {
            return "Directory";
        }
        return "Front Desk";
    }, [pathname]);

    const dispatch = useDispatch();
    const params: any = useParams();

    function tabChangeHndlr(tabId: string) {
        setActiveTabId(tabId);
    }
    const [customActiveTab, setcustomActiveTab] = useState("1");
    const toggleCustom = (tab: any) => {
        if (customActiveTab !== tab) {
            setcustomActiveTab(tab);
        }
    };

    const openModal = (modalName: any) => {
        const modalData: any = {
            classId: getStudentByIdResp?.studentAcademicDetails?.classId, className: getStudentByIdResp?.studentAcademicDetails?.className, studentCode: getStudentByIdResp?.studentDetails?.studentCode, studentId: getStudentByIdResp?.studentDetails?.id, studentName: getStudentByIdResp?.studentDetails?.studentName, sectionId: getStudentByIdResp?.studentAcademicDetails?.sectionId, sectionName: getStudentByIdResp?.studentAcademicDetails?.sectionName, academicYearId: params?.academicYearId, curriculumId: getStudentByIdResp?.studentAcademicDetails?.curriculumId
        }
        setCategory(modalName);
        setOpenModals({ modalName: modalName, modalData: modalData });
    }
    const closeModal = () => {
        setOpenModals({ modalName: '', modalData: undefined });
    }
  const { closeModal: closeStudentImageUploadModal, modalState: studentImageUploadModalState, openModal: openStudentImageUploadModal } = useModal();

    const { getStudentByIdResp, updateStudentResp, addTcReqRes,
        currentInstIdResp: instituteId, affectedSection,
        currentBranchIdResp: branchId, studentManagementErrorResp, loggedInUserRole, classroomManagmentErrorResp, branchClassResp, brchSectionsResp } = useAppSelector(
            ({ directoryStudent, appData, branchAcademics, classroomManagmentInfo }) => ({
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
                loggedInUserRole: appData.loggedInUserRole,

            }),
            shallowEqual
        );

    const canCreateAndUpdate = useMemo(() => {
        return (loggedInUserRole !== 'EXAMINATION' && loggedInUserRole !== 'LIBRARY');
    }, [loggedInUserRole]);

    const StudentDetailsRef = useRef<any>({
        prevErrorStudentRep: studentManagementErrorResp
    });
    const StudentDetailsRespRef = useRef<any>({
        preUpdateStudentDetails: updateStudentResp,
        prevAddTcReqRes: addTcReqRes,
        prevClassroomManagmentErrorResp: classroomManagmentErrorResp
    });
    const StudentImage = useRef<any>({
        file: null
    });

    useEffect(() => {

        const { prevErrorStudentRep } =
            StudentDetailsRef.current;

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
            StudentDetailsRespRef.current;

        if (updateStudentResp && preUpdateStudentDetails !== updateStudentResp) {
            if (affectedSection === "Profile Picture") {
                const { data } = updateStudentResp,
                    { studentDetails } = data,
                    { imageBase64 } = studentDetails || {};
                    closeStudentImageUploadModal();
                toast.success('Student profile photo updated successfully.');
                if (imageBase64) {
                    setUserImageState(`data:image/png;base64,${imageBase64}`);
                }
            }
        }
        else if (addTcReqRes && addTcReqRes !== prevAddTcReqRes) {
            toast.success('New TC Request Added !');
            setOpenModals({ modalName: "", modalData: undefined });
        }
        else if (classroomManagmentErrorResp && classroomManagmentErrorResp !== prevClassroomManagmentErrorResp) {
            const { details } = classroomManagmentErrorResp;
            toast.error(details);
        }
        StudentDetailsRespRef.current.preUpdateStudentDetails = updateStudentResp;
        StudentDetailsRespRef.current.prevAddTcReqRes = addTcReqRes;
        StudentDetailsRespRef.current.prevClassroomManagmentErrorResp = classroomManagmentErrorResp;
    }, [updateStudentResp, affectedSection, addTcReqRes, , classroomManagmentErrorResp]);

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
            const payload = { branchId, curriculumId: getStudentByIdResp?.studentAcademicDetails?.curriculumId, academicYearId: params.academicYearId, pageNo: 0, pageSize: 100, sortBy: "className", orderBy: "asc" };
            dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            const payload1 = { branchId, academicYearId: params.academicYearId, branchCurriculumId: getStudentByIdResp?.studentAcademicDetails?.curriculumId, classId: getStudentByIdResp?.studentAcademicDetails?.classId, sortBy: "sectionName", orderBy: "asc", pageNo: 0, pageSize: 100 };
            dispatch(getBrchSectionsAct(generateActionPayload("get_brch_sections", undefined, payload1)));

            let newpayload = {
                studentId: getStudentByIdResp?.studentDetails?.id,
                branchId: branchId,
                academicYearId: params.academicYearId,
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
    }, [getStudentByIdResp])
    function handleFileUploadHnlr(event: any) {
        const file = event.target.files[0];
        let error = uploadImageFileErrorHndlr(file.size, file.type);
        // branchLogoFileRef.current = event.target.files[0];
        if (error === "") {
            StudentImage.current.file = URL.createObjectURL(file);
            // setUserImageState(URL.createObjectURL(file));
            setUserImageErrorState('')
            const formData = new FormData();
            const data: any = details(getStudentByIdResp, {}, { branchId, instituteId })
            formData.append("studentRequest", JSON.stringify(data));
            formData.append("studentImage", file);
            dispatch(updateStudentAct(generateActionPayload('update_students_by_id', undefined, formData, {
                affectedSection: "Profile Picture"
            })));
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

    function getActiveMenuComponent(menuId: string | null) {
        switch (menuId) {
            case "overview":
                return StudentInfo;
            case "student-ledger":
                return StudentLedger;
            case "parent-guardian":
                return ParentGuardian;
            case "attendance":
                return Attendance;
            case "report-card":
                return ReportCard;
            case "academic-performance":
                return AcademicPerformance
        }
    }
    useEffect(() => {
        brchSectionsResp && setSectionList(brchSectionsResp.data.find((section: any) => section.branchClassId === getStudentByIdResp?.studentAcademicDetails?.classId)?.sectionsResponse)
    }, [brchSectionsResp])

    const activeComponent = useMemo(() => {
        const TabComponent: any = getActiveMenuComponent(activeTabId);
        return (
            <TabComponent branchId={branchId}
                canCreateAndUpdate={canCreateAndUpdate}
                instituteId={instituteId} studentId={params.studentId}
                academicYearId={params.academicYearId} />
        );
    }, [activeTabId, canCreateAndUpdate]);

    return (<>
        <div className="page-content student-detail-container">
            <div className="tw-mx-auto tw-px-4">
                <BreadCrumb title="Student Details" pageTitle={pageTitleName} />

                {/* Student Header Card */}
                <div className="tw-grid tw-grid-cols-12">
                    <div className="tw-col-span-12">
                        <div className="tw-bg-white tw-rounded-lg tw-mb-3 tw-shadow">
                            <div className="tw-p-0">
                                {/* Top Background Section */}
                                <div
                                    className="tw-px-4 tw-flex tw-items-center tw-rounded-t-lg tw-relative"
                                    style={{
                                        width: "100%",
                                        minHeight: "97px",
                                        backgroundImage: `url(${StudentBg})`,
                                        backgroundPosition: "center",
                                        backgroundSize: "cover",
                                        backgroundRepeat: "no-repeat",
                                    }}
                                >
                                    <div
                                        className="tw-flex tw-items-center tw-absolute tw-w-full"
                                        style={{ top: "14px" }}
                                    >
                                        <div className="tw-flex tw-items-center">
                                            <div
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    openStudentImageUploadModal();
                                                }}
                                            >
                                                <UploadImage
                                                    name="user-image"
                                                    acceptFileFormat="image/png, image/jpeg"
                                                    value={userImageState || StudentImageStatic}
                                                    // onChange={handleFileUploadHnlr}
                                                    invalid={true}
                                                    error={userImageErrorState}
                                                />
                                            </div>
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

                                {/* Bottom Info Section */}
                                <div
                                    className="tw-flex tw-bg-white tw-rounded-b-lg tw-px-4 tw-pb-3"
                                    style={{ paddingTop: "26px" }}
                                >
                                    <div className="tw-flex tw-flex-wrap tw-flex-grow tw-me-2">
                                        <span className="tw-flex tw-items-center tw-me-4">
                                            <span className="tw-text-sm tw-me-1 tw-font-bold">
                                                Admission Number:
                                            </span>
                                            <span>
                                                {getStudentByIdResp &&
                                                    getStudentByIdResp.studentDetails.admissionNo}
                                            </span>
                                        </span>

                                        <span className="tw-flex tw-items-center tw-me-4">
                                            <span className="tw-text-sm tw-me-1 tw-font-bold">
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

                                        <span className="tw-flex tw-items-center tw-me-4">
                                            <span className="tw-text-sm tw-me-1 tw-font-bold">
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

                                        <span className="tw-flex tw-items-center tw-me-4">
                                            <span className="tw-text-sm tw-me-1 tw-font-bold tw-whitespace-nowrap">
                                                Roll Number:
                                            </span>
                                            <span>
                                                {getStudentByIdResp &&
                                                    getStudentByIdResp.studentAcademicDetails.rollNo}
                                            </span>
                                        </span>

                                        <span className="tw-flex tw-items-center tw-me-4">
                                            <span className="tw-text-sm tw-me-1 tw-font-bold tw-whitespace-nowrap">
                                                Date Of Birth:
                                            </span>
                                            <span className="tw-whitespace-nowrap">
                                                {getStudentByIdResp &&
                                                    getCurrentTimezoneYyyyMmDdFormat(
                                                        getStudentByIdResp.studentDetails.dob
                                                    )}
                                            </span>
                                        </span>

                                        <span className="tw-flex tw-items-center tw-me-4">
                                            <span className="tw-text-sm tw-me-1 tw-font-bold tw-whitespace-nowrap">
                                                JODO Student Id:
                                            </span>
                                            <span>
                                                {getStudentByIdResp &&
                                                    getStudentByIdResp.studentAcademicDetails.jodoStudentId}
                                            </span>
                                        </span>

                                        <span className="tw-flex tw-items-center tw-me-4">
                                            <span className="tw-text-sm tw-me-1 tw-font-bold tw-whitespace-nowrap">
                                                Status:
                                            </span>
                                            {getStudentByIdResp?.studentDetails
                                                ?.studentStatus && (
                                                    <StatusLabel
                                                        type={
                                                            getStudentByIdResp.studentDetails.studentStatus
                                                        }
                                                        labelName={
                                                            getStudentByIdResp.studentDetails.studentStatus
                                                        }
                                                    />
                                                )}
                                        </span>
                                    </div>

                                    {/* Action Dropdown */}
                                    {canCreateAndUpdate && <div className="tw-flex tw-justify-end tw-flex-shrink-0">
                                        <SelectInput
                                            name="category"
                                            labelText=""
                                            value={category}
                                            onChange={(event: any) =>
                                                openModal(event.target.value)
                                            }
                                            valueKey="id"
                                            textKey="value"
                                            menuItems={Categories}
                                            labelClass="tw-mb-0 tw-text-gray-400"
                                            formgroupClassName="tw-mb-0"
                                            defaultSelect="Select Action"
                                        />
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="tw-grid tw-grid-cols-12">
                    <div className="tw-col-span-12">
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
            id="offline-transfer-certificate-request"
            isOpen={openModals.modalName === "transferCertificate"}
            toggle={closeModal}
            modalTitle={"Offline Transfer Certificate Request"}
        >
            <OfflineTransferCertificateModal
                isOpen={openModals.modalName === "transferCertificate"}
                toggle={closeModal}
                modalTitle="Offline Transfer Certificate Request"
                instituteId={instituteId}
                instituteName={"Offline Transfer Certificate Request"}
                branchId={branchId}
                editBranchDetails={""}
                editCertificateDetails={openModals.modalData}
                requestType='OFFLINE'
                directory={true}
            // tcId={offlineTransferCertificateModalState.tcId}
            />
        </ModalContainerUpdated>
        <ModalContainerUpdated
            id="bonafide-certificate-modal"
            isOpen={openModals.modalName === "bonafideCertificate"}
            toggle={closeModal}
            modalTitle={'Add Request'}

        >
            <NewBonafideCertificateModal
                isOpen={openModals.modalName === "bonafideCertificate"}
                toggle={closeModal}
                modalTitle={'Add Request'}
                instituteId={instituteId}
                instituteName={""}
                branchId={branchId}
                directory={true}
                bonafideCertificateDetails={openModals.modalData}
            // bonafideId={newBonafideCertificateModalState.bonafideId}
            />
        </ModalContainerUpdated>
        <ModalContainerUpdated
            id="change-stream-modal"
            isOpen={openModals.modalName === "changeStream"}
            toggle={closeModal}
            modalTitle={'Change Stream'}
            modalSize="md"
        >
            <ChangeStreamModal
                isOpen={openModals.modalName === "changeStream"}
                toggle={closeModal}
                modalTitle="Change Stream"
                instituteId={instituteId}
                instituteName={"Change Stream"}
                branchId={branchId}
                requestDetails={""}
                directory={true}
                editChangeStreamDetails={openModals?.modalData}
            // filterData={changeStreamFilterState}
            />
        </ModalContainerUpdated>
        <ModalContainerUpdated
            id="bonafide-certificate-modal"
            isOpen={openModals.modalName === "changeCurriculum"}
            toggle={closeModal}
            modalTitle="Change Curriculum"
            modalSize="md"
        >
            <ChangeCurriculumModal
                isOpen={openModals.modalName === "changeCurriculum"}
                toggle={closeModal}
                modalTitle="Change Curriculum"
                instituteId={instituteId}
                instituteName={"Change Curriculum"}
                branchId={branchId}
                editBranchDetails={""}
                directory={true}
                editChangeCurriculumDetails={openModals?.modalData}
            // filterData={changeCurriculumFilterState}
            />
        </ModalContainerUpdated>
        <ModalContainerUpdated
            id="changecampus-modal"
            isOpen={openModals.modalName === "changeCampus"}
            toggle={closeModal}
            modalTitle={"Add Change Campus"}
        >
            <ChangeCampusModal
                toggle={closeModal}
                branchId={branchId}
                instituteId={instituteId}
                academicYearId={params?.academicYearId}
                directory={true}
                editChangeCampusDetails={openModals?.modalData}
            />
        </ModalContainerUpdated>
      <ModalContainerUpdated
        id="student-image"
        isOpen={studentImageUploadModalState.showModal}
        toggle={closeStudentImageUploadModal}
        modalTitle={studentImageUploadModalState.modalData ? "Edit Student Image" : "Add Student Image"}
        modalSize="md"
      >
        <StudentImageUploadModal
          id={studentImageUploadModalState.modalData}
          isOpen={false}
          toggle={closeStudentImageUploadModal}
          modalTitle="Student Image"
        />
      </ModalContainerUpdated>
    </>
    )
}