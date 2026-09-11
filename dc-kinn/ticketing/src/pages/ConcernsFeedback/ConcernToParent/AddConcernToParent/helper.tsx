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
    return `${item?.employeeName} - ${item?.employeeCode}`;
  }

  export function renderOptionsSection(item: any) {
    return <div>
        <span>{item?.sectionName}</span><br/>
        <span className="text-muted fs-12">{item?.curriculumName} - {item?.className}</span>
    </div>;
  }
  
  export function renderValueSection(selectedItems: any) {
    return `${selectedItems?.sectionName}`;
  }