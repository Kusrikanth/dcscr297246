  export interface LibraryPublishersDataTypes {
    id: number;
    publisherName: string;
    shortName: string;
   }
   export interface IChangeLibraryPublishersProps {
    isOpen: boolean,
    toggle: any,
    modalTitle?: string,
    id: string | undefined;
  }