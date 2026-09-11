
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ModalContainerUpdated, } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { useHistory } from "react-router-dom";
import { shallowEqual, useDispatch } from "react-redux";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppSelector } from "../../../hooks/storehook";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import { downloadStaticHealthFormAct, getHealthFormListAct, updateHealthFormStatusAct } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import AddHealthForm from "./AddHealthForm";
import { generateColumns } from "./helper";
import Button from "../../../Components/Common/Button";



const HealthForm = () => {

    const dispatch = useDispatch();

    const pagination: any = useRef<any>({
        pageNo: 0,
        pageSize: 10
    })
    const [addHealthFormModal, setAddHealthFormModal] = useState<any>({
        showModal: false,
        applicationId: undefined
    })

    const [currentStudent, setCurrentStudent] = useState<boolean>(false);
    const [healthFormList, setHealthFormList] = useState<any>([]);

    const {
        currentInstIdResp: instituteId,
        showApiLoader,
        saveHealthFormResp,
        classroomManagmentErrorResp,
        getHealthFormListResp,
        currentStudentId,
        parentChildrensResp,
        downloadStaticHealthResp,
    }: any = useAppSelector(
        ({ globalData, appData, classroomManagmentInfo, directoryStudent }) => ({
            currentInstIdResp: appData.currentInstIdResp,
            currentStudentId: appData.currentStudentId,
            showApiLoader: globalData.showApiLoader,
            saveHealthFormResp: classroomManagmentInfo.saveHealthFormResp,
            classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
            getHealthFormListResp: classroomManagmentInfo.getHealthFormListResp,
            downloadStaticHealthResp: classroomManagmentInfo.downloadStaticHealthResp,
            parentChildrensResp: directoryStudent.parentChildrensResp,
        }),
        shallowEqual
    );

    const HealthFormVerifyRef = useRef<any>({
        prevSaveHealthFormResp: saveHealthFormResp,
        prevDownloadStaticHealthResp: downloadStaticHealthResp,
        prevClassroomManagmentErrorResp: classroomManagmentErrorResp || {},
        prevGetHealthFormListResp: getHealthFormListResp || {},
    });

    useEffect(() => {
        const { prevSaveHealthFormResp, prevClassroomManagmentErrorResp, prevGetHealthFormListResp, prevDownloadStaticHealthResp } = HealthFormVerifyRef.current;

        if (saveHealthFormResp && saveHealthFormResp !== prevSaveHealthFormResp) {
            toast.success("Health Form request added successfully. ");
            toggleAddHealthFormModal();
            HealthFormVerifyList();
        }

        else if (getHealthFormListResp && getHealthFormListResp !== prevGetHealthFormListResp) {
            setHealthFormList(getHealthFormListResp?.content || [])
        }
        else if (classroomManagmentErrorResp && classroomManagmentErrorResp !== prevClassroomManagmentErrorResp) {
            const { details } = classroomManagmentErrorResp || {};
            toast.error(details);
        }
        else if (downloadStaticHealthResp && downloadStaticHealthResp !== prevDownloadStaticHealthResp) {
            const { systemFile } = downloadStaticHealthResp,
                { s3URL } = systemFile || {};
            if (s3URL) {
                const url = s3URL || ""
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Health_Form.pdf');
                link.setAttribute('target', '_blank');
                document.body.appendChild(link);
                link.click();
                link.remove();
            } else {
                toast.error('Download url for health form is not found.');
            }
        }

        HealthFormVerifyRef.current.prevSaveHealthFormResp = saveHealthFormResp;
        HealthFormVerifyRef.current.prevGetHealthFormListResp = getHealthFormListResp;
        HealthFormVerifyRef.current.prevClassroomManagmentErrorResp = classroomManagmentErrorResp;
        HealthFormVerifyRef.current.prevDownloadStaticHealthResp = downloadStaticHealthResp;

    }, [saveHealthFormResp, classroomManagmentErrorResp, getHealthFormListResp, downloadStaticHealthResp]);

    useEffect(() => {
        if (currentStudentId && parentChildrensResp) {
            const student = parentChildrensResp?.find((item: any) => +item?.childId === +currentStudentId) || {};
            setCurrentStudent(student)
            HealthFormVerifyList()
        }
    }, [parentChildrensResp])

    const toggleAddHealthFormModal = (id?: any) => {
        setAddHealthFormModal((prev: any) => ({ ...prev, showModal: !prev.showModal }))
    };

    const roleColumns = useMemo(() => {
        return generateColumns()
    }, [healthFormList]);

    const HealthFormVerifyList = (otherProps?: any) => {
        const student = parentChildrensResp?.find((item: any) => +item?.childId === +currentStudentId) || {};
        const { academicYearId, curriculumId, classId, childCode, childBranchId, instituteId } = student;
        let payload = {
            academicYearId, curriculumId, instituteId: instituteId, branchId: childBranchId, classId, searchString: childCode, statusList: "APPROVED,ACCEPTED,REJECTED,PENDING", ...pagination.current
        };
        if (payload.academicYearId && payload.searchString) {
            dispatch(getHealthFormListAct(generateActionPayload('get_health_form_list', undefined, payload)))
        }
    }


    useEffect(() => {
        const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
        dispatch(
            getInstAcademicYearAct(
                generateActionPayload("get_inst_academic_year", undefined, payload)
            )
        );
        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
        }
    }, []);

    useEffect(() => {
        HealthFormVerifyList()
    }, [currentStudentId]);

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        HealthFormVerifyList(paginationInfo)
    }

    const downloadHealthForm = () => {
        const student = parentChildrensResp?.find((item: any) => +item?.childId === +currentStudentId) || {};
        const { childBranchId } = student || {};
        const payload = {
            formType: "HEALTH_FORM",
            branchId: childBranchId || ""
        }
        dispatch(downloadStaticHealthFormAct(generateActionPayload("download_static_health_form", undefined, payload)));
    }

    const { totalElements, totalPages, pageble } = getHealthFormListResp || {}
    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="daily attendance" pageTitle="Parent" />

                    <div className="tw-bg-white tw-rounded-lg tw-shadow">

                        <div className="tw-border-b tw-px-4 tw-py-3">
                            <div className="tw-flex tw-items-center tw-w-full">

                                <div className="tw-flex-1">
                                    <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                        Health Form Verification List
                                    </h4>
                                </div>

                                <div className="tw-ml-auto tw-flex tw-items-center tw-gap-2">

                                    <Button
                                        variant="info"
                                        onClick={() => downloadHealthForm()}
                                        disabled={showApiLoader}
                                    >
                                        Download Health Form
                                    </Button>

                                    <Button
                                        variant="primary"
                                        onClick={() => toggleAddHealthFormModal()}
                                        disabled={
                                            healthFormList?.length > 0 &&
                                                healthFormList[0]?.confirmationStatus !== "REJECTED"
                                                ? true
                                                : false
                                        }
                                    >
                                        Upload Health Form
                                    </Button>

                                </div>
                            </div>
                        </div>

                        <TableContainer
                            columns={roleColumns || []}
                            data={healthFormList || []}
                            divClass="table-responsive tw-mb-3"
                            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                            showPagination={true}
                            totalPages={totalPages || 0}
                            totalRecords={totalElements || 0}
                            callbackPaginationHndlr={paginationHndlr}
                            currentPageNumber={pageble?.pageNumber || 0}
                        />
                    </div>
                </div>
            </div>

            <ModalContainerUpdated
                id="add-health-form-modal"
                isOpen={addHealthFormModal.showModal}
                toggle={toggleAddHealthFormModal}
                modalTitle="Student Health Form"
                modalSize="md"
            >
                <AddHealthForm toggle={toggleAddHealthFormModal} isOpen={addHealthFormModal.showModal} currentStudent={currentStudent} />
            </ModalContainerUpdated>

        </>
    );
};

export default HealthForm;
