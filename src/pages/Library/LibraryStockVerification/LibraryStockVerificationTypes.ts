  export interface LibraryStockVerificationDataTypes {
    id: number;
    libraryName: string;
    roomName: string;
    shelfName: string;
    rack: string;
    numberOfBooks: string;
   }
  export interface StockingCheckingDataTypes {
    id: number;
    studentId: string;
    bookName: string;
    category: string;
    languages: string;
    authorName: string;
    pages: string;
   }
   export interface IChangeLibraryStockVerificationProps {
    isOpen: boolean,
    toggle: any,
    modalTitle?: string,
    libraryId: string;
    roomId: string;
    shelfId: string;
    rackId: string;
    libraryName: string; roomName: string; shelfName: string; rackName: string;
  }
  export interface ILibraryStockVerificationProps {
    isOpen: boolean,
    toggle: any,
    modalTitle?: string,
  }
  export interface LibraryVerificationModelTypes {
    id: number;
    accessionNumber: string;
    bookName: string;
    category: string;
    language: string;
    authorName: string;
    pages: string;
  }
  export interface RelocateModelTypes {
    id: number;
    accessionNumber: string;
    bookName: string;
    library: string;
    room: string;
    shelf: string;
    rack: string;
  }
  
  export interface LibraryTCRequestModals2Props {
    isOpen: boolean;
    toggle: any;
    modalTitle: string;
    instituteId: string;
    instituteName: string;
    branchId: string;
    editBranchDetails: string | undefined;
  }
  