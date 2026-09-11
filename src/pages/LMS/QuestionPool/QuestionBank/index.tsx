import React, { useMemo, useState } from "react";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import QuestionBankUpload from "./QuestionBankUpload";
import QuestionBankBulkUpload from "./QuestionBankBulkUpload";
import GlobalRepository from "./GlobalRepository";
import RoleManagement from "./RoleManagement";

const QuestionBank = () => {

    const [activeId, setActiveId] = useState<any>("questionBankUpload");

    const MenuOptions = [
        {
            id: "questionBankUpload",
            labelName: "Question Bank Repository",
            customPadding: "0px 15px",
        },
        {
            id: "globalRepository",
            labelName: "Question Pool Library",
            customPadding: "0px 15px",
        },
        {
            id: "roleManagement",
            labelName: "Role Management",
            customPadding: "0px 15px",
        },
        {
            id: "questionBankBulkUpload",
            labelName: "Bulk Upload",
            customPadding: "0px 15px",
        },
    ];
    function getActiveMenuComponent(menuId: string) {
        switch (menuId) {
            case "questionBankUpload":
                return QuestionBankUpload;
            case "questionBankBulkUpload":
                return QuestionBankBulkUpload;
            case "globalRepository":
                return GlobalRepository;
            case "roleManagement":
                return RoleManagement;
            default:
                return null;
        }
    }
    function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
        const { currentTarget } = event,
            menuId = currentTarget.getAttribute("data-id");
        setActiveId(menuId);
    }
    const activeComponent = useMemo(() => {
        const TabComponent: any = getActiveMenuComponent(activeId);
        return (
            <TabComponent />
        );
    }, [activeId]);
    return (
        <>
            <div className="page-content free_payment_record_wrapper">
                <div className="container-fluid">
                    <BreadCrumb title="Question Bank" pageTitle="LMS" />

                    <div className="card mb-0">
                        <div className="card-header pb-0">
                            <div className="row align-items-center">
                                <div className="col-12">
                                    <h4 className="card-title mb-0 flex-grow-1">
                                        Question Bank
                                    </h4>
                                </div>
                            </div>
                            <UpdatedHorizontalTab
                                MenuOptions={MenuOptions}
                                clickMenuHandler={clickMenuHandler}
                                activeTabId={activeId}
                                showBadge={true}
                                horizontalClass="pt-2 mb-0 overflow-auto text-nowrap"
                            />
                        </div>
                    </div>
                    <div className="card-body p-0">
                        {activeComponent}
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuestionBank;
