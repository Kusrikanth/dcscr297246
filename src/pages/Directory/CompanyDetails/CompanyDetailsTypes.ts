  export interface CompanyDetailsDataTypes {
    id: number;
    companyName: string;
    shortName: string;
   }
   export interface IChangeCompanyDetailsProps {
    isOpen: boolean,
    toggle: any,
    modalTitle?: string,
  }