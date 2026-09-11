import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02Icon,
  DragDropVerticalIcon,
} from "@hugeicons-pro/core-stroke-standard";
import { CustomSelect, Switch, TextInput } from "../../../Components/Common";

export interface IApprovalEmployee {
  id: string;
  name: string;
  title: string;
  department: string;
}

export interface IActivityParticipant {
  employeeId: string;
  department: string;
  role: "mandatory" | "acknowledgement";
}

export interface IApprovalActivity {
  id: string;
  name: string;
  description: string;
  active: boolean;
  participants: Array<IActivityParticipant>;
}

export const approvalEmployees: Array<IApprovalEmployee> = [
  {
    id: "EMP-1021",
    name: "Kavitha Rao",
    title: "Accounts Manager",
    department: "Accounts",
  },
  {
    id: "EMP-1048",
    name: "Joseph Mathew",
    title: "IT Administrator",
    department: "Information Technology",
  },
  {
    id: "EMP-1002",
    name: "Dr. Anjali Menon",
    title: "Principal",
    department: "School Leadership",
  },
  {
    id: "EMP-1094",
    name: "Neha Kapoor",
    title: "Senior Administrator",
    department: "Administration",
  },
  {
    id: "EMP-1127",
    name: "Rakesh Iyer",
    title: "Records Officer",
    department: "Student Records",
  },
  {
    id: "EMP-1017",
    name: "Suresh Nair",
    title: "Finance Controller",
    department: "Accounts",
  },
  {
    id: "EMP-1086",
    name: "Preeti Sharma",
    title: "Admissions Head",
    department: "Admissions",
  },
  {
    id: "EMP-1142",
    name: "Manoj Reddy",
    title: "Admissions Executive",
    department: "Admissions",
  },
];

export const starterActivities: Array<IApprovalActivity> = [
  {
    id: "tc-request",
    name: "TC Request",
    description: "Transfer certificate issue workflow",
    active: true,
    participants: [
      {
        employeeId: "EMP-1021",
        department: "Accounts",
        role: "mandatory",
      },
      {
        employeeId: "EMP-1048",
        department: "Information Technology",
        role: "acknowledgement",
      },
      {
        employeeId: "EMP-1002",
        department: "Principal",
        role: "mandatory",
      },
      {
        employeeId: "EMP-1094",
        department: "Administration",
        role: "mandatory",
      },
      {
        employeeId: "EMP-1127",
        department: "Student Records",
        role: "acknowledgement",
      },
    ],
  },
  {
    id: "concession-approval",
    name: "Concession Approval",
    description: "Student fee concession approval",
    active: true,
    participants: [
      { employeeId: "EMP-1017", department: "Accounts", role: "mandatory" },
    ],
  },
  {
    id: "admission-cancellation",
    name: "Admission Cancellation",
    description: "Admission withdrawal and account closure",
    active: true,
    participants: [
      { employeeId: "EMP-1017", department: "Accounts", role: "mandatory" },
      { employeeId: "EMP-1086", department: "Admissions", role: "mandatory" },
    ],
  },
];

export const searchableApprovalEmployees = approvalEmployees.map(
  (employee) => ({
    ...employee,
    searchLabel: `${employee.name} ${employee.id} ${employee.title} ${employee.department}`,
  })
);

export function findApprovalEmployee(id?: string) {
  return approvalEmployees.find((employee) => employee.id === id);
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
  participants: Array<IActivityParticipant>;
}

export function generateParticipantColumns({
  onChangeParticipant,
  onRemoveParticipant,
  participants,
}: IParticipantColumnHandlers) {
  function changeEmployeeHndlr(index: number, employeeId: string) {
    const employee = findApprovalEmployee(employeeId);
    onChangeParticipant(index, {
      employeeId,
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
          <HugeiconsIcon icon={DragDropVerticalIcon} size={16} />
          <b>{index + 1}</b>
        </span>
      ),
    },
    {
      Header: "Employee",
      accessor: "employeeId",
      disableSortBy: true,
      Cell: ({ row: { original, index } }: any) => {
        const employee = findApprovalEmployee(original?.employeeId);
        const usedIds = participants
          .filter((_, itemIndex) => itemIndex !== index)
          .map((item) => item.employeeId);
        const availableEmployees = searchableApprovalEmployees.filter(
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
        const employee = findApprovalEmployee(original?.employeeId);
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
