import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { Col } from 'reactstrap';
import {  NewPhoneInput, RadioInput, SelectInput, TextIconInput, TextInput } from '../../../../Components/Common'
import { useAppSelector } from '../../../../hooks/storehook';
import { getBranchClassAct, getBrchSectionsAct } from '../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { updateStudentAct } from '../../../../store/directory/studentmanagement/studentmanagementactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { CampusTypeOptions, details, formSectionSaveKey, IsEmployeeOptions } from './helper';
import { IModalProps, IUpdateEmployeeRepRef } from './EmployeeInfoTypes'
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { getRelationTypeAct } from '../../../../store/masterdata/masterdataactions';
import Button from '../../../../Components/Common/Button';
interface AddEmergencyContactProps {
  emergencyContactId: number;
  emergencyContactPerson: string;
  emergencyContactNo: string;
  emergencyRelationId: string;
}
// const initialValues:AddSiblingDetailsProps = {
//     studentId:"",
//     name: "",
//     campus: "",
//     curriculum: "",
//     class: "",
//     section: "",
//     intheSameSchool:""
//   };
const AddEmergencyContactModal = (props: IModalProps) => {
  const dispatch = useDispatch();
  const [sectionList, setSectionList] = useState([]);
  const initialValues = (editData?: any) => {

    return {
      emergencyContactId: editData?.id || "",
      emergencyContactPerson: editData?.emergencyContactPerson || "",
      emergencyContactNo: editData?.emergencyContactNo || "",
      emergencyRelationId: editData?.emergencyRelationId || "",
    }
  }
  const [initialData, setInitialData] =
    useState<AddEmergencyContactProps>(initialValues());

  const { updateStudentResp, affectedSection, brchCurriculumResp, branchClassResp, brchSectionsResp,relationTypeListResp,showApiLoader } = useAppSelector(
    ({ directoryStudent, globalData, branchAcademics,masterData }) => ({
      updateStudentResp: directoryStudent.updateStudentResp,
      affectedSection: directoryStudent.affectedSection,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      brchSectionsResp: branchAcademics.brchSectionsResp,
      relationTypeListResp: masterData.relationTypeListResp,
      showApiLoader:globalData.showApiLoader,

    }),
    shallowEqual
  );
  const EmergencyContactDetailsRef = useRef<IUpdateEmployeeRepRef>({
    prevUpdateEmployeeRep: updateStudentResp
  });
  useEffect(() => {
    const { prevUpdateEmployeeRep } =
      EmergencyContactDetailsRef.current;

    if (updateStudentResp &&
      prevUpdateEmployeeRep !== updateStudentResp) {
      if (affectedSection === "Emergency Contact") {
        toast.success(`Emergency Contact ${props.editData ? 'Edited' : 'Added'} successfully.`);
        props.toggle(true);
      }
    }
    EmergencyContactDetailsRef.current.prevUpdateEmployeeRep = updateStudentResp;
  }, [affectedSection, updateStudentResp]);

  const validationSchema = Yup.object().shape({
    emergencyContactPerson: Yup.string().required("Name is required."),
    emergencyContactNo: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Phone number with 10 digit is valid.').required("Phone number required.").nullable(),
    emergencyRelationId: Yup.string().required("Relation is required."),
  });
  
  const addEmergencyContactDetailsForm = useFormik({
    enableReinitialize: true,
    initialValues: initialData,
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      const data = details(props.data, values, "Emergency Contact",{branchId:props.branchId,instituteId:props.instituteId}, formSectionSaveKey.emergencyContactDetails);
      formData.append("employeeRequest", JSON.stringify(data));
      dispatch(updateStudentAct(generateActionPayload('add_employee', undefined, formData, {
        affectedSection: "Emergency Contact"
      })));
    },
  });
  function onChangePhoneInput(date: string, otherData: any, event: any) {
    const { target } = event, { name } = target || {},
        updateDate = date.substring(2);
        addEmergencyContactDetailsForm.setFieldValue(name, updateDate);
  }
  useEffect(() => {
    props.isOpen && setInitialData(initialValues(props.editData))
  }, [props.isOpen])

  useEffect(()=>{
    dispatch(getRelationTypeAct(generateActionPayload("get_global_records_by_search_string",undefined,{ categoryName: "RELATION", searchString: "",pageNo:0,pageSize:100,sortBy:"relationType",orderBy:"asc" })));
  },[])
  // useEffect(()=>{
  //   const payload = { branchId:20,curriculumId:props.editData&&props.editData.siblingCurriculumId, pageNo: 0, pageSize: 100 };
  //   props.editData&&dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class",undefined,payload))); 
  //   const payload1 = { branchId:20,curriculumId:props.editData&&props.editData.siblingCurriculumId,classId:props.editData&&props.editData.siblingClassId, pageNo: 0, pageSize: 100 };
  //   initialData&&dispatch(getBrchSectionsAct(generateActionPayload("get_brch_sections",undefined,payload1)));  
  // },[])
  // const CurriculumHandler=(e:any)=>{
  //   addEmergencyContactDetailsForm.handleChange(e);
  //   const payload = { branchId:20,curriculumId:initialData.siblingCurriculumId, pageNo: 0, pageSize: 100 };
  //   initialData&&dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class",undefined,payload))); 
  // }
  // const ClassHandler=(e:any)=>{
  //   addEmergencyContactDetailsForm.handleChange(e);
  //   const payload1 = { branchId:20,curriculumId:initialData.siblingCurriculumId,classId:initialData.siblingClassId, pageNo: 0, pageSize: 100 };
  //   initialData&&dispatch(getBrchSectionsAct(generateActionPayload("get_brch_sections",undefined,payload1)));


  //   SectionList&&setSectionList(SectionList.find((section:any)=>section.branchClassId===+addEmergencyContactDetailsForm.values.siblingClassId)?.sectionsResponse)
  // }

  // const {data:CurriculumList}=brchCurriculumResp||{};
  // const {data:SectionList}=brchSectionsResp||{};
  // const {content:ClassList}=branchClassResp||{};
  //   useEffect(()=>{

  //     SectionList&&setSectionList(SectionList.find((section:any)=>section.branchClassId===+addEmergencyContactDetailsForm.values.siblingClassId)?.sectionsResponse)
  // },[SectionList])

  const {data:RelationTypeList}=relationTypeListResp||{};
  return (

    <div className="tw-p-4">

      <div className="tw-flex tw-flex-wrap tw-my-1 tw--mx-2">

        <div className="tw-w-full md:tw-w-1/2 tw-px-2">
          <TextInput
            name='emergencyContactPerson'
            labelText='Name'
            value={addEmergencyContactDetailsForm.values.emergencyContactPerson}
            onChange={addEmergencyContactDetailsForm.handleChange}
            onBlur={addEmergencyContactDetailsForm.handleBlur}
            invalid={
              addEmergencyContactDetailsForm.touched.emergencyContactPerson &&
              addEmergencyContactDetailsForm.errors.emergencyContactPerson
                ? true
                : false
              }
              error={
              addEmergencyContactDetailsForm.touched.emergencyContactPerson &&
                addEmergencyContactDetailsForm.errors.emergencyContactPerson
                ? addEmergencyContactDetailsForm.errors.emergencyContactPerson
                : ""
            }
          />
          {/* <SelectInput
              name="name"
              labelText="ame"
              value={addEmergencyContactDetailsForm.values.name}
              onChange={addEmergencyContactDetailsForm.handleChange}
              menuItems={selectData3}
              valueKey="year"
              textKey="year"
              formgroupClassName="mb-0"
            /> */}
        </div>

        <div className="tw-w-full md:tw-w-1/2 tw-px-2">
          {/* <TextInput
                name='curriculum'
                labelText='Curriculum'
                value={addEmergencyContactDetailsForm.values.curriculum}
                onChange={addEmergencyContactDetailsForm.handleChange}
            /> */}
          <SelectInput
            name="emergencyRelationId"
            labelText="Relationship Type"
            value={addEmergencyContactDetailsForm.values.emergencyRelationId}
            onChange={addEmergencyContactDetailsForm.handleChange}
            onBlur={addEmergencyContactDetailsForm.handleBlur}
            menuItems={RelationTypeList||[]}
            valueKey="id"
            textKey="relationType"
            formgroupClassName="tw-mb-0"
            invalid={
              addEmergencyContactDetailsForm.touched.emergencyRelationId &&
              addEmergencyContactDetailsForm.errors.emergencyRelationId
                ? true
                : false
            }
            error={
              addEmergencyContactDetailsForm.touched.emergencyRelationId &&
              addEmergencyContactDetailsForm.errors.emergencyRelationId
                ? addEmergencyContactDetailsForm.errors.emergencyRelationId
                : ""
            }
          />
        </div>

        <div className="tw-w-full md:tw-w-1/2 tw-px-2">
          {/* <TextInput
            name='emergencyContactNo'
            labelText='Phone no.'
            value={addEmergencyContactDetailsForm.values.emergencyContactNo}
            onChange={addEmergencyContactDetailsForm.handleChange}
            onBlur={addEmergencyContactDetailsForm.handleBlur}
            invalid={
              addEmergencyContactDetailsForm.touched.emergencyContactNo &&
              addEmergencyContactDetailsForm.errors.emergencyContactNo
              ? true
              : false
            }
            error={
              addEmergencyContactDetailsForm.touched.emergencyContactNo &&
                addEmergencyContactDetailsForm.errors.emergencyContactNo
                ? addEmergencyContactDetailsForm.errors.emergencyContactNo
                : ""
            }
          /> */}
          <NewPhoneInput
            name="emergencyContactNo"
            labelText="Phone no."
            value={addEmergencyContactDetailsForm.values.emergencyContactNo}
            onChange={onChangePhoneInput}
            onBlur={addEmergencyContactDetailsForm.handleBlur}
            // isDisabled={!edit}
            // labelClass="text-muted fs-14 mb-0"
            // inputClassName={`${!edit ? 'border-0 border-bottom rounded-0 bg-transparent' : ""}`}
            invalid={(addEmergencyContactDetailsForm.touched.emergencyContactNo && addEmergencyContactDetailsForm.errors.emergencyContactNo) ? true : false}
            error={(addEmergencyContactDetailsForm.touched.emergencyContactNo && addEmergencyContactDetailsForm.errors.emergencyContactNo) ? addEmergencyContactDetailsForm.errors.emergencyContactNo : ""}
            />
          {/* <SelectInput
              name="name"
              labelText="ame"
              value={addEmergencyContactDetailsForm.values.name}
              onChange={addEmergencyContactDetailsForm.handleChange}
              menuItems={selectData3}
              valueKey="year"
              textKey="year"
              formgroupClassName="mb-0"
            /> */}
        </div>
      </div>
      <div className="tw-flex tw-gap-2 tw-justify-end tw-mt-4">

        <Button
          type="button"
          variant='secondary'
          onClick={props.toggle}
        >
          Cancel
        </Button>

        <Button
          type="button"
          variant='primary'
          onClick={(event: any) =>
            addEmergencyContactDetailsForm.handleSubmit(event)
          }
          disabled={showApiLoader}
        >
          {`${props.editData ? "Update" : "Submit"}`}
        </Button>

      </div>
    </div>
   
  )
}

export default AddEmergencyContactModal
