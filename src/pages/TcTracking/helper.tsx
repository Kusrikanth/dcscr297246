export const tcBranchFilterOptions = [
    {
        id: "AFFILIATION_CODE",
        name: "Affiliation Code"
    },
    ...(import.meta.env.VITE_ENVIRONMENT === "dev" ? [{
        id: "UDISE_ID",
        name: "UDISE ID"
    },
    {
        id: "SCHOOL_CODE",
        name: "School Code"
    }] : [])
]

export const tcStudentFilterOptions = [
    {
        id: "STUDENT_CODE",
        name: "Student Code"
    },
    ...(import.meta.env.VITE_ENVIRONMENT === "dev" ? [{
        id: "APAAR_ID",
        name: "APAAR ID"
    },
    {
        id: "PEN_NO",
        name: "PEN NO"
    }] : [])
]

export const getNameFromFilter = (resp: any, filterName: string) => {
    return resp?.find((item: any) => item.id === filterName)?.name
}

export const maskPhone = (phone: string) => {
    if (!phone || phone.length < 4) return phone;
    return phone.slice(0, 2) + "xxxxx" + phone.slice(-2);
};

export const maskEmail = (email: string) => {
    const [name, domain] = email.split("@");
    if (name.length <= 3) return "*".repeat(name.length) + "@" + domain;
    return name.slice(0, 3) + "xxxxx" + name.slice(-1) + "@" + domain;
};