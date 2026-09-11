  
  export  const eventStatus = [
    {
        name : "UPCOMING",
        id : "UPCOMING"
    },
    {
        name : "LIVE",
        id : "LIVE"
    },
    {
        name : "CLOSED",
        id : "CLOSED"
    }
  ]

  export function renderOptionsEmployee(item: any) {
    return `${item?.employeeName} - ${item?.employeeCode}`;
  }

  export function renderOptionsStaff(item: any) {
    return `${item?.employeeName} - ${item?.employeeCode}`;
  }
  export function renderValueSection(selectedItems: any) {
    return `${selectedItems?.employeeCode}`;
  }

  export const userTypeOptions = [
    {
        name: "All",
        id: "ALL"
    },
    {
        name: "PARENTS",
        id: "PARENT"
    },
    {
        name: "EMPLOYEES",
        id: "STAFF"
    },
]

export const statusOptionsStaff = [
  {
      id: "Admin",
      name: "Admin",
      selected: true,
  },
  {
      id: "Non-Teaching",
      name: "Non-Teaching",
      selected: false,
  },
  {
      id: "Teaching",
      name: "Teaching",
      selected: false,
  },
]

export const statusOptionsParent = [
  {
      id: "father",
      name: "Father",
  },
  {
      id: "mother",
      name: "Mother",
  },
  {
      id: "localGaurdian",
      name: "Local Gaurdian",
  },
  {
      id: "primaryContact",
      name: "Primary Contact",
  },
]

export const parmissionOptions = [
  {
      id: "isPublished",
      name: "Published",
  },
  {
      id: "isAllowedComments",
      name: "Allowed Comments",
  }
]

export const studentTypeOptions = [
    {
        id: "all-student",
        name: "All Student",
    }, {
        id: "selected-student",
        name: "Selected Student",
    }
]

export function renderValueStudent(selectedItems: any, removeItemHandler: any) {
    if (Array.isArray(selectedItems)) {
        return (<div className="selected-container">
            {
                selectedItems.map((item, index) => {
                    return (<div key={`item-${item?.id}`} className="selectedoption-item">
                        <span>{item?.name}</span>
                        <span data-id={item?.id} onClick={removeItemHandler} className="remove-icon">
                            <i className="ri-close-line"></i>
                        </span>

                    </div>)
                })
            }
        </div>)
    }
}

export function renderValueStaff(selectedItems: any, removeItemHandler: any) {
    if (Array.isArray(selectedItems)) {
        return (<div className="selected-container">
            {
                selectedItems.map((item, index) => {
                    return (<div key={`item-${item?.id}`} className="selectedoption-item">
                        <span>{item?.employeeName}</span>
                        <span data-id={item?.userId} onClick={removeItemHandler} className="remove-icon">
                            <i className="ri-close-line"></i>
                        </span>

                    </div>)
                })
            }
        </div>)
    }
}

export function renderOptionsStudent(item: any) {
    return `${item?.name} - ${item?.studentCode}`;
}

export const createEventPayload = (
    values: any,
    instituteId: string,
    branchId: string,
    tags: string[],
    startDate: string | null,
    endDate: string | null,
    selectedSectionIds: any,
    studentIds: any,
    employeeIds: any
  ) => {
    const payload: any = {
      instituteId,
      branchId,
      academicYearId: values.academicYearId,
      title: values.title,
      description: values.description,
      eventType: values.eventType,
      tags,
      startDate,
      endDate,
      eventStatus: values.eventStatus,
      location: values.location,
      latitude: values.latitude,
      longitude: values.longitude,
      organizedBy: values.organizedBy,
      contactPerson: values.contactPerson,
      contactPhone: values.contactPhone,
      isPublished: values.isPublished,
      isAllowedComments: values.isAllowedComments,
      recipientType: values.recipientType,
    };
  
    // Conditionally add parentDetails or staffDetails based on recipientType
    if (values.recipientType === 'PARENT') {
      payload.parentDetails = { sections: selectedSectionIds, studentIds };
    } else if (values.recipientType === 'STAFF') {
      payload.staffDetails = {
        categories: values.employeeCategory,
        employeeIds: employeeIds, // Replace with actual employee IDs if needed
      };
    }
  
    return payload;
  };
  