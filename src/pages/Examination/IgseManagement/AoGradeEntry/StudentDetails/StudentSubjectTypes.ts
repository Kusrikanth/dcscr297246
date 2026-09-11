

interface studentDetailsProps {
  StudName?: string;
  dep_id?: string;
  imgUrl?: string;
}

interface existingSubjectProps {
  existsLang?: string;
  existLangName?: string;
}

interface replacingSubjectProps {
 repLang?: string;
  repLangName?: string;
}

export interface StudentSubjectDataTypes {
  id: number;
  studentName: studentDetailsProps;
  class: string;
}

export interface ChangeStudentSubject {
  studentName: string;
  year: string;
  curriculum: string;
  section: string;
  class: string;
}
export interface IChangeStudentSubjectProps {
  isOpen: boolean,
  toggle: any,
  modalTitle?: string,
  existingSubject: string;
  replaceSubject: string;
}