

//Common Component
import React, { useState, useMemo } from "react";

//Component
import ClassTerm from "./ClassTerm";
// import BranchInfo from "./BranchInfo";
// import BranchDetails from "./BankDetails";

// function getActiveMenuComponent(tabId: string | null) {
//     switch (tabId) {
//         case "academic-term":
//             return TermInfo;
//         case "academic-term-for-preprimary":
//             return PrePrimary;
//         case "class-wise-term-date":
//             return ClassTerm;
//     }
// }

interface IAcademicTermsProps {
    instituteId: string,
    instituteName: string,
    branchId: string
}
export const AcdemicTerms: React.FC<IAcademicTermsProps> = ({ instituteId, instituteName, branchId }) => {
    const [activeTabId, setActiveTabId] = useState<string | null>("class-wise-term-date");

    function tabChangeHndlr(tabId: string) {
        setActiveTabId(tabId);
    }

    const activeComponent = useMemo(() => {
        // const TabComponent: any = getActiveMenuComponent(activeTabId);
        // return <TabComponent instituteId={instituteId} branchId={branchId} instituteName={instituteName} />
    }, [activeTabId]);

    return (
        <React.Fragment>
            <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200" >
                {/* <CardHeader className="rounded">
                    <Tabs
                        activeTabId={activeTabId}
                        tabChangeHndlr={tabChangeHndlr}
                        tabsList={tabsOptions}
                        navContainerClass="card-header-tabs border-bottom-0 nav-tabs"
                    />
                </CardHeader> */}
                <ClassTerm
                    instituteId={instituteId} branchId={branchId} instituteName={instituteName}
                />
                {/* <CardHeader>
                    <h4 className="card-title mb-0 flex-grow-1">Class Wise Term Date</h4>
                </CardHeader>
                <CardBody className="p-0">
                    {activeComponent}
                </CardBody> */}
            </div>
        </React.Fragment>
    )
}

export default AcdemicTerms;