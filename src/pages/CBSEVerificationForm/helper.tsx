import { sanitizeUrlParams } from "../../utility/commonutility";

export const yesNoRadioOptions = [
  {
    id: "YES",
    name: "Yes"
  }, {
    id: "NO",
    name: "No"
  }
]

export const undertakingOptions = [
  { id: "NOCORRECTIONS", name: "I have thoroughly checked all the details of my ward for CBSE Board registration. The Date of Birth/ Name & Surname of Candidate /Father /Mother are correct and require NO CORRECTIONS" },
  { id: "CORRECTIONS", name: "I Require Corrections." }
]

export const signRadioOptions = [
  {
    id: "FATHER",
    name: "Father"
  }, {
    id: "MOTHER",
    name: "Mother"
  }
]

export const handicapOptions = [
  {
    id: "Spastic",
    name: "Spastic"
  }, {
    id: "Dyslexis",
    name: "Dyslexis"
  }, {
    id: "Blind",
    name: "Blind"
  }, {
    id: "Handicapped",
    name: "Handicapped"
  }, {
    id: "Deaf",
    name: "Deaf"
  }, {
    id: "Others",
    name: "Others"
  }
]

export const acceptedDocFile = ['application/pdf'];
export function uploadFileErrorHndlr(fileSize: any, fileType: string) {
  if (!acceptedDocFile.includes(fileType)) {
    return `Upload file should be of format ${acceptedDocFile.join(',')}.`;
  }
  if (!isNaN(fileSize) && (Math.ceil(fileSize / (1024 * 1024)) > 1)) {
    return "Upload file should be less than 1Mb.";
  }
  return "";
}



export const acceptedImageFile = ["image/jpeg", "image/jpg", "image/png"];

export function uploadImageErrorHndlr(fileSize: any, fileType: string) {
  if (!acceptedImageFile.includes(fileType)) {
    return `Upload file should be of format ${acceptedImageFile.join(',')}`;
  }
  if (!isNaN(fileSize) && (Math.ceil(fileSize / (1024 * 1024)) > 1)) {
    return "Upload file should be less than 1MB.";
  }
  return "";
}

export function validateDimension(height: number, width: number) {
  if (height > 120 || width > 300) {
    return `Max dimension for uploading signature should be 300 x 120 pixel size.`;
  }
  return "";
}

export function generatePayloadForCbseVerification(initialData: any, formData: any) {
  const requestPayload = {
    cbseVerificationId: formData?.cbseVerificationId,
    studentId: formData?.studentId,
    academicYearId: formData?.academicYearId,
    isHandicapped: formData?.isHandicapped,
    isMinority: formData?.isMinority,
    medicalCondition: formData?.medicalCondition,
    hasSibling: formData?.hasSibling,
    undertaking: formData?.undertaking,
    isHasAadharNumber: formData?.isAadharCardPresent,
    castEmail: formData?.castEmail ? "YES" : "NO",
    documentMail: formData?.documentMail ? "YES" : "NO",
    signName: formData?.signName,
    existingAadhardFileId: formData?.existingAadhardFileId,
    handicappedFor: formData?.handicappedFor,
    medicalRemarks: formData?.medicalRemarks,
    handicappedRemarks: formData?.handicappedRemarks,
    siblingStudentId: formData?.siblingStudentId,
    isChangeSibling: (initialData?.siblingStudentId || formData?.siblingStudentId)
      ? initialData?.siblingStudentId !== formData?.siblingStudentId : false,
    correctedSecondLanguage: initialData?.secondLanguage !== formData?.secondLanguage ? formData?.secondLanguage : "",
    correctedThirdLanguage: initialData?.thirdLanguage !== formData?.thirdLanguage ? formData?.thirdLanguage : "",
    correctedStudentName: initialData?.studentName !== formData?.correctedStudentName ? formData?.correctedStudentName : "",
    correctedFatherName: initialData?.fatherName !== formData?.correctedFatherName ? formData?.correctedFatherName : "",
    correctedMotherName: initialData?.motherName !== formData?.correctedMotherName ? formData?.correctedMotherName : "",
    correctedFatherIncome: initialData?.fatherIncome !== formData?.fatherIncome ? formData?.fatherIncome : "",
    correctedMotherIncome: initialData?.motherIncome !== formData?.motherIncome ? formData?.motherIncome : "",
    correctedAadharNumber: initialData?.aadharCardNo !== formData?.aadharCardNo ? formData?.aadharCardNo : "",
    correctedGenderId: initialData?.genderId !== formData?.genderId ? formData?.genderId : "",
    correctedDob: initialData?.dob !== formData?.correctedDob ? formData?.correctedDob : "",
    correctedCasteId: initialData?.casteId !== formData?.casteId ? formData?.casteId : "",

    correctedMailId: initialData?.emailId !== formData?.emailId ? formData?.emailId : "",
    correctedMobileNumber: initialData?.mobileNo !== formData?.mobileNo ? formData?.mobileNo : "",

    subjectsRequired: formData?.subjectsRequired,
    haveSkillSubject: formData?.haveSkillSubject,
    skillSubjectName: formData?.skillSubjectName,
    boardRollNo: formData?.boardRollNo,
    boardName: formData?.boardName,
    boardOtherName: formData?.boardOtherName,
    source: 'WEB'

  };
  const requestFormData = sanitizeUrlParams(requestPayload);
  const formDataPayload = new FormData();
  formDataPayload.append("request", JSON.stringify(requestFormData));
  if (!!formData?.studentAadharFile) {
    formDataPayload.append("studentAadhar", formData?.studentAadharFile);
  }
  if (formData?.requestLetterFile) {
    formDataPayload.append("requestLetter", formData?.requestLetterFile);
  }
  if (formData?.affidavitFile) {
    formDataPayload.append("affidavitFile", formData?.affidavitFile);
  }
  if (formData?.evidenceProofFile) {
    formDataPayload.append("evidenceProof", formData?.evidenceProofFile);
  }
  if (formData?.signFile) {
    formDataPayload.append("signFile", formData?.signFile);
  }
  if (formData?.casteFile) {
    formDataPayload.append("casteFile", formData?.casteFile);
  }
  if (formData?.marksSheetFile) {
    formDataPayload.append("marksSheet", formData?.marksSheetFile);
  }
  return formDataPayload;
}


export const boardNames = [
  {
    name: "CBSE",
  },
  {
    name: "ICSE",
  }, {
    name: "IGSC",
  }, {
    name: "IB",
  }, {
    name: "SSC -Telangana state",
  }, {
    name: "SSC- Andhra Pradesh",
  }, {
    name: "IGCSE",
  }, {
    name: "Others",
  }
]


