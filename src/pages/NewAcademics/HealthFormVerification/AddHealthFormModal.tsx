import React, { useEffect, useState } from 'react'
import { AutoSearchInput, AutoSearchInputUpdated, DateInput, SelectInput, TextArea, TextInput, UploadFileInput } from '../../../Components/Common';
import { useAppSelector } from '../../../hooks/storehook';
import { shallowEqual, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { getBranchClassAct } from '../../../store/branchsettings/branchacademics/branchacademicsactions';
import { generateActionPayload } from '../../../utility/reduxutility';
import { getSectionList, getStuHealthFormListAct, saveHealthFormAct } from '../../../store/academic/classroomManagment/classroommanagmentactions';
import { getStudentsListAct } from '../../../store/directory/studentmanagement/studentmanagementactions';
import * as Yup from "yup";
import Button from '../../../Components/Common/Button';

const initialValues: any = {
    academicYearId: "",
    curriculumId: "",
    classId: "",
    sectionId:"",
    studentId :"",
    address:"",
    healthForm:null,
};

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required('Academic Year is required'),
  studentId: Yup.string().required('Please Search student after selecting academic year .'),
  healthForm: Yup.mixed().required('Health Form is required')
      .test('fileFormat', 'Only PDF files are allowed', value => {
        if (value) {
          const supportedFormats = ['pdf'];
          return supportedFormats.includes(value.name.split('.').pop());
        }
        return true;
      })
})


const AddHealthFormModal = (props:any) => {

const dispatch = useDispatch();
const [searchStudentState, setSearchStudentState] = useState<any>(null);
const [healthForm,setHealthForm] = useState<any>("");
const [errorHealthForm, setErrorHealthForm] = useState<any>("")

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        studentsListResp,
        sectionListResp,
        saveHealthFormResp,
        getStuHealthFormListResp,
    }: any = useAppSelector(
        ({applicationSale, globalData, instAcademics, branchAcademics, appData, directoryStudent,classroomManagmentInfo }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader:globalData.showApiLoader,
            studentsListResp:directoryStudent.studentsListResp,
            sectionListResp:classroomManagmentInfo.sectionListResp,
            saveHealthFormResp:classroomManagmentInfo.saveHealthFormResp,
            getStuHealthFormListResp:classroomManagmentInfo.getStuHealthFormListResp,
        }),
        shallowEqual
    );

    const addHealthForm = useFormik({
        initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values:any) => {
          const params = {...values , branchId ,instituteId}
          delete params.healthForm
          const formData = new FormData();
          formData.append("request", JSON.stringify(params));
          formData.append("file",values.healthForm);
          dispatch(saveHealthFormAct(generateActionPayload("save_health_form", undefined, formData)));
        },
      });

      useEffect(() => {
       
      if(props.isOpen){
        let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT")?.academicYearId
        addHealthForm.setValues((prev:any)=>({...prev,academicYearId:yearId}))
      }
        
      }, [props.isOpen])
      


        const filterHandler = (event:any)=>{
            addHealthForm.handleChange(event)
            const { name, value } = event.target;
            if (name === "curriculumId") {
                const payload = { branchId: branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
                dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
              }
              else if(name === "classId"){
                if(value){
                    let payload = { branchClassId: value || null, masterAcademicYearId: addHealthForm.values.academicYearId,orderBy: "asc",
                    sortBy: "sectionName" }

                dispatch(getSectionList(generateActionPayload("get_section_list", undefined, payload)));
                }
    
              }
        }

        function onInputSearchChange(inputString: any) {
            const { academicYearId, curriculumId, classId } = addHealthForm.values;
            if (inputString && academicYearId) {
        
              // const params = { searchString: inputString };
              // dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, { branchId })));
              const params = {
                branchId, academicYearId : academicYearId,
                // classId: classId,
                // curriculumId: curriculumId, 
                searchString: inputString,
              };
              dispatch(getStuHealthFormListAct(generateActionPayload("get_stu_health_form", undefined, params)));
            }
          }

          function uploadFileErrorHndlr(fileSize: any, fileType: string, validFileFormaters: Array<string>) {
            if (!validFileFormaters.includes(fileType)) {
                return `Upload file should be of format ${validFileFormaters.join(',')}`;
            }
            if (!isNaN(fileSize) && (Math.ceil(fileSize / (1024 * 1024)) > 2)) {
                return "Upload file should be less than 2mb.";
            }
            return "";
        }

          function handleFileUploadHnlr(event: any) {
            const { name } = event.target;
            const file = event.target.files[0];
            if (name === "healthForm") {
              let error = uploadFileErrorHndlr(file.size,file.type,['application/pdf']);
              if (error === "") {
                setErrorHealthForm('');
                setHealthForm(file);
                addHealthForm.setFieldValue('healthForm', file)
              }
              else {
                setErrorHealthForm(error);
              }
            }
          }

          const selectedStudent = (student: any) => {
            
            const payload = { branchId: branchId, curriculumId: student?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            if(student?.sectionId){
              let newpayload = { branchClassId: student?.classId || null, masterAcademicYearId: addHealthForm.values.academicYearId,orderBy: "asc", sortBy: "sectionName" }
  
              dispatch(getSectionList(generateActionPayload("get_section_list", undefined, newpayload)));
            }

            setSearchStudentState(student);
            addHealthForm.setValues((prev:any)=>({...prev,
              studentId: student?.studentId,
              curriculumId : student?.curriculumId,
              classId : student?.classId,
              sectionId : student?.sectionId,
              address : student?.currentAddress,

            }) );
    
          }

        const { data: academicYearList } = academicYearListResp || {};
        const { data: curriculumTypes } = brchCurriculumResp || {}
        const { content: classTypes } = branchClassResp || {};
        const { data: StudentList } = studentsListResp || {};
  return (
    <>
      <div className="tw-p-4">
        <div className="tw-grid tw-gap-3 tw-grid-cols-12">

          {/* Academic Year */}
          <div className="tw-col-span-6">
            <SelectInput
                name="academicYearId"
                value={addHealthForm.values.academicYearId}
                onChange={filterHandler}
                onBlur={addHealthForm.handleBlur}
                menuItems={academicYearList || []}
                valueKey="academicYearId"
                textKey="academicYearName"
                // inputClassName="border-0"
           
                formgroupClassName="tw-mb-0"
                defaultSelect="Select"
                labelText='Academic Year'
                labelClass='required'
                invalid={addHealthForm.touched.academicYearId && addHealthForm.errors.academicYearId ? true : false}
                error={addHealthForm.touched.academicYearId && addHealthForm.errors.academicYearId ? addHealthForm.errors.academicYearId : ""}
            />    
          </div>

          {/* Curriculum */}
          <div className="tw-col-span-6">
            <SelectInput
                 name="curriculumId"
                 value={addHealthForm.values.curriculumId}
                 onChange={filterHandler}
                 menuItems={curriculumTypes || []}
                 valueKey="branchCurriculumId"
                 onBlur={addHealthForm.handleBlur}
                 textKey="curriculumName"
                 isDisabled={true}
                 // inputClassName="bg-light border-0"
                 formgroupClassName="tw-mb-0"
                 defaultSelect="Select"
                 labelText='Curriculum'
                 invalid={addHealthForm.touched.curriculumId && addHealthForm.errors.curriculumId ? true : false}
                error={addHealthForm.touched.curriculumId && addHealthForm.errors.curriculumId ? addHealthForm.errors.curriculumId : ""}
             />                    
          </div>

          {/* Class */}
          <div className="tw-col-span-6 tw-mt-2 tw-pt-1">
            <SelectInput
                 name="classId"
                 value={addHealthForm.values.classId}
                 onChange={filterHandler}
                 onBlur={addHealthForm.handleBlur}
                 menuItems={classTypes || []}
                 valueKey="id"
                 textKey="shortName"
                 isDisabled={true}
                 defaultSelect="Select"
                 labelText='Classes'
                 // inputClassName="bg-light border-0"
                 formgroupClassName="tw-mb-0"
                 invalid={addHealthForm.touched.classId && addHealthForm.errors.classId ? true : false}
                  error={addHealthForm.touched.classId && addHealthForm.errors.classId ? addHealthForm.errors.classId : ""}
             />   
          </div>

          {/* Section */}
          {searchStudentState?.sectionId && (
            <div className="tw-col-span-6 tw-mt-2 tw-pt-1">
              <SelectInput
                 name="sectionId"
                 value={addHealthForm.values.sectionId}
                 onChange={filterHandler}
                 onBlur={addHealthForm.handleBlur}
                 menuItems={sectionListResp?.data || []}
                 valueKey="sectionId"
                 textKey="sectionName"
                 isDisabled={true}
                 defaultSelect="Select"
                 labelText='Section'
                 // inputClassName="bg-light border-0"
                 formgroupClassName="tw-mb-0"
                 invalid={addHealthForm.touched.sectionId && addHealthForm.errors.sectionId ? true : false}
                  error={addHealthForm.touched.sectionId && addHealthForm.errors.sectionId ? addHealthForm.errors.sectionId : ""}
             />  
            </div>
          )}

          {/* Student Auto Search */}
          <div className="tw-col-span-12 tw-mt-2 tw-pt-1">
            <AutoSearchInputUpdated
              formgroupClassName="search-box"
              name="studentId"
              placeHolder="Search..."
              onChange={(string) => {
                if (!string) addHealthForm.setFieldValue('studentId', "");
                onInputSearchChange(string);
              }}
              onBlur={addHealthForm.handleBlur}
              valueKey="studentId"
              labelHeader="Student Code"
              labelKey="studentCode"
              subLabelHeader="Student Name"
              subLabelKey="studentName"
              labelText="Student"
              labelClass="tw-font-semibold"
              options={getStuHealthFormListResp || []}
              selected={searchStudentState}
              selectedOptionCallbck={selectedStudent}
              invalid={addHealthForm.touched.studentId && addHealthForm.errors.studentId}
              error={addHealthForm.touched.studentId && addHealthForm.errors.studentId ? addHealthForm.errors.studentId : ""}
            >
              <i className="ri-search-line tw-absolute tw-right-3 tw-top-3" />
            </AutoSearchInputUpdated>
          </div>

          {/* Address */}
          <div className="tw-col-span-12 tw-mt-2 tw-pt-1">
            <TextArea
              name="address"
              value={addHealthForm.values.address}
              onChange={filterHandler}
              onBlur={addHealthForm.handleBlur}
              formgroupClassName="tw-mb-0"
              labelText="Residential Address"
              isDisabled={true}
              helperText=""
            />
          </div>

          {/* Upload Health Form */}
          <div className="tw-col-span-12 tw-mt-3">
            <UploadFileInput
              name="healthForm"
              labelText="Upload Health Form"
              labelClass="tw-font-semibold"
              value={healthForm?.name || ""}
              onChange={handleFileUploadHnlr}
              hideUploadBtn={true}
              invalid={!!errorHealthForm}
              error={errorHealthForm || (addHealthForm.touched.healthForm && addHealthForm.errors.healthForm)}
            />
          </div>

          {/* Action Buttons */}
          <div className="tw-col-span-12">
            <div className="tw-flex tw-justify-end tw-gap-3 tw-mt-2">
              <Button
                type="button"
                variant='secondary'
                onClick={props.toggle}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant='primary'
                onClick={(event: any) => addHealthForm.handleSubmit(event)}
                disabled={showApiLoader}
              >
                Submit
              </Button>
            </div>
          </div>

        </div>
      </div>

    </>
  )
}

export default AddHealthFormModal