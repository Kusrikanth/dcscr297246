
export const testModeTypes = [
  { id: "online", shortName: "Online" },
  { id: "offline", shortName: "Ofline" },
];

export const difficultyLevels = [
  { id: "easy", shortName: "Easy" },
  { id: "medium", shortName: "Medium" },
  { id: "hard", shortName: "Hard" },
];

export const topicList = [
  { id: "tp1", shortName: "Linear Equations" },
  { id: "tp2", shortName: "Triangles" },
];

export const chapterList = [
  { id: "ch1", shortName: "Algebra" },
  { id: "ch2", shortName: "Geometry" },
];

export const languageList = [
  { id: "Hindi", labelName: "Hindi" },
  { id: "Telugu", labelName: "Telugu" },
  { id: "English", labelName: "English" },
  { id: "French", labelName: "French" },
  { id: "Spanish", labelName: "Spanish" },
  { id: "Sanskrit", labelName: "Sanskrit" },
  { id: "Others", labelName: "Others" },
];

export const bloomList = [
  { id: "remember", labelName: "Remember" },
  { id: "understand", labelName: "Understand" },
  { id: "apply", labelName: "Apply" },
  { id: "evaluate", labelName: "Evaluate" },
  { id: "create", labelName: "Create" },
];

export const subjectList = [
  { id: "physics", shortName: "Physics" },
  { id: "chemistry", shortName: "Chemistry" },
  { id: "maths", shortName: "Mathematics" },
];

export const assessmentTypes = [
  { id: "ch1", shortName: "Online Test - Objectives" },
  { id: "ch1", shortName: "Ofline Test - Objectives" },
  { id: "ch1", shortName: "Online Test - Theory" },
  { id: "ch1", shortName: "Ofline Test - Theory" },
];

export const createdBy = [
  {
    createdBy: "101",
    name: "Ravi Sharma",
    code: "RS101"
  },
  {
    createdBy: "102",
    name: "Anita Mehra",
    code: "AM102"
  },
  {
    createdBy: "103",
    name: "Kunal Jain",
    code: "KJ103"
  }
];

export const physicsCategories = [
  { id: "radio", physicsIconsNames: "Single Choice Question" },
  { id: "checkBox", physicsIconsNames: "Multiple Choice Question" },
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

export const tag = [
  {
    id: 101,
    userId: "u001",
    employeeName: "Physics",
    employeeCode: "CBSE"
  },
  {
    id: 102,
    userId: "u002",
    employeeName: "Laws",
    employeeCode: "ICSE"
  },
  {
    id: 103,
    userId: "u003",
    employeeName: "Mechanics",
    employeeCode: "ICSE"
  },
  {
    id: 104,
    userId: "u004",
    employeeName: "Numbers",
    employeeCode: "CBSE"
  }
];

export const searchInputOptions = [
  { id: 'global', name: 'Global Search' },
  { id: 'questionNo', name: 'Question ID' },
  { id: 'question', name: 'Question' },
  { id: 'type', name: 'Type' },
  { id: 'difficulty	', name: 'Difficulty' },
  { id: 'topic', name: 'Topic' },
]

export const sourceOptions = [
  {id: "questionBank", name: "Question Bank"}
]