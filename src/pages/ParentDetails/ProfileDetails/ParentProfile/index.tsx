import React, { useEffect, useState } from "react";
import { studentSection } from "./helper";
//Section Component

import { useDispatch } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import StudentDetails from "./Overview/StudentProfile";
import AcademicsDetails from "./Overview/AcademicsDetails";
import ParentsDetails from "./Overview/ParentDetails";
import SiblingDetails from "./Overview/SiblingDetails";
import IdentificationDetails from "./Overview/IdentificationDetails";
import DocumentDetails from "./Overview/DocumentDetails";
import MedicalInfoDetails from "./Overview/MedicalInfoDetails";


interface IStudentInfo {
    studentId: number;
    branchId: number;
    instituteId: number;
    academicYearId: string;
}

export default function StudentInfo(props: IStudentInfo) {
    const [activeSectionState, setActiveSectionState] = useState<string>("student_profile");
    const dispatch = useDispatch();
    
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
        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-4">

            <div className="lg:tw-col-span-3">
                <div className="left-menu-card tw-bg-white tw-rounded-lg tw-shadow ">
                    <div className="tw-p-4 menu-container">
                        <ul className="tw-space-y-2 menu-sections">
                            {studentSection.map((item: any) => (
                                <li
                                    data-id={item.id}
                                    key={item.id}
                                    onClick={changeSectionHndlr}
                                    className={`menu-options ${item.id === activeSectionState && 'active-menu-option' || ''}`}
                                >
                                    <div>
                                        <h6 className="tw-text-sm tw-font-semibold tw-mb-0">
                                            {item.title}
                                        </h6>
                                        <div className="tw-text-xs tw-opacity-80">
                                            {item.subTitle}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="lg:tw-col-span-9">
                <StudentDetails divId="student_profile" branchId={props.branchId} instituteId={props.instituteId} studentId={props.studentId} academicYearId={props.academicYearId} />
                <AcademicsDetails divId="academics" branchId={props.branchId} instituteId={props.instituteId} studentId={props.studentId} academicYearId={props.academicYearId}/>
                <IdentificationDetails divId="identification" branchId={props.branchId} instituteId={props.instituteId} academicYearId={props.academicYearId} studentId={props.studentId} />
                <MedicalInfoDetails divId="medical-info" branchId={props.branchId} instituteId={props.instituteId} studentId={props.studentId} academicYearId={props.academicYearId} canCreateAndUpdate={true}/>
                <ParentsDetails divId="parent_details" branchId={props.branchId} instituteId={props.instituteId} studentId={props.studentId} academicYearId={props.academicYearId} />
                <SiblingDetails divId="sibling_details" branchId={props.branchId} instituteId={props.instituteId} academicYearId={props.academicYearId} studentId={props.studentId} />
               <DocumentDetails divId="documents" branchId={props.branchId} instituteId={props.instituteId} studentId={props.studentId} academicYearId={props.academicYearId}/>
                {/* <OtherDetails /> */}
            </div>

        </div>
    )
}