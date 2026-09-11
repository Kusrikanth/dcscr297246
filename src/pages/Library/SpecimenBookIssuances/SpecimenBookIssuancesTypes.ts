export interface SpecimenBookIssuancesDataTypes {
    id: number;

    class:  string;
    studentName: string;
    studentCode: string;
    section: string;
    title: string;
    accessionNumber: string;
    bookCost: string;
    issuanceDate: string;
    returnDate: string;
    latereturnDate: string;
    status: string;
   }
export interface SpecimenBookIssuancesModelDataTypes {
    id: number;
    recordType : string;
    category : string;
    language: string;
    accessionNumber: string;
    authorName: string;
    bookName: string;
    pages: string;
   }
     export interface IChangeSpecimenBookIssuancesStudentViewProps {
      isOpen: boolean,
    toggle: any,
    modalTitle?: string,
    }
    export interface StudentDataTypes {
      id: number;
      studentName: string;
      studentCode: string;
      bookTitle: string;
      accessionNumber: string;
    }
    export interface EmployeeDataTypes {
      id: number;
      employeeName: string;
      employeeCode: string;
      bookTitle: string;
      accessionNumber: string;
    }