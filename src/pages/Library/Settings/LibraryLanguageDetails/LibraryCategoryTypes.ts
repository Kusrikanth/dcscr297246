export interface LibraryLanguageDetailsDataTypes {
    id: number;
    language : string;
    createdUser : string;
    createdDate : string;
    modifiedDate : string;
   }
     export interface IChangeLibraryLanguageDetailsProps {
      isOpen: boolean,
      toggle: any,
      modalTitle?: string,
      publishersName: string;
      shortName: string;
    }