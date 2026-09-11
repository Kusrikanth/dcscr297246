import React, { useMemo, useState } from 'react';
import { ModalContainerUpdated } from '../../../../Components/Common/ModalContainer';
import StudentExamDetailModal from './StudentExamDetailModal';
import AllStudentExamDetailModal from './AllStudentExamDetailModal';

const StudentExamScheduleModal = ({
    firstIsOpen,
    firstIsToggle,
    secondIsOpen,
    firstExamId,
    secondIsToggle,
    secondExamId,

}: any) => {
  
    
    return (
        <>
            <ModalContainerUpdated
                id='student-exam-details'
                isOpen={firstIsOpen}
                toggle={firstIsToggle}
                modalTitle="Student Exam Schedule Details"
                modalSize="md"
            >
                <StudentExamDetailModal
                    isOpen={firstIsOpen}
                    toggle={firstIsToggle}
                    examId={firstExamId}
                        // studentList={studentList?.studentsList}
                />
            </ModalContainerUpdated>

            <ModalContainerUpdated
                id="all-student-exam-details"
                isOpen={secondIsOpen}
                toggle={secondIsToggle}
                modalTitle="Student Exam Schedule Details"
                modalSize="xl"
            >
                <AllStudentExamDetailModal
                    isOpen={secondIsOpen}
                    toggle={secondIsToggle}
                    examId={secondExamId}
                    // studentList={studentList}
                />

            </ModalContainerUpdated>
        </>
    )
}
export default StudentExamScheduleModal;