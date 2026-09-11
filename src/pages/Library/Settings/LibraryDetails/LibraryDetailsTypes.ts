  export interface LibraryDetailsDataTypes {
    id: number;
    libraryName: string;
    shortName: string;
    location: string;
   }
   export interface IChangeLibraryDetailsProps {
    isOpen: boolean,
    toggle: any,
    modalTitle?: string,
  }