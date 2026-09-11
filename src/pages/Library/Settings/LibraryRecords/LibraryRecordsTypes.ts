export interface LibraryRecordsDataTypes {
    id: number;
    recordType : string;
    createdUser : string;
    createdDate : string;
    modifiedDate : string;
   }
     export interface IChangeLibraryRecordsProps {
      isOpen: boolean,
      toggle: any,
      modalTitle?: string,
      publishersName: string;
      shortName: string;
    }