export interface SpecimenBookReturnsDataTypes {
    id: number;
    library : string;
    studentName : string;
   studentCode : string;
    title : string;
    accessionNumber : string;
    issuanceDate : string;
    returnDate : string;
    latereturnDate : string;
   }
export interface SpecimenBookReturnsModelDataTypes {
    id: number;
    recordType : string;
    category : string;
    language: string;
    accessionNumber: string;
    authorName: string;
    bookName: string;
    pages: string;
   }
     export interface IChangeSpecimenBookReturnsStudentViewProps {
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