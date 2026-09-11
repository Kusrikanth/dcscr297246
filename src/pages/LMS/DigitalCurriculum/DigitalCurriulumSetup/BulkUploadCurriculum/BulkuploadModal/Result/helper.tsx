export interface UploadData {
  uploadDate: string;
  status: string;
  uploadedBy: string;
  records: string;
}

export interface CurriculumData {
  units: number;
  chapters: number;
  topics: number;
  sessions: number;
}

export const formatUploadDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};
