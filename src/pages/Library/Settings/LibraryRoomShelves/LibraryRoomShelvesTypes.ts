  export interface LibraryRoomShelvesDataTypes {
    id: number;
    libraryName: string;
    shelfName: string;
    roomName: string;
   }
   export interface IChangeLibraryRoomShelvesProps {
    isOpen: boolean,
    toggle: any,
    modalTitle: string;
    id: string | undefined;
    editBranchDetails: string | undefined;
  }