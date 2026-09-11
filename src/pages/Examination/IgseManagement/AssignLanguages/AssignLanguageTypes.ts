interface studentDetailsProps {
  StudName?: string;
  dep_id?: string;
  imgUrl?: string;
}

export interface StudentSubjectDataTypes {
  id: number;
  studentName: studentDetailsProps;
  class: string;
  section: string;
  secondLanguage: string;
  thirdLanguage: string;
}

export interface IAssignLanguageProps {
  isOpen: boolean,
  toggle: any,
  modalTitle?: string,
  existingSubject: string;
  replaceSubject: string;
}