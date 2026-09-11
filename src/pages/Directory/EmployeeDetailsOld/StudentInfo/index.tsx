import React, { useState } from "react";
import { studentSection } from "./helper";
//Section Component
import ContactDetails from "./ContactDetails";
import StudentDetails from "./StudentDetails";
import ParentInfo from "./ParentInfo";
import SiblingDetails from "./SiblingDetails";
import DocumentDetails from "./DocumentDetails";
import OtherDetails from "./OtherDetails";



export default function StudentInfo() {
    const [activeSectionState, setActiveSectionState] = useState<string>("personal_info");
    function changeSectionHndlr(event: React.MouseEvent<HTMLLIElement>) {
        const sectionId = event.currentTarget.getAttribute("data-id");
        if (sectionId)
            setActiveSectionState(sectionId);
    }
    return (
        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-6">
            <div className="lg:tw-col-span-3">
                <div className="tw-bg-white tw-shadow tw-rounded-lg">
                    <div className="tw-p-4 menu-container">
                        <ul className="menu-sections">
                            {studentSection.map((item: any) => (
                                <li
                                    data-id={item.id}
                                    key={item.id}
                                    onClick={changeSectionHndlr}
                                    className={`menu-options  
                                            ${item.id === activeSectionState
                                            ? "active-menu-option"
                                            : ""
                                        }`}
                                >
                                    <div>
                                        <h5 className="tw-text-sm tw-font-semibold tw-mb-0">
                                            {item.title}
                                        </h5>
                                        <div className="tw-text-xs tw-text-gray-500">
                                            {item.subTitle}
                                        </div>
                                    </div>
                                </li>
                            ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
            <div className="lg:tw-col-span-9">
                <StudentDetails />
                <ContactDetails />
                <ParentInfo />
                <SiblingDetails />
                <DocumentDetails />
                <OtherDetails />
            </div>
        </div >
    )
}