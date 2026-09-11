  export interface HostelDetailsRoomTypes {
    id: number;
    hostelName: string;
    shortName: string;
    location: string;
   }
   export interface IChangeHostelRoomTypesProps {
    isOpen: boolean,
    toggle: any,
    modalTitle?: string,
  }