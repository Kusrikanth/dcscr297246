import React, { useEffect, useState } from "react";

import { shallowEqual, useDispatch } from "react-redux";

import * as Yup from 'yup';
import { useAppSelector } from "../../../../hooks/storehook";
import DefaultUser from "../../../../assets/imagesdps/default-user.png";


const StudentExamDetailModal = (props: any) => {

    const { examId, studentList, isOpen } = props;
    const dispatch = useDispatch();

    const [examDetails, setExamDetails] = useState<any>(null);

    const [studentState, setStudentState] = useState<any>({
        studentName : "",
        studentRegNo : "",
    })

    useEffect(() => {
        if (props.isOpen) {
            const newData = studentList?.filter((item:any)=>{
                return +item?.studentRegId === +examId 
               })
               if(newData?.length){
                   setExamDetails(newData[0])
               }
        }else{
        setExamDetails({})    
        }
    }, [props.isOpen])


    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, academicYearListResp, brchCurriculumResp, branchClassResp, notDetentionedPromotionedStudends, detainedOrPromotedClasses }: any =
        useAppSelector(
            ({ appData, instAcademics, branchAcademics, classroomManagmentInfo }: any) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                academicYearListResp: instAcademics.academicYearListResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                branchClassResp: branchAcademics.branchClassResp,
                notDetentionedPromotionedStudends: classroomManagmentInfo.notDetentionedPromotionedStudends,
                detainedOrPromotedClasses: classroomManagmentInfo.detainedOrPromotedClasses,
            }),
            shallowEqual
        );
    return (
        <>
            <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-mt-4">
                <div className="tw-avatar-md tw-flex-shrink-0 tw-rounded-full tw-me-2">
                    <img
                        src={examDetails?.studentImgUrl || DefaultUser}
                        className="tw-w-full tw-h-full tw-rounded-full"
                        style={{ border: "3px solid #0AB39C" }}
                    />
                </div>
                <div className="tw-mt-2">
                    {examDetails?.studentName}
                </div>
            </div>

            <div className="tw-grid tw-grid-cols-2 tw-gap-3 tw-pl-4 tw-bg-[#E7F0F8] tw-mt-4">
                <div className="tw-mt-2 tw-h-7 tw-text-[#8A8D9F]">
                    Registration Number
                </div>
                <div className="tw-mt-2 tw-h-7">
                    {examDetails?.studentRegNo ? examDetails?.studentRegNo : "N/A"}
                </div>
            </div>

            <div className="tw-grid tw-grid-cols-2 tw-gap-3 tw-pl-4 tw-mt-0">
                <div className="tw-mt-2 tw-h-7 tw-text-[#8A8D9F]">
                    Group
                </div>
                <div className="tw-mt-2 tw-h-7">
                    {examDetails?.streamGroupShortName ? examDetails?.streamGroupShortName : "N/A"}
                </div>
            </div>

            <div className="tw-grid tw-grid-cols-2 tw-gap-3 tw-pl-4 tw-bg-[#E7F0F8] tw-mt-0">
                <div className="tw-mt-2 tw-h-7 tw-text-[#8A8D9F]">
                    Admission Cancel
                </div>
                <div className="tw-mt-2 tw-h-7">
                    {examDetails?.cancelAdmission ? "Yes" : "No"}
                </div>
            </div>

            <div className="tw-grid tw-grid-cols-2 tw-gap-3 tw-pl-4 tw-mt-0">
                <div className="tw-mt-2 tw-h-7 tw-text-[#8A8D9F]">
                    Admission Type
                </div>
                <div className="tw-mt-2 tw-h-7">
                    {examDetails?.admissionType ? examDetails?.admissionType : "N/A"}
                </div>
            </div>

            <div className="tw-grid tw-grid-cols-2 tw-gap-3 tw-pl-4 tw-bg-[#E7F0F8] tw-mt-0">
                <div className="tw-mt-2 tw-h-7 tw-text-[#8A8D9F]">
                    Schedule Mode
                </div>
                <div className="tw-mt-2 tw-h-7">
                    {examDetails?.scheduleMode ? examDetails?.scheduleMode : "N/A"}
                </div>
            </div>

            <div className="tw-grid tw-grid-cols-2 tw-gap-3 tw-pl-4 tw-mt-0">
                <div className="tw-mt-2 tw-h-7 tw-text-[#8A8D9F]">
                    Meeting Link ID
                </div>
                <div className="tw-mt-2 tw-h-7">
                    {examDetails?.meetingId ? examDetails?.meetingId : "N/A"}
                </div>
            </div>

            <div className="tw-grid tw-grid-cols-2 tw-gap-3 tw-pl-4 tw-bg-[#E7F0F8] tw-mt-0">
                <div className="tw-mt-2 tw-h-7 tw-text-[#8A8D9F]">
                    Password
                </div>
                <div className="tw-mt-2 tw-h-7">
                    {examDetails?.passCode ? examDetails?.passCode : "N/A"}
                </div>
            </div>

            <div className="tw-grid tw-grid-cols-2 tw-gap-3 tw-pl-4 tw-mt-0">
                <div className="tw-mt-2 tw-h-7 tw-text-[#8A8D9F]">
                    Time
                </div>
                <div className="tw-mt-2 tw-h-7">
                    {examDetails?.timeSlot ? examDetails?.timeSlot : "N/A"}
                </div>
            </div>
        </>

    );
};

export default StudentExamDetailModal;
