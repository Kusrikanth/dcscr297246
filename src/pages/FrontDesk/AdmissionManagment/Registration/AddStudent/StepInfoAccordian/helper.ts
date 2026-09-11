export const studentUIDTypes: Array<any> = [
    {
        id: "aadhaar-card",
        name: "Aadhaar Card"
    }, {
        id: "foreign-national-passport-number",
        name: "Foreign National Passport Number"
    }
];

export const admissionTypes: Array<any> = [
    {
        id: "Non Residential",
        name: "Non-Residential"
    }, {
        id: "Residential",
        name: "Residential"
    }
]

export const genderOptions: Array<any> = [
    {
        id: "male",
        name: "Male"
    }, {
        id: "female",
        name: "Female"
    },
]

export const bloodGroupOptions: Array<any> = [
    {
        id: "A +ve",
        name: "A +ve"
    }, {
        id: "B +ve",
        name: "B +ve"
    }, {
        id: "AB +ve ",
        name: "AB +ve "
    }, {
        id: "O +ve",
        name: "O +ve"
    }, {
        id: "A -ve",
        name: "A -ve"
    }, {
        id: "B -ve",
        name: "B -ve"
    }, {
        id: "O -ve",
        name: "O -ve"
    }
    , {
        id: "Unknown",
        name: "Unknown"
    }
]

export const nationalityOptions: Array<any> = [
    {
        id: "Indian",
        name: "Indian"
    }
]
export const motherToungeOptions: Array<any> = [
    {
        id: "Hindu",
        name: "Hindu"
    }, {
        id: "Telgu",
        name: "Telgu"
    }
]

export const languageOptions: Array<any> = [
    {
        id: "Hindi",
        name: "Hindi"
    }, {
        id: "English",
        name: "English"
    }
]


export const admissionCategory: Array<any> = [
    {
        id: "Curriculum Category",
        name: "Curriculum Category"
    }, {
        id: "Sports Category",
        name: "Sports Category"
    },
    {
        id: "Recommendation Category",
        name: "Recommendation Recommendation"
    }
]

export const houseNameOptions: Array<any> = [
    {
        id: "SAPPHIRE",
        name: "SAPPHIRE"
    }, {
        id: "RUBY",
        name: "RUBY"
    }, {
        id: "EMERALD",
        name: "EMERALD"
    }, {
        id: "TOPAZ",
        name: "TOPAZ"
    }
]


export const yesNoOptions: Array<any> = [
    {
        id: "yes",
        name: "Yes"
    },
    {
        id: "no",
        name: "No"
    }
]


export const trueFalseOptions: Array<any> = [
    {
        id: "true",
        name: "Yes",
    },
    {
        id: "false",
        name: "No",
    }
]
export const religionOptions: Array<any> = [
    {
        id: "hindu",
        name: "Hindu"
    },
    {
        id: "muslim",
        name: "Muslim"
    }
]

export const designationOptions: Array<any> = [
    {
        id: "1",
        name: "Teacher"
    },
    {
        id: "2",
        name: "ACP"
    }
]
export const qualificationOptions: Array<any> = [
    {
        id: "1",
        name: "Graduate"
    },
    {
        id: "2",
        name: "Non-Graduate"
    }
]

export const dipSiteParentOptions: Array<any> = [
    {
        id: "FATHER",
        name: "Father"
    }, {
        id: "MOTHER",
        name: "Mother"
    }
]

export const levelOptions: Array<any> = [
    {
        id: "STATE",
        name: "State"
    },
    {
        id: "NATIONAL",
        name: "National"
    }
]
export function generateStudentInfoPayload(formsDetails: any) {
    const { } = formsDetails;
}

export function generateSiblingPayload(branchId: string, siblingsInfo: any) {
    const firstSiblingInfo = siblingsInfo.siblings[0] || null,
        secondSiblingInfo = siblingsInfo.siblings[1] || null;
    return {
        hasSibling: siblingsInfo?.hasSibling,
        siblingFromDPS: siblingsInfo?.siblingFromDPS,
        siblingCode: firstSiblingInfo?.siblingCode || "",
        siblingName: firstSiblingInfo?.siblingName || "",
        siblingBranchId: branchId,
        siblingCurriculumId: firstSiblingInfo?.siblingCurriculumId || "",
        siblingClassId: firstSiblingInfo?.siblingClassId || "",
        siblingSectionId: firstSiblingInfo?.siblingSectionId || "",
        siblingDetails: firstSiblingInfo?.siblingDetails || "",
        hasSecondSibling: secondSiblingInfo ? "true" : "false",
        secondSiblingFromDPS: siblingsInfo?.siblingFromDPS,
        secondSiblingCode: secondSiblingInfo?.siblingCode || "",
        secondSiblingName: secondSiblingInfo?.siblingCode || "",
        secondSiblingBranchId: secondSiblingInfo ? branchId : "",
        secondSiblingCurriculumId: secondSiblingInfo?.siblingCurriculumId || "",
        secondSiblingClassId: secondSiblingInfo?.siblingClassId || "",
        secondSiblingSectionId: secondSiblingInfo?.siblingSectionId || "",
        secondSiblingDetails: secondSiblingInfo?.siblingDetails || "",
    }
}