import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { MenuOptionHrtl } from "../../../Components/Common";
import React from "react";

interface IMasterFieldsValues {
  id: string;
  valueName: string;
}

interface IMasterFieldsTypesTableData {
  id: number;
  masterFields: string;
  values: Array<IMasterFieldsValues>;
}
const NationalityColumns = [
  {
    Header: "Nationality",
    accessor: "nationalityName",
  },
  {
    Header: "Short Name",
    accessor: "shortName",
    Cell: ({ value }: any) => {
      return (<span>{value || "n/a"}</span>)
    },
    disableSortBy: true
  }
];
const ReligionColumns = [
  {
    Header: "Religion",
    accessor: "religionName",
  },
  {
    Header: "Short Name",
    accessor: "shortName",
    Cell: ({ value }: any) => {
      return (<span>{value || "n/a"}</span>)
    },
    disableSortBy: true
  }
];
const CastColumns = [
  {
    Header: "Caste Name",
    accessor: "casteName",
  }
];
const GenderColumns = [
  {
    Header: "Gender",
    accessor: "genderName",
  },
  {
    Header: "Short Name",
    accessor: "shortName",
    Cell: ({ value }: any) => {
      return (<span>{value || "n/a"}</span>)
    },
    disableSortBy: true
  }
];
const OccupationColumns = [
  {
    Header: "Occupation",
    accessor: "occupationName",
  },
  {
    Header: "Short Name",
    accessor: "shortName",
    Cell: ({ value }: any) => {
      return (<span>{value || "n/a"}</span>)
    },
    disableSortBy: true
  }
];
const MothertongueColumns = [
  {
    Header: "Mother Tongue",
    accessor: "motherTongueName",
  },
  {
    Header: "Short Name",
    accessor: "shortName",
    Cell: ({ value }: any) => {
      return (<span>{value || "n/a"}</span>)
    },
    disableSortBy: true
  }
];
const BloodGroupColumns = [
  {
    Header: "Blood Group",
    accessor: "bloodGroupName",
  }
];
const BankNameColumns = [
  {
    Header: "Bank Name",
    accessor: "bankName",
  },
  {
    Header: "Short Name",
    accessor: "shortName",
    Cell: ({ value }: any) => {
      return (<span>{value || "n/a"}</span>)
    },
    disableSortBy: true
  }
];
function getCategoryColumns(selectedValue: string) {
  switch (selectedValue) {
    case "nationality":
      return NationalityColumns;
    case "religion":
      return ReligionColumns;
    case "caste":
      return CastColumns;
    case "mother-tongue":
      return MothertongueColumns;
    case "gender":
      return GenderColumns;
    case "occupation":
      return OccupationColumns;
    case "blood-group":
      return BloodGroupColumns;
      case "BANK-NAMES":
        return BankNameColumns;
    default:
      return [];
  }
}
export function generateColumns(viewMoreHndlr: any, selectedValue: string) {
  return ([
    {
      Header: "S.No",
      Cell: ({ row: { index } }: any) => {
        return (<span>{(Number(index) + 1)}</span>)
      },
      disableSortBy: true
    },
    ...getCategoryColumns(selectedValue)
    // {
    //   Header: "Short Name",
    //   accessor: "shortName",
    //   Cell: ({ value }: any) => {
    //     return (<span>{value || "n/a"}</span>)
    //   }
    // }
  ])
}

export const menuItems = [
  {
    categoryId: "nationality",
    categoryName: "Nationality",
  },
  {
    categoryId: "religion",
    categoryName: "Religion",
  },
  {
    categoryId: "caste",
    categoryName: "Caste",
  },
  {
    categoryId: "mother-tongue",
    categoryName: "Mother Tounge",
  },
  {
    categoryId: "gender",
    categoryName: "Gender",
  },
  {
    categoryId: "occupation",
    categoryName: "Occupation",
  },
  {
    categoryId: "blood-group",
    categoryName: "Blood Group",
  },
  {
    categoryId: "BANK-NAMES",
    categoryName: "Bank Name",
  },
];


export function getDefaultSortColumns(categoryId: string) {
  switch (categoryId) {
    case "nationality": return [{ id: "nationalityName", desc: false }];
    case "religion": return [{ id: "religionName", desc: false }];
    case "caste": return [{ id: "casteName", desc: false }];
    case "mother-tongue": return [{ id: "motherTongueName", desc: false }];
    case "gender": return [{ id: "genderName", desc: false }];
    case "occupation": return [{ id: "occupationName", desc: false }];
    case "blood-group": return [{ id: "bloodGroupName", desc: false }];
    case "BANK-NAMES": return [{ id: "bankName", desc: false }];
    default: return undefined;
  }
}