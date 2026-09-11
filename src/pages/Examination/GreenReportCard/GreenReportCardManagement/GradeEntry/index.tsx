import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useFormik } from 'formik';

import { shallowEqual } from 'react-redux';

import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon } from '@hugeicons-pro/core-stroke-standard';

import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook';
import { resetBrchClassAct } from '../../../../../store/branchsettings/branchacademics/branchacademicsslice';
import {
  getBranchClassAct,
  getBranchCurriculumAct,
} from '../../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import { getIgseTermNameListAct } from '../../../../../store/examination/examinationsettings/examinationsettingsaction';
import {
  getAllGreenReportGradeEntryStntsListAct,
  getCategorySelectionListAct,
  saveGreenReportGradeAct,
} from '../../../../../store/examination/pvaReports/pvaReportsActions';
import { getSectionList } from '../../../../../store/academic/classroomManagment/classroommanagmentactions';
import { setIgseTermDetailsListAct } from '../../../../../store/examination/examinationsettings/examinationsettingsslice';
import { generateColumns } from './helper';
import {
  ModalContainerUpdated,
  SelectInput,
  TableExpandable,
} from '../../../../../Components/Common';
import {
  resetAllGreenReportGradeEntryStntsListAct,
  resetCategorySelectionListAct,
} from '../../../../../store/examination/pvaReports/pvaReportsSlice';
import { useModal } from '../../../../../hooks/modalhook';
import StudentIndividualProjectModal from './StudentIndividualProjectModal';

const initialValues = {
  academicYearId: '',
  curriculumId: '',
  classId: '',
  termId: '',
  sectionId: '',
};

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required('Academic Year is required'),
  curriculumId: Yup.string().required('Curriculum is required'),
  classId: Yup.string().required('Class is required'),
  termId: Yup.string().required('Term is required'),
  sectionId: Yup.string().required('Section is required'),
});

const GreenGradeEntry = () => {
  const dispatch = useAppDispatch();
  const [studentData, setStudentData] = useState<any>([]);
  const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);
  const classApiCalled = useRef(false);
  const location = useLocation();
  const isEy = location.pathname.includes('/early-years-management');
  const isIgcse = location.pathname.includes('/igcse-management');
  const [objectivesData, setObjectivesData] = useState<any[]>([]);
  const {
    openModal: studentIndividualProjectOpenModal,
    closeModal: studentIndividualProjectCloseModal,
    modalState: studentIndividualProjectModalState,
  } = useModal();

  const pvaGradeEntryForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      getCategoryListApiCall(values);
      getAllGreenReportGradeEntryStntsList();
    },
  });

  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    sectionListResp,
    getIgseTermNameListResp,
    getAllGreenReportGradeEntryStntsListResp,
    getCategorySelectionListResp,
    saveGreenReportGradeResp,
    pvaReportsErrorAct,
    loggedInUserRole,
  } = useAppSelector(
    ({
      globalData,
      instAcademics,
      branchAcademics,
      appData,
      classroomManagmentInfo,
      examinationSettings,
      pvaReports,
    }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      sectionListResp: classroomManagmentInfo.sectionListResp,
      getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
      getAllGreenReportGradeEntryStntsListResp:
        pvaReports.getAllGreenReportGradeEntryStntsListResp,
      getCategorySelectionListResp: pvaReports.getCategorySelectionListResp,
      saveGreenReportGradeResp: pvaReports.saveGreenReportGradeResp,
      pvaReportsErrorAct: pvaReports.pvaReportsErrorAct,
      loggedInUserRole: appData.loggedInUserRole,
    }),
    shallowEqual,
  );
  const pvsGradeEntryRef = useRef({
    prevSaveGreenReportGradeResp: saveGreenReportGradeResp,
    prevPvaReportsErrorAct: pvaReportsErrorAct,
  });

  useEffect(() => {
    const { prevSaveGreenReportGradeResp, prevPvaReportsErrorAct } =
      pvsGradeEntryRef.current;
    if (
      saveGreenReportGradeResp &&
      prevSaveGreenReportGradeResp !== saveGreenReportGradeResp
    ) {
      toast.success('Grade entry saved successfully');
      setAllStudentSelectedState(false);
      setStudentData((prevData) =>
        prevData.map((student) => ({
          ...student,
          isSelected: false,
        })),
      );
      getCategoryListApiCall();
      getAllGreenReportGradeEntryStntsList();
    } else if (
      pvaReportsErrorAct &&
      prevPvaReportsErrorAct !== pvaReportsErrorAct
    ) {
      const { details } = pvaReportsErrorAct;
      toast.error(details || 'Something went wrong');
      dispatch(resetAllGreenReportGradeEntryStntsListAct(undefined));
      dispatch(resetCategorySelectionListAct(undefined));
      setStudentData([]);
    }

    pvsGradeEntryRef.current.prevSaveGreenReportGradeResp =
      saveGreenReportGradeResp;
    pvsGradeEntryRef.current.prevPvaReportsErrorAct = pvaReportsErrorAct;
  }, [saveGreenReportGradeResp, pvaReportsErrorAct]);

  useEffect(() => {
    const categorySelections = Array.isArray(
      getCategorySelectionListResp?.content,
    )
      ? getCategorySelectionListResp.content
      : [];

    const categories = categorySelections.map((selection: any) => ({
      id: selection.id,
      title: selection.categoryName,
      subCategories: Array.isArray(selection?.subCategories)
        ? selection.subCategories.map((subCategory: any) => ({
            id: subCategory.subCategoryId,
            skillAreaId: subCategory.subCategoryId,
            title: subCategory.subCategoryName,
          }))
        : [],
    }));

    setObjectivesData(categories);
  }, [getCategorySelectionListResp]);

  useEffect(() => {
    const studentsList = Array.isArray(getAllGreenReportGradeEntryStntsListResp)
      ? getAllGreenReportGradeEntryStntsListResp
      : [];

    const modifiedData = studentsList.map((student: any) => {
      const objectiveValues: Record<string, number> = {};

      student.categoryResponseDTOS?.forEach((category: any) => {
        category.subCategories?.forEach((subCategory: any) => {
          objectiveValues[`objective_${subCategory.subCategoryId}`] =
            Number(subCategory.gradeRating) || 0;
        });
      });

      const uploadImageUrl = student.uploadImageUrl;

      return {
        ...student,
        isSelected: false,
        isIndividualProject: student.isIndividualProject ?? false,
        projectDescription: student.projectDescription ?? null,
        uploadImage: uploadImageUrl ?? null,
        uploadImageFileName:
          student.uploadImageFileName ??
          student.uploadImageName ??
          uploadImageUrl?.originalName ??
          uploadImageUrl?.s3Url ??
          '',
        uploadImagePreviewUrl: uploadImageUrl?.s3Url ?? '',
        ...objectiveValues,
      };
    });

    setStudentData(modifiedData);
  }, [getAllGreenReportGradeEntryStntsListResp]);

  useEffect(() => {
    const yearId =
      academicYearListResp &&
      academicYearListResp.data.find(
        (year: any) => year.yearStatus.toLowerCase() === 'current',
      )?.academicYearId;
    pvaGradeEntryForm.setFieldValue('academicYearId', yearId);
    getCurriculumApiCall({ academicYearId: yearId });
  }, [academicYearListResp]);

  useEffect(() => {
    const { data } = brchCurriculumResp || {};
    const curriculumMapping: Record<string, string> = {
      '/early-years-management': 'EY1-EY3',
      '/cbse-pva-management': 'CBSE',
      '/igcse-management': 'IGCSE',
    };
    const selectedCurriculumName = curriculumMapping[location.pathname];
    if (
      Array.isArray(data) &&
      data.length > 0 &&
      pvaGradeEntryForm.values.academicYearId &&
      !classApiCalled.current
    ) {
      const selectedCurriculum = data.find(
        (item) => item.shortName === selectedCurriculumName,
      );
      if (!selectedCurriculum) {
        dispatch(resetBrchClassAct(undefined));
        pvaGradeEntryForm.setFieldValue('curriculumId', '');
        return;
      }
      pvaGradeEntryForm.setFieldValue(
        'curriculumId',
        selectedCurriculum.branchCurriculumId,
      );

      const payload: any = {
        branchId,
        curriculumId: selectedCurriculum.branchCurriculumId,
        academicYearId: pvaGradeEntryForm.values.academicYearId,
        sortBy: 'classSequence',
        orderBy: 'asc',
        pageNo: 0,
        pageSize: 100,
      };
      if (loggedInUserRole === 'TEACHER') {
        payload.progressCardType = 'PVA';
      }
      dispatch(
        getBranchClassAct(
          generateActionPayload(
            'get_brch_curriculum_class',
            undefined,
            payload,
          ),
        ),
      );
      dispatch(
        getIgseTermNameListAct(
          generateActionPayload('get_igse_term_name_list', undefined, {
            branchId,
            curriculumId: selectedCurriculum.branchCurriculumId,
          }),
        ),
      );
      pvaGradeEntryForm.setValues((prev: any) => ({
        ...prev,
        curriculumId: selectedCurriculum.branchCurriculumId,
      }));
      classApiCalled.current = true;
    }
  }, [brchCurriculumResp, pvaGradeEntryForm.values.academicYearId]);

  useEffect(() => {
    const { content } = branchClassResp || {};
    if (Array.isArray(content) && content.length > 0) {
      pvaGradeEntryForm.setFieldValue('classId', content[0].id);
      getSectionListResp({ branchClassId: content[0]?.id });
    }
  }, [branchClassResp]);

  useEffect(() => {
    return () => {
      dispatch(resetBrchClassAct(undefined));
      dispatch(resetCategorySelectionListAct(undefined));
      dispatch(resetAllGreenReportGradeEntryStntsListAct(undefined));
    };
  }, []);

  const handleHandSelectionChange = (
    studentId: number,
    objectiveId: string,
    value: number,
  ) => {
    setStudentData((prevData) =>
      prevData.map((student) =>
        student.studentId === studentId
          ? { ...student, [`objective_${objectiveId}`]: value }
          : student,
      ),
    );
  };

  const instituteTerms = (curriculumId: string) => {
    if (curriculumId) {
      let payload = {
        branchId,
        curriculumId,
      };
      dispatch(
        getIgseTermNameListAct(
          generateActionPayload('get_igse_term_name_list', undefined, payload),
        ),
      );
    }
  };

  const getCategoryListApiCall = (otherProps?: any) => {
    const { academicYearId, curriculumId, classId, termId, sectionId } =
      pvaGradeEntryForm.values;

    if (academicYearId && curriculumId && classId) {
      const payload = {
        instituteId,
        branchId,
        academicYearId,
        curriculumId,
        classId,
        termId,
        sectionId,
        ...otherProps,
      };

      if (payload.academicYearId) {
        dispatch(
          getCategorySelectionListAct(
            generateActionPayload(
              'get_category_selection_list',
              undefined,
              payload,
            ),
          ),
        );
      }
    }
  };

  const getAllGreenReportGradeEntryStntsList = () => {
    const payload = {
      branchId,
      ...pvaGradeEntryForm.values,
    };
    dispatch(
      getAllGreenReportGradeEntryStntsListAct(
        generateActionPayload(
          'get_all_green_report_grade_entry_stnts_list_resp',
          undefined,
          payload,
        ),
      ),
    );
  };

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = {
      academicYearId: pvaGradeEntryForm.values.academicYearId,
      branchId: branchId,
      pageNo: 0,
      pageSize: 100,
      sortBy: 'curriculumName',
      orderBy: 'asc',
      ...otherProps,
    };
    if (loggedInUserRole === 'TEACHER') {
      payload1.progressCardType = 'PVA';
    }
    dispatch(
      getBranchCurriculumAct(
        generateActionPayload('get_brch_curriculum', undefined, payload1),
      ),
    );
  };

  const getClassApiCall = (otherProps?: any) => {
    const payload = {
      branchId,
      curriculumId: pvaGradeEntryForm.values.curriculumId,
      academicYearId: pvaGradeEntryForm.values.academicYearId,
      sortBy: 'classSequence',
      orderBy: 'asc',
      pageNo: 0,
      pageSize: 100,
      ...otherProps,
    };
    if (loggedInUserRole === 'TEACHER') {
      payload.progressCardType = 'PVA';
    }
    dispatch(
      getBranchClassAct(
        generateActionPayload('get_brch_curriculum_class', undefined, payload),
      ),
    );
  };

  const getSectionListResp = (otherProps?: any) => {
    const payload = {
      branchClassId: pvaGradeEntryForm.values.classId || null,
      masterAcademicYearId: pvaGradeEntryForm.values.academicYearId,
      curriculumId: pvaGradeEntryForm.values.curriculumId,
      pageNo: 0,
      pageSize: 20,
      sortBy: 'sectionName',
      orderBy: 'asc',
      ...otherProps,
    };
    if (loggedInUserRole === 'TEACHER') {
      payload.progressCardType = 'PVA';
    }
    if (payload.branchClassId && payload.masterAcademicYearId) {
      dispatch(
        getSectionList(
          generateActionPayload('get_section_list', undefined, payload),
        ),
      );
    }
  };

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    pvaGradeEntryForm.setFieldValue(name, value);
    dispatch(resetAllGreenReportGradeEntryStntsListAct(undefined));
    setStudentData([]);
    const updateFormValues = (
      updatedValues: Partial<typeof pvaGradeEntryForm.values>,
    ) => {
      pvaGradeEntryForm.setValues((prev) => ({ ...prev, ...updatedValues }));
    };
    if (name === 'academicYearId') {
      dispatch(resetCategorySelectionListAct(undefined));
      getCurriculumApiCall({ academicYearId: value });
      updateFormValues({
        academicYearId: value,
        classId: '',
        curriculumId: '',
        sectionId: '',
      });
    } else if (name === 'curriculumId') {
      updateFormValues({
        curriculumId: value,
        classId: '',
        sectionId: '',
      });
      if (!value) {
        dispatch(resetBrchClassAct(undefined));
        dispatch(setIgseTermDetailsListAct(undefined));
      } else {
        getClassApiCall({
          curriculumId: value,
          academicYearId: pvaGradeEntryForm.values.academicYearId,
        });
        instituteTerms(value);
      }
    } else if (name === 'classId') {
      updateFormValues({ classId: value, sectionId: '' });
      getSectionListResp({ branchClassId: value });
    } else if (name === 'termId') {
      updateFormValues({ termId: value });
    } else {
      updateFormValues({ [name]: value });
    }
  };

  const allStudentCheckHndlr = useCallback((event: any) => {
    const { checked } = event.target;
    setAllStudentSelectedState(checked);
    setStudentData((prevData) =>
      prevData.map((student) => ({
        ...student,
        isSelected: checked,
      })),
    );
  }, []);

  const singleStudentCheckHndlr = useCallback(
    (event: any) => {
      const { checked } = event.currentTarget;
      const studentId = Number(event.currentTarget.getAttribute('data-id'));
      setStudentData((prevData) =>
        prevData.map((student) =>
          student.studentId === studentId
            ? { ...student, isSelected: checked }
            : student,
        ),
      );
      setAllStudentSelectedState((prevData) =>
        studentData.every((s) =>
          s.studentId === studentId ? checked : s.isSelected,
        ),
      );
    },
    [studentData],
  );

  const handleStudentDetailsModalOpen = (student: any) => {
    studentIndividualProjectOpenModal(student);
  };

  const handleStudentIndividualProjectSubmit = (studentDetails: any) => {
    const {
      studentId,
      isIndividualProject,
      projectDescription,
      uploadImage,
      uploadImageFileName,
    } = studentDetails;

    setStudentData((prevData) =>
      prevData.map((student) =>
        String(student.studentId) === String(studentId)
          ? {
              ...student,
              isIndividualProject,
              projectDescription,
              uploadImage,
              uploadImageFileName,
            }
          : student,
      ),
    );
    toast.success('Student details updated successfully');
  };

  const generatePayload = (
    studentData: any[],
    objectivesData: any[],
    branchId: number,
  ) => {
    const { academicYearId, classId, sectionId, termId } =
      pvaGradeEntryForm.values;

    const selectedStudents = studentData.filter(
      (student) => student.isSelected,
    );

    return {
      academicYearId: Number(academicYearId),
      classId: Number(classId),
      sectionId: Number(sectionId),
      termId: Number(termId),
      branchId: Number(branchId),

      students: selectedStudents.map((student, studentIndex) => {
        const categories = objectivesData
          .map((category: any) => {
            const subCategories = (category.subCategories || [])
              .map((subCategory: any) => {
                const gradeRating =
                  Number(student[`objective_${subCategory.id}`]) || 0;

                return {
                  subCategoryId: Number(subCategory.id),
                  gradeRating,
                };
              })
              .filter((subCategory: any) => subCategory.gradeRating > 0);

            return {
              greenTermCategoryId: Number(category.id),
              subCategories,
            };
          })
          .filter((category: any) => category.subCategories.length > 0);

        return {
          studentId: Number(student.studentId),
          isIndividualProject: student.isIndividualProject ?? false,
          projectDescription: student.isIndividualProject
            ? (student.projectDescription ?? null)
            : null,
          ...(student.isIndividualProject && student.uploadImage instanceof File
            ? { uploadImage: `studentImage_${studentIndex + 1}` }
            : {}),
          categories,
        };
      }),
    };
  };

  const submitHndlr = () => {
    const selectedStudents = studentData.filter(
      (student) => student.isSelected,
    );

    if (!selectedStudents.length) {
      toast.error('At least one student is required');
      return;
    }

    const hasAtLeastOneHandSelected = selectedStudents.some((student) =>
      Object.keys(student).some(
        (key) => key.startsWith('objective_') && Number(student[key]) > 0,
      ),
    );

    if (!hasAtLeastOneHandSelected) {
      toast.error('At least one hand selection is required');
      return;
    }

    const payload = generatePayload(studentData, objectivesData, branchId);

    const formData = new FormData();

    formData.append('request', JSON.stringify(payload));

    selectedStudents.forEach((student, studentIndex) => {
      if (student.isIndividualProject && student.uploadImage instanceof File) {
        const fileKey = `studentImage_${studentIndex + 1}`;
        formData.append(fileKey, student.uploadImage, student.uploadImage.name);
      }
    });

    dispatch(
      saveGreenReportGradeAct(
        generateActionPayload(
          'save_green_report_grade_resp',
          undefined,
          formData,
        ),
      ),
    );
  };

  const columns = useMemo(
    () =>
      generateColumns(
        allStudentCheckHndlr,
        singleStudentCheckHndlr,
        allStudentSelectedState,
        isEy,
        isIgcse,
        objectivesData,
        handleHandSelectionChange,
        handleStudentDetailsModalOpen,
      ),
    [studentData, objectivesData],
  );
  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {};
  const { content: classTypes } = branchClassResp || {};

  return (
    <>
      <div className="card d-inline-block w-100 overflow-hidden">
        <div className="card-body p-0">
          <div className="bg-light m-3 pt-1 pb-0 rounded">
            <div className="row p-3 g-3 examination">
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="academicYearId"
                  value={pvaGradeEntryForm.values.academicYearId}
                  onChange={filterHandler}
                  menuItems={academicYearList || []}
                  valueKey="academicYearId"
                  textKey="academicYearName"
                  labelText="Academic Year"
                  labelClass="required"
                  inputClassName="bg-light"
                  formgroupClassName="mb-0"
                  floatingLabel
                  invalid={
                    pvaGradeEntryForm.touched.academicYearId &&
                    pvaGradeEntryForm.errors.academicYearId
                      ? true
                      : false
                  }
                  error={
                    pvaGradeEntryForm.touched.academicYearId &&
                    pvaGradeEntryForm.errors.academicYearId
                      ? pvaGradeEntryForm.errors.academicYearId
                      : ''
                  }
                />
              </div>
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="curriculumId"
                  value={pvaGradeEntryForm.values.curriculumId}
                  onChange={filterHandler}
                  menuItems={curriculumTypes}
                  valueKey="branchCurriculumId"
                  textKey="curriculumName"
                  labelText="Curriculum"
                  labelClass="required"
                  inputClassName="bg-light"
                  formgroupClassName="mb-0"
                  floatingLabel
                  invalid={
                    pvaGradeEntryForm.touched.curriculumId &&
                    pvaGradeEntryForm.errors.curriculumId
                      ? true
                      : false
                  }
                  error={
                    pvaGradeEntryForm.touched.curriculumId &&
                    pvaGradeEntryForm.errors.curriculumId
                      ? pvaGradeEntryForm.errors.curriculumId
                      : ''
                  }
                />
              </div>

              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="classId"
                  value={pvaGradeEntryForm.values.classId}
                  onChange={filterHandler}
                  menuItems={classTypes}
                  valueKey="id"
                  textKey="shortName"
                  labelText="Class"
                  labelClass="required"
                  inputClassName="bg-light"
                  formgroupClassName="mb-0"
                  floatingLabel
                  invalid={
                    pvaGradeEntryForm.touched.classId &&
                    pvaGradeEntryForm.errors.classId
                      ? true
                      : false
                  }
                  error={
                    pvaGradeEntryForm.touched.classId &&
                    pvaGradeEntryForm.errors.classId
                      ? pvaGradeEntryForm.errors.classId
                      : ''
                  }
                />
              </div>
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="sectionId"
                  value={pvaGradeEntryForm.values.sectionId}
                  onChange={filterHandler}
                  menuItems={sectionListResp?.data || []}
                  valueKey="sectionId"
                  textKey="sectionName"
                  defaultSelect="Select"
                  labelText="Section"
                  labelClass="required"
                  inputClassName="bg-light"
                  formgroupClassName="mb-0"
                  onBlur={pvaGradeEntryForm.handleBlur}
                  floatingLabel
                  invalid={
                    pvaGradeEntryForm.touched.sectionId &&
                    pvaGradeEntryForm.errors.sectionId
                      ? true
                      : false
                  }
                  error={
                    pvaGradeEntryForm.touched.sectionId &&
                    pvaGradeEntryForm.errors.sectionId
                      ? pvaGradeEntryForm.errors.sectionId
                      : ''
                  }
                />
              </div>
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="termId"
                  labelText="Term Name"
                  labelClass="required"
                  inputClassName="bg-light"
                  formgroupClassName="mb-0"
                  value={pvaGradeEntryForm.values.termId}
                  onChange={filterHandler}
                  menuItems={
                    Array.isArray(getIgseTermNameListResp?.data)
                      ? getIgseTermNameListResp?.data
                      : []
                  }
                  valueKey="termId"
                  textKey="termName"
                  floatingLabel
                  invalid={
                    pvaGradeEntryForm.touched.termId &&
                    pvaGradeEntryForm.errors.termId
                      ? true
                      : false
                  }
                  error={
                    pvaGradeEntryForm.touched.termId &&
                    pvaGradeEntryForm.errors.termId
                      ? pvaGradeEntryForm.errors.termId
                      : ''
                  }
                />
              </div>
              {/* <div className="col-auto d-flex align-items-center mt-2 mt-sm-0">
                <span>
                  Please select students to provide ratings for skills
                </span>
              </div> */}
              <div className="col-auto ms-auto d-flex align-items-center mt-2 mt-sm-0">
                <button
                  disabled={showApiLoader}
                  type="button"
                  onClick={(event: any) =>
                    pvaGradeEntryForm.handleSubmit(event)
                  }
                  className="btn float-end text-white d-flex justify-content-center align-items-center"
                  style={{ background: '#405189', border: 'none' }}
                >
                  <HugeiconsIcon
                    icon={Search01Icon}
                    className="me-2 text-white"
                    size={15}
                  />
                  Search
                </button>
              </div>
            </div>
          </div>
          <div className="row">
            <TableExpandable
              columns={columns || []}
              data={studentData || []}
              tableClass="table-bordered table-nowrap"
              divClass="table-responsive max-h-500px mb-2"
              theadClass="table-light text-muted align-middle z-index-2"
              showPagination={false}
              rowDataInfo={
                Array.isArray(getCategorySelectionListResp?.content)
                  ? getCategorySelectionListResp.content
                  : []
              }
            />
            {studentData?.length === 0 && pvaReportsErrorAct && (
              <div className="col d-flex">
                <span className="text-danger ms-3 mt-2">
                  {`Please add data in Settings and Category Selection for the selected filters`}
                </span>
              </div>
            )}
          </div>
          <div className="row">
            <div className="d-flex gap-2 w-auto ms-auto mx-4 my-3">
              <button
                type="button"
                className={`btn btn-success`}
                disabled={showApiLoader}
                onClick={submitHndlr}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <ModalContainerUpdated
        id="student-Individual-project-details"
        isOpen={studentIndividualProjectModalState.showModal}
        toggle={studentIndividualProjectCloseModal}
        modalTitle="Individual Project Details"
        modalSize="lg"
      >
        <StudentIndividualProjectModal
          isOpen={studentIndividualProjectModalState.showModal}
          toggle={studentIndividualProjectCloseModal}
          student={studentIndividualProjectModalState.modalData}
          showApiLoader={showApiLoader}
          onSubmitHandler={handleStudentIndividualProjectSubmit}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default GreenGradeEntry;
