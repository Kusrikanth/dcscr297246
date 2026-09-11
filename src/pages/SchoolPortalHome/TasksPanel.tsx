import React, { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Comment01Icon,
  PlusSignIcon,
  Task01Icon,
  Tick02Icon,
  UserSwitchIcon,
} from "@hugeicons-pro/core-stroke-standard";
import {
  CustomSelect,
  SelectInput,
  TextInput,
} from "../../Components/Common";
import NoDataComp from "../../Components/Common/NoDataComp";
import Button from "../../Components/Common/Button";
import UpdatedHorizontalTab from "../../Components/Common/UpdatedHorizontalTab";
import { getDateWithTimeFormat } from "../../utility/dateutility";
import { CustomDatePicker } from "../DashBoardBranchSummary/CustomDatePicker";
import AddTaskModal, { INewTaskValues } from "./AddTaskModal";
import CloseTaskModal from "./CloseTaskModal";
import ReassignTaskModal from "./ReassignTaskModal";
import TaskCommentsModal from "./TaskCommentsModal";
import {
  findEmployeeById,
  IPortalTask,
  renderEmployeeOption,
  renderEmployeeValue,
  searchableEmployees,
  taskDateTypeOptions,
} from "./helper";

interface ITasksPanelProps {
  tasks: Array<IPortalTask>;
  onCloseTask: (id: string, remarks: string) => void;
  onAddTask: (task: INewTaskValues) => void;
  onReassignTask: (id: string, assigneeId: string, remarks: string) => void;
  onAddComment: (id: string, comment: string) => void;
}

const initialFilterState = {
  dateType: "deadline",
  startDate: "",
  endDate: "",
  userFilter: "",
  keyword: "",
};

const TasksPanel: React.FC<ITasksPanelProps> = ({
  tasks,
  onCloseTask,
  onAddTask,
  onReassignTask,
  onAddComment,
}) => {
  const [activeTabId, setActiveTabId] = useState("open");
  const [filterState, setFilterState] = useState({ ...initialFilterState });
  const [closingTask, setClosingTask] = useState<IPortalTask | undefined>();
  const [reassigningTask, setReassigningTask] = useState<
    IPortalTask | undefined
  >();
  const [commentingTask, setCommentingTask] = useState<
    IPortalTask | undefined
  >();
  const [showAddModal, setShowAddModal] = useState(false);

  const openCount = tasks.filter((item) => item.status === "open").length;
  const completedCount = tasks.length - openCount;

  const selectedUser = findEmployeeById(filterState.userFilter);

  const visibleTasks = useMemo(() => {
    return tasks.filter((task) => {
      const taskDate = (task as any)[filterState.dateType]?.slice(0, 10);
      const searchable =
        `${task.title} ${task.id} ${task.source} ${task.owner} ${task.assignee} ${task.deadline
          } ${task.remarks || ""} ${(task.comments || [])
            .map((comment) => comment.text)
            .join(" ")}`.toLowerCase();

      return (
        task.status === activeTabId &&
        (!filterState.startDate ||
          (taskDate &&
            taskDate >= filterState.startDate &&
            taskDate <= (filterState.endDate || filterState.startDate))) &&
        (!selectedUser || task.assignee === selectedUser.name) &&
        (!filterState.keyword.trim() ||
          searchable.includes(filterState.keyword.trim().toLowerCase()))
      );
    });
  }, [tasks, activeTabId, filterState, selectedUser]);

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFilterState((prevState) => ({ ...prevState, [name]: value }));
  }

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const menuId = event.currentTarget.getAttribute("data-id");
    setActiveTabId(menuId || "open");
  }

  function onChangeDateRangeHndlr({ startDate, endDate }: any) {
    setFilterState((prevState) => ({
      ...prevState,
      startDate: startDate || "",
      endDate: endDate || "",
    }));
  }

  function clearFiltersHndlr() {
    setFilterState((prevState) => ({
      ...prevState,
      userFilter: "",
      startDate: "",
      endDate: "",
    }));
  }

  const showClearFilters = Boolean(
    filterState.userFilter || filterState.startDate
  );

  return (
    <div className="tw-card tw-mb-0 tw-h-full !tw-overflow-visible">
      <div className="tw-card-header tw-flex tw-items-start tw-gap-3">
        <div className="tw-flex-grow tw-min-w-0">
          <h4 className="tw-card-title">My Tasks</h4>
          <p className="tw-card-subTitle">
            Tasks assigned to you and your team
          </p>
        </div>
        <div className="tw-flex-shrink-0">
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <HugeiconsIcon icon={PlusSignIcon} size={15} />
            <span>Add</span>
          </Button>
        </div>
      </div>

      <div className="tw-card-body">
        <UpdatedHorizontalTab
          MenuOptions={[
            {
              id: "open",
              labelName: "Open",
              count: openCount,
              customPadding: "0px 10px 4px 10px",
            },
            {
              id: "completed",
              labelName: "Completed",
              count: completedCount,
              customPadding: "0px 10px 4px 10px",
            },
          ]}
          clickMenuHandler={clickMenuHandler}
          activeTabId={activeTabId}
          showBadge
          horizontalClass="tw-border-b tw-border-gray-200 tw-mb-3"
          tabWrapperClass="!tw-border-0"
        />

        <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-mb-3">
          <div className="tw-col-span-12 lg:tw-col-span-8">
            <div className="search-box">
              <TextInput
                name="keyword"
                value={filterState.keyword}
                onChange={onChangeFilterHndlr}
                inputClassName="tw-bg-gray-100"
                formgroupClassName="tw-mb-0"
                placeHolder="Search tasks by title, ID, source, assignee or comment"
                maxLength={80}
              />
              <i className="ri-search-line search-icon" />
            </div>
          </div>

          <div className="tw-col-span-12 lg:tw-col-span-4">
            <CustomSelect
              name="userFilter"
              idKey="id"
              searchKey="searchLabel"
              defaultSelect="All users"
              value={filterState.userFilter}
              options={searchableEmployees}
              renderValue={renderEmployeeValue}
              renderOptions={renderEmployeeOption}
              onChange={(userFilter: string) =>
                setFilterState((prevState) => ({ ...prevState, userFilter }))
              }
            />
          </div>

          <div className="tw-col-span-6 lg:tw-col-span-4">
            <SelectInput
              name="dateType"
              value={filterState.dateType}
              onChange={onChangeFilterHndlr}
              menuItems={taskDateTypeOptions}
              valueKey="key"
              textKey="name"
              hideSelectOption
              formgroupClassName="tw-mb-0"
            />
          </div>

          <div className="tw-col-span-6 lg:tw-col-span-6">
            <CustomDatePicker
              name="taskDateRange"
              placeholder="Date range"
              formgroupClassName="tw-mb-0"
              startDate={filterState.startDate || null}
              endDate={filterState.endDate || null}
              onChange={onChangeDateRangeHndlr}
              portalId="ui-task-range-portal"
            />
          </div>
          {showClearFilters && (
            <div className="tw-mb-3 tw-col-span-2">
              <Button variant="linkBtn" onClick={clearFiltersHndlr}>
                Clear filters
              </Button>
            </div>
          )}
        </div>


        <div className="tw-flex tw-flex-col tw-gap-2">
          {visibleTasks.length ? (
            visibleTasks.map((task) => (
              <div
                key={task.id}
                className="tw-border tw-rounded-md tw-p-3 tw-flex tw-items-start tw-gap-3"
              >
                <span
                  className={`tw-flex tw-items-center tw-justify-center tw-rounded-md tw-w-9 tw-h-9 tw-flex-shrink-0 ${task.status === "open"
                    ? "tw-bg-orange-50 tw-text-orange-600"
                    : "tw-bg-green-50 tw-text-green-600"
                    }`}
                >
                  <HugeiconsIcon icon={Task01Icon} size={17} />
                </span>

                <div className="tw-flex-grow tw-min-w-0">
                  <strong className="tw-text-sm tw-block">{task.title}</strong>
                  <p className="tw-text-xs tw-text-gray-500 tw-mb-0">
                    {task.id} · {task.source}
                    {task.comments?.length
                      ? ` · ${task.comments.length} comment${task.comments.length > 1 ? "s" : ""
                      }`
                      : ""}
                  </p>
                  <small className="tw-text-gray-500">
                    {task.status === "open"
                      ? `Assigned to ${task.assignee} · Due ${getDateWithTimeFormat(
                        task.deadline
                      )}`
                      : `Closed ${task.closedAt} · ${task.remarks}`}
                  </small>
                </div>

                {task.status === "open" ? (
                  <div className="tw-flex tw-items-center tw-gap-2 tw-flex-shrink-0">
                    <button
                      type="button"
                      title="Add comment"
                      className="btn btn-sm btn-soft-secondary tw-relative"
                      onClick={() => setCommentingTask(task)}
                    >
                      <HugeiconsIcon icon={Comment01Icon} size={16} />
                    </button>
                    <button
                      type="button"
                      title="Reassign action"
                      className="btn btn-sm btn-soft-info"
                      onClick={() => setReassigningTask(task)}
                    >
                      <HugeiconsIcon icon={UserSwitchIcon} size={16} />
                    </button>
                    <button
                      type="button"
                      title="Close action"
                      className="btn btn-sm btn-soft-success"
                      onClick={() => setClosingTask(task)}
                    >
                      <HugeiconsIcon icon={Tick02Icon} size={16} />
                    </button>
                  </div>
                ) : (
                  <span className="badge badge-soft-success text-uppercase tw-flex-shrink-0">
                    Completed
                  </span>
                )}
              </div>
            ))
          ) : (
            <NoDataComp
              title={`No matching ${activeTabId} actions`}
              helperText="Change or clear the date range and employee filters."
            />
          )}
        </div>

        {showAddModal && (
          <AddTaskModal
            isOpen
            toggle={() => setShowAddModal(false)}
            onCreate={(task) => {
              onAddTask(task);
              setShowAddModal(false);
              setActiveTabId("open");
            }}
          />
        )}

        {closingTask && (
          <CloseTaskModal
            isOpen
            task={closingTask}
            toggle={() => setClosingTask(undefined)}
            onConfirm={(remarks) => {
              onCloseTask(closingTask.id, remarks);
              setClosingTask(undefined);
              setActiveTabId("completed");
            }}
          />
        )}

        {reassigningTask && (
          <ReassignTaskModal
            isOpen
            task={reassigningTask}
            toggle={() => setReassigningTask(undefined)}
            onReassign={(assigneeId, remarks) => {
              onReassignTask(reassigningTask.id, assigneeId, remarks);
              setReassigningTask(undefined);
            }}
          />
        )}

        {commentingTask && (
          <TaskCommentsModal
            isOpen
            task={commentingTask}
            toggle={() => setCommentingTask(undefined)}
            onAddComment={(comment) => {
              onAddComment(commentingTask.id, comment);
              setCommentingTask(undefined);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TasksPanel;
