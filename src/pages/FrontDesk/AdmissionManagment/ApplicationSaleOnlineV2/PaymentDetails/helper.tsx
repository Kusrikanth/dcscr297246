export const SourceTypes = [
  {
    id: "Website",
    value: "Website"
  },
  {
    id: "Existing Parent",
    value: "Existing Parent"
  },
  {
    id: "Alumni",
    value: "Alumni"
  },
  {
    id: "Social Media",
    value: "Social Media"
  },
  {
    id: "Edustoke",
    value: "Edustoke"
  },
  {
    id: "Any Other",
    value: "Any Other"
  },
]

export const admissionTypes: Array<any> = [
  {
    id: "Non-Residential",
    name: "Non Residential"
  },
  {
    id: "Residential",
    name: "Residential"
  }
]

export const admissionTypesForNonResidential: Array<any> = [
  {
    id: "Non-Residential",
    name: "Non Residential"
  },
]

export function createPaymentPayload(saleFormInfo: any, otherInfo: any) {
  return (
    {
      branchId: otherInfo?.branchId,
      academicYearId: otherInfo?.academicYearId,
      curriculumId: otherInfo?.curriculumId,
      classId: saleFormInfo?.admissionClassId,
      name: saleFormInfo?.fullName,
      phone: saleFormInfo?.contactNumber,
      email: saleFormInfo?.emailId,
      applicationSaleId: otherInfo?.applicationSaleId,
      paymentType: "APPLICATION_SALE",
      gateWayType: otherInfo?.gateWayType,
      details: [
        {
          component_type: "Payable Amount",
          amount: import.meta.env.VITE_ENVIRONMENT === "dev" ? "1.0" : otherInfo?.amount
        }
      ],
      callback_url: `${import.meta.env.VITE_APPLICATION_URL}/applicationsuccess/${otherInfo?.applicationSaleId}`
    }
  )
}

export const renderCountryValue = (selected: any) => {
  return selected?.countryName || "";
};

export const renderCountryOption = (item: any) => {
  return item.countryName;
};

export const renderStateValue = (selected: any) => selected?.stateName || "";

export const renderStateOption = (item: any) => item.stateName;


export const renderDistrictValue = (selected: any) => selected?.districtName || "";

export const renderDistrictOption = (item: any) => item.districtName;