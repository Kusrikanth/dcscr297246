export interface LibraryRacksDataTypes {
    id: number;
    libraryName: string;
    shelfName: string;
    roomName: string;
    rack: string;
   }
   export interface IChangeLibraryRacksProps {
    isOpen: boolean,
    toggle: any,
    modalTitle: string;
    id: string | undefined;
    editBranchDetails: string | undefined;
  }