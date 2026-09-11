import React, { useState } from "react";
import { toast } from "react-toastify";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import WelcomeBand from "./WelcomeBand";
import MetricCards from "./MetricCards";
import ApprovalsPanel from "./ApprovalsPanel";
import TasksPanel from "./TasksPanel";
import WorkingCalendar from "./WorkingCalendar";
import BirthdaysPanel from "./BirthdaysPanel";
import HomeworkPanel from "./HomeworkPanel";
import CommunicationPanel from "./CommunicationPanel";
import FeedPanel from "./FeedPanel";
import EventsPanel from "./EventsPanel";
import { IApprovalAction } from "./ApprovalDecisionModal";
import { INewTaskValues } from "./AddTaskModal";
import {
  currentUser,
  findEmployeeById,
  IApprovalRequest,
  initialApprovals,
  initialTasks,
  IPortalTask,
} from "./helper";
import { getDateWithTimeFormat } from "../../utility/dateutility";

const SchoolPortalHome: React.FC = () => {
  const [approvals, setApprovals] =
    useState<Array<IApprovalRequest>>(initialApprovals);
  const [tasks, setTasks] = useState<Array<IPortalTask>>(initialTasks);

  const mandatoryCount = approvals.filter(
    (item) => item.requirement === "mandatory"
  ).length;

  function approvalDecisionHndlr(
    request: IApprovalRequest,
    action: IApprovalAction,
    reason: string
  ) {
    setApprovals((prevState) =>
      prevState.filter((item) => item.id !== request.id)
    );
    const completedAction =
      action === "approve"
        ? "approved"
        : action === "acknowledge"
          ? "acknowledged"
          : "rejected";
    toast.success(
      `${request.type} ${completedAction}${reason ? " with a note" : ""}.`
    );
  }

  function addTaskHndlr(task: INewTaskValues) {
    const assignee = findEmployeeById(task.assignee);
    setTasks((prevState) => [
      {
        id: `ACT-${prevState.length + 300}`,
        title: task.title,
        owner: currentUser.name,
        assignee: assignee?.name || currentUser.name,
        createdAt: new Date().toISOString(),
        deadline: task.deadline,
        source: "Manual action",
        status: "open",
      },
      ...prevState,
    ]);
    toast.success("New action created.");
  }

  function calendarTaskHndlr(
    task: INewTaskValues,
    ownerId: string,
    sourceDate: string
  ) {
    const owner = findEmployeeById(ownerId);
    const assignee = findEmployeeById(task.assignee);
    setTasks((prevState) => [
      {
        id: `ACT-${prevState.length + 300}`,
        title: task.title,
        owner: owner?.name || currentUser.name,
        assignee: assignee?.name || currentUser.name,
        createdAt: `${sourceDate}T09:00`,
        deadline: task.deadline,
        source: `Calendar · ${sourceDate}`,
        status: "open",
      },
      ...prevState,
    ]);
    toast.success("Calendar note saved and action created.");
  }

  function closeTaskHndlr(id: string, remarks: string) {
    const now = new Date();
    setTasks((prevState) =>
      prevState.map((task) =>
        task.id === id
          ? {
            ...task,
            status: "completed",
            remarks,
            completedDate: now.toISOString(),
            closedAt: getDateWithTimeFormat(now.toISOString()),
          }
          : task
      )
    );
    toast.success("Action marked as completed.");
  }

  function reassignTaskHndlr(id: string, assigneeId: string, remarks: string) {
    const assignee = findEmployeeById(assigneeId);
    setTasks((prevState) =>
      prevState.map((task) =>
        task.id === id
          ? {
            ...task,
            previousAssignee: task.assignee,
            assignee: assignee?.name || task.assignee,
            reassignmentRemarks: remarks,
          }
          : task
      )
    );
    toast.success(`Action reassigned to ${assignee?.name}.`);
  }

  function addCommentHndlr(id: string, text: string) {
    const entry = {
      id: Date.now(),
      text,
      author: currentUser.name,
      createdAt: getDateWithTimeFormat(new Date().toISOString()),
    };
    setTasks((prevState) =>
      prevState.map((task) =>
        task.id === id
          ? { ...task, comments: [...(task.comments || []), entry] }
          : task
      )
    );
    toast.success("Comment added. Action remains open.");
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="DPS" pageTitle="DPS" />

          <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-mb-6">
            <div className="tw-col-span-12">
              <WelcomeBand />
            </div>

            <MetricCards
              pendingCount={approvals.length}
              mandatoryCount={mandatoryCount}
              acknowledgementCount={approvals.length - mandatoryCount}
              showPendingCard={currentUser.canApprove}
            />

            {currentUser.canApprove && approvals.length > 0 && (
              <div className="tw-col-span-12 xl:tw-col-span-6">
                <ApprovalsPanel
                  approvals={approvals}
                  onDecision={approvalDecisionHndlr}
                />
              </div>
            )}

            {tasks.some((task) => task.status === "open") && (
              <div className="tw-col-span-12 xl:tw-col-span-6">
                <TasksPanel
                  tasks={tasks}
                  onCloseTask={closeTaskHndlr}
                  onAddTask={addTaskHndlr}
                  onReassignTask={reassignTaskHndlr}
                  onAddComment={addCommentHndlr}
                />
              </div>
            )}

            <div className="tw-col-span-12 xl:tw-col-span-8">
              <WorkingCalendar onTaskCreated={calendarTaskHndlr} />
            </div>

            <div className="tw-col-span-12 md:tw-col-span-6 xl:tw-col-span-4">
              <BirthdaysPanel />
            </div>

            <div className="tw-col-span-12 xl:tw-col-span-8">
              <HomeworkPanel />
            </div>

            <div className="tw-col-span-12 md:tw-col-span-6 xl:tw-col-span-4">
              <EventsPanel />
            </div>

            <div className="tw-col-span-12 xl:tw-col-span-8">
              <CommunicationPanel />
            </div>

            <div className="tw-col-span-12 md:tw-col-span-6 xl:tw-col-span-4">
              <FeedPanel />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SchoolPortalHome;
