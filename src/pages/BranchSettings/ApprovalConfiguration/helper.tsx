import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon } from "@hugeicons-pro/core-stroke-standard";
import { CustomSelect, Switch, TextInput } from "../../../Components/Common";
import {
  approvalEmployees,
  getClassScopeLabel,
  starterActivities,
  IActivityParticipant,
  IApprovalActivity,
  IApprovalEmployee,
} from "../../../utility/approvalconfigutility";

export type { IActivityParticipant, IApprovalActivity, IApprovalEmployee };
export { approvalEmployees, starterActivities };

export function getSearchableApprovalEmployees(
  employees: Array<IApprovalEmployee>
) {
  return employees.map((employee) => ({
    ...employee,
    searchLabel: `${employee.name} ${employee.id} ${employee.title} ${employee.department}`,
  }));
}

export function findApprovalEmployee(
  id?: string,
  employees: Array<IApprovalEmployee> = approvalEmployees
) {
  return employees.find((employee) => `${employee.id}` === `${id}`);
}

export function renderApprovalEmployeeOption(item: IApprovalEmployee) {
  return (
    <div className="tw-flex tw-items-center tw-justify-between tw-gap-3 tw-w-full">
      <span className="tw-flex tw-flex-col">
        <span className="tw-font-medium">{item?.name}</span>
        <small className="tw-text-gray-500">{item?.title}</small>
      </span>
      <span className="tw-flex tw-flex-col tw-text-end">
        <span className="tw-text-xs">{item?.id}</span>
        <small className="tw-text-gray-500">{item?.department}</small>
      </span>
    </div>
  );
}

export function renderApprovalEmployeeValue(item: IApprovalEmployee) {
  if (!item) return null;
  return (
    <span className="tw-truncate">
      {item?.name}
      <small className="tw-text-gray-500 tw-ms-1">
        {item?.id} · {item?.department}
      </small>
    </span>
  );
}

export interface IParticipantColumnHandlers {
  onChangeParticipant: (
    index: number,
    changes: Partial<IActivityParticipant>
  ) => void;
  onRemoveParticipant: (index: number) => void;
  onEditClassScope: (index: number) => void;
  onMoveParticipant: (index: number, direction: "up" | "down") => void;
  participants: Array<IActivityParticipant>;
  employees: Array<IApprovalEmployee>;
}

export function generateParticipantColumns({
  onChangeParticipant,
  onRemoveParticipant,
  onEditClassScope,
  onMoveParticipant,
  participants,
  employees,
}: IParticipantColumnHandlers) {
  const searchableEmployees = getSearchableApprovalEmployees(employees);

  function changeEmployeeHndlr(index: number, employeeId: string) {
    const employee = findApprovalEmployee(employeeId, employees);
    onChangeParticipant(index, {
      employeeId,
      employeeName: employee?.name || "",
      department: employee?.department || "",
    });
  }

  return [
    {
      Header: "Order",
      accessor: "order",
      disableSortBy: true,
      Cell: ({ row: { index } }: any) => (
        <span className="tw-flex tw-items-center tw-gap-1 tw-text-gray-500">
          <span className="tw-flex tw-flex-col">
            <button
              type="button"
              className="btn btn-sm tw-p-0 tw-leading-none tw-text-gray-500 hover:tw-text-gray-800 disabled:tw-opacity-30"
              title="Move up"
              aria-label={`Move approver ${index + 1} up`}
              disabled={index === 0}
              onClick={() => onMoveParticipant(index, "up")}
            >
              <i className="ri-arrow-up-s-line tw-text-base" />
            </button>
            <button
              type="button"
              className="btn btn-sm tw-p-0 tw-leading-none tw-text-gray-500 hover:tw-text-gray-800 disabled:tw-opacity-30"
              title="Move down"
              aria-label={`Move approver ${index + 1} down`}
              disabled={index === participants.length - 1}
              onClick={() => onMoveParticipant(index, "down")}
            >
              <i className="ri-arrow-down-s-line tw-text-base" />
            </button>
          </span>
          <b>{index + 1}</b>
        </span>
      ),
    },
    {
      Header: "Employee",
      accessor: "employeeId",
      disableSortBy: true,
      Cell: ({ row: { original, index } }: any) => {
        const employee = findApprovalEmployee(original?.employeeId, employees);
        const usedIds = participants
          .filter((_, itemIndex) => itemIndex !== index)
          .map((item) => item.employeeId);
        const availableEmployees = searchableEmployees.filter(
          (item) => !usedIds.includes(item.id)
        );
        return (
          <div style={{ minWidth: "16rem" }}>
            <CustomSelect
              name={`participant-${index}`}
              idKey="id"
              searchKey="searchLabel"
              defaultSelect="Search employee, ID or department"
              value={original?.employeeId}
              options={availableEmployees}
              renderValue={renderApprovalEmployeeValue}
              renderOptions={renderApprovalEmployeeOption}
              onChange={(employeeId: string) =>
                changeEmployeeHndlr(index, employeeId)
              }
            />
            <small className="tw-text-gray-500">
              {employee
                ? `${employee.id} · ${employee.department}`
                : "Start typing to find an employee"}
            </small>
            {original?.tcRetentionFormEnabled && (
              <span className="badge bg-info-subtle text-info tw-ms-1">
                TC Retention Form
              </span>
            )}
          </div>
        );
      },
    },
    {
      Header: "Department / responsibility",
      accessor: "department",
      disableSortBy: true,
      Cell: ({ row: { original, index } }: any) => (
        <div style={{ minWidth: "12rem" }}>
          <TextInput
            name={`department-${index}`}
            value={original?.department}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onChangeParticipant(index, { department: event.target.value })
            }
            formgroupClassName="tw-mb-0"
            placeHolder="Department"
            maxLength={60}
          />
        </div>
      ),
    },
    {
      Header: "Class scope",
      accessor: "applicableClasses",
      disableSortBy: true,
      Cell: ({ row: { original, index } }: any) => {
        const scoped = (original?.applicableClasses || []).length > 0;
        return (
          <div style={{ minWidth: "10rem" }}>
            <button
              type="button"
              className="btn btn-sm btn-soft-info"
              onClick={() => onEditClassScope(index)}
              title="Edit class scope"
            >
              {getClassScopeLabel(original)}
              <i className="ri-pencil-line tw-ms-1" />
            </button>
            <div>
              <small
                className={scoped ? "tw-text-orange-600" : "tw-text-gray-500"}
              >
                {scoped
                  ? "Approves only these classes"
                  : "Approves every class"}
              </small>
            </div>
          </div>
        );
      },
    },
    {
      Header: "Requirement",
      accessor: "role",
      disableSortBy: true,
      Cell: ({ row: { original, index } }: any) => (
        <div style={{ minWidth: "13rem" }}>
          <Switch
            attributeId={`requirement-${index}`}
            checked={original?.role === "mandatory"}
            onChangeHndlr={(event: React.ChangeEvent<HTMLInputElement>) =>
              onChangeParticipant(index, {
                role: event.target.checked ? "mandatory" : "acknowledgement",
              })
            }
            labelClass="tw-ms-2"
            labelName={
              original?.role === "mandatory"
                ? "Mandatory approval"
                : "Acknowledgement"
            }
          />
          <small
            className={
              original?.role === "mandatory"
                ? "tw-text-orange-600"
                : "tw-text-gray-500"
            }
          >
            {original?.role === "mandatory"
              ? "Required to complete"
              : "Optional · does not block"}
          </small>
        </div>
      ),
    },
    {
      Header: "",
      accessor: "actions",
      disableSortBy: true,
      Cell: ({ row: { original, index } }: any) => {
        const employee = findApprovalEmployee(original?.employeeId, employees);
        const labelName = employee
          ? `Delete ${employee.name}`
          : "Delete empty record";
        return (
          <button
            type="button"
            className="btn btn-sm btn-soft-danger"
            title={labelName}
            aria-label={labelName}
            onClick={() => onRemoveParticipant(index)}
          >
            <HugeiconsIcon icon={Delete02Icon} size={16} />
          </button>
        );
      },
    },
  ];
}
