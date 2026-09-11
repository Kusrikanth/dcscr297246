import { useMemo, useState, type MouseEvent } from "react";

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import UpdatedHorizontalTab from "../../../Components/Common/UpdatedHorizontalTab";
import { Button,
    ModalContainerUpdated } from "../../../Components/Common";
import { useModal } from "../../../hooks/modalhook";

import WorkflowsTab from "./WorkflowsTab";
import CampaignsTab from "./CampaignsTab";
import AssignmentRulesTab from "./AssignmentRulesTab";
import MetaLeadFormsTab from "./MetaLeadFormsTab";
import MetaLeadReviewTab from "./MetaLeadReviewTab";
import RemarketingTab from "./RemarketingTab";
import SyncHistoryTab from "./SyncHistoryTab";
import { pendingMetaLeads } from "./MetaLeadReviewTab/helper";
import { metaLeadForms } from "../Settings/MetaLeadAds/helper";
import AddEditAssignmentRuleModal from "./AssignmentRulesTab/AddEditAssignmentRuleModal";
import WorkflowBuilder, {
    type WorkflowFormState,
} from "./WorkflowBuilder";
import {
    assignmentRules as sampleAssignmentRules,
    automationWorkflows as sampleWorkflows,
    marketingCampaigns as sampleCampaigns,
    type AssignmentRule,
    type AutomationWorkflow,
    type MarketingCampaign,
} from "./helper";
import { toast } from "react-toastify";

const Automations = () => {
    const [activeTab, setActiveTab] = useState<string>("workflows");
    const [view, setView] = useState<string>("list");
    const [editingWorkflow, setEditingWorkflow] =
        useState<AutomationWorkflow | undefined>(undefined);

    const [workflows, setWorkflows] =
        useState<Array<AutomationWorkflow>>(sampleWorkflows);
    const [campaigns, setCampaigns] =
        useState<Array<MarketingCampaign>>(sampleCampaigns);
    const [rules, setRules] =
        useState<Array<AssignmentRule>>(sampleAssignmentRules);

    const {
        openModal: ruleOpenModal,
        closeModal: ruleCloseModal,
        modalState: ruleModalState,
    } = useModal();

    const menuOptions = useMemo(
        () => [
            {
                id: "workflows",
                labelName: "Workflows",
                customPadding: "0px 10px 0px 10px",
                count: workflows.length,
            },
            {
                id: "assignmentRules",
                labelName: "Assignment Rules",
                customPadding: "0px 10px 0px 10px",
                count: rules.length,
            },
            {
                id: "metaReview",
                labelName: "Review Meta Leads",
                customPadding: "0px 10px 0px 10px",
                count: pendingMetaLeads.length,
            },
            {
                id: "metaForms",
                labelName: "Meta Lead Forms",
                customPadding: "0px 10px 0px 10px",
                count: metaLeadForms.length,
            },
            {
                id: "remarketing",
                labelName: "Remarketing Audiences",
                customPadding: "0px 10px 0px 10px",
            },
            {
                id: "syncHistory",
                labelName: "Sync History",
                customPadding: "0px 10px 0px 10px",
            },
            {
                id: "campaigns",
                labelName: "Bulk Campaigns",
                customPadding: "0px 10px 0px 10px",
                count: campaigns.length,
            },
        ],
        [campaigns.length, rules.length, workflows.length],
    );

    const isMetaTab = [
        "metaReview",
        "metaForms",
        "remarketing",
        "syncHistory",
    ].includes(activeTab);

    const clickMenuHandler = (event: MouseEvent<HTMLElement>) => {
        const menuId = event.currentTarget.getAttribute("data-id");

        if (menuId) {
            setActiveTab(menuId);
        }
    };

    const addWorkflowHandler = () => {
        setEditingWorkflow(undefined);
        setView("builder");
    };

    const editWorkflowHandler = (workflow: AutomationWorkflow) => {
        setEditingWorkflow(workflow);
        setView("builder");
    };

    const saveWorkflowHandler = (
        form: WorkflowFormState,
        isEdit: boolean,
    ) => {
        const startAt = `${form.startDate}T${form.startTime}`;
        const definition = {
            conditions: form.conditions,
            logic: form.logic,
            actions: form.actions,
            noRecheckAfterDelay: form.noRecheckAfterDelay,
        };

        if (isEdit && editingWorkflow) {
            setWorkflows(currentList =>
                currentList.map(item =>
                    item.id === editingWorkflow.id
                        ? {
                            ...item,
                            name: form.name.trim(),
                            category: form.category,
                            startAt,
                            definition,
                        }
                        : item,
                ),
            );
        } else {
            setWorkflows(currentList => [
                {
                    id: `w-${Date.now()}`,
                    name: form.name.trim(),
                    category: form.category,
                    createdBy: "Srikanth Reddy",
                    createdAt: new Date().toISOString(),
                    startAt,
                    isActive: true,
                    lastStatus: "",
                    completedCount: 0,
                    failedCount: 0,
                    skippedCount: 0,
                    pendingCount: 0,
                    definition,
                },
                ...currentList,
            ]);
        }

        toast.success(
            isEdit
                ? "Automation workflow updated"
                : "Automation workflow saved"
        );
        setEditingWorkflow(undefined);
        setView("list");
    };

    const toggleWorkflowStatusHandler = (workflow: AutomationWorkflow) => {
        setWorkflows(currentList =>
            currentList.map(item =>
                item.id === workflow.id
                    ? { ...item, isActive: !item.isActive }
                    : item,
            ),
        );
        toast.success(`"${workflow.name}" ${workflow.isActive ? "paused" : "activated"}`);
    };

    const runWorkflowHandler = (workflow: AutomationWorkflow) => {
        setWorkflows(currentList =>
            currentList.map(item =>
                item.id === workflow.id
                    ? { ...item, lastStatus: "running", pendingCount: 0 }
                    : item,
            ),
        );
        toast.success(`"${workflow.name}" queued for an immediate run`);
    };

    const deleteWorkflowHandler = (workflow: AutomationWorkflow) => {
        setWorkflows(currentList =>
            currentList.filter(item => item.id !== workflow.id),
        );
        toast.success(`"${workflow.name}" deleted`);
    };

    const campaignStatusHandler = (
        campaign: MarketingCampaign,
        status: string,
    ) => {
        setCampaigns(currentList =>
            currentList.map(item =>
                item.id === campaign.id
                    ? {
                        ...item,
                        status,
                        updatedAt: new Date().toISOString(),
                    }
                    : item,
            ),
        );
        toast.success(`"${campaign.name}" marked ${status.toLowerCase()}`);
    };

    const saveRuleHandler = (rule: AssignmentRule, isEdit: boolean) => {
        setRules(currentList =>
            isEdit
                ? currentList.map(item =>
                    item.id === rule.id ? rule : item,
                )
                : [rule, ...currentList],
        );
        toast.success(
            isEdit
                ? "Assignment rule updated"
                : "Assignment rule created"
        );
    };

    const toggleRuleStatusHandler = (rule: AssignmentRule) => {
        setRules(currentList =>
            currentList.map(item =>
                item.id === rule.id
                    ? { ...item, isActive: !item.isActive }
                    : item,
            ),
        );
        toast.success(`"${rule.name}" ${rule.isActive ? "disabled" : "enabled"}`);
    };

    const deleteRuleHandler = (rule: AssignmentRule) => {
        setRules(currentList =>
            currentList.filter(item => item.id !== rule.id),
        );
        toast.success(`"${rule.name}" deleted`);
    };

    if (view === "builder") {
        return (
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb pageTitle="CRM" />

                    <WorkflowBuilder
                        workflow={editingWorkflow}
                        onCancel={() => {
                            setEditingWorkflow(undefined);
                            setView("list");
                        }}
                        onSave={saveWorkflowHandler}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="page-content">
            <div className="container-fluid">
                <BreadCrumb pageTitle="CRM" />

                <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-3">
                    <div className="tw-flex-1">
                        <UpdatedHorizontalTab
                            MenuOptions={menuOptions}
                            clickMenuHandler={clickMenuHandler}
                            activeTabId={activeTab}
                            showBadge
                            horizontalClass=""
                        />
                    </div>

                    {activeTab === "assignmentRules" ? (
                        <Button
                            type="button"
                            variant="primary"
                            onClick={() => ruleOpenModal()}
                        >
                            <i className="ri-add-fill tw-me-1"></i>
                            Add Assignment Rule
                        </Button>
                    ) : isMetaTab ? null : (
                        <Button
                            type="button"
                            variant="primary"
                            onClick={addWorkflowHandler}
                        >
                            <i className="ri-add-fill tw-me-1"></i>
                            Add Workflow
                        </Button>
                    )}
                </div>

                <div className="tw-mt-3">
                    {activeTab === "workflows" && (
                        <WorkflowsTab
                            workflows={workflows}
                            onEdit={editWorkflowHandler}
                            onToggleStatus={toggleWorkflowStatusHandler}
                            onRunNow={runWorkflowHandler}
                            onDelete={deleteWorkflowHandler}
                        />
                    )}

                    {activeTab === "campaigns" && (
                        <CampaignsTab
                            campaigns={campaigns}
                            onStatusChange={campaignStatusHandler}
                        />
                    )}

                    {activeTab === "assignmentRules" && (
                        <AssignmentRulesTab
                            rules={rules}
                            onEdit={rule => ruleOpenModal(rule)}
                            onToggleStatus={toggleRuleStatusHandler}
                            onDelete={deleteRuleHandler}
                        />
                    )}

                    {activeTab === "metaReview" && <MetaLeadReviewTab />}

                    {activeTab === "metaForms" && <MetaLeadFormsTab />}

                    {activeTab === "remarketing" && <RemarketingTab />}

                    {activeTab === "syncHistory" && <SyncHistoryTab />}
                </div>

                <ModalContainerUpdated
                    id="crm-automation-rule-modal"
                    isOpen={ruleModalState.showModal}
                    toggle={ruleCloseModal}
                    modalTitle={
                        ruleModalState.modalData
                            ? "Edit Assignment Rule"
                            : "Add Assignment Rule"
                    }
                    modalSize="lg"
                >
                    <AddEditAssignmentRuleModal
                        data={ruleModalState.modalData}
                        toggle={ruleCloseModal}
                        onSave={saveRuleHandler}
                    />
                </ModalContainerUpdated>
            </div>
        </div>
    );
};

export default Automations;
