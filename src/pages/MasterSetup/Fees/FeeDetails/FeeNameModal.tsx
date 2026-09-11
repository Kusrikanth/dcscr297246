import React, { useEffect, useState, useRef } from "react";
import { shallowEqual } from "react-redux";
import {
  ModalContainer, SelectInput, TextInput, RadioInputContainer,
  InputCheckbox
} from "../../../../Components/Common";
import { useFormik } from "formik";
import { allowConcessionOptions, selectData4 } from "./helper";
import { toast } from "react-toastify";
// Formik validation
import * as Yup from "yup";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import { addInstFeeNameAct, updateInstFeeNameAct } from "../../../../store/mastersettings/feesettings/feesettingsactions";
import { getMasterFeeTypesAct } from "../../../../store/masterdata/masterdataactions";


const initialValues: any = {
  feeName: "",
  instituteDepartmentId: "",
  instituteCurriculumId: "",
  feeTypeId: "",
  applicableToEmployee: "",
  includeInChallan: "",
  isAllowRefund: "",
  employeeConcession: "",
  studentConcession: "",
  uniformSlab: ""
}

interface IUserDetails {
  employeeConcession: string,
  feeName: string,
  feeTypeId: string,
  includeChallan: string,
  instituteCurriculumId: string,
  instituteDepartmentId: string,
  isAllowRefund: string,
  studentConcession: string,
  uniformSlab: string
}

function getAddEditFeeName(editData?: any): any {
  return {
    employeeConcession: editData?.employeeConcession || false,
    feeName: editData?.feeName || "",
    feeTypeId: editData?.feeTypeId || "",
    includeChallan: editData?.includeChallan.toString() || "true",
    instituteCurriculumId: editData?.instituteCurriculumId || "",
    instituteDepartmentId: editData?.instituteDepartmentId || "",
    instituteFeeNameId: editData?.instituteFeeNameId || undefined,
    isAllowRefund: editData?.isAllowRefund.toString() || "",
    studentConcession: editData?.studentConcession || false,
    uniformSlab: editData?.uniformSlab.toString() || "true"
  }
}

const validationSchema = Yup.object().shape({
  instituteCurriculumId: Yup.string().required("Curriculum required."),
  feeName: Yup.string().required("Fee name required."),
  feeTypeId: Yup.string().required("Fee type required."),
  instituteDepartmentId: Yup.string().required("Department required."),
  isAllowRefund: Yup.string().required("Allow refund required."),
});


const FeeNameModal: React.FC<any> = (props) => {
  const [allConcessionState, setAllConcessionState] = useState(false);
  const [feeNameState, setFeeNameState] = useState<any>(getAddEditFeeName(null));

  const dispatch = useAppDispatch();
  const { addInstFeeNameResp, updateInstFeeNameResp, instFeeDepartmentsResp, masterFeeTypesResp,
    instCurriculumResp } = useAppSelector(({ instAcademics, instFeeSettings, masterData }) => ({
      addInstFeeNameResp: instFeeSettings.addInstFeeNameResp,
      updateInstFeeNameResp: instFeeSettings.updateInstFeeNameResp,
      instFeeDepartmentsResp: instFeeSettings.instFeeDepartmentsResp,
      masterFeeTypesResp: masterData.masterFeeTypesResp,
      instCurriculumResp: instAcademics.instCurriculumResp,
    }), shallowEqual);

  const feeNameRespRef = useRef<any>({
    prevAddInstFeeNameResp: addInstFeeNameResp,
    prevUpdateInstFeeNameResp: updateInstFeeNameResp
  });

  useEffect(() => {
    const { prevAddInstFeeNameResp, prevUpdateInstFeeNameResp } = feeNameRespRef.current;
    if (addInstFeeNameResp && prevAddInstFeeNameResp !== addInstFeeNameResp) {
      props.toggle(true);
      toast.success("Fee name added successfully.");
    } else if (updateInstFeeNameResp && prevUpdateInstFeeNameResp !== updateInstFeeNameResp) {
      props.toggle(true);
      toast.success("Fee name updated successfully.");
    }
    feeNameRespRef.current.prevAddInstFeeNameResp = addInstFeeNameResp;
    feeNameRespRef.current.prevUpdateInstFeeNameResp = updateInstFeeNameResp;
  }, [addInstFeeNameResp, updateInstFeeNameResp]);


  useEffect(() => {
    if (!masterFeeTypesResp) {
      const payload = { pageNo: 0, pageSize: 100 };
      dispatch(getMasterFeeTypesAct(generateActionPayload("get_master_feetypes", undefined, payload)))
    }
  }, [masterFeeTypesResp]);

  useEffect(() => {
    if (!props.isOpen) {
      feeNameModalForm.resetForm();
    }
  }, [props.isOpen]);

  useEffect(() => {
    if (props.editFeeDetails) {
      const { employeeConcession, studentConcession } = props.editFeeDetails;
      setAllConcessionState(employeeConcession && studentConcession);
      setFeeNameState(getAddEditFeeName(props.editFeeDetails));
    } else {
      setAllConcessionState(false);
      setFeeNameState(getAddEditFeeName());
    }
  }, [props.editFeeDetails]);


  const feeNameModalForm = useFormik({
    enableReinitialize: true,
    initialValues: feeNameState,
    validationSchema,
    onSubmit: (values) => {
      const updatePayload = values;
      const params = { instituteId: props.instituteId, instituteAcademicYearId: props.instituteAcademicYearId };
      if (props.feeNameId) {
        dispatch(updateInstFeeNameAct(generateActionPayload("update_inst_fee_name", params, values)));
      } else {
        let payload = { ...values },
          params = { instituteId: props.instituteId };
        dispatch(addInstFeeNameAct(generateActionPayload("add_inst_fee_names", params, payload)));
      }
    },
  });

  function onChangeConcessionHndlr(event: any) {
    const { name, checked } = event.target;
    if (name === "all") {
      feeNameModalForm.setValues((prevState: any) => ({
        ...prevState, studentConcession: checked,
        employeeConcession: checked
      }))
      setAllConcessionState(checked);
    }
    else if (name === "studentConcession") {
      feeNameModalForm.setValues((prevState: any) => ({
        ...prevState, [name]: checked
      }))
      setAllConcessionState(checked && feeNameModalForm.values.employeeConcession || false);
    } else {
      feeNameModalForm.setValues((prevState: any) => ({
        ...prevState, [name]: checked
      }))
      setAllConcessionState(checked && feeNameModalForm.values.studentConcession || false);
    }
  }


  const { data: feeDepartments } = instFeeDepartmentsResp || {},
    { data: instCurriculumList } = instCurriculumResp || {};
  return (
    <>
      <ModalContainer
        id="class-subject-modal"
        modalTitle={props.modalTitle}
        isOpen={props.isOpen}
        toggle={props.toggle}
        submitHndlr={feeNameModalForm.handleSubmit}
        cancelHndlr={props.toggle}
        cancelTitle={"Cancel"}
        submitTitle={props.feeNameId ? "Update" : "Submit"}
        modalSize={"md"}
        modalBodyClass="p-0"
      >
        <div className="tw-flex tw-flex-column tw-border-b tw-mb-3">
          <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-my-1 tw-px-4 tw-mb-4">
            <div className="tw-col-span-12">
              <SelectInput
                name="instituteCurriculumId"
                labelText="Curriculum"
                value={feeNameModalForm.values.instituteCurriculumId}
                onChange={feeNameModalForm.handleChange}
                formgroupClassName="tw-mb-0"
                menuItems={instCurriculumList}
                valueKey="instituteCurriculumId"
                textKey="curriculumName"
                invalid={(feeNameModalForm.touched.instituteCurriculumId && feeNameModalForm.errors.instituteCurriculumId) ? true : false}
                error={(feeNameModalForm.touched.instituteCurriculumId && feeNameModalForm.errors.instituteCurriculumId) ? feeNameModalForm.errors.instituteCurriculumId : ""}
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <TextInput
                name="feeName"
                labelText="Fee Name"
                value={feeNameModalForm.values.feeName}
                onChange={feeNameModalForm.handleChange}
                formgroupClassName="tw-mb-0"
                invalid={(feeNameModalForm.touched.feeName && feeNameModalForm.errors.feeName) ? true : false}
                error={(feeNameModalForm.touched.feeName && feeNameModalForm.errors.feeName) ? feeNameModalForm.errors.feeName : ""}

              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <SelectInput
                name="feeTypeId"
                labelText="Fee Type"
                value={feeNameModalForm.values.feeTypeId}
                onChange={feeNameModalForm.handleChange}
                formgroupClassName="tw-mb-0"
                menuItems={masterFeeTypesResp?.data}
                valueKey="masterFeeTypeId"
                textKey="masterFeeTypeName"
                invalid={(feeNameModalForm.touched.feeTypeId && feeNameModalForm.errors.feeTypeId) ? true : false}
                error={(feeNameModalForm.touched.feeTypeId && feeNameModalForm.errors.feeTypeId) ? feeNameModalForm.errors.feeTypeId : ""}

              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <SelectInput
                name="instituteDepartmentId"
                labelText="Department"
                menuItems={Array.isArray(feeDepartments) ? feeDepartments : []}
                value={feeNameModalForm.values.instituteDepartmentId?.toString()}
                // onChange={changeHndlr}
                onChange={feeNameModalForm.handleChange}
                formgroupClassName="tw-mb-0"
                valueKey="departmentId"
                textKey="departmentName"
                invalid={(feeNameModalForm.touched.instituteDepartmentId && feeNameModalForm.errors.instituteDepartmentId) ? true : false}
                error={(feeNameModalForm.touched.instituteDepartmentId && feeNameModalForm.errors.instituteDepartmentId) ? feeNameModalForm.errors.instituteDepartmentId : ""}

              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <SelectInput
                name="isAllowRefund"
                labelText="Allow Refund"
                value={feeNameModalForm.values.isAllowRefund}
                onChange={feeNameModalForm.handleChange}
                formgroupClassName="tw-mb-0"
                menuItems={selectData4}
                valueKey="id"
                textKey="allowRefundType"
                invalid={(feeNameModalForm.touched.isAllowRefund && feeNameModalForm.errors.isAllowRefund) ? true : false}
                error={(feeNameModalForm.touched.isAllowRefund && feeNameModalForm.errors.isAllowRefund) ? feeNameModalForm.errors.isAllowRefund : ""}

              />
            </div>

            <div className="tw-col-span-12 md:tw-col-span-4">
              <RadioInputContainer
                name="uniformSlab"
                labelText="Uniform Slab"
                radioOptions={[{ id: "true", name: "Yes" }, { id: "false", name: "No" }]}
                value={feeNameModalForm.values.uniformSlab}
                onChange={feeNameModalForm.handleChange}
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-4">
              <RadioInputContainer
                name="includeChallan"
                labelText="Include in Challan"
                radioOptions={[{ id: "true", name: "Yes" }, { id: "false", name: "No" }]}
                value={feeNameModalForm.values.includeChallan}
                onChange={feeNameModalForm.handleChange}
              />
            </div>

          </div>

          <div className="tw-flex tw-items-center tw-mb-2 tw-px-4">
            <h6 className="tw-text-base tw-font-semibold tw-mb-0">Allow Conncession</h6>
          </div>
        </div>

        <div className="tw-grid tw-grid-cols-12 tw-px-4 tw-mb-4">
          <div className="tw-col-span-12">
            <InputCheckbox
              name={"all"}
              labelName={"All"}
              value={allConcessionState}
              onChange={onChangeConcessionHndlr}
            />
          </div>
          {allowConcessionOptions &&
            allowConcessionOptions.map((item, index: number) => (
              <div key={index} className="tw-col-span-12 tw-mb-1">
                <InputCheckbox
                  name={item.name}
                  labelName={item.label}
                  value={feeNameModalForm.values[item.name]}
                  onChange={onChangeConcessionHndlr}
                />
              </div>
            ))}
        </div>
      </ModalContainer>
    </>
  );
};

export default FeeNameModal;
