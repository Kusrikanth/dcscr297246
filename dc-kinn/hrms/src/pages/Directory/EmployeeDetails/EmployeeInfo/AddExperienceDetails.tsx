import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { Col } from 'reactstrap';
import { DateInput,  RadioInput, SelectInput, TextIconInput, TextInput } from '../../../../Components/Common'
import { useAppSelector } from '../../../../hooks/storehook';
import { getBranchClassAct, getBrchSectionsAct } from '../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { updateStudentAct } from '../../../../store/directory/studentmanagement/studentmanagementactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { CampusTypeOptions, details, formSectionSaveKey, IsEmployeeOptions } from './helper';
import { IModalProps, IUpdateEmployeeRepRef } from './EmployeeInfoTypes'
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Current_Date } from '../../../../utility/dateutility';
import Button from '../../../../Components/Common/Button';
interface AddExperienceDetailsProps {
    experienceId: number;
    organizationName: string;
    designationId: string;
    fromDate: string;
    toDate: string;
    experience: string;
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
const AddExperienceDetailsModal = (props: IModalProps) => {
    const dispatch = useDispatch();
    const [sectionList, setSectionList] = useState([]);
    const initialValues = (editData?: any) => {

        return {
            experienceId: editData?.id || "",
            organizationName: editData?.organizationName || "",
            designationId: editData?.designationId || "",
            fromDate: editData?.fromDate || "",
            toDate: editData?.toDate || "",
            experience: editData?.experience || "",
        }
    }
    const [initialData, setInitialData] =
        useState<AddExperienceDetailsProps>(initialValues());

    const { updateStudentResp, affectedSection, brchCurriculumResp, branchClassResp, showApiLoader, designationListResp } = useAppSelector(
        ({ directoryStudent, instituteInfo, branchAcademics, masterData,globalData }) => ({
            updateStudentResp: directoryStudent.updateStudentResp,
            affectedSection: directoryStudent.affectedSection,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            brchSectionsResp: branchAcademics.brchSectionsResp,
            designationListResp: masterData.designationListResp,
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
            if (affectedSection === "Experience Details") {
                toast.success(`Experience Details ${props.editData ? 'Edited' : 'Added'} successfully.`);
                props.toggle(true);
            }
        }
        EmergencyContactDetailsRef.current.prevUpdateEmployeeRep = updateStudentResp;
    }, [affectedSection, updateStudentResp]);


    const validationSchema = Yup.object().shape({
        organizationName: Yup.string().required("Organisation Name is required."),
        designationId: Yup.string().required("Designation Id is required."),
        fromDate: Yup.date().max(Current_Date, "Invalid Date").required("From Date is required."),
        toDate: Yup.date().max(Current_Date, "Invalid Date").required("To Date is required."),
        experience: Yup.number().typeError("Enter valid number.").required("Experience is required."),
    });

    const addExperienceDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues: initialData,
        validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            const data = details(props.data, values, "Experience Details", { branchId: props.branchId, instituteId: props.instituteId }, formSectionSaveKey.previousExperienceDetails);
            formData.append("employeeRequest", JSON.stringify(data));
            dispatch(updateStudentAct(generateActionPayload('add_employee', undefined, formData, {
                affectedSection: "Experience Details"
            })));
        },
    });
    useEffect(() => {
        if(props.isOpen){
            setInitialData(initialValues(props.editData))
        }
        else{
            addExperienceDetailsForm.resetForm();
        }
    }, [props.isOpen])
    // useEffect(()=>{
    //   const payload = { branchId:20,curriculumId:props.editData&&props.editData.siblingCurriculumId, pageNo: 0, pageSize: 100 };
    //   props.editData&&dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class",undefined,payload))); 
    //   const payload1 = { branchId:20,curriculumId:props.editData&&props.editData.siblingCurriculumId,classId:props.editData&&props.editData.siblingClassId, pageNo: 0, pageSize: 100 };
    //   initialData&&dispatch(getBrchSectionsAct(generateActionPayload("get_brch_sections",undefined,payload1)));  
    // },[])
    // const CurriculumHandler=(e:any)=>{
    //   addExperienceDetailsForm.handleChange(e);
    //   const payload = { branchId:20,curriculumId:initialData.siblingCurriculumId, pageNo: 0, pageSize: 100 };
    //   initialData&&dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class",undefined,payload))); 
    // }
    // const ClassHandler=(e:any)=>{
    //   addExperienceDetailsForm.handleChange(e);
    //   const payload1 = { branchId:20,curriculumId:initialData.siblingCurriculumId,classId:initialData.siblingClassId, pageNo: 0, pageSize: 100 };
    //   initialData&&dispatch(getBrchSectionsAct(generateActionPayload("get_brch_sections",undefined,payload1)));


    //   SectionList&&setSectionList(SectionList.find((section:any)=>section.branchClassId===+addExperienceDetailsForm.values.siblingClassId)?.sectionsResponse)
    // }

    // const {data:CurriculumList}=brchCurriculumResp||{};
    // const {data:SectionList}=brchSectionsResp||{};
    // const {content:ClassList}=branchClassResp||{};
    //   useEffect(()=>{

    //     SectionList&&setSectionList(SectionList.find((section:any)=>section.branchClassId===+addExperienceDetailsForm.values.siblingClassId)?.sectionsResponse)
    // },[SectionList])

    const { data: DesignationData } = designationListResp || {};
    return (

            <div className="tw-flex tw-flex-wrap tw-my-1 tw-p-4 tw--mx-2">
                <div className="tw-w-full md:tw-w-1/2 tw-px-2">
                    <TextInput
                        name="organizationName"
                        labelText="Organisation Name"
                        value={addExperienceDetailsForm.values.organizationName}
                        onChange={addExperienceDetailsForm.handleChange}
                        onBlur={addExperienceDetailsForm.handleBlur}
                        invalid={
                            addExperienceDetailsForm.touched.organizationName &&
                                addExperienceDetailsForm.errors.organizationName
                                ? true
                                : false
                        }
                        error={
                            addExperienceDetailsForm.touched.organizationName &&
                                addExperienceDetailsForm.errors.organizationName
                                ? addExperienceDetailsForm.errors.organizationName
                                : ""
                        }
                    />
                    {/* <SelectInput
              name="name"
              labelText="ame"
              value={addExperienceDetailsForm.values.name}
              onChange={addExperienceDetailsForm.handleChange}
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
                value={addExperienceDetailsForm.values.curriculum}
                onChange={addExperienceDetailsForm.handleChange}
            /> */}
                    <SelectInput
                        name="designationId"
                        labelText="Designation"
                        value={addExperienceDetailsForm.values.designationId}
                        onChange={addExperienceDetailsForm.handleChange}
                        onBlur={addExperienceDetailsForm.handleBlur}
                        menuItems={DesignationData || []}
                        valueKey="id"
                        textKey="designationName"
                        invalid={
                            addExperienceDetailsForm.touched.designationId &&
                                addExperienceDetailsForm.errors.designationId
                                ? true
                                : false
                        }
                        error={
                            addExperienceDetailsForm.touched.designationId &&
                                addExperienceDetailsForm.errors.designationId
                                ? addExperienceDetailsForm.errors.designationId
                                : ""
                        }
                    />
                </div>

                <div className="tw-w-full md:tw-w-1/2 tw-px-2">
                    <DateInput
                        name="fromDate"
                        value={addExperienceDetailsForm.values.fromDate}
                        onChange={addExperienceDetailsForm.handleChange}
                        onBlur={addExperienceDetailsForm.handleBlur}
                        inputClassName="tw-bg-transparent"
                        labelText="From Date"
                        labelClass="tw-text-gray-500"
                        maxDate={Current_Date}
                        invalid={
                            addExperienceDetailsForm.touched.fromDate &&
                                addExperienceDetailsForm.errors.fromDate
                                ? true
                                : false
                        }
                        error={
                            addExperienceDetailsForm.touched.fromDate &&
                                addExperienceDetailsForm.errors.fromDate
                                ? addExperienceDetailsForm.errors.fromDate
                                : ""
                        }
                    />
                </div>

                <div className="tw-w-full md:tw-w-1/2 tw-px-2">
                    <DateInput
                        name="toDate"
                        value={addExperienceDetailsForm.values.toDate}
                        onChange={addExperienceDetailsForm.handleChange}
                        onBlur={addExperienceDetailsForm.handleBlur}
                        inputClassName="tw-bg-transparent"
                        labelText="To Date"
                        labelClass="tw-text-gray-500"
                        maxDate={Current_Date}
                        invalid={
                            addExperienceDetailsForm.touched.toDate &&
                                addExperienceDetailsForm.errors.toDate
                                ? true
                                : false
                        }
                        error={
                            addExperienceDetailsForm.touched.toDate &&
                                addExperienceDetailsForm.errors.toDate
                                ? addExperienceDetailsForm.errors.toDate
                                : ""
                        }
                    />
                </div>

                <div className="tw-w-full md:tw-w-1/2 tw-px-2">
                    <TextInput
                        name='experience'
                        labelText='Experience (Yrs)'
                        value={addExperienceDetailsForm.values.experience}
                        onChange={addExperienceDetailsForm.handleChange}
                        onBlur={addExperienceDetailsForm.handleBlur}
                        maxLength={2}
                        invalid={
                            addExperienceDetailsForm.touched.experience &&
                                addExperienceDetailsForm.errors.experience
                                ? true
                                : false
                        }
                        error={
                            addExperienceDetailsForm.touched.experience &&
                                addExperienceDetailsForm.errors.experience
                                ? addExperienceDetailsForm.errors.experience
                                : ""
                        }
                    />
                    {/* <SelectInput
              name="name"
              labelText="ame"
              value={addExperienceDetailsForm.values.name}
              onChange={addExperienceDetailsForm.handleChange}
              menuItems={selectData3}
              valueKey="year"
              textKey="year"
              formgroupClassName="mb-0"
            /> */}
            </div>

            <div className="tw-w-full tw-flex tw-justify-end tw-gap-2 tw-mt-4 tw-px-2">
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
                        addExperienceDetailsForm.handleSubmit(event)
                    }
                    disabled={showApiLoader}
                >
                    {`${props.editData ? "Update" : "Submit"}`}
                </Button>
            </div>
        </div>
    )
}

export default AddExperienceDetailsModal
