export const priorityOptions = [
    {
        id: "LOW",
        name: "LOW"
    },
    {
        id: "MEDIUM",
        name: "MEDIUM"
    },
    {
        id: "HIGH",
        name: "HIGH"
    },
    {
        id: "CRITICAL",
        name: "CRITICAL"
    },

]
export const getComplaintDepartmentListResp = [
 
    { id: 1, departmentName: "Academics" },
    { id: 2, departmentName: "Library" },
    { id: 3, departmentName: "Hostel" },
    { id: 4, departmentName: "Transport" }
  
];
export const allModulesListResp = [
  { id: 101, moduleName: "Student Management" },
  { id: 102, moduleName: "Attendance" },
  { id: 103, moduleName: "Timetable" },
  { id: 104, moduleName: "Examinations" }
];
export const physicsCategories = [
   { id: "radio", physicsIconsNames: "Single Choice Question" },
        { id: "checkBox", physicsIconsNames: "Multiple Choice Question" },
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
export const sectionsList = [
   { id: "s1", labelName: "Section 1" },
  { id: "s2", labelName: "Section 2" },
  { id: "s3", labelName: "Section 3" },
  { id: "s4", labelName: "Section 4" },
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
export const timeLevels = [
   { id: "00:01:00", shortName: "1Min" },
  { id: "00:02:00", shortName: "2Min" },
  { id: "00:03:00", shortName: "3Min" },
  { id: "00:04:00", shortName: "4Min" },
  { id: "00:05:00", shortName: "5Min" },
];
export const skillTypeList = [
   { id: "Conceptual", shortName: "Conceptual" },
  { id: "Numerical", shortName: "Numerical" },
  { id: "Grammar", shortName: "Grammar" },
  { id: "Application", shortName: "Application" },
];
export const questions = [
  "What is gravity?",
  "Why is the sky blue?",
  "What is the speed of light and why is it important?",
  "What causes seasons on Earth?",
  "What causes seasons on Earth?"
];




export const statusOptions = [
    {
        id: "OPEN",
        name: "OPEN"
    },
    {
        id: "INPROGRESS",
        name: "INPROGRESS"
    },
    {
        id: "CLOSED",
        name: "CLOSED"
    },
    {
        id: "ON_HOLD",
        name: "ON HOLD"
    },
    {
        id: "BLOCKED",
        name: "BLOCKED"
    },

]

export const concernByOptions = [
    {
        name :"PARENT",
        id : "PARENT"
    },
    {
        name :"EMPLOYEE",
        id : "EMPLOYEE"
    },
    // {
    //     name :"STUDENT",
    //     id : "STUDENT",
    // }
]
export const accessRoles = ["STUDENT","PARENT","EMPLOYEE","TEACHER","ADM_CONS","ADM_HEAD","TRANSPORT_HEAD","ACCOUNT_HEAD","ACCOUNT","TRANSPORT","PRINCIPAL","VICE_PRINCIPAL","PA","HR","HR_HEAD"]

export const categoriesOptions = [
    
        {
             name: "ACADEMIC",
              key: "ACADEMIC"
        },
    {
             name:"NON ACADEMIC",
              key: "NON_ACADEMIC"
     }
]
export const departmentOptions = [
    {
        name :"Class 11 , 12 In charge",
        id : "1"
    },
    {
        name :"Class 9 , 10 In charge",
        id : "2"
    }
]
export function renderValueEmployee(selectedItems: any, removeItemHandler: any) {
    if (Array.isArray(selectedItems)) {
      return (<div className="selected-container">
        {
          selectedItems.map((item, index) => {
            return (<div key={`item-${item?.id}`} className="selectedoption-item">
              <span>{item?.employeeName}</span>
              <span data-id={item?.id} onClick={removeItemHandler} className="remove-icon">
                <i className="ri-close-line"></i>
              </span>
  
            </div>)
          })
        }
      </div>)
    }
  }
  
  export function renderOptionsEmployee(item: any) {
    return (
        <div>
            <div>{`${item?.employeeName}`}</div>
            <div className="text-muted fs-13px">{`${item?.employeeCode} | ${item?.departmentName} | ${item?.branchName}`}</div>
        </div>
    );
  }


export const requestType = [
  {
    reqType: "BUG_ISSUE",
    name: "Bug Issue"
  },
  {
    reqType: "CHANGE_REQUEST",
    name: "Change Request"
  },
  {
    reqType: "NEW_IMPLEMENTATION",
    name: "New Implementation"
  },
  {
    reqType: "SUPPORT_REQUEST",
    name: "Support Request"
  },
  {
    reqType: "CLARIFICATION",
    name: "Clarification"
  },
  {
    reqType: "DATA_REQUEST",
    name: "Data Request"
  },
]


// Helper function to generate unique option ID
export const generateUniqueOptionId = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 1000-9999 for 4 digits
    return `OP_${randomNum}`;
};