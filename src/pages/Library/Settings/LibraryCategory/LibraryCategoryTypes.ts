export interface LibraryCategoryDataTypes {
    id: number;
    category : string;
    createdUser : string;
    createdDate : string;
    modifiedDate : string;
   }
     export interface IChangeLibraryCategoryProps {
      isOpen: boolean,
      toggle: any,
      modalTitle?: string,
      publishersName: string;
      shortName: string;
    }