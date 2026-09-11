import React, { useEffect, useState } from "react";
import { studentSection } from "./helper";
//Section Component
import StudentDetails from "./StudentDetails";
import SiblingDetails from "./SiblingDetails";
import DocumentDetails from "./DocumentDetails";
import AcademicsDetails from "./AcademicsDetails";
import IdentificationDetails from "./IdentificationDetails";
import PastEducationDetails from "./PastEducationDetails";
import MedicalInfoDetails from "./MedicalInfoDetails";
import ParentsDetails from "./ParentsDetails";
import { useDispatch } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getStudentByIdAct } from "../../../../store/directory/studentmanagement/studentmanagementactions";
import CommunicationDetails from "./CommunicationDetails";
import ParmanentAddressDetails from "./PermanentAddressDetails";

interface IStudentInfo {
    studentId: number;
    branchId: number;
    instituteId: number;
    academicYearId: string;
    canCreateAndUpdate: boolean
}

export default function StudentInfo(props: IStudentInfo) {
    const [activeSectionState, setActiveSectionState] = useState<string>("student_profile");
    const dispatch = useDispatch();
    useEffect(() => {
        const { academicYearId, studentId } = props;
        if (studentId && academicYearId)
            dispatch(getStudentByIdAct(generateActionPayload("get_students_by_id",
                { studentId: props.studentId }, { academicYearId, branchId: props.branchId })));
    }, []);
    function changeSectionHndlr(event: React.MouseEvent<HTMLLIElement>) {
        const sectionId = event.currentTarget.getAttribute("data-id");
        if (sectionId) {
            setActiveSectionState(sectionId);
            const sectionDivId = document.getElementById(sectionId);
            if (sectionDivId) {
                window.scrollTo({
                    behavior: 'smooth',
                    top: sectionDivId.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 64
                })
            }
        }
    }
    return (
        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            {/* Left Menu */}
            <div className="tw-col-span-12 lg:tw-col-span-3 2xl:tw-col-span-3">
                <div className="tw-bg-white tw-rounded-lg tw-shadow left-menu-card">
                    <div className="tw-p-4 menu-container">
                        <ul className="menu-sections tw-space-y-1">
                            {studentSection.map((item: any) => (
                                <li
                                    key={item.id}
                                    data-id={item.id}
                                    onClick={changeSectionHndlr}
                                    className={`menu-options tw-cursor-pointer tw-rounded-md tw-px-3 tw-py-2 hover:tw-bg-gray-100 
                                ${item.id === activeSectionState
                                            ? "active-menu-option tw-bg-gray-100 tw-font-semibold"
                                            : ""
                                        }`}
                                >
                                    <div>
                                        <h6 className="title tw-mb-0 tw-text-sm">
                                            {item.title}
                                        </h6>
                                        {/* <div className="title-desc">{item.subTitle}</div> */}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="tw-col-span-12 lg:tw-col-span-9 2xl:tw-col-span-9">
                <StudentDetails
                    divId="student_profile"
                    branchId={props.branchId}
                    instituteId={props.instituteId}
                    studentId={props.studentId}
                    academicYearId={props.academicYearId}
                    canCreateAndUpdate={props.canCreateAndUpdate}
                />

                <AcademicsDetails
                    divId="academics"
                    branchId={props.branchId}
                    instituteId={props.instituteId}
                    studentId={props.studentId}
                    academicYearId={props.academicYearId}
                    canCreateAndUpdate={props.canCreateAndUpdate}
                />

                <IdentificationDetails
                    divId="identification"
                    branchId={props.branchId}
                    instituteId={props.instituteId}
                    studentId={props.studentId}
                    academicYearId={props.academicYearId}
                    canCreateAndUpdate={props.canCreateAndUpdate}      
                />

                <PastEducationDetails
                    divId="past_education"
                    branchId={props.branchId}
                    instituteId={props.instituteId}
                    studentId={props.studentId}
                    academicYearId={props.academicYearId}
                    canCreateAndUpdate={props.canCreateAndUpdate}
                />

                <MedicalInfoDetails
                    divId="medical_info"
                    branchId={props.branchId}
                    instituteId={props.instituteId}
                    studentId={props.studentId}
                    academicYearId={props.academicYearId}
                    canCreateAndUpdate={props.canCreateAndUpdate}
                />

                <ParentsDetails
                    divId="parents_data"
                    branchId={props.branchId}
                    instituteId={props.instituteId}
                    studentId={props.studentId}
                    academicYearId={props.academicYearId}
                    canCreateAndUpdate={props.canCreateAndUpdate}
                />

                <SiblingDetails
                    divId="sibling_details"
                    branchId={props.branchId}
                    instituteId={props.instituteId}
                    academicYearId={props.academicYearId}
                    studentId={props.studentId}
                    canCreateAndUpdate={props.canCreateAndUpdate}
                />

                <CommunicationDetails
                    divId="communication_details"
                    branchId={props.branchId}
                    instituteId={props.instituteId}
                    academicYearId={props.academicYearId}
                    studentId={props.studentId}
                    canCreateAndUpdate={props.canCreateAndUpdate}
                />

                <ParmanentAddressDetails
                    divId="permanent_address_details"
                    branchId={props.branchId}
                    instituteId={props.instituteId}
                    academicYearId={props.academicYearId}
                    studentId={props.studentId}
                    canCreateAndUpdate={props.canCreateAndUpdate}
                />

                <DocumentDetails
                    divId="documents"
                    branchId={props.branchId}
                    instituteId={props.instituteId}
                    studentId={props.studentId}
                    academicYearId={props.academicYearId}
                    canCreateAndUpdate={props.canCreateAndUpdate}
                />
            </div>
        </div>

    )
}