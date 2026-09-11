  export interface HostelBuildingDataTypes {
    id: number;
    hostelName: string;
    shortName: string;
    location: string;
   }
   export interface IChangeHostelBuildingProps {
    isOpen: boolean,
    toggle: any,
    modalTitle?: string,
  }