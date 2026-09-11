export const incomeOptions = [
    {
        id: 'n/a',
        name: 'NA',
        min: 0,
        max: 0,
    },
    {
        id: 'Below 3 Lakhs',
        name: 'Below 3 Lakhs',
        min: 0,
        max: 300000,
    },
    {
        id: '3,00,000 - 5,00,000',
        name: '3,00,0000 - 5,00,0000',
        min: 300000,
        max: 500000,
    },
    {
        id: '5,00,000 - 10,00,000',
        name: '5,00,000 - 10,00,000',
        min: 500000,
        max: 1000000,
    },
    {
        id: '10,00,000 - 20,00,000',
        name: '10,00,000 - 20,00,000',
        min: 1000000,
        max: 2000000,
    }, {
        id: '20,00,000 - 30,00,000',
        name: '20,00,000 - 30,00,000',
        min: 2000000,
        max: 3000000,
    }, {
        id: '30,00,000 - 50,00,000',
        name: '30,00,000 - 50,00,000',
        min: 3000000,
        max: 5000000,
    },
    {
        id: '50,00,000 And Above',
        name: '50,00,000 And Above',
        min: 5000000,
        max: 100000000
    }
]

export const qualificationOptions = [
    {
        id: "Ph.D/Doctorate",
        name: "Ph.D/Doctorate"
    },
    {
        id: "Postgraduate",
        name: "Postgraduate"
    },
    {
        id: "Graduation",
        name: "Graduation"
    },
    {
        id: "Diploma",
        name: "Diploma"
    },
    {
        id: "Others",
        name: "Others"
    }
]

export function getQualificationName(qualificationName: any) {
    const qualification = qualificationOptions.find(item => item.id?.toString().toLowerCase() === qualificationName?.toString().toLowerCase());
    if (qualification) {
        return qualification?.id;
    } else {
        return "Others";
    }
}
export function getIncomeOptions(grossSalary: any) {
    if (isNaN(grossSalary) || !grossSalary) {
        return incomeOptions[0].id;
    }
    const totalSalary = Math.round(Number(grossSalary) * 12);
    let incomeId = incomeOptions[0].id;
    for (let i = 0; i < incomeOptions.length; i++) {
        if (totalSalary >= incomeOptions[i].min && totalSalary < incomeOptions[i].max) {
            incomeId = incomeOptions[i].id;
            break;
        }
    }
    return incomeId;
}

export const acceptedDocFile = ['application/pdf',"image/jpeg", "image/jpg", "image/png"];
export function uploadFileErrorHndlr(fileSize: any, fileType: string) {
  if (!acceptedDocFile.includes(fileType)) {
    return `Upload file should be of format ${acceptedDocFile.join(',')}.`;
  }
  if (!isNaN(fileSize) && (Math.ceil(fileSize / (1024 * 1024)) > 1)) {
    return "Upload file should be less than 1Mb.";
  }
  return "";
}

export function renderValueSection(selectedItem: any) {
  return selectedItem?.occupationName || "";
}

export function renderOptionsEmployee(item: any) {
  return   item?.occupationName?.toString() || "";
}
