export interface BookIssuancesDataTypes {
    id: number;
    studentName: string;
    studentCode: string;
    section : string;
    class : string;
    title : string;
    issuanceDate : string;
    accessionNumber : string;
    returnDate : string;
    status : string;
   }
export interface BookIssuancesModelDataTypes {
    id: number;
    recordType : string;
    category : string;
    language: string;
    accessionNumber: string;
    authorName: string;
    bookName: string;
    pages: string;
   }
     export interface IChangeBookIssuancesStudentViewProps {
      isOpen: boolean,
    toggle: any,
    modalTitle?: string,
    }
    export interface PrePrimaryResultDataTypes {
      id: number;
      studentName: string;
      studentCode: string;
    }