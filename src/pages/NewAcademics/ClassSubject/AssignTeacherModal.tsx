import React, { useEffect, useMemo, useState } from 'react'
import BookIconWithInfo from '../../../Components/Common/BookIconWithInfo';
import { AutoSearchInput, InputCheckbox } from '../../../Components/Common';
import TableContainer from '../../../Components/Common/TableContainer';
import { generateColumnsModal } from './helper';
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { generateActionPayload } from '../../../utility/reduxutility';
import { getAssignTeacherListAct, saveSubjectTeacherAct } from '../../../store/academic/classSubjects/classsubjectsactions';
import { shallowEqual } from 'react-redux';
import { getTeacherList } from '../../../store/academic/classroomManagment/classroommanagmentactions';
import { useFormik } from 'formik';
import { nanoid } from 'nanoid';
import Button from '../../../Components/Common/Button';

const initialValues = {
  teacherId: "",
  assignToAll: false
}

const AssignTeacherModal = (props: any) => {
  const dispatch = useAppDispatch();
  const [assignTeacherList, setAssignTeacherList] = useState<any>([]);
  const [searchInputState, setSearchInputState] = useState<string>("");

  const getAssignTeacherList = (otherProps?: any) => {
    const payload = { 
      branchId, 
      academicYearId: props?.academicYearId, 
      curriculumId: props?.curriculumId, 
      classId: props?.branchClassId, 
      subjectId: props?.modalData?.id, 
      ...otherProps 
    };
    dispatch(getAssignTeacherListAct(generateActionPayload("get_section_teacher_list", undefined, payload)));
  }

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getAssignTeacherListResp,
    employeeStatusResp,
    employeeCategoriesResp,
    teacherListResp
  } = useAppSelector(
    ({ classSubjectsInfo, appData, globalData, masterData, classroomManagmentInfo }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getAssignTeacherListResp: classSubjectsInfo.getAssignTeacherListResp,
      employeeStatusResp: masterData.employeeStatusResp,
      employeeCategoriesResp: masterData.employeeCategoriesResp,
      teacherListResp: classroomManagmentInfo.teacherListResp,
    }),
    shallowEqual
  );
    
  const assignTeacherForm = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      const payload = {
        branchId,
        academicYearId: props?.academicYearId,
        curriculumId: props?.curriculumId,
        branchClassId: props?.branchClassId,
        subjectId: props?.modalData?.id,
        sectionTeacherDetailsDto: assignTeacherList?.map((item) => {
          if (item.isDeleted) {
            return {
              sectionId: item.sectionId,
              teacherId: item.originalTeacherId || item.teacherId,
              isDeleted: true
            };
          }
          return {
            sectionId: item.sectionId,
            teacherId: item.teacherId || null,
            isDeleted: false
          };
        }).filter(item => item.teacherId || item.isDeleted) 
      };          
      dispatch(saveSubjectTeacherAct(generateActionPayload("save_subject_teacher", undefined, payload)));
    },
  });

  const getEmployees = (otherProps?: any) => {
    let statusID = employeeStatusResp && employeeStatusResp.find((status: any) => status.empStatusName.toLowerCase() === 'active')?.id;
    let categoryID = employeeCategoriesResp && employeeCategoriesResp.find((category: any) => category.categoryName.toLowerCase() === 'teachers')?.employeeCategoryId;
    let filterState = { ...otherProps };

    if (props?.academicYearId && props?.curriculumId) {
      const params = { 
        branchId: branchId, 
        pageNo: 0, 
        pageSize: 2000, 
        status: statusID, 
        employeeCategoryId: categoryID, 
        searchString: filterState.searchString || "", 
        masterAcademicYearId: props?.academicYearId, 
        curriculumId: props?.curriculumId, 
        ...otherProps 
      };
      dispatch(getTeacherList(generateActionPayload("get_employees", undefined, params)));
    }
  }

  const handleMainSearch = (value: string) => {
    setSearchInputState(value);
    getEmployees({ searchString: value });
  }

  const onChangeInputHndlr = (sectionId: any, value: any, name: any) => {
    if (name === "teacherId") {
      getEmployees({ searchString: value });
    }
  }

  const selectedEmployeeCallback = (employee: any, itemId: any) => {
    const newList = assignTeacherList?.map((item: any) => {
      if (itemId === item.id) {
        if (!employee && item.teacherId) {
          return {
            ...item,
            isDeleted: true,
            originalTeacherId: item.teacherId,
            teacherId: null,
            teacherEmployeeCode: null,
            teacherName: null
          };
        } 
        else if (employee) {
          return {
            ...item,
            isDeleted: false,
            teacherId: employee?.id,
            teacherEmployeeCode: employee?.employeeCode,
            teacherName: employee?.employeeName,
            originalTeacherId: null
          };
        }
        return item;
      }
      return item;
    });
  
    setAssignTeacherList(newList);
  }


  const handleAssignToAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    assignTeacherForm.setFieldValue("assignToAll", checked);
    
    if (checked && teacherListResp && teacherListResp.length > 0) {
      const selectedTeacher = teacherListResp[0];
      
      const newList = assignTeacherList.map((item: any) => ({
        ...item,
        teacherId: selectedTeacher.id,
        teacherEmployeeCode: selectedTeacher.employeeCode,
        teacherName: selectedTeacher.employeeName
      }));
      
      setAssignTeacherList(newList);
    }
  }

  useEffect(() => {
    if (getAssignTeacherListResp) {
      if (getAssignTeacherListResp?.length > 0) {
        setAssignTeacherList(getAssignTeacherListResp?.map((item: any) => ({
          ...item,
          id: nanoid(),
          isDeleted: false, 
        })));
      } else {
        setAssignTeacherList([]);
      }
    }
  }, [getAssignTeacherListResp]);
      
  useEffect(() => {
    getAssignTeacherList();
    // getEmployees();
  }, []);

  const classSubjectColumns = useMemo(() => generateColumnsModal(), [assignTeacherList]);

  const submitHandler = () => {
    assignTeacherForm.handleSubmit();
  };

  return (
    <>
      <div>
        <div className="tw-flex tw-justify-between tw-items-center tw-px-5 tw-py-4 tw-border-b">
          <BookIconWithInfo
            cardName={props?.modalData?.cardName}
            subName={props?.modalData?.subName}
            image={props?.modalData?.image}
            color={props?.modalData?.color}
          />
          <div className="search-box">
            <AutoSearchInput
              formgroupClassName="search-box"
              name="teacherId"
              placeHolder="Search..."
              onChange={(value: any) => handleMainSearch(value)}
              valueKey={"id"}
              labelKey="employeeName"
              subLabelKey="employeeCode"
              labelHeader="Employee Code"
              subLabelHeader="Employee Name"
              options={teacherListResp || []}
              selectedOptionCallbck={(employee: any) => {
                if (assignTeacherForm.values.assignToAll && employee) {
                  const newList = assignTeacherList.map((item: any) => ({
                    ...item,
                    teacherId: employee.id,
                    teacherEmployeeCode: employee.employeeCode,
                    teacherName: employee.employeeName
                  }));
                  setAssignTeacherList(newList);
                }
              }}
            ><i className="ri-search-line search-icon"></i></AutoSearchInput>
          </div>
          <InputCheckbox
            name="assignToAll"
            formgroupClassName="tw-mb-0"
            labelName={"Assign to All"}
            value={assignTeacherForm.values.assignToAll}
            onChange={handleAssignToAll}
          />
        </div>
        <div className="tw-px-5 tw-py-4">
          <TableContainer
            columns={classSubjectColumns}
            data={assignTeacherList || []}
            tableClass="tw-mb-0"
            divClass="tw-overflow-auto tw-max-h-[400px]"
            theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle tw-sticky tw-top-0 tw-z-10"
            showPagination={false}
            onChangeInputHndlr={onChangeInputHndlr}
            rowDataInfo={teacherListResp}
            selectedMembersCallback={selectedEmployeeCallback}
          />
        </div>
        <div className="tw-flex tw-justify-end tw-gap-3 tw-px-5 tw-py-4 tw-border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={props.toggle}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={submitHandler}
            disabled={showApiLoader}
          >
            Save
          </Button>
        </div>
      </div>
    </>
  );
}

export default AssignTeacherModal;