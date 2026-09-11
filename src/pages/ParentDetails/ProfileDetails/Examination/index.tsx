import React, { useState } from "react";
import { studentSection } from "./helper";
import { useDispatch } from "react-redux";
import ReportCard from "./Overview/ReportCard";
import ParentGuardianCard from "./Overview/ParentGuardianContainer";

interface IExaminationInfo {
    studentId: number;
    branchId: number;
    instituteId: number;
    academicYearId: string;
}

export default function ExaminationInfo(props: IExaminationInfo) {
    const [activeSectionState, setActiveSectionState] = useState<string>("admit-card");
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
        <div>
            <div className="examination-setting tw-flex tw-justify-start tw-ps-0 menu-container">
                <ul className="tw-bg-white tw-rounded-xl tw-py-2 tw-px-2 tw-my-2 menu-sections tw-flex">
                    {studentSection.map((item) => (
                        <li
                            data-id={item.id}
                            key={item.id}
                            onClick={changeSectionHndlr}
                            className={`menu-options mb-0 ${item.id === activeSectionState ? 'active-menu-option' : ''}`}
                        >
                            <div>
                                <h6 className="tw-text-sm tw-font-medium tw-mb-0">{item.title}</h6>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="tw-w-full">
                {activeSectionState === "admit-card" && (
                    <ParentGuardianCard
                        divId="admit-card"
                        branchId={props.branchId}
                        instituteId={props.instituteId}
                        studentId={props.studentId}
                        academicYearId={props.academicYearId}
                    />
                )}
                {activeSectionState === "report-card" && (
                    <ReportCard
                        divId="report-card"
                        branchId={props.branchId}
                        instituteId={props.instituteId}
                        studentId={props.studentId}
                        academicYearId={props.academicYearId}
                    />
                )}
            </div>
        </div>
    );
}
