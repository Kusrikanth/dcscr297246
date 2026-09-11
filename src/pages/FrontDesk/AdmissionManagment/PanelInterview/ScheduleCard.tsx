import React, { useEffect, useMemo, useState } from 'react'
import DefaultStudentImage from "../../../../assets/imagesdps/student-default-img.png";
import { default as EditSvg } from "../../../../assets/imagesdps/directory/EditSvgIcon.svg?react";
import { default as DeleteSvg } from "../../../../assets/imagesdps/academics/DeleteIconSvg.svg?react";
import { getDateDdMMFormat, getTimeHHMMSSFormat } from "../../../../utility/dateutility";
import { AvatarGroupUpdated, ModalContainerUpdated } from '../../../../Components/Common';
import StudentExamDetailModal from './StudentExamDetailModal';
import AllStudentExamDetailModal from './AllStudentExamDetailModal';

const ScheduleCard = ({ interviewInfo, deleteInterviewHndlr, editInterviewHndlr }: any) => {
    const [students,setStudents]=useState([]);
    const [absentStudents,setAbsentStudents]=useState([]);
    const [isAbsentStudent,setIsAbsentStudent]=useState<boolean>(false);
    useEffect(()=>{
        if(interviewInfo&&interviewInfo.admissionPanelInterviewScheduleDetailsDTOS.length>0){
            let stu:any=[],absStudent:any=[];
            interviewInfo.admissionPanelInterviewScheduleDetailsDTOS.map((student:any)=>{
                if(student.isAbsent==="YES"){
                    absStudent.push(student)
                }
                else{
                    stu.push(student) 
                }
            })
            setAbsentStudents(absStudent);
            setStudents(stu);
        }
    },[interviewInfo])

    const [stuExamDetailModalState, setStuExamDetailModalState] = useState<any>({
        showModal: false,
        examId: undefined
    })

    const toggleStudentExamDetailModal = (event:any,isAbsent?:any) => {
        if(isAbsent){
            setIsAbsentStudent(true)
        }else{setIsAbsentStudent(false)}
        const id:any = event.currentTarget.getAttribute("data-id")
        setStuExamDetailModalState((prev: any) => ({ ...prev, showModal: !prev.showModal,examId : id }));
    }
    const [allStuExamDetailModalState, setAllStuExamDetailModalState] = useState<any>({
        showModal: false,
        examId: undefined
    })

    const toggleAllStudentExamDetailModal = (event:any,isAbsent?:any) => {
        if(isAbsent){
            setIsAbsentStudent(true)
        }else{setIsAbsentStudent(false)}
        const id:any = event.currentTarget.getAttribute("data-id")
        setAllStuExamDetailModalState((prev: any) => ({ ...prev, showModal: !prev.showModal,examId : id }));
    }

    return (
        <>
        <div className='row p-3 mb-3' style={{ border: "1px solid #CED4DA", borderRadius: "3px" }}>
            <div className='col-12 col-lg-6 d-flex align-items-center' style={{ borderRight: "2px solid #CED4DA" }}>
                <div className='fs-5 fw-bold col-2' style={{ borderRight: "2px solid #CED4DA" }}>
                    {/* <span className='d-block'>{interviewInfo.month}</span>
                    <span>{interviewInfo.day}</span> */}
                    <span>{getDateDdMMFormat(interviewInfo?.interviewDate)}</span>
                </div>
                {/* <hr className='mx-4' style={{height:"70px",width:"2px",backgroundColor:"#CED4DA"}}/> */}
                <div className='col-4 ps-3'>
                    {<p>{interviewInfo?.timeSlot}</p>}
                    <p className='m-0'>Class :<span>{interviewInfo.classShortName || "-"}</span></p>
                </div>
                <div className='col-6'>
                    <div className='row'>
                        <div className='col-5'>
                            <p>Meeting Link :</p>
                        </div>
                        <div className='col-7'>
                            <p>{interviewInfo.meetingLink || "-"}</p>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-5'>
                            <p>ID :</p>
                        </div>
                        <div className='col-7'>
                            <p>{interviewInfo.meetingId || "-"}</p>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-5'>
                            <p>Password :</p>
                        </div>
                        <div className='col-7'>
                            <p>{interviewInfo.meetingPassword || "-"}</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* <hr style={{height:"70px",backgroundColor:"#CED4DA"}}/> */}
            <div className='col-12 col-lg-6 ps-5'>
                <div className='row'>
                    <div className='col-4'>
                        <p className='fw-bold fs-15'>Students Detail</p>
                        <div className="avatar-group">
                            {/* {Array.isArray(interviewInfo?.studentDetails) && interviewInfo?.studentDetails.map((studentInfo: any, index: any) =>
                            ( */}
                            <AvatarGroupUpdated
                                avatars={students}
                                imageKey="studentImageS3URL"
                                tooltipKey="studentName"
                                numberOfAvatarToShow={4}
                                showLimitedAvatar={true}
                                dataId={interviewInfo?.id}
                                uniqueAvatarKey="id"
                                onClickHandler={(event:any)=>toggleStudentExamDetailModal(event,false)}
                                onClickMoreAvatarHndlr={(event:any)=>toggleAllStudentExamDetailModal(event,false)}
                            />
                            {/* ))} */}
                        </div>
                    </div>
                    <div className='col-4'>
                        <p className='fw-bold fs-15'>Absentees</p>
                        <div className="avatar-group">
                            {/* {Array.isArray(interviewInfo?.studentDetails) && interviewInfo?.studentDetails.map((studentInfo: any, index: any) =>
                            ( */}
                            <AvatarGroupUpdated
                                avatars={absentStudents}
                                imageKey="studentImageS3URL"
                                tooltipKey="studentName"
                                numberOfAvatarToShow={4}
                                dataId={interviewInfo?.id}
                                uniqueAvatarKey="id"
                                onClickHandler={(event:any)=>toggleStudentExamDetailModal(event,true)}
                                onClickMoreAvatarHndlr={(event:any)=>toggleAllStudentExamDetailModal(event,true)}
                            />
                            {/* ))} */}
                        </div>
                    </div>
                    <div className='col-4 d-flex align-items-center justify-content-center'>
                        <EditSvg
                            data-id={interviewInfo?.id}
                            className='me-3 fs-20 cursor-pointer' onClick={editInterviewHndlr} />
                        <DeleteSvg className="d-inline-block cursor-pointer"
                            data-id={interviewInfo?.id}
                            onClick={deleteInterviewHndlr}
                            fill='#878A99' />
                    </div>
                </div>
            </div>
        </div>
        <ModalContainerUpdated
            id="student-exam-details"
            isOpen={stuExamDetailModalState.showModal}
            toggle={toggleStudentExamDetailModal}
            modalTitle="Student Exam Schedule Details"
            modalSize="md"
        >
             <StudentExamDetailModal isOpen={stuExamDetailModalState.showModal} toggle={toggleStudentExamDetailModal} examId={stuExamDetailModalState.examId} studentList={isAbsentStudent ? absentStudents : students} />

            </ModalContainerUpdated>
        <ModalContainerUpdated
           id='all-student-exam-details'
            isOpen={allStuExamDetailModalState.showModal}
            toggle={toggleAllStudentExamDetailModal}
            modalTitle="Student Exam Schedule Details"
            modalSize="xl"
        >
             <AllStudentExamDetailModal isOpen={allStuExamDetailModalState.showModal} toggle={toggleAllStudentExamDetailModal} examId={allStuExamDetailModalState.examId} studentList={isAbsentStudent ? absentStudents : students} />

            </ModalContainerUpdated>
        </>
    )
}

export default ScheduleCard
