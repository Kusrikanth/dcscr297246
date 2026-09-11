import { shallowEqual } from "react-redux";
import { AutoSearchInput, SelectInput } from "../../../../../Components/Common";
import { useAppSelector } from "../../../../../hooks/storehook";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import Button from "../../../../../Components/Common/Button";


const initialValues = {
  subjectId: "",
  teacherId: "",
  teacherName: "",
  teacherEmployeeCode: "",
  substituteTeacherId: "",
  substituteTeacherName: "",
  substituteTeacherEmployeeCode: "",
}
const AddSubjectModal = ({ toggle, selectedCell, onSubjectAdded, id, getEmployees, timeTable }) => {

  const [subjectsList, setSubjectsList] = useState<any>([]);
  const [searchEmployeeState, setSearchEmployeeState] = useState<any>(null);
  const [searchSubEmployeeState, setSearchSubEmployeeState] = useState<any>(null);

  const {
    getSubjectsTeacherResp,
    currentBranchIdResp: branchId,
    teacherListResp
  } = useAppSelector(
    ({ timeTableManagement, appData, classroomManagmentInfo }) => ({
      getSubjectsTeacherResp: timeTableManagement.getSubjectsTeacherResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      teacherListResp: classroomManagmentInfo.teacherListResp,
    }),
    shallowEqual
  );

  const addTimeTablForm = useFormik({
    initialValues,
    onSubmit: (values) => {
      const subjectData = {
        periodId: selectedCell.periodId,
        dayName: selectedCell.dayName,
        subjectId: values.subjectId,
        periodSubjectName: getSubjectName(values.subjectId),
        periodSubjectId: values.subjectId,
        periodSubjectType: getSubjectType(values.subjectId),
        periodTeacherId: values.teacherId,
        periodSubjectTeacher: values.teacherName,
        periodSubjectTeacherEmpCode: values.teacherEmployeeCode,
        substituteTeacherId: values.substituteTeacherId,
        substituteTeacherName: values.substituteTeacherName,
        periodSubstituteTeacherEmpCode: values.substituteTeacherEmployeeCode,
      };
      onSubjectAdded(subjectData);
      toggle();
    },
  });

  useEffect(() => {
    if (getSubjectsTeacherResp) {
      const subjectsListTemp: any = [];
      getSubjectsTeacherResp?.data?.map((subject: any) => {
        subjectsListTemp.push({
          subjectId: subject.subjectId,
          subjectName: subject.subjectName,
          subjectType: subject.subjectType,
          teacherEmpCode: subject.teacherCode,
          teacherId: subject.teacherId,
          teacherName: subject.teacherName,
          substituteTeacherId: subject.substituteTeacherId,
          substituteTeacherName: subject.substituteTeacherName,
          substituteTeacherEmpCode: subject.substituteTeacherEmpCode
        });
      })
      setSubjectsList(subjectsListTemp);
    }
  }, [getSubjectsTeacherResp]);

  useEffect(() => {
    if (id) {
      const subject = subjectsList.find((sub) => +sub.subjectId === +id);
      if (subject) {
        let existingTeacherId = "";
        let existingTeacherName = "";
        let existingTeacherEmpCode = "";
        let existingSubTeacherId = "";
        let existingSubTeacherName = "";
        let existingSubTeacherEmpCode = "";

        if (timeTable && selectedCell) {
          for (const day of timeTable) {
            if (day.dayName === selectedCell.dayName) {
              for (const period of day.periods) {
                if (period.periodId === selectedCell.periodId) {
                  existingTeacherId = period.periodTeacherId || "";
                  existingTeacherName = period.periodSubjectTeacher || "";
                  existingTeacherEmpCode = period.periodSubjectTeacherEmpCode || "";
                  existingSubTeacherId = period.substituteTeacherId || "";
                  existingSubTeacherName = period.periodSubtituteTeacherName || "";
                  existingSubTeacherEmpCode = period.periodSubtituteTeacherEmpCode || "";
                  break;
                }
              }
            }
          }
        }

        addTimeTablForm.setFieldValue('subjectId', id);
        addTimeTablForm.setFieldValue('teacherId', existingTeacherId || subject.teacherId || "");
        addTimeTablForm.setFieldValue('teacherName', existingTeacherName || subject.teacherName || "");
        addTimeTablForm.setFieldValue('teacherEmployeeCode', existingTeacherEmpCode || subject.teacherEmpCode || "");
        addTimeTablForm.setFieldValue('substituteTeacherId', existingSubTeacherId || subject.substituteTeacherId || "");
        addTimeTablForm.setFieldValue('substituteTeacherName', existingSubTeacherName || subject.substituteTeacherName || "");
        addTimeTablForm.setFieldValue('substituteTeacherEmployeeCode', existingSubTeacherEmpCode || subject.substituteTeacherEmpCode || "");

        if (existingTeacherId || subject.teacherId) {
          setSearchEmployeeState({
            id: existingTeacherId || subject.teacherId,
            employeeCode: existingTeacherEmpCode || subject.teacherEmpCode,
            employeeName: existingTeacherName || subject.teacherName
          });
        }

        if (existingSubTeacherId || subject.substituteTeacherId) {
          setSearchSubEmployeeState({
            id: existingSubTeacherId || subject.substituteTeacherId,
            employeeCode: existingSubTeacherEmpCode || subject.substituteTeacherEmpCode,
            employeeName: existingSubTeacherName || subject.substituteTeacherName
          });
        }
      }
    }
    else if (selectedCell?.draggedSubjectId) {
      const subject = subjectsList.find((sub) => +sub.subjectId === +selectedCell.draggedSubjectId);

      if (subject) {
        addTimeTablForm.setFieldValue('subjectId', selectedCell.draggedSubjectId);
        addTimeTablForm.setFieldValue('teacherId', subject.teacherId || "");
        addTimeTablForm.setFieldValue('teacherName', subject.teacherName || "");
        addTimeTablForm.setFieldValue('teacherEmployeeCode', subject.teacherEmpCode || "");
        addTimeTablForm.setFieldValue('substituteTeacherId', subject.substituteTeacherId || "");
        addTimeTablForm.setFieldValue('substituteTeacherName', subject.substituteTeacherName || "");
        addTimeTablForm.setFieldValue('substituteTeacherEmployeeCode', subject.substituteTeacherEmpCode || "");

        if (subject.teacherId) {
          setSearchEmployeeState({
            id: subject.teacherId,
            employeeCode: subject.teacherEmpCode,
            employeeName: subject.teacherName
          });
        }

        if (subject.substituteTeacherId) {
          setSearchSubEmployeeState({
            id: subject.substituteTeacherId,
            employeeCode: subject.substituteTeacherEmpCode,
            employeeName: subject.substituteTeacherName
          });
        }
      }
    }
  }, [id, subjectsList, selectedCell, timeTable]);

  const filterHandler = (e) => {
    const { name, value } = e.target
    if (name === "subjectId") {
      const selectedSubject = subjectsList.find((sub) => +sub.subjectId === +value);
      if (selectedSubject) {

        addTimeTablForm.setValues({
          ...addTimeTablForm.values,
          [name]: value,
          teacherId: selectedSubject.teacherId || "",
          teacherName: selectedSubject.teacherName || "",
          teacherEmployeeCode: selectedSubject.teacherEmpCode || "",
          substituteTeacherId: selectedSubject.substituteTeacherId || "",
          substituteTeacherName: selectedSubject.substituteTeacherName || "",
          substituteTeacherEmployeeCode: selectedSubject.substituteTeacherEmpCode || ""
        });

        if (selectedSubject.teacherId) {
          setSearchEmployeeState({
            id: selectedSubject.teacherId,
            employeeCode: selectedSubject.teacherEmpCode,
            employeeName: selectedSubject.teacherName
          });
        } else {
          setSearchEmployeeState(null);
        }

        if (selectedSubject.substituteTeacherId) {
          setSearchSubEmployeeState({
            id: selectedSubject.substituteTeacherId,
            employeeCode: selectedSubject.substituteTeacherEmpCode,
            employeeName: selectedSubject.substituteTeacherName
          });
        } else {
          setSearchSubEmployeeState(null);
        }
      }
    }
  };

  const handleMainSearch = (value: string) => {
    getEmployees({ searchString: value });
  }

  const getSubjectName = (subjectId) => {
    const selectedSubject = subjectsList.find((sub) => +sub.subjectId === +subjectId);
    return selectedSubject ? selectedSubject.subjectName : "";
  };

  const getSubjectType = (subjectId) => {
    const selectedSubject = subjectsList.find((sub) => +sub.subjectId === +subjectId);
    return selectedSubject ? selectedSubject.subjectType : "";
  };

  return (
    <>
      <form onSubmit={(event: any) => addTimeTablForm.handleSubmit(event)}>

        <div className="tw-p-6">
          <div className="tw-space-y-4">
            <div className="tw-w-full">
              <SelectInput
                name="subjectId"
                labelText="Subject"
                value={addTimeTablForm.values.subjectId}
                onChange={filterHandler}
                menuItems={subjectsList}
                isDisabled={!id ? false : true}
                valueKey="subjectId"
                textKey="subjectName"
                formgroupClassName="tw-mb-3"
              />
            </div>

            <div className="tw-w-full">
              <AutoSearchInput
                formgroupClassName="search-box tw-mb-3"
                name="teacherId"
                placeHolder="Select Teacher..."
                labelText="Teacher Name"
                onChange={(value: any) => handleMainSearch(value)}
                valueKey={"id"}
                labelKey="employeeName"
                subLabelKey="employeeCode"
                labelHeader="Employee Code"
                subLabelHeader="Employee Name"
                selected={searchEmployeeState}
                options={teacherListResp || []}
                isDisabled={selectedCell.draggedSubjectId || !id ? false : true}
                selectedOptionCallbck={(employee: any) => {
                  if (employee) {
                    addTimeTablForm.setValues({
                      ...addTimeTablForm.values,
                      teacherId: employee.id,
                      teacherName: employee.employeeName,
                      teacherEmployeeCode: employee.employeeCode
                    });
                  }
                }}
              >
                <i className="ri-search-line tw-text-gray-400"></i>
              </AutoSearchInput>
            </div>

            <div className="tw-w-full">
              <AutoSearchInput
                formgroupClassName="search-box tw-mb-3"
                name="substituteTeacherId"
                placeHolder="Select Substitute Teacher..."
                labelText="Substitute Teacher Name"
                onChange={(value: any) => handleMainSearch(value)}
                valueKey={"id"}
                labelKey="employeeName"
                subLabelKey="employeeCode"
                labelHeader="Employee Code"
                subLabelHeader="Employee Name"
                selected={searchSubEmployeeState}
                isDisabled={id && !selectedCell.draggedSubjectId ? false : true}
                options={teacherListResp || []}
                selectedOptionCallbck={(employee: any) => {
                  if (employee) {
                    addTimeTablForm.setValues({
                      ...addTimeTablForm.values,
                      substituteTeacherId: employee.id,
                      substituteTeacherName: employee.employeeName,
                      substituteTeacherEmployeeCode: employee.employeeCode
                    });
                  }
                }}
              >
                <i className="ri-search-line tw-text-gray-400"></i>
              </AutoSearchInput>
            </div>

          </div>

          <div className="tw-flex tw-justify-end tw-gap-3 tw-mt-6">

            <Button
              type="button"
              onClick={toggle}
              variant="secondary"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
            >
              Submit
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddSubjectModal;
