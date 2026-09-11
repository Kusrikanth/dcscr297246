import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { Col } from 'reactstrap';
import {  NewPhoneInput, RadioInput, SelectInput, TextIconInput, TextInput } from '../../../../Components/Common'
import { updateStudentAct } from '../../../../store/directory/studentmanagement/studentmanagementactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { details, IsEmployeeOptions } from './helper';
import { IModalProps, IUpdateEmployeeRepRef } from './EmployeeInfoTypes'
import { useAppSelector } from '../../../../hooks/storehook';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { getRelationTypeAct } from '../../../../store/masterdata/masterdataactions';
import Button from '../../../../Components/Common/Button';
interface AddDependencyDetailsProps {
  depedenctId: number;
  dependentName: string;
  relationTypeId: string;
  dependentContactNo: string;
}
// const initialValues:AddParentDetailsProps = {

//     name: "",
//     documentNumber: "",
//     relationType: "",
//     email: "",
//     contactNo: "",
//     isEmployee:""
//   };
const AddDependencyModal = (props: IModalProps) => {
  const dispatch = useDispatch()
  const initialValues = (editData?: any) => {
    return {
      depedenctId: editData?.id || undefined,
      dependentName: editData?.dependentName || "",
      relationTypeId: editData?.relationTypeId || "",
      dependentContactNo: editData?.dependentContactNo || "",
    }
  }
  const [initialData, setInitialData] =
    useState<AddDependencyDetailsProps>(initialValues());
  const [realationType, setRelationType] = useState();
  useEffect(() => {
    if (props.isOpen) {
      setInitialData(initialValues(props.editData))
    }
    else {
      addDepedencyDetailsForm.resetForm()
    }
  }, [props.isOpen])
  //   const [initialValues, setSearchState] =
  // useState<AddParentDetailsProps>(initialValues);

  const validationSchema = Yup.object().shape({
    dependentName: Yup.string().required("Name is required."),
    relationTypeId: Yup.string().required("Relation Type is required."),
    dependentContactNo: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Phone number with 10 digit is valid.').required("Phone number required.").nullable(),
  });

  const addDepedencyDetailsForm = useFormik({
    enableReinitialize: true,
    initialValues: initialData,
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      const val = details(props.data, values, "Dependency Details", { branchId: props.branchId, instituteId: props.instituteId })

      formData.append("employeeRequest", JSON.stringify(val));
      dispatch(updateStudentAct(generateActionPayload('add_employee', undefined, formData, {
        affectedSection: "Dependency Details"
      })));

    },
  });
  const { updateStudentResp, affectedSection, relationTypeListResp,showApiLoader } = useAppSelector(
    ({ directoryStudent, masterData,globalData }) => ({
      updateStudentResp: directoryStudent.updateStudentResp,
      affectedSection: directoryStudent.affectedSection,
      relationTypeListResp: masterData.relationTypeListResp,
      showApiLoader:globalData.showApiLoader,
    }),
    shallowEqual
  );
  const ParentDetailsRef = useRef<IUpdateEmployeeRepRef>({
    prevUpdateEmployeeRep: updateStudentResp
  });
  useEffect(() => {
    const { prevUpdateEmployeeRep } =
      ParentDetailsRef.current;

    if (updateStudentResp &&
      prevUpdateEmployeeRep !== updateStudentResp) {
      affectedSection === "Dependency Details" && toast.success(`Depedent ${props.editData ? 'Edited' : 'Added'} successfully.`);
      affectedSection === "Dependency Details" && props.toggle(true);
    }
    ParentDetailsRef.current.prevUpdateEmployeeRep = updateStudentResp;
  }, [affectedSection, updateStudentResp]);

  useEffect(() => {
    dispatch(getRelationTypeAct(generateActionPayload("get_global_records_by_search_string", undefined, { categoryName: "RELATION", searchString: "", pageNo: 0, pageSize: 100, sortBy: "relationType", orderBy: "asc" })));
  }, [])

  function onChangePhoneInput(date: string, otherData: any, event: any) {
    const { target } = event, { name } = target || {},
        updateDate = date.substring(2);
        addDepedencyDetailsForm.setFieldValue(name, updateDate);
}

  const { data: RelationTypeList } = relationTypeListResp || {};

  return (
 
    <div className="tw-p-4">

      <div className="tw-flex tw-flex-wrap tw-my-1 tw--mx-2">
        <div className="tw-w-full md:tw-w-1/2 tw-px-2">
          <TextInput
            name='dependentName'
            labelText='Name'
            value={addDepedencyDetailsForm.values.dependentName}
            invalid={
              addDepedencyDetailsForm.touched.dependentName &&
                addDepedencyDetailsForm.errors.dependentName
                ? true
                : false
            }
            error={
              addDepedencyDetailsForm.touched.dependentName &&
                addDepedencyDetailsForm.errors.dependentName
                ? addDepedencyDetailsForm.errors.dependentName
                : ""
            }
            onBlur={addDepedencyDetailsForm.handleBlur}
            onChange={addDepedencyDetailsForm.handleChange}
          />
          {/* <SelectInput
              name="name"
              labelText="ame"
              value={addDepedencyDetailsForm.values.name}
              onChange={addDepedencyDetailsForm.handleChange}
              menuItems={selectData3}
              valueKey="year"
              textKey="year"
              formgroupClassName="mb-0"
            /> */}
        </div>

        <div className="tw-w-full md:tw-w-1/2 tw-px-2">
          {/* <TextInput
                name='relationType'
                labelText='Relation Type'
                value={addDepedencyDetailsForm.values.relationType}
                onChange={addDepedencyDetailsForm.handleChange}
                isDisabled={!!props.editData}
            /> */}
          <SelectInput
            name="relationTypeId"
            labelText="Relation Type"
            value={addDepedencyDetailsForm.values.relationTypeId}
            onBlur={addDepedencyDetailsForm.handleBlur}
            onChange={addDepedencyDetailsForm.handleChange}
            valueKey="id"
            textKey="relationType"
            menuItems={RelationTypeList || []}
            invalid={
              addDepedencyDetailsForm.touched.relationTypeId &&
                addDepedencyDetailsForm.errors.relationTypeId
                ? true
                : false
            }
            error={
              addDepedencyDetailsForm.touched.relationTypeId &&
                addDepedencyDetailsForm.errors.relationTypeId
                ? addDepedencyDetailsForm.errors.relationTypeId
                : ""
            }
            formgroupClassName="tw-mb-0"
          />
        </div>

        <div className="tw-w-full md:tw-w-1/2 tw-px-2">
          {/* <TextInput
            name='dependentContactNo'
            labelText='Phone no.'
            value={addDepedencyDetailsForm.values.dependentContactNo}
            onBlur={addDepedencyDetailsForm.handleBlur}
            onChange={addDepedencyDetailsForm.handleChange}
            invalid={
              addDepedencyDetailsForm.touched.dependentContactNo &&
              addDepedencyDetailsForm.errors.dependentContactNo
                  ? true
                  : false
          }
          error={
            addDepedencyDetailsForm.touched.dependentContactNo &&
            addDepedencyDetailsForm.errors.dependentContactNo
                  ? addDepedencyDetailsForm.errors.dependentContactNo
                  : ""
          }
          /> */}
          <NewPhoneInput
            name="dependentContactNo"
            labelText="Phone no."
            value={addDepedencyDetailsForm.values.dependentContactNo}
            onChange={onChangePhoneInput}
            onBlur={addDepedencyDetailsForm.handleBlur}
            // isDisabled={!edit}
            // labelClass="text-muted fs-14 mb-0"
            // inputClassName={`${!edit ? 'border-0 border-bottom rounded-0 bg-transparent' : ""}`}
            invalid={(addDepedencyDetailsForm.touched.dependentContactNo && addDepedencyDetailsForm.errors.dependentContactNo) ? true : false}
            error={(addDepedencyDetailsForm.touched.dependentContactNo && addDepedencyDetailsForm.errors.dependentContactNo) ? addDepedencyDetailsForm.errors.dependentContactNo : ""}
          />
          {/* <SelectInput
              name="section"
              labelText="Section"
              value={generateRollNumForm.values.section}
              onChange={generateRollNumForm.handleChange}
              menuItems={selectData4}
              valueKey="section"
              textKey="section"
              formgroupClassName="mb-0"
            /> */}
        </div>

      </div>
      <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-4">
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
          onClick={(event: any) =>
            addDepedencyDetailsForm.handleSubmit(event)
          }
          disabled={showApiLoader}
        >
          {`${props.editData ? "Update" : "Submit"}`}
        </Button>
      </div>
    </div>
 
  )
}

export default AddDependencyModal
