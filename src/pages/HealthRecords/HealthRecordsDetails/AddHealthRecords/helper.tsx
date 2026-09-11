import { differenceInYears } from "date-fns";

export const medicalOptions = [
    {
        name : "First-Aid",
        key : "firstAid",
        isChecked : false,
    },
    {
        name : "Medication",
        key : "medication",
        isChecked : false,
    },
    {
        name : "Referred to Hospital",
        key : "referredToHospital",
        isChecked : false,
    },
    {
        name : "Sent to Home",
        key : "sentToHome",
        isChecked : false,
    },
]
export const selectData1 = [
    {
        userType: "STUDENT",
    },
    {
        userType: "EMPLOYEE",
    },
  ];

export const calculateAge = (dateOfBirth:any) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = differenceInYears(today, birthDate);
    return age;
  };

  export const statusOptions = [
    {
        id : "isSms",
        name : "Send SMS to Parent",
        selected : true,
    }
]