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
export const accessRoles = ["STUDENT","PARENT","EMPLOYEE","TEACHER","ADM_CONS","ADM_HEAD","TRANSPORT_HEAD","ACCOUNT_HEAD","ACCOUNT","TRANSPORT","PRINCIPAL","VICE_PRINCIPAL","PA","HR","HR_HEAD", "EMPLOYEE", "HOSTEL", "MEDICAL", "LIBRARY", "GRIEVANCE",
      "PARENT_ROLE"]


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
            <div className="tw-text-gray-500 tw-text-[13px]">{`${item?.employeeCode} | ${item?.departmentName} | ${item?.branchName}`}</div>
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