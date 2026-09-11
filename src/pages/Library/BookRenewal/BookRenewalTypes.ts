export interface BookRenewalDataTypes {
    id: number;
    library  : string;
    studentName : string;
   studentCode : string;
   employeeName : string;
   employeeCode : string;
    accessionNumber : string;
    bookName : string;
    issuanceDate : string;
    returnDate : string;
    renewalDate : string;
   }
export interface IChangeBookRenewalProps {
    isOpen: boolean,
    toggle: any,
    modalTitle?: string,
    }