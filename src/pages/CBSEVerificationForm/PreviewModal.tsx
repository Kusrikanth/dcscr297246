import React from 'react'
import { getDisplayDateForTableFormat } from '../../utility/dateutility';

const PreviewCbseVerificationModal = ({ studentDetails }: any) => {
    return (
        <>
            <div className="tw-p-4 tw-bg-white tw-rounded-xl tw-shadow-sm">
                <table className="tw-w-full tw-mb-3 tw-text-sm tw-border tw-border-gray-300">
                    <tbody className="tw-divide-y tw-divide-gray-300">
                        <tr>
                            <td colSpan={4} style={{ textAlign: "center", fontWeight: "bold" }}>DATA VERIFICATION FOR CBSE REGISTRATION - FINAL COPY</td>
                        </tr>
                        <tr>
                            <td>STUDENT ID</td>
                            <td colSpan={3}>{studentDetails?.studentCode || "-"}</td>
                        </tr>
                        <tr>
                            <td>STUDENT NAME</td>
                            <td colSpan={3}>{studentDetails?.studentName || "-"}</td>
                        </tr>
                        <tr>
                            <td>CLASS / SECTION</td>
                            <td colSpan={3}>{studentDetails?.classSection || "-"}</td>
                        </tr>
                        <tr>
                            <td>ADMISSION NO.</td>
                            <td colSpan={3}>{studentDetails?.admissionNo || "-"}</td>
                        </tr>
                        <tr>
                            <td>DATE OF ADMISSION</td>
                            <td colSpan={3}>{getDisplayDateForTableFormat(studentDetails?.dateOfAdmission)}</td>
                        </tr>
                        <tr>
                            <td>DATE OF BIRTH</td>
                            <td colSpan={3}>{getDisplayDateForTableFormat(studentDetails?.dateOfBirth)}</td>
                        </tr>
                        <tr>
                            <td>GENDER</td>
                            <td colSpan={3}>{studentDetails?.gender || "-"}</td>
                        </tr>
                        <tr>
                            <td>MOBILE NO.</td>
                            <td colSpan={3}>{studentDetails?.mobileNo || "-"}</td>
                        </tr>
                        <tr>
                            <td>EMAIL ID</td>
                            <td colSpan={3}>{studentDetails?.emailId || "-"}</td>
                        </tr>
                        <tr>
                            <td>AADHAR NO.</td>
                            <td colSpan={3}>{studentDetails?.aadharNo || "-"}</td>
                        </tr>
                        <tr>
                            <td>CASTE</td>
                            <td colSpan={3}>{studentDetails?.casteName || "-"}</td>
                        </tr>
                        <tr>
                            <td>FATHER NAME</td>
                            <td colSpan={3}>{studentDetails?.fatherName || "-"}</td>
                        </tr>
                        <tr>
                            <td>ANNUAL INCOME OF FATHER</td>
                            <td colSpan={3}>{studentDetails?.fatherAnnualIncome || "-"}</td>
                        </tr>
                        <tr>
                            <td>MOTHER NAME</td>
                            <td colSpan={3}>{studentDetails?.motherName || "-"}</td>
                        </tr>
                        <tr>
                            <td>ANNUAL INCOME OF MOTHER</td>
                            <td colSpan={3}>{studentDetails?.motherAnnualIncome || "-"}</td>
                        </tr>
                        <tr>
                            <td>IS THE CANDIDATE HANDICAP ?</td>
                            <td colSpan={3}>{studentDetails?.isHandicapped || "-"}</td>
                        </tr>
                        <tr>
                            <td>MINORITY SECTION (YES / NO)</td>
                            <td colSpan={3}>{studentDetails?.isMinority || "-"}</td>
                        </tr>
                        <tr>
                            <td>DOES THE CANDIDATE HAVE ANY SIBLINGS ?</td>
                            <td colSpan={3}>{studentDetails?.hasSibling || "-"}</td>
                        </tr>
                        <tr>
                            <td>IS SIBLING STUDYING IN SCHOOL ?</td>
                            <td colSpan={3}>{studentDetails?.isSiblingStudyingInSameSchool || "-"}</td>
                        </tr>
                        <tr>
                            <td>SIBLING STUDENT ID</td>
                            <td colSpan={3}>{studentDetails?.siblingStudentCode || "-"}</td>
                        </tr>
                        <tr>
                            <td>SIBLING STUDENT NAME</td>
                            <td colSpan={3}>{studentDetails?.siblingStudentName || "-"}</td>
                        </tr>
                        <tr>
                            <td>SIBLING CAMPUS/CURRICULUM/CLASS / SECTION</td>
                            <td colSpan={3}>{studentDetails?.siblingBranchName || "-"}/
                                {studentDetails?.siblingCurriculumName || "-"}/
                                {studentDetails?.siblingSectionName || "-"}
                            </td>
                        </tr>
                        <tr>
                            <td>PLEASE SHARE ANY MEDICAL CONDITION OF<br />  YOUR WARD THAT WARRANT MEDICAL PROVISION<br /> IN SCHOOL DURING BOARD EXAMS AND HENCE<br /> TAKE CONSENT FROM CBSE</td>
                            <td colSpan={3}>{studentDetails?.medicalCondition || "-"}</td>
                        </tr>
                        {!studentDetails?.isClassAboveTenth && <><tr>
                            <td>SECOND LANGUAGE</td>
                            <td colSpan={3}>{studentDetails?.secondLanguage || "-"}</td>
                        </tr>
                            <tr>
                                <td>THIRD LANGUAGE</td>
                                <td colSpan={3}>{studentDetails?.thirdLanguage || "-"}</td>
                            </tr></>}

                        {
                            studentDetails?.isClassAboveTenth && <>
                                <tr><td>SUBJECTS REGISTERED</td>
                                    <td colSpan={3}>{studentDetails?.subjectsRequired || "-"}</td></tr>
                                <tr><td>HAVE YOU REGISTED FOR SKILL SUBJECT?</td>
                                    <td colSpan={3}>{studentDetails?.haveSkillSubject || "-"}</td></tr>
                                <tr> <td>SKILL SUBJECT NAME</td>
                                    <td colSpan={3}>{studentDetails?.skillSubjectName || "-"}</td></tr>
                                <tr><td>CLASS X BOARD ROLL NO.</td>
                                    <td colSpan={3}>{studentDetails?.boardRollNo || "-"}</td></tr>
                                <tr> <td>CLASS X BOARD NAME</td>
                                    <td colSpan={3}>{studentDetails?.boardName || "-"}</td></tr>
                            </>
                        }
                    </tbody>
                </table>
                <div className="tw-font-bold tw-mb-2">
                    REQUIRE CORRECTIONS : {studentDetails?.requireCorrection || "-"}
                </div>
                <div>
                    {studentDetails?.documentMail ?
                        "We will mail the Documents with in a week's time." : 'We have Submitted the Documents.'}
                </div>
                <div>
                    DATE OF SUBMISSION : {getDisplayDateForTableFormat(studentDetails?.dateOfSubmission)}
                </div>
                <div className='tw-font-bold tw-mb-2'>
                    We parents of {studentDetails?.studentName || "-"} studying in class IX/P have carefully checked the data. We confirm the data is correct.
                    It can be submitted to CBSE. We understand that {studentDetails?.requireCorrection ? '' : 'NO'} CORRECTION/S/CHANGES WILL BE ACCEPTED BY CBSE.
                </div>
                <div className='tw-flex tw-justify-end tw-flex-col tw-items-end'>
                    <h6>{studentDetails?.signName} SIGN</h6>
                    <img src={studentDetails?.signPreviewUrl} alt="Parent Sign" />
                </div>
            </div>
        </>
    )
}

export default PreviewCbseVerificationModal;