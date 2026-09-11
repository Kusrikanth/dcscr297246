export function generateColumns() {

  return [
          {
              Header: "Exam Name",
              accessor: "examName",
              disableSortBy: true,
          },
          {
              Header: "Class",
              accessor: "className",
              disableSortBy: true,
          },
          {
              Header: "Section",
              accessor: "sectionName",
              disableSortBy: true,
             columnClassName: "text-center"

          },  
          {
              Header: "Subject",
              accessor: "subjectName",
              disableSortBy: true,
             columnClassName: "text-center"

          },
          {
             Header: "Total Students",
             accessor: "totalStudentCount",
             disableSortBy: true,
             columnClassName: "text-center"

          },
          {
             Header: "Entered Students",
             accessor: "enteredStudentCount",
             disableSortBy: true,
             columnClassName: "text-center"

          },
          {
             Header: "Not Entered Students",
             accessor: "notEnteredStudentCount",
             disableSortBy: true,
             columnClassName: "text-center"

          },
          {
             Header: "Absent",
             accessor: "absenteesStudentCount",
             disableSortBy: true,
             columnClassName: "text-center"
          }
      ];
}

export const ignoredKeys = ["searchString","academicYearId", "curriculumId", "classId", "examinationId"];