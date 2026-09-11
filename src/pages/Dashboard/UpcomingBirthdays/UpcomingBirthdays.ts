interface studentDetailsProps {
    name?: string;
    dep_id?: string;
    imgUrl?: string;
}
export interface IUpcomingBirthDaysData {
    id: number;
    studentName: studentDetailsProps | string;
    class: string;
    section:string;
    birthDate:string;
  }