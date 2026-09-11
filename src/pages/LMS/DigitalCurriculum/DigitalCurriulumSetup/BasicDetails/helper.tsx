  export function renderOptionsEmployee(item: any) {
    return `${item?.employeeName} - ${item?.employeeCode}`;
  }

 export function renderValueSection(selectedItems: any) {
    return `${selectedItems?.employeeName}`;
  }