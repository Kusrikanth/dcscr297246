  export interface HostelDetailsDataTypes {
    id: number;
    hostelName: string;
    shortName: string;
    location: string;
   }
   export interface IChangeHostelDetailsProps {
    isOpen: boolean,
    toggle: any,
    modalTitle?: string,
  }