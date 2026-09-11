
interface assesmentObjectivesProps {
  assesmentObjectives1?: string;
  assesmentObjectives2?: string;
  assesmentObjectives3?: string;
  assesmentObjectives4?: string;
}

export interface AoSelectionDataTypes {
  id: number;
  subjectName: string;
  class: string;
  term: string;
  assesmentObjectives: assesmentObjectivesProps;
}
export interface AoSelectionDataTypesI {
  id: number;
  subjectName: string;
}

export interface IChangeAoSelectionProps {
  isOpen: boolean,
  toggle: any,
  modalTitle?: string,
  modalData?: any,
  modalData1?: any
}