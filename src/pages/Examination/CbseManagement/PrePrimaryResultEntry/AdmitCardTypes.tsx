interface studentDetailsProps {
  StudName?: string;
  dep_id?: string;
  imgUrl?: string;
}

export interface PrePrimaryResultDataTypes {
    id: number;
    studentName: studentDetailsProps;
    rollNo: string;
  }
  
  export interface IPrePrimaryResultProps {
    isOpen: boolean,
    toggle: any,
    modalTitle?: string,
  }