import React from "react";

export const assessmentMode = [
  // { id: "ONLINE", shortName: "Online" },
  // { id: "OFFLINE", shortName: "Offline" },
];
export const topicList = [
  { id: "tp1", shortName: "Linear Equations" },
  { id: "tp2", shortName: "Triangles" },
];
export const assessmentTypes = [
  { id: "FORMATIVE", shortName: "Formative" },
  { id: "SUMMATIVE", shortName: "Summative" },
  { id: "PRACTICE", shortName: "Practice" },
  { id: "MOCK", shortName: "Mock" },
  // { id: "LIVE_WORKSHEET", shortName: "Live Worksheet" },
];
export const createdBy = [
  {
    id: 101,
    userId: "u001",
    employeeName: "John Doe",
    employeeCode: "EMP101"
  },
  {
    id: 102,
    userId: "u002",
    employeeName: "Jane Smith",
    employeeCode: "EMP102"
  },
  {
    id: 103,
    userId: "u003",
    employeeName: "Rahul Sharma",
    employeeCode: "EMP103"
  },
  {
    id: 104,
    userId: "u004",
    employeeName: "Anita Mehta",
    employeeCode: "EMP104"
  }
];
export const skillTags = [
  {
    id: 101,
    userId: "u001",
    employeeName: "Skill 1",
    employeeCode: "S1"
  },
  {
    id: 102,
    userId: "u002",
    employeeName: "Skill 2",
    employeeCode: "S2"
  },
  {
    id: 103,
    userId: "u003",
    employeeName: "Skill 3",
    employeeCode: "S3"
  },
  {
    id: 104,
    userId: "u004",
    employeeName: "Skill 4",
    employeeCode: "S4"
  },
];

export const subjectList = [
   { id: "physics", shortName: "Physics" },
  { id: "chemistry", shortName: "Chemistry" },
  { id: "maths", shortName: "Mathematics" },
];
export function renderValueStaff(selectedItems: any[], removeItemHandler: any) {
  return (
    <div className="selected-container">
      {selectedItems.map((item) => (
        <div key={`item-${item?.id}`} className="selectedoption-item">
          <span>{item?.employeeName}</span>
          <span
            data-id={item?.userId}
            onClick={removeItemHandler}
            className="remove-icon"
          >
            <i className="ri-close-line"></i>
          </span>
        </div>
      ))}
    </div>
  );
}
  export function renderOptionsEmployee(item: any) {
    return `${item?.employeeName} - ${item?.employeeCode}`;
  }

 export function renderValueSection(selectedItems: any) {
    return `${selectedItems?.employeeName}`;
  }