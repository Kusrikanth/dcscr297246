import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import BreadCrumb from '../../../../Components/Common/BreadCrumb'
import { AutoSearchInputUpdated, BrowseFile, ConfirmationModal, ModalContainerUpdated, QuillEditor, RadioInputContainer, SelectInput, StatusLabel, TextArea, UserDetails } from '../../../../Components/Common'
import UpdatedHorizontalTab from '../../../../Components/Common/UpdatedHorizontalTab'
import { MenuOptions, accessRoles, complaintStatusOptions, getAssigneesName, statusOptions, updatedMenuOptions } from './helper'
import AssignEmployeeModal from '../AssignEmployeeModal'
import DefaultStudentImage from "../../../../assets/imagesdps/student-default-img.png";
import { useHistory, useLocation } from 'react-router-dom'
import { shallowEqual, useDispatch } from 'react-redux'
import { generateActionPayload } from '../../../../utility/reduxutility'
import { addCommentListAct, deleteCommentListAct, deleteConcernFileAct, editCommentListAct, getCommentListAct, getConcernsFeedbackListAct, getConcernsFeedbackListByIdAct } from '../../../../store/concernsfeedback/concernsfeedbacklist/concernsfeedbacklistaction'
import { useAppSelector } from '../../../../hooks/storehook'
import { toast } from 'react-toastify'
import { getDateWithTimeFormat, getDdMmYyyyFormat } from '../../../../utility/dateutility'
import AddFileHndler from '../../../Communication/Events/ViewEvent/AddFileHndler'
import { useFormik } from 'formik'
import * as Yup from "yup";
import UpdatePriorityModal from './UpdatePriorityModal'
import UpdateSubjectModal from './UpdateSubjectModal'
import Pdf from "../../../../assets/imagesdps/academics/pdf.svg";
import Docx from "../../../../assets/imagesdps/academics/word.svg";
import Other from "../../../../assets/imagesdps/academics/common.svg";
import { parseQueryStringToObject } from '../../../../utility/commonutility'
import { useModal } from '../../../../hooks/modalhook'
import RequestTypeModal from './RequestTypeModal'
import UpdateCategoryModal from './UpdateCategoryModal'
import UpdateModuleModal from './UpdateModuleModal'
import UpdateTargetDateModal from './UpdateTargetDateModal'
import Button from '../../../../Components/Common/Button'

const initialValues = {
    complaintStatus: "CLOSED",
    comment: "",
    file: null,
    fileName: "",
    complaintNo: ""
}

function getValidationSchema(activeId: any, name: any) {
    return (
        Yup.object().shape({
            // comment: Yup.string().required("Comment is required.").nullable(),
            // file: Yup.string().required("File is required.").nullable(),
            complaintStatus: Yup.string().test('is-status-required', 'status is required.', function (value) {
                if (activeId === "comments" && !value && !accessRoles.includes(name)) {
                    return false;
                }
                return true;
            }),
        })
    )
}

const ViewConcernFeedback = () => {
    const history = useHistory();
    const [activeId, setActiveId] = useState<any>("comments");
    const [commentList, setCommentList] = useState<any>([]);
    const [isAccess, setIsAccess] = useState<boolean>(false)
    const location: any = useLocation();
    const dispatch = useDispatch();

    const { closeModal: closeRequestTypeModal, modalState: requestTypeModalState, openModal: openRequestTypeModal } = useModal();
    const { closeModal: closeUpdateCategoryModal, modalState: updateCategoryModalState, openModal: openUpdateCategoryModal } = useModal();
    const { closeModal: closeUpdateModuleModal, modalState: updateModuleModalState, openModal: openUpdateModuleModal } = useModal();
    const { closeModal: closeUpdateTargetDateModal, modalState: updateTargetDateModalState, openModal: openUpdateTargetDateModal } = useModal();

    const [assignEmployeeModalState, setAssignEmployeeModalState] =
        useState({
            showModal: false,
            modalData: "",
        });
    const [updatePriorityModal, setUpdatePriorityModal] =
        useState({
            showModal: false,
            modalData: "",
        });
    const [updateSubjectModal, setUpdateSubjectModal] =
        useState({
            showModal: false,
            modalData: "",
        });
    const [concernListById, setConcernListById] = useState<any>(null)
    const [delStudentModalState, setDelDepartmentModalState] = useState<any>({
        showModal: false,
        id: ""
    })
    const [delFileState, setDelFileState] = useState<any>({
        showModal: false,
        id: ""
    })
    const [addFileModalState, setAddFileModalState] = useState<any>({
        showModal: false,
    })

    const {
        academicYearListResp,
        currentInstIdResp: instituteId,
        currentBranchIdResp: branchId,
        showApiLoader,
        getCommentListResp,
        getConcernsFeedbackListByIdResp,
        concernsFeedbackErrResp,
        editCommentListResp,
        deleteConcernFileResp,
        addCommentListResp,
        addConcernFileResp,
        editConcernsFeedbackListResp,
        deleteCommentListResp,
        userMeResp,
        instituteListResp,
        getConcernsFeedbackListResp,
        currentStudentId, 
        parentChildrensResp,
        loggedInUserRole
    } =
        useAppSelector(({ appData, instAcademics, globalData, concernsFeedback, login, instituteInfo, directoryStudent }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            showApiLoader: globalData.showApiLoader,
            getCommentListResp: concernsFeedback.getCommentListResp,
            getConcernsFeedbackListByIdResp: concernsFeedback.getConcernsFeedbackListByIdResp,
            concernsFeedbackErrResp: concernsFeedback.concernsFeedbackErrResp,
            editCommentListResp: concernsFeedback.editCommentListResp,
            deleteCommentListResp: concernsFeedback.deleteCommentListResp,
            deleteConcernFileResp: concernsFeedback.deleteConcernFileResp,
            addConcernFileResp: concernsFeedback.addConcernFileResp,
            addCommentListResp: concernsFeedback.addCommentListResp,
            editConcernsFeedbackListResp: concernsFeedback.editConcernsFeedbackListResp,
            userMeResp: login.userMeResp,
            instituteListResp: instituteInfo.instituteListResp,
            getConcernsFeedbackListResp: concernsFeedback.getConcernsFeedbackListResp,
            currentStudentId: appData.currentStudentId,
            parentChildrensResp: directoryStudent.parentChildrensResp,
            loggedInUserRole: appData.loggedInUserRole,

        }), shallowEqual);

    const concernFeedbackRef = useRef<any>({
        prevGetConcernsFeedbackListByIdResp: getConcernsFeedbackListByIdResp,
        prevGetCommentListResp: getCommentListResp,
        prevConcernsFeedbackErrResp: concernsFeedbackErrResp,
        prevEditCommentListResp: editCommentListResp,
        prevDeleteCommentListResp: deleteCommentListResp,
        prevDeleteConcernFileResp: deleteConcernFileResp,
        prevAddConcernFileResp: addConcernFileResp,
        prevAddCommentListResp: addCommentListResp,
        prevEditConcernsFeedbackListResp: editConcernsFeedbackListResp,
    });

    useEffect(() => {
        const { prevConcernsFeedbackErrResp, prevGetConcernsFeedbackListByIdResp, prevGetCommentListResp, prevEditCommentListResp, prevDeleteCommentListResp, prevDeleteConcernFileResp, prevAddConcernFileResp, prevAddCommentListResp, prevEditConcernsFeedbackListResp } = concernFeedbackRef.current;
        if (getConcernsFeedbackListByIdResp && getConcernsFeedbackListByIdResp !== prevGetConcernsFeedbackListByIdResp) {
            if (getConcernsFeedbackListByIdResp) {
                setConcernListById(getConcernsFeedbackListByIdResp)
                addCommentForm.setValues((prev: any) => ({ ...prev, complaintStatus: "CLOSED" }));
            }
        }
        if (getCommentListResp && getCommentListResp !== prevGetCommentListResp) {
            const { data } = getCommentListResp || {};
            if (Array.isArray(data) && data.length > 0) {
                setCommentList(data?.map((i: any) => ({ ...i, isEdit: false, tempComment: i.comment })))
            } else if (Array.isArray(data) && data.length === 0) {
                setCommentList([])
            }
        }
        else if (editCommentListResp && editCommentListResp !== prevEditCommentListResp) {
            toast.success("Comment Updated Successfully");
            getCommentListApiCall()
        }
        else if (deleteConcernFileResp && deleteConcernFileResp !== prevDeleteConcernFileResp) {
            toast.success("Attechment Deleted Successfully");
            toggleFileDelHndler();
            getConcernFeedbackListById(location.state.complaintId);
        }
        else if (addConcernFileResp && addConcernFileResp !== prevAddConcernFileResp) {
            toast.success("Attechment Added Successfully");
            toggleAddFileModalHndler();
            getConcernFeedbackListById(location.state.complaintId);
        }
        else if (addCommentListResp && addCommentListResp !== prevAddCommentListResp) {
            toast.success("Comment Added Successfully");
            addCommentForm.setValues((prev: any) => ({ ...initialValues, complaintStatus: "CLOSED" }));
            getCommentListApiCall();
            getConcernFeedbackListById(location.state.complaintId);
        }
        else if (deleteCommentListResp && deleteCommentListResp !== prevDeleteCommentListResp) {
            toast.success("Comment Deleted Successfully");
            toggleDeleteModalHndler();
            getCommentListApiCall();
        }
        else if (editConcernsFeedbackListResp && editConcernsFeedbackListResp !== prevEditConcernsFeedbackListResp) {
            toast.success("Complaint Updated Successfully");
            if (assignEmployeeModalState.showModal) {
                toggleViewDetailsModal()
            } else if (updateSubjectModal.showModal) {
                toggleUpdateSubjectModal()
            } else if (requestTypeModalState.showModal) {
                closeRequestTypeModal()
            }
            else if (updateCategoryModalState.showModal) {
                closeUpdateCategoryModal()
            }
            else if (updateModuleModalState.showModal) {
                closeUpdateModuleModal()
            }
            else if (updateTargetDateModalState.showModal) {
                closeUpdateTargetDateModal()
            }
            else {
                toggleUpdatePriorityModal()
            }
            getConcernFeedbackListById(location.state.complaintId);
        }
        else if (concernsFeedbackErrResp && concernsFeedbackErrResp !== prevConcernsFeedbackErrResp) {
            const { message }: any = concernsFeedbackErrResp;
            toast.error(message || "Something went wrong.");
        }

        concernFeedbackRef.current.prevGetConcernsFeedbackListByIdResp = getConcernsFeedbackListByIdResp;
        concernFeedbackRef.current.prevGetCommentListResp = getCommentListResp;
        concernFeedbackRef.current.prevEditCommentListResp = editCommentListResp;
        concernFeedbackRef.current.prevDeleteCommentListResp = deleteCommentListResp;
        concernFeedbackRef.current.prevAddConcernFileResp = addConcernFileResp;
        concernFeedbackRef.current.prevDeleteConcernFileResp = deleteConcernFileResp;
        concernFeedbackRef.current.prevAddCommentListResp = addCommentListResp;
        concernFeedbackRef.current.prevEditConcernsFeedbackListResp = editConcernsFeedbackListResp;
        concernFeedbackRef.current.prevConcernsFeedbackErrResp = concernsFeedbackErrResp;

    }, [getConcernsFeedbackListByIdResp, concernsFeedbackErrResp, getCommentListResp, editCommentListResp, deleteCommentListResp, deleteConcernFileResp, addConcernFileResp, addCommentListResp, editConcernsFeedbackListResp,]);

    const addCommentForm = useFormik({
        initialValues,
        validationSchema: getValidationSchema(activeId, userMeResp?.role?.name),
        onSubmit: (values) => {

            const payload: any = {
                complaintId: location.state.complaintId,
                comment: values.comment,
                complaintStatus: values.complaintStatus,
                commentType: activeId === "comments" ? "COMMENT" : "REMARKS",
                ...(loggedInUserRole === "PARENT_ROLE" && {
                    studentId: selectedChild?.childId,
                    branchId: selectedChild?.childBranchId,
                    studentClassSection: selectedChild?.sectionName
                        ? `${selectedChild?.sectionName}`
                        : selectedChild?.classShortName,
                }),
            }
            if (!values.complaintStatus) {
                delete payload.complaintStatus
            }
            const formData = new FormData();
            formData.append("request", JSON.stringify(payload));
            if (values.file) {
                formData.append("multipartFile", values.file || "");
            }
            dispatch(addCommentListAct(generateActionPayload("add_comment_list", undefined, formData)));
        },
    });

    useEffect(() => {
        if (userMeResp) {
            if (location.state?.complaintId && getConcernsFeedbackListByIdResp?.status === "CLOSED" && !location?.state?.isCreated) {
                setIsAccess(false)
            }
            else {
                if (userMeResp?.role?.roleType === "EMPLOYEE") {
                    if (location?.state?.isCreated && !(getConcernsFeedbackListByIdResp?.status === "CLOSED")) {
                        setIsAccess(true)
                    } else {
                        setIsAccess(false)
                    }
                }
                else if (!accessRoles.includes(userMeResp?.role?.name)) {
                    setIsAccess(true)
                } else {
                    setIsAccess(false)
                }
            }
        }

    }, [userMeResp, location, getConcernsFeedbackListByIdResp])

    const selectedChild = useMemo(() => {
        if (Array.isArray(parentChildrensResp) && parentChildrensResp.length > 0) {
            return parentChildrensResp.find(item => item.childId?.toString() === currentStudentId?.toString());
        }
        return {};
    }, [parentChildrensResp, currentStudentId]);

    const concernStudentName = concernListById?.studentName || concernListById?.studentFirstName || "";
    const concernStudentCode = concernListById?.studentCode || concernListById?.studentUserName || "";

    // End user type can arrive as PARENT / PARENT_ROLE depending on how the concern was raised
    // (by the parent themselves, or by an admin on a parent's behalf).
    const isParentConcern = `${concernListById?.complaintUserType || ""}`.toUpperCase().includes("PARENT")
        || !!(concernStudentName || concernStudentCode);

    const toggleViewDetailsModal = (modalData?: any) => {
        setAssignEmployeeModalState((prev: any) => ({
            ...prev,
            showModal: !prev.showModal,
            modalData: modalData || "",
        }))
    }

    const toggleUpdatePriorityModal = (modalData?: any) => {
        setUpdatePriorityModal((prev: any) => ({
            ...prev,
            showModal: !prev.showModal,
            modalData: modalData || "",
        }))
    }

    const toggleUpdateSubjectModal = (modalData?: any) => {
        setUpdateSubjectModal((prev: any) => ({
            ...prev,
            showModal: !prev.showModal,
            modalData: modalData || "",
        }))
    }

    const toggleDeleteModalHndler = (id?: any) => {
        setDelDepartmentModalState((prev: any) => ({
            ...prev,
            showModal: !prev.showModal,
            id: id || "",
        }))
    }

    const toggleFileDelHndler = (id?: any) => {
        setDelFileState((prev: any) => ({
            ...prev,
            showModal: !prev.showModal,
            id: id || "",
        }))
    }
    const toggleAddFileModalHndler = () => {
        setAddFileModalState((prev: any) => ({
            ...prev,
            showModal: !prev.showModal,
        }))
    }

    function getActiveMenuComponent(menuId: string | null) {
        switch (menuId) {
            case "comments":
                return <></>;
            case "remarks":
                return <></>;
        }
    }
    function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
        const { currentTarget } = event,
            menuId = currentTarget.getAttribute("data-id");
        getCommentListApiCall({ commentType: menuId === "comments" ? "COMMENT" : "REMARKS", })
        addCommentForm.resetForm();
        setActiveId(menuId);
    }

    const getConcernFeedbackListById = (id?: any) => {
        dispatch(getConcernsFeedbackListByIdAct(generateActionPayload("get_concern_feedback_list_by_id", { id: id })));
    }

    const getCommentListApiCall = (otherProps?: any) => {
        try {

            let complaintId = location?.state?.complaintId;


            if (!complaintId) {
                const storedDataStr = sessionStorage.getItem('ctrl_click_complaint_data');

                if (storedDataStr) {
                    const storedData = JSON.parse(storedDataStr);
                    complaintId = storedData.complaintId;
                }
            }

            if (complaintId) {
                dispatch(
                    getCommentListAct(
                        generateActionPayload(
                            "get_comment_list",
                            { id: complaintId },
                            {
                                commentType: activeId === "comments" ? "COMMENT" : "REMARKS",
                                ...otherProps
                            }
                        )
                    )
                );
            }
        } catch (e) {
            console.error("Error in getCommentListApiCall:", e);
        }
    };

    useEffect(() => {
        try {

            let complaintId = location?.state?.complaintId;
            let dataFromSession = false;

            if (!complaintId) {
                const storedDataStr = sessionStorage.getItem('ctrl_click_complaint_data');

                if (storedDataStr) {
                    const storedData = JSON.parse(storedDataStr);
                    complaintId = storedData.complaintId;
                    dataFromSession = true;

                    history.replace({
                        ...location,
                        state: {
                            ...(location.state || {}),
                            complaintId: storedData.complaintId,
                            isCreated: storedData.isCreated,
                            pathName: storedData.pathName,
                            academicYearId: storedData.academicYearId
                        },
                    });
                }
            }

            if (complaintId) {
                getCommentListApiCall();
                getConcernFeedbackListById(complaintId);
            }
        } catch (e) {
            console.error("Error in useEffect:", e);
        }
    }, [location])

    const editHndler = (index: any) => {
        const { isEdit } = commentList[index];
        commentList[index].isEdit = !isEdit;
        if (!isEdit) {
            commentList[index]["tempComment"] = commentList[index]["comment"];
        }
        setCommentList([...commentList]);
    }

    const commentChangeHndler = (content: any, index: any) => {
    commentList[index]["tempComment"] = content;
    setCommentList([...commentList]);
    }

    const updateHndler = (index: any) => {
        const data = commentList[index];

        dispatch(editCommentListAct(generateActionPayload("edit_comment_list", { id: data.id }, { comment: data?.tempComment })));
    }

    const delModalSubmitHndlr = () => {
        dispatch(deleteCommentListAct(generateActionPayload("delete_comment_list", { id: delStudentModalState.id })));
    }

    const delFileSubmitHndlr = () => {
        dispatch(deleteConcernFileAct(generateActionPayload("delete_concern_file", { id: delFileState.id })));
    }

    function onChangeFileInputHndlr(event: any) {
        const { name } = event.target;
        const file = event.target.files[0];
        const fileSize = event.target.files[0].size;

        const maxFileSize = 2 * 1024 * 1024;
        if (fileSize > maxFileSize) {
            toast.warning("File size is less than or equal to 2MB.");
        } else {
            addCommentForm.setValues((prevState: any) => ({
                ...prevState, fileName: file.name,
                file
            }))
        }
    }

    function onInputSearchChange(inputString: any) {
        if (location?.state?.pathName === "/my-concerns-feedback") {
            const payload = { academicYearId: location?.state?.academicYearId, branchId, assigneeId: location?.state?.assigneeId, searchString: inputString };
            dispatch(getConcernsFeedbackListAct(generateActionPayload("assignee_list_concern", undefined, { ...payload })))
        }
        else if (Array.isArray(instituteListResp?.data) && instituteListResp?.data.length > 0) {
            let academicYearId = location?.state?.academicYearId;

            const instituteGroupId = instituteListResp?.data.find((item: any) => +item?.id === +instituteId)?.instituteGroupId
            const params = {
                instituteId,
                searchString: inputString,
                instituteGroupId: instituteGroupId,
                academicYearId,
                isParentComplaint: false,
                requestType: ""
            };

            if (loggedInUserRole !== "BRANCH_ADMIN" && loggedInUserRole !== "INSTITUTE_ADMIN") {
                const { role } = userMeResp || {},
                    { roleType } = role || {};
                if (roleType === "EMPLOYEE" && location.state.pathName !== "/my-concerns") {
                    params.requestType = "DEPT_COMPLAINTS"
                } else {
                    params.requestType = "MY_COMPLAINTS"
                }
            }
            dispatch(getConcernsFeedbackListAct(generateActionPayload("get_concern_feedback_list", undefined, { ...params })));
        }
    }

    const { data: StudentList } = getConcernsFeedbackListResp || {};

    const selectedStudent = (student: any) => {
        if (student) {
            setConcernListById(student);
            addCommentForm.setFieldValue('complaintNo', student?.complaintId);

            if (student?.complaintId) {

                history.replace({
                    ...location,
                    state: {
                        ...location.state,
                        complaintId: student?.complaintId
                    },
                });
            }
        }
    }

     const onChangeQuillHndlr = (content: any) => {
        addCommentForm.setFieldValue("comment", content);
    }

    const isEditableWithin24hrs = () => {
        if (!concernListById?.createdDate) return false;
        const createdTime = new Date(concernListById.createdDate + "Z").getTime();
        const now = Date.now();
        const diffInHours = (now - createdTime) / (1000 * 60 * 60);
        return diffInHours <= 24;
    };

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Students Management" pageTitle="Helpdesk" />
                    <div className='tw-border tw-border-b tw-mb-4 tw-bg-white tw-p-4'>

                        <div className='tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-3'>
                            <div className='tw-col-span-1 lg:tw-col-span-1'>
                                <AutoSearchInputUpdated
                                    formgroupClassName="search-box"
                                    name="complaintNo"
                                    placeHolder="Search"
                                    onChange={(string: any) => {
                                        if (!string) addCommentForm.setFieldValue('complaintNo', "");
                                        onInputSearchChange(string)
                                    }}
                                    // onBlur={feeSummaryForm.handleBlur}
                                    valueKey="complaintNo"
                                    labelHeader="Complaint No"
                                    labelKey="complaintNo"
                                    subLabelHeader="Complaint Subject"
                                    subLabelKey="complaintSubject"
                                    options={StudentList}
                                    selectedOptionCallbck={selectedStudent}
                                ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
                            </div>
                        </div>
                    </div>
                    <div className='tw-grid tw-grid-cols-1 xl:tw-grid-cols-12 tw-gap-4 tw-mb-5 xl:tw-items-stretch'>
                        <div className='tw-col-span-1 xl:tw-col-span-3 xl:tw-h-full'>
                            <div className='tw-bg-white tw-rounded-lg tw-shadow tw-flex tw-flex-col xl:tw-h-full'>
                                <div className='tw-p-4 tw-flex-shrink-0'>
                                    <h4 className='tw-text-base tw-font-semibold tw-mb-0'>
                                        Concern Details
                                    </h4>
                                </div>
                                <div className='tw-border-t tw-p-4'>
                                    <div className='tw-grid tw-grid-cols-12 tw-gap-2'>
                                        <div className='tw-col-span-4'>Complaint No.</div>
                                        <div className='tw-col-span-8 tw-flex'>
                                            <span className='tw-mr-3'>:</span>
                                            <span>{concernListById?.complaintNo}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='tw-border-t tw-p-4'>
                                    <div className='tw-grid tw-grid-cols-12 tw-gap-2'>
                                        <div className='tw-col-span-4'>Open date</div>
                                        <div className='tw-col-span-8 tw-flex'>
                                            <span className='tw-mr-3'>:</span>
                                            <span>{concernListById?.assignedDate ? getDdMmYyyyFormat(concernListById?.assignedDate) : ""}</span>
                                        </div>
                                    </div>
                                </div>
                                {!accessRoles.includes(userMeResp?.role?.name) && (
                                    <>
                                        <div className='tw-border-t tw-p-4'>
                                            <div className='tw-grid tw-grid-cols-12 tw-gap-2'>
                                                <div className='tw-col-span-4'>Target date</div>
                                                <div className='tw-col-span-8 tw-flex'>
                                                    <span className='tw-mr-3'>:</span>
                                                    <span className='tw-break-words'>
                                                        {concernListById?.targetDate ? getDdMmYyyyFormat(concernListById?.targetDate) : ""}
                                                    </span>
                                                    {isAccess && (
                                                        <span
                                                            onClick={() => openUpdateTargetDateModal()}
                                                            className='tw-text-blue-600 tw-ml-2 tw-cursor-pointer'
                                                        >
                                                            <i className="ri-pencil-line"></i>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='tw-border-t tw-p-4'>
                                            <div className='tw-grid tw-grid-cols-12 tw-gap-2'>
                                                <div className='tw-col-span-4'>Priority</div>
                                                <div className='tw-col-span-8 tw-flex'>
                                                    <span className='tw-mr-3'>:</span>
                                                    <span className='tw-flex tw-items-center'>
                                                        <StatusLabel
                                                            type={concernListById?.priority}
                                                            labelName={concernListById?.priority}
                                                        />
                                                        {isAccess && (
                                                            <span
                                                                onClick={() => toggleUpdatePriorityModal()}
                                                                className='tw-text-blue-600 tw-ml-2 tw-cursor-pointer'
                                                            >
                                                                <i className="ri-pencil-line"></i>
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div className='tw-border-t tw-p-4'>
                                    <div className='tw-grid tw-grid-cols-12 tw-gap-2'>
                                        <div className='tw-col-span-4'>Module</div>
                                        <div className='tw-col-span-8 tw-flex'>
                                            <span className='tw-mr-3'>:</span>
                                            <span className='tw-break-words'>{concernListById?.moduleName}</span>
                                            {isAccess && (
                                                <span
                                                    onClick={() => openUpdateModuleModal()}
                                                    className='tw-text-blue-600 tw-ml-2 tw-cursor-pointer'
                                                >
                                                    <i className="ri-pencil-line"></i>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className='tw-border-t tw-p-4'>
                                    <div className='tw-grid tw-grid-cols-12 tw-gap-2'>
                                        <div className='tw-col-span-4'>Category</div>
                                        <div className='tw-col-span-8 tw-flex'>
                                            <span className='tw-mr-3'>:</span>
                                            <span className='tw-break-words'>{concernListById?.category}</span>
                                            {isAccess && (
                                                <span
                                                    onClick={() => openUpdateCategoryModal()}
                                                    className='tw-text-blue-600 tw-ml-2 tw-cursor-pointer'
                                                >
                                                    <i className="ri-pencil-line"></i>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {!accessRoles.includes(userMeResp?.role?.name) && (
                                    <div className='tw-border-t tw-p-4'>
                                        <div className='tw-grid tw-grid-cols-12 tw-gap-2'>
                                            <div className='tw-col-span-4'>Request Type</div>
                                            <div className='tw-col-span-8 tw-flex'>
                                                <span className='tw-mr-3'>:</span>
                                                <span className='tw-break-words'>{concernListById?.requestType}</span>
                                                {isAccess && (
                                                    <span
                                                        onClick={() => openRequestTypeModal()}
                                                        className='tw-text-blue-600 tw-ml-2 tw-cursor-pointer'
                                                    >
                                                        <i className="ri-pencil-line"></i>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className='tw-border-t tw-p-4'>
                                    <div className='tw-grid tw-grid-cols-12 tw-gap-2'>
                                        <div className='tw-col-span-4'>Department</div>
                                        <div className='tw-col-span-8 tw-flex'>
                                            <span className='tw-mr-3'>:</span>
                                            <span className='tw-break-words'>{concernListById?.departmentName}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='tw-border-t tw-p-4'>
                                    <div className='tw-grid tw-grid-cols-12 tw-gap-2'>
                                        <div className='tw-col-span-4'>Department Head</div>
                                        <div className='tw-col-span-8 tw-flex'>
                                            <span className='tw-mr-3'>:</span>
                                            <UserDetails
                                                displayName={concernListById?.departmentHeadName}
                                                displayId={concernListById?.departmentHeadCode}
                                                showAvatar={false}
                                                mainDivClass='tw-truncate'
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='tw-border-t tw-p-4'>
                                    <div className='tw-grid tw-grid-cols-12 tw-gap-2'>
                                        <div className='tw-col-span-4'>Owner</div>
                                        <div className='tw-col-span-8 tw-flex tw-w-full tw-overflow-hidden'>
                                            <span className='tw-mr-3'>:</span>
                                            <UserDetails
                                                displayName={concernListById?.complaintFirstName}
                                                displayId={concernListById?.complaintUserName}
                                                showAvatar={false}
                                                mainDivClass='tw-overflow-hidden'
                                            />
                                        </div>
                                    </div>
                                </div>
                                {isParentConcern && (
                                    <div className='tw-border-t tw-p-4'>
                                        <div className='tw-grid tw-grid-cols-12 tw-gap-2'>
                                            <div className='tw-col-span-4'>Student</div>
                                            <div className='tw-col-span-8 tw-flex tw-w-full tw-overflow-hidden'>
                                                <span className='tw-mr-3'>:</span>
                                                <UserDetails
                                                    displayName={concernStudentName || "-"}
                                                    displayId={concernStudentCode || "-"}
                                                    showAvatar={false}
                                                    mainDivClass='tw-overflow-hidden'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className='tw-border-t tw-p-4'>
                                    <div className='tw-grid tw-grid-cols-12 tw-gap-2'>
                                        <div className='tw-col-span-4'>Assignees</div>
                                        <div className='tw-col-span-8 tw-flex'>
                                            <span className='tw-mr-3'>:</span>
                                            <span className='tw-break-words'>{getAssigneesName(concernListById?.assignee)}</span>
                                        </div>
                                    </div>
                                </div>
                                {loggedInUserRole === "PARENT_ROLE" && (
                                    <>
                                        {!isParentConcern && (
                                        <div className="tw-border-t tw-p-4">
                                            <div className="tw-grid tw-grid-cols-12 tw-gap-2">
                                                <div className="tw-col-span-4">Student Name</div>

                                                <div className="tw-col-span-8 tw-flex">
                                                    <span className="tw-mr-3">:</span>

                                                    <span className="tw-break-words">
                                                        <UserDetails
                                                            displayName={
                                                                getConcernsFeedbackListByIdResp?.studentName || "-"
                                                            }
                                                            displayId={
                                                                getConcernsFeedbackListByIdResp?.studentCode || "-"
                                                            }
                                                            imageUrl={selectedChild?.childImageURL}
                                                            size="xs"
                                                            defaultImgType="student"
                                                        />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        )}

                                        <div className="tw-border-t tw-p-4">
                                            <div className="tw-grid tw-grid-cols-12 tw-gap-2">
                                                <div className="tw-col-span-4">Class</div>

                                                <div className="tw-col-span-8 tw-flex">
                                                    <span className="tw-mr-3">:</span>

                                                    <span className="tw-break-words">
                                                        {getConcernsFeedbackListByIdResp?.studentClassSection || "-"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {isAccess && (
                                    <div className='tw-border-t tw-p-4 tw-flex tw-justify-end'>
                                        <div className='tw-gap-2'>
                                            <div className='tw-col-span-12'>
                                                <Button variant='soft' onClick={() => toggleViewDetailsModal(concernListById)}>
                                                    <div className='tw-flex tw-justify-center tw-items-center'>
                                                        <span>Assign</span>
                                                        <span className='tw-ml-2'>
                                                            <i className="ri-pencil-line"></i>
                                                        </span>
                                                    </div>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='tw-col-span-1 xl:tw-col-span-4 xl:tw-h-full'>
                            <div className='tw-bg-white tw-rounded-lg tw-shadow tw-flex tw-flex-col xl:tw-h-full'>
                                <div className='tw-p-4 tw-min-w-0'>
                                    <div className='tw-grid tw-grid-cols-1 tw-gap-1 tw-min-w-0'>
                                        <div className='tw-col-span-1 tw-min-w-0'>
                                            <div className='tw-grid tw-grid-cols-12 tw-gap-2 tw-items-start'>
                                                <div className='tw-col-span-11 tw-min-w-0'>
                                                    <h4 className='tw-text-lg tw-font-semibold tw-mb-2 tw-break-words'>
                                                        {concernListById?.complaintSubject}
                                                    </h4>
                                                </div>
                                                <div className='tw-col-auto tw-ml-auto'>
                                                    {isAccess && isEditableWithin24hrs() && (
                                                        <span
                                                            onClick={() => toggleUpdateSubjectModal()}
                                                            className='tw-text-blue-600 tw-ml-2 tw-cursor-pointer'
                                                        >
                                                            <i className="ri-pencil-line"></i>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='tw-col-span-1 tw-text-gray-500 tw-text-xs'>
                                            {concernListById?.createdDate
                                                ? `Created At ${getDateWithTimeFormat(concernListById?.createdDate + "Z")}`
                                                : ""}
                                        </div>

                                        <div className="tw-col-span-1 tw-min-w-0">
                                            <div className="tw-max-h-[100vh] tw-overflow-y-auto tw-pr-2">
                                                <div className="tw-p-4 tw-min-w-0">
                                                    <div
                                                        className="tw-break-words [&_p]:tw-m-0 [&_ol]:tw-pl-5 [&_ul]:tw-pl-5 [&_li]:tw-mb-1"
                                                        dangerouslySetInnerHTML={{ __html: concernListById?.description || "" }}
                                                    />
                                                </div>
                                                <div className="tw-px-4 tw-pb-4 tw-flex tw-flex-wrap tw-gap-3 tw-min-w-0">
                                                    {concernListById?.files?.map((item: any, index: any) => {
                                                        const file = item?.originalFileName?.split("/");
                                                        const fileName = file[file.length - 1];
                                                        const fileExtension = fileName.split(".").pop().toLowerCase();

                                                        const icon =
                                                            fileExtension === "docx" ? Docx :
                                                                fileExtension === "pdf" ? Pdf :
                                                                    Other;

                                                        return (
                                                            <div
                                                                className="tw-border tw-rounded tw-px-2 tw-py-2 tw-w-full sm:tw-w-auto sm:tw-max-w-[240px] tw-min-w-0"
                                                                key={index}
                                                            >
                                                                <div className="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-min-w-0">
                                                                    <div className="tw-flex tw-items-center tw-gap-2 tw-min-w-0 tw-flex-1">
                                                                        <img src={icon} className="tw-w-7 tw-h-7 tw-shrink-0" />

                                                                        <span
                                                                            className="tw-block tw-min-w-0 tw-flex-1 tw-no-underline tw-truncate tw-text-gray-500"
                                                                            title={fileName}
                                                                        >
                                                                            <ins className="tw-no-underline tw-truncate tw-block">
                                                                                {fileName}
                                                                            </ins>
                                                                        </span>
                                                                    </div>

                                                                    <span
                                                                        className="tw-cursor-pointer tw-shrink-0"
                                                                        onClick={() => window.open(item?.s3Url, "_blank")}
                                                                    >
                                                                        <i className="ri-download-line" title="Download"></i>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='tw-col-span-1 xl:tw-col-span-5 tw-grid tw-gap-4 xl:tw-h-full'>
                            <div className='tw-bg-white tw-rounded-lg tw-shadow tw-flex tw-flex-col xl:tw-h-full'>
                                <div className="tw-border-b tw-p-4 tw-flex tw-items-start tw-justify-between">
                                    <h4 className="tw-text-base tw-font-semibold tw-mb-0">Conversations</h4>
                                </div>
                                <div className="tw-max-h-[35vh] md:tw-max-h-[40vh] xl:tw-max-h-[45vh] tw-overflow-y-auto tw-mb-3 tw-px-2 tw-pb-4">
                                    {commentList?.length > 0 ? (
                                        commentList.map((i: any, index: number) => (
                                            <div className="tw-px-2 tw-py-4 tw-border-b" key={index}>
                                                <div className="tw-flex tw-items-start">
                                                    <div
                                                        className="avatar-group-item"
                                                        data-bs-toggle="tooltip"
                                                        data-bs-placement="top"
                                                        title={"image"}
                                                    >
                                                        <img
                                                            src={i?.imageUrl || DefaultStudentImage}
                                                            alt="image"
                                                            className="tw-rounded-full tw-w-8 tw-h-8"
                                                        />
                                                    </div>

                                                    <div className="tw-ml-3 tw-flex-1 tw-min-w-0 tw-flex tw-items-start tw-justify-between">
                                                        <div className="tw-min-w-0">
                                                            <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-truncate">
                                                                {i?.userName}
                                                            </h4>
                                                        </div>

                                                        <div className="tw-flex tw-gap-2 tw-ml-2 tw-flex-shrink-0">
                                                            <Button
                                                                variant="soft"
                                                                onClick={() => editHndler(index)}
                                                                className='!tw-px-2 !tw-py-1'
                                                            >
                                                                <i className="ri-pencil-fill tw-text-base fs-12"></i>
                                                            </Button>

                                                            <Button
                                                                variant="wrong"
                                                                onClick={() => toggleDeleteModalHndler(i?.id)}
                                                                className='!tw-px-2 !tw-py-1 tw-border !tw-border-red-500'
                                                            >
                                                                <i className="ri-delete-bin-5-fill tw-text-base fs-12"></i>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="tw-text-gray-500 tw-text-xs tw-mt-1 tw-mb-0 tw-ms-10 tw-whitespace-normal tw-break-keep">
                                                    {i?.createdDate
                                                        ? `Created At ${getDateWithTimeFormat(`${i?.createdDate + "Z"}`)}`
                                                        : ""}
                                                </div>
                                                <div className="tw-mt-3 tw-text-sm tw-overflow-x-hidden tw-pr-2">
                                                    {i?.isEdit ? (
                                                        <>
                                                            <div className="conversation-editor">
                                                                <Suspense fallback={<div>Loading...</div>}>
                                                                    <QuillEditor
                                                                        name={`comment-${index}`}
                                                                        value={i?.tempComment}
                                                                        onChange={(content: any) => commentChangeHndler(content, index)}
                                                                        labelText=""
                                                                    />
                                                                </Suspense>
                                                            </div>
                                                            <div className="tw-flex tw-justify-end tw-mt-2 tw-gap-2">
                                                                <Button variant="secondary" onClick={() => editHndler(index)}>
                                                                    Cancel
                                                                </Button>
                                                                <Button
                                                                    disabled={showApiLoader}
                                                                    variant="primary"
                                                                    onClick={() => updateHndler(index)}
                                                                >
                                                                    Update
                                                                </Button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div
                                                            className="tw-break-words [&_p]:tw-m-0 [&_ol]:tw-pl-5 [&_ul]:tw-pl-5 [&_li]:tw-mb-1"
                                                            dangerouslySetInnerHTML={{ __html: i?.comment }}
                                                        />
                                                    )}
                                                </div>
                                                {i?.filesUrl && (
                                                    <div
                                                        className="tw-mt-2 tw-cursor-pointer"
                                                        onClick={() => window.open(i?.filesUrl, "_blank")}
                                                    >
                                                        <span className="tw-text-blue-500 tw-text-xs">Document</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="tw-p-4">No Comment Found</div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <div className='tw-bg-white tw-rounded-lg tw-shadow tw-flex tw-flex-col xl:tw-h-full'>
                                    <div className='tw-pt-2 tw-flex tw-flex-col'>
                                        <UpdatedHorizontalTab
                                            MenuOptions={!isAccess ? updatedMenuOptions : MenuOptions}
                                            clickMenuHandler={clickMenuHandler}
                                            activeTabId={activeId}
                                            showBadge={false}
                                            horizontalClass=""
                                        />
                                        <div className='tw-mt-3 tw-p-4 tw-pt-0'>
                                            <div className='tw-grid tw-grid-cols-1 tw-gap-y-2 tw-gap-x-4'>
                                                <div className='tw-col-span-1 helpdesk'>
                                                    <Suspense fallback={<div>Loading...</div>}>
                                                        <QuillEditor
                                                            name="comment"
                                                            value={addCommentForm.values.comment}
                                                            onChange={onChangeQuillHndlr}
                                                            invalid={
                                                                addCommentForm.touched.comment && addCommentForm.errors.comment
                                                                    ? true
                                                                    : false
                                                            }
                                                            error={
                                                                addCommentForm.touched.comment && addCommentForm.errors.comment
                                                                    ? addCommentForm.errors.comment
                                                                    : ""
                                                            }
                                                            labelText="Comments"
                                                            labelClass='required'
                                                            formgroupClassName='mb-0'
                                                        />
                                                    </Suspense>
                                                </div>
                                                <div className='tw-col-span-1'>
                                                    <BrowseFile
                                                        containerClassName="tw-mb-0"
                                                        labelText="Upload File"
                                                        name="file"
                                                        fileName={addCommentForm.values.fileName}
                                                        onChangeFileHndlr={onChangeFileInputHndlr}
                                                    />
                                                </div>
                                                {activeId === "comments" && (
                                                    <div className='tw-col-span-1'>
                                                        <SelectInput
                                                            name="complaintStatus"
                                                            value={addCommentForm.values.complaintStatus}
                                                            onChange={addCommentForm.handleChange}
                                                            labelText="Complaint Status"
                                                            valueKey="id"
                                                            textKey="name"
                                                            labelClass="required"
                                                            menuItems={complaintStatusOptions}
                                                            invalid={
                                                                addCommentForm.touched.complaintStatus &&
                                                                    addCommentForm.errors.complaintStatus
                                                                    ? true
                                                                    : false
                                                            }
                                                            error={
                                                                addCommentForm.touched.complaintStatus &&
                                                                    addCommentForm.errors.complaintStatus
                                                                    ? addCommentForm.errors.complaintStatus
                                                                    : ""
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className='tw-border-t tw-p-4 tw-flex tw-justify-end'>
                                            <Button
                                                variant='primary'
                                                onClick={(e: any) => addCommentForm.handleSubmit(e)}
                                                disabled={
                                                    showApiLoader ||
                                                    (getConcernsFeedbackListByIdResp?.status?.toLowerCase() === "closed")
                                                }
                                            >
                                                Save
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="assign-employee-modal"
                isOpen={assignEmployeeModalState.showModal}
                toggle={() => toggleViewDetailsModal()}
                modalTitle="Assign To"
                modalSize="md"
            >
                <AssignEmployeeModal
                    toggle={() => toggleViewDetailsModal()}
                    modalData={concernListById}
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="update-priority-modal"
                isOpen={updatePriorityModal.showModal}
                toggle={() => toggleUpdatePriorityModal()}
                modalTitle="Update Priority"
                modalSize="md"
            >
                <UpdatePriorityModal
                    toggle={() => toggleUpdatePriorityModal()}
                    modalData={concernListById}
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="update-description-modal"
                isOpen={updateSubjectModal.showModal}
                toggle={() => toggleUpdateSubjectModal()}
                modalTitle="Update Subject and Description"
                modalSize="md"
            >
                <UpdateSubjectModal
                    toggle={() => toggleUpdateSubjectModal()}
                    modalData={concernListById}
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="add-new-files-modal"
                isOpen={addFileModalState.showModal}
                toggle={toggleAddFileModalHndler}
                modalTitle="Add Attechments"
                modalSize="lg"
            >
                <AddFileHndler
                    showApiLoader={showApiLoader}
                />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-student-modal"
                isOpen={delStudentModalState.showModal}
                confirmMessage="Are you sure you want to delete this student ?"
                cancelHndlr={() => toggleDeleteModalHndler()}
                confirmHndlr={delModalSubmitHndlr}
                showImgIcon={true}
                isDisble={showApiLoader}
                iconType='reject'
            />
            <ConfirmationModal
                id="delete-student-modal"
                isOpen={delFileState.showModal}
                confirmMessage="Are you sure you want to delete this file ?"
                cancelHndlr={() => toggleFileDelHndler()}
                confirmHndlr={delFileSubmitHndlr}
                showImgIcon={true}
                isDisble={showApiLoader}
                iconType='reject'
            />

            <ModalContainerUpdated
                id="add-edit-feature-modal"
                modalSize="md"
                isOpen={requestTypeModalState.showModal}
                toggle={closeRequestTypeModal}
                modalTitle={"Update Request Type"}
            >
                <RequestTypeModal
                    toggle={closeRequestTypeModal}
                    modalData={concernListById}
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="update-category-modal"
                modalSize="md"
                isOpen={updateCategoryModalState.showModal}
                toggle={closeUpdateCategoryModal}
                modalTitle={"Update Category and Department"}
            >
                <UpdateCategoryModal
                    toggle={closeUpdateCategoryModal}
                    modalData={concernListById}
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="update-module-modal"
                modalSize="md"
                isOpen={updateModuleModalState.showModal}
                toggle={closeUpdateModuleModal}
                modalTitle={"Update Module"}
            >
                <UpdateModuleModal
                    toggle={closeUpdateModuleModal}
                    modalData={concernListById}
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="update-module-modal"
                modalSize="md"
                isOpen={updateTargetDateModalState.showModal}
                toggle={closeUpdateTargetDateModal}
                modalTitle={"Update Target Date"}
            >
                <UpdateTargetDateModal
                    toggle={closeUpdateTargetDateModal}
                    modalData={concernListById}
                />
            </ModalContainerUpdated>
        </>
    )
}

export default ViewConcernFeedback