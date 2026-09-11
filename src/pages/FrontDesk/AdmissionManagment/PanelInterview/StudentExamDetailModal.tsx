import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import DefaultUser from "../../../../assets/imagesdps/default-user.png";


const StudentExamDetailModal = (props: any) => {

    const { examId, studentList, isOpen } = props;
    const dispatch = useDispatch();

    const [examDetails, setExamDetails] = useState<any>(null);

    useEffect(() => {
        if (props.isOpen) {
        
            const newData = studentList?.filter((item:any)=>{
                return (+item?.studentRegistrationId === +examId ) || (+item?.studentRegId === +examId)
               })
          
               if(newData?.length){
                   setExamDetails(newData[0])
               }
        }else{
        setExamDetails({})    
        }
    }, [props.isOpen])
    return (
        <>
            <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-mt-4">
                <div className="tw-avatar-md tw-flex-shrink-0 tw-rounded-full tw-mb-2">
                    <img
                        src={examDetails?.studentImageS3URL || DefaultUser}
                        className="tw-w-full tw-h-full tw-rounded-full tw-block"
                        style={{ border: "3px solid #0AB39C" }}
                    />
                </div>
                <div className="tw-mt-2 tw-font-medium">
                    {examDetails?.studentName || "N/A"}
                </div>
            </div>

            <div className="tw-grid tw-grid-cols-2 tw-gap-3 tw-pl-4 tw-bg-[#E7F0F8] tw-mt-4 tw-py-2">
                <div className="tw-text-gray-500 tw-h-[30px] tw-flex tw-items-center">Registration Number</div>
                <div className="tw-h-[30px] tw-flex tw-items-center">{examDetails?.studentRegNo || "N/A"}</div>
            </div>

            <div className="tw-grid tw-grid-cols-2 tw-gap-3 tw-pl-4 tw-py-2">
                <div className="tw-text-gray-500 tw-h-[30px] tw-flex tw-items-center">Group</div>
                <div className="tw-h-[30px] tw-flex tw-items-center">{examDetails?.groupShortName || "N/A"}</div>
            </div>

            <div className="tw-grid tw-grid-cols-2 tw-gap-3 tw-pl-4 tw-bg-[#E7F0F8] tw-py-2">
                <div className="tw-text-gray-500 tw-h-[30px] tw-flex tw-items-center">Admission Cancel</div>
                <div className="tw-h-[30px] tw-flex tw-items-center">{examDetails?.admissionCancel || "No"}</div>
            </div>

            <div className="tw-grid tw-grid-cols-2 tw-gap-3 tw-pl-4 tw-py-2">
                <div className="tw-text-gray-500 tw-h-[30px] tw-flex tw-items-center">Admission Type</div>
                <div className="tw-h-[30px] tw-flex tw-items-center">{examDetails?.admissionType || "N/A"}</div>
            </div>

            <div className="tw-grid tw-grid-cols-2 tw-gap-3 tw-pl-4 tw-bg-[#E7F0F8] tw-py-2">
                <div className="tw-text-gray-500 tw-h-[30px] tw-flex tw-items-center">Schedule Mode</div>
                <div className="tw-h-[30px] tw-flex tw-items-center">{examDetails?.scheduleMode || "N/A"}</div>
            </div>

            <div className="tw-grid tw-grid-cols-2 tw-gap-3 tw-pl-4 tw-py-2">
                <div className="tw-text-gray-500 tw-h-[30px] tw-flex tw-items-center">Meeting Link ID</div>
                <div className="tw-h-[30px] tw-flex tw-items-center">{examDetails?.meetingId || "N/A"}</div>
            </div>

            <div className="tw-grid tw-grid-cols-2 tw-gap-3 tw-pl-4 tw-bg-[#E7F0F8] tw-py-2">
                <div className="tw-text-gray-500 tw-h-[30px] tw-flex tw-items-center">Password</div>
                <div className="tw-h-[30px] tw-flex tw-items-center">{examDetails?.meetingPassword || "N/A"}</div>
            </div>

            <div className="tw-grid tw-grid-cols-2 tw-gap-3 tw-pl-4 tw-py-2">
                <div className="tw-text-gray-500 tw-h-[30px] tw-flex tw-items-center">Time</div>
                <div className="tw-h-[30px] tw-flex tw-items-center">{examDetails?.timeSlot || "N/A"}</div>
            </div>
        </>
    );
};

export default StudentExamDetailModal;
