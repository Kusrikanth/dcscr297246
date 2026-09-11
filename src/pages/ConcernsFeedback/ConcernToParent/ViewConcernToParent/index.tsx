import React, { useEffect, useRef, useState } from 'react'
import BreadCrumb from '../../../../Components/Common/BreadCrumb'
import { BrowseFile, ConfirmationModal, ModalContainerUpdated, RadioInputContainer, StatusLabel, TextArea, UserDetails } from '../../../../Components/Common'
import UpdatedHorizontalTab from '../../../../Components/Common/UpdatedHorizontalTab'
import {  statusOptions, updatedMenuOptions ,  } from './helper'
import DefaultStudentImage from "../../../../assets/imagesdps/student-default-img.png";
import { useLocation } from 'react-router-dom'
import { shallowEqual } from 'react-redux'
import { generateActionPayload } from '../../../../utility/reduxutility'
import { addCommentListAct, deleteCommentListAct, deleteConcernFileAct, editCommentListAct, getCommentListAct, getConcernsFeedbackListByIdAct, setConcernsFeedbackListByIdAct } from '../../../../store/concernsfeedback/concernsfeedbacklist/concernsfeedbacklistaction'
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook'
import { toast } from 'react-toastify'
import { getDateWithTimeFormat, getDdMmYyyyFormat } from '../../../../utility/dateutility'

import { useFormik } from 'formik'
import * as Yup from "yup";
import AddFileHndler from '../../../Communication/Events/ViewEvent/AddFileHndler'
import UpdatePriorityModal from '../../ConcernsFeedbackList/ViewConcernFeedback/UpdatePriorityModal'
import Button from '../../../../Components/Common/Button'


const initialValues = {
    complaintStatus: "",
    comment: "",
    file: null,
    fileName: "",
}

const ViewConcernToParent = () => {

    const [activeId, setActiveId] = useState("comments");
    const [commentList, setCommentList] = useState<any[]>([]);
    const [isAccess , setIsAccess] = useState<boolean>(false)
    const location: any = useLocation();
    const dispatch = useAppDispatch();

    const [assignEmployeeModalState, setAssignEmployeeModalState] =
        useState({
            showModal: false,
            modalData : "",
        });
    const [updatePriorityModal, setUpdatePriorityModal] =
        useState({
            showModal: false,
            modalData : "",
        });
    const [updateSubjectModal, setUpdateSubjectModal] =
        useState({
            showModal: false,
            modalData : "",
        });
    const [concernListById, setConcernListById] = useState<any>(null)
    const [delStudentModalState, setDelDepartmentModalState] = useState({
        showModal: false,
        id: ""
    })
    const [delFileState, setDelFileState] = useState({
        showModal: false,
        id: ""
    })
    const [addFileModalState, setAddFileModalState] = useState({
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
        loggedInUserRole,
    } =
        useAppSelector(({ appData, instAcademics, globalData, concernsFeedback,login }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentInstIdResp: appData.currentInstIdResp,
            loggedInUserRole: appData.loggedInUserRole,
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
        }), shallowEqual);

    const concernFeedbackRef = useRef({
        prevGetConcernsFeedbackListByIdResp: getConcernsFeedbackListByIdResp,
        prevGetCommentListResp: getCommentListResp,
        prevConcernsFeedbackErrResp: concernsFeedbackErrResp,
        prevEditCommentListResp: editCommentListResp,
        prevDeleteCommentListResp: deleteCommentListResp,
        prevDeleteConcernFileResp: deleteConcernFileResp,
        prevAddConcernFileResp: addConcernFileResp,
        prevAddCommentListResp:addCommentListResp,
        prevEditConcernsFeedbackListResp : editConcernsFeedbackListResp,
    });

    useEffect(() => {
        const { prevConcernsFeedbackErrResp, prevGetConcernsFeedbackListByIdResp, prevGetCommentListResp, prevEditCommentListResp, prevDeleteCommentListResp, prevDeleteConcernFileResp, prevAddConcernFileResp , prevAddCommentListResp , prevEditConcernsFeedbackListResp } = concernFeedbackRef.current;
        if (getConcernsFeedbackListByIdResp && getConcernsFeedbackListByIdResp !== prevGetConcernsFeedbackListByIdResp) {
                setConcernListById(getConcernsFeedbackListByIdResp)
                addCommentForm.setValues((prev: any) => ({ ...prev, complaintStatus: getConcernsFeedbackListByIdResp?.status }));
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
        else if(addCommentListResp && addCommentListResp !== prevAddCommentListResp){
            toast.success("Comment Added Successfully");
            addCommentForm.setValues((prev: any) => ({ ...initialValues, complaintStatus: getConcernsFeedbackListByIdResp?.status }));
            getCommentListApiCall();
            getConcernFeedbackListById(location.state.complaintId);
        }
        else if (deleteCommentListResp && deleteCommentListResp !== prevDeleteCommentListResp) {
            toast.success("Comment Deleted Successfully");
            toggleDeleteModalHndler();
            getCommentListApiCall();
        }
        else if(editConcernsFeedbackListResp && editConcernsFeedbackListResp !== prevEditConcernsFeedbackListResp){
            toast.success("Complaint Updated Successfully");
            if(assignEmployeeModalState.showModal){
                toggleViewDetailsModal()
            }else if(updateSubjectModal.showModal){
                toggleUpdateSubjectModal()
            } else{
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

    }, [getConcernsFeedbackListByIdResp, concernsFeedbackErrResp, getCommentListResp, editCommentListResp, deleteCommentListResp, deleteConcernFileResp, addConcernFileResp,addCommentListResp,editConcernsFeedbackListResp,]);

    const addCommentForm = useFormik({
        initialValues,
        onSubmit: (values) => {

            const payload:any = {
                complaintId: location.state.complaintId,
                comment: values.comment,
                complaintStatus: values.complaintStatus,
                commentType: activeId === "comments" ? "COMMENT" : "REMARKS",
            }
            if(!values.complaintStatus){
                delete payload.complaintStatus
            }
            const formData = new FormData();
            formData.append("request", JSON.stringify(payload));
            if(values.file){
                formData.append("multipartFile", values.file || "");
            }
            dispatch(addCommentListAct(generateActionPayload("add_comment_list", undefined, formData)));
        },
    });

    useEffect(() => {
      return () => {
        dispatch(setConcernsFeedbackListByIdAct(undefined))
      }
    }, [])
    

    useEffect(() => {
        if(loggedInUserRole && getConcernsFeedbackListByIdResp){
            if(location.state.complaintId){
                if(getConcernsFeedbackListByIdResp?.status === "CLOSED"){
                    setIsAccess(false)
                }
                else if(loggedInUserRole === "TEACHER" || loggedInUserRole == "BRANCH_ADMIN"){
                    setIsAccess(true)
                }
                else if(loggedInUserRole === "PARENT_ROLE"){
                    setIsAccess(false)
                }
            }
            else {
                setIsAccess(false)
            }
        }
      
    }, [loggedInUserRole,getConcernsFeedbackListByIdResp])


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

    }

    const getConcernFeedbackListById = (id?: any) => {
        dispatch(getConcernsFeedbackListByIdAct(generateActionPayload("get_concerns_to_parent_by_id", { id: id })));
    }

    const getCommentListApiCall = (otherProps?:any) => {
        dispatch(getCommentListAct(generateActionPayload("get_comment_list", { id: location.state.complaintId },{commentType : activeId === "comments" ? "COMMENT" : "REMARKS" , ...otherProps})));
    }

    useEffect(() => {
        if (location?.state?.complaintId) {
            getCommentListApiCall()
            getConcernFeedbackListById(location.state.complaintId)
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

    const commentChangeHndler = (e: any, index: any) => {
        const { name, value } = e.target;
        commentList[index]["tempComment"] = value;
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

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Students Management" pageTitle="Helpdesk" />
                    <div className='tw-flex tw-flex-wrap tw--mx-3'>
                        <div className='tw-w-full lg:tw-w-1/4 tw-px-3'>
                            <div className='tw-bg-white tw-rounded-lg tw-shadow tw-sticky tw-top-4'>
                                <div className='tw-p-4'>
                                    <h4 className='tw-text-base tw-font-semibold tw-mb-0'>
                                        Concern Details
                                    </h4>
                                </div>
                                <div className='tw-px-4 tw-py-3 tw-border-t tw-border-gray-200'>
                                    <div className='tw-flex tw-flex-wrap tw--mx-2'>
                                        <div className='tw-w-1/3 tw-px-2'>Complaint No.</div>
                                        <div className='tw-w-2/3 tw-px-2 tw-flex'><span className='tw-mr-3'>:</span><span>{concernListById?.complaintNumber}</span> </div>
                                    </div>
                                </div>
                                <div className='tw-px-4 tw-py-3 tw-border-t tw-border-gray-200'>
                                    <div className='tw-flex tw-flex-wrap tw--mx-2'>
                                        <div className='tw-w-1/3 tw-px-2'>Open date</div>
                                        <div className='tw-w-2/3 tw-px-2 tw-flex'><span className='tw-mr-3'>:</span><span>{concernListById?.complaintDate ? getDdMmYyyyFormat(concernListById?.complaintDate) : ""}</span> </div>
                                    </div>
                                </div>
                                <div className='tw-px-4 tw-py-3 tw-border-t tw-border-gray-200'>
                                    <div className='tw-flex tw-flex-wrap tw--mx-2'>
                                        <div className='tw-w-1/3 tw-px-2'>Priority</div>
                                        <div className='tw-w-2/3 tw-px-2 tw-flex'><span className='tw-mr-3'>:</span><span className='tw-flex tw-items-center'><StatusLabel type={concernListById?.priority} labelName={concernListById?.priority} />{isAccess && <span onClick={() => toggleUpdatePriorityModal()} className='tw-text-blue-600 tw-ml-2 tw-cursor-pointer'><i className="ri-pencil-line"></i></span>}</span> </div>
                                    </div>
                                </div>
                                <div className='tw-px-4 tw-py-3 tw-border-t tw-border-gray-200'>
                                    <div className='tw-flex tw-flex-wrap tw--mx-2'>
                                        <div className='tw-w-1/3 tw-px-2'>Category</div>
                                        <div className='tw-w-2/3 tw-px-2 tw-flex'><span className='tw-mr-3'>:</span><span>{concernListById?.category}</span> </div>
                                    </div>
                                </div>
                                <div className='tw-px-4 tw-py-3 tw-border-t tw-border-gray-200'>
                                    <div className='tw-flex tw-flex-wrap tw--mx-2'>
                                        <div className='tw-w-1/3 tw-px-2'>Department</div>
                                        <div className='tw-w-2/3 tw-px-2 tw-flex'><span className='tw-mr-3'>:</span><span>{concernListById?.complaintToDepartmentName}</span> </div>
                                    </div>
                                </div>
                                <div className='tw-px-4 tw-py-3 tw-border-t tw-border-gray-200'>
                                    <div className='tw-flex tw-flex-wrap tw--mx-2'>
                                        <div className='tw-w-1/3 tw-px-2'>Owner</div>
                                        <div className='tw-w-2/3 tw-px-2 tw-flex'><span className='tw-mr-3'>:</span> <UserDetails
                                            displayName={concernListById?.complaintByName}
                                            displayId={concernListById?.complaintByCode}
                                            showAvatar={false}
                                        /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='tw-w-full lg:tw-w-3/4 tw-px-3'>
                            <div className='tw-flex tw-flex-wrap -tw-mx-3 tw-gap-4'>
                                <div className='tw-w-full tw-px-3'>
                                    <div className='tw-bg-white tw-rounded-lg tw-shadow'>
                                        <div className='tw-p-4'>
                                            <div className='tw-flex tw-flex-wrap tw--mx-3'>
                                                <div className='tw-w-full tw-px-3'>
                                                    <div className='tw-flex tw-flex-wrap tw--mx-3'>
                                                        <div className='tw-w-11/12 tw-px-3'> <h4 className='tw-text-lg tw-font-semibold tw-mb-2'>{concernListById?.subject}</h4></div>
                                                        {/* <div className='tw-w-auto tw-ml-auto tw-px-3'>{ isAccess && <span onClick={()=>toggleUpdateSubjectModal()} className='tw-text-blue-600 tw-ml-2 tw-cursor-pointer'><i className="ri-pencil-line"></i></span>}</div> */}
                                                    </div>

                                                </div>
                                                <div className='tw-w-full tw-px-3 tw-text-gray-500 tw-text-xs'>{concernListById?.createdDate ? `Created At ${getDateWithTimeFormat(concernListById?.createdDate + "Z")}` : ""}</div>

                                                <div className='tw-w-full tw-px-3 tw-text-sm tw-mt-3' dangerouslySetInnerHTML={{ __html: concernListById?.description }}>

                                                </div>

                                                <div className='tw-w-full tw-px-3 tw-my-3 tw-flex tw-flex-wrap'>
                                                    {concernListById?.attachments?.map((item: any, index: any) => {
                                                        return (
                                                            <div key={index} className='tw-relative tw-mt-3'>
                                                                <Button variant='soft' onClick={() => { window.open(item?.s3Url, '_blank') }}>
                                                                    <div className='tw-flex tw-justify-center tw-items-center'>
                                                                        <span title={item?.originalName} style={{ maxWidth: "7rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}><ins>{item?.originalName}</ins></span>
                                                                    </div>
                                                                </Button>
                                                                {isAccess && <span onClick={() => toggleFileDelHndler(item?.fileId)} className="tw-inline-flex tw-items-center tw-justify-center tw-rounded-full tw-bg-red-600 tw-text-white tw-cursor-pointer tw-absolute tw-px-2 tw-py-0.5 tw-text-xs" style={{ top: "-7px", right: -6 }}>
                                                                    X
                                                                </span>}
                                                            </div>
                                                        )
                                                    })}
                                                    {isAccess && <Button variant='soft' onClick={toggleAddFileModalHndler}> Add New File</Button>}
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='tw-w-full tw-px-3'>
                                    <div className='tw-bg-white tw-rounded-lg tw-shadow'>
                                        <div className='tw-p-4'>
                                            <UpdatedHorizontalTab
                                                MenuOptions={updatedMenuOptions}
                                                clickMenuHandler={clickMenuHandler}
                                                activeTabId={activeId}
                                                showBadge={false}
                                                horizontalClass=""

                                            />
                                            <div className='tw-flex tw-flex-wrap tw--mx-3 tw-mt-3'>
                                                <div className='tw-w-full tw-px-3'>
                                                    <TextArea
                                                        name="comment"
                                                        value={addCommentForm.values.comment}
                                                        onChange={addCommentForm.handleChange}
                                                        labelText="Comments"
                                                        height='10rem'
                                                        invalid={(addCommentForm.touched.comment && addCommentForm.errors.comment) ? true : false}
                                                        error={(addCommentForm.touched.comment && addCommentForm.errors.comment) ? addCommentForm.errors.comment : ""}
                                                    />
                                                </div>
                                                <div className='tw-w-full tw-px-3'>
                                                    <BrowseFile
                                                        containerClassName="tw-mb-3"
                                                        labelText="Upload File"
                                                        name="file"
                                                        fileName={addCommentForm.values.fileName}
                                                        onChangeFileHndlr={onChangeFileInputHndlr}
                                                    />
                                                </div>
                                                {loggedInUserRole !== "PARENT_ROLE" && <div className='tw-w-full tw-px-3'>
                                                    <RadioInputContainer
                                                        name="complaintStatus"
                                                        labelText="Status : "
                                                        containerClassName='tw-flex tw-items-baseline'
                                                        inputContainerClassName="tw-mt-2 tw-ml-3"
                                                        radioOptions={statusOptions}
                                                        invalid={(addCommentForm.touched.complaintStatus && addCommentForm.errors.complaintStatus) ? true : false}
                                                        error={(addCommentForm.touched.complaintStatus && addCommentForm.errors.complaintStatus) ? addCommentForm.errors.complaintStatus : ""}
                                                        value={addCommentForm.values.complaintStatus}
                                                        onChange={addCommentForm.handleChange}
                                                        isDisabled={getConcernsFeedbackListByIdResp?.status?.toLowerCase() === "closed" ? true : false}
                                                    />
                                                </div>}

                                                <div className='tw-ml-auto tw-w-auto tw-px-3'>
                                                    <Button onClick={(e: any) => addCommentForm.handleSubmit(e)} variant='primary' disabled={showApiLoader || (getConcernsFeedbackListByIdResp?.status?.toLowerCase() === "closed" ? true : false)}>Save</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='tw-w-full tw-px-3'>
                                    <div className='tw-bg-white tw-rounded-lg tw-shadow'>
                                        <div className='tw-px-4 tw-py-3 tw-border-b tw-border-gray-200'>
                                            <h4 className='tw-text-base tw-font-semibold tw-mb-0'>Conversations</h4>
                                        </div>
                                        <div style={{ overflowY: "auto", height: "15rem" }}>
                                            {commentList?.length > 0 ? commentList?.map((i: any, index: number) => (
                                                <div className='tw-px-4 tw-py-3 tw-border-b tw-border-gray-200' key={index}>
                                                    <div className='tw-flex' id='comment' >
                                                        <div >
                                                            <div className="tw-inline-block" data-bs-toggle="tooltip" data-bs-placement="top" title={"image"}>
                                                                <img src={i?.imageUrl || DefaultStudentImage} alt="image" className="tw-rounded-full tw-w-8 tw-h-8 tw-object-cover" />
                                                            </div>
                                                        </div>
                                                        <div className='tw-flex tw-flex-col tw-ml-3 tw-w-9/12'>
                                                            <h4 className='tw-text-base tw-font-semibold tw-mb-0'>{i?.userName}</h4>
                                                            <div className='tw-text-gray-500 tw-text-xs tw-mt-1 tw-mb-3 tw-whitespace-nowrap'>{i?.createdDate ?
                                                                `Created At ${getDateWithTimeFormat(`${i?.createdDate + "Z"}`)}`
                                                                : ""}</div>
                                                            <div className='tw-flex tw-flex-col'>
                                                                {i?.isEdit ? <><TextArea
                                                                    name={`comment-${index}`}
                                                                    value={i?.tempComment}
                                                                    onChange={(e: any) => commentChangeHndler(e, index)}
                                                                    formgroupClassName="tw-mb-0 tw-w-full"
                                                                />
                                                                    <Button disabled={showApiLoader} style={{ height: "2.3rem", width: "fit-content" }} variant='primary' onClick={() => updateHndler(index)}>Update</Button></> : i?.comment}
                                                            </div>
                                                            {i?.filesUrl && <div className='tw-mt-2 tw-cursor-pointer' onClick={() => window.open(i?.filesUrl, "_blank")}>
                                                                <span className='tw-text-blue-500 tw-text-xs'>Document</span>
                                                            </div>}
                                                        </div>
                                                        <div className='tw-ml-auto'>
                                                            {isAccess && <>
                                                                <Button variant='soft' onClick={() => editHndler(index)}><i className="ri-pencil-fill tw-text-base"></i></Button>
                                                                <Button variant='reject' onClick={() => toggleDeleteModalHndler(i?.id)}><i className="ri-delete-bin-5-fill tw-text-base"></i></Button>
                                                            </>}
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : <div className='tw-p-4'>
                                                No Comment Found
                                            </div>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
           
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
                id="update-priority-modal"
                isOpen={updatePriorityModal.showModal}
                toggle={()=>toggleUpdatePriorityModal()}
                modalTitle="Update Priority"
                modalSize="md"
            >
                <UpdatePriorityModal
                    toggle={()=>toggleUpdatePriorityModal()}
                    modalData={concernListById}
                />
            </ModalContainerUpdated>
        </>
    )
}

export default ViewConcernToParent