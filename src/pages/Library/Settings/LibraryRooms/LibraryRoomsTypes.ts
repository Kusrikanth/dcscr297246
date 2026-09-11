  export interface LibraryRoomsDataTypes {
    id: number;
    libraryName: string;
    roomNo: string;
    roomName: string;
   }
  export interface ILibraryRoomsModalProps {
    isOpen: boolean,
    toggle: any,
    modalTitle: string;
    id: string | undefined;
    editBranchDetails: string | undefined;
  }