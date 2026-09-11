import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ModalContainer,
  SelectInput,
} from "../../../../Components/Common";
// import { Col, Row } from "reactstrap";
import { useFormik } from "formik";
import {
  generateModalColumns,
  selectData2,
} from "./helper";
import {
  addNewEmployeeConcessionModalProps,
} from "./EmployeeConcessionTypes";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { addInstEmployeeConcessionAct, getInstFeeNameByDeptAct, updateInstEmployeeConcessionAct } from "../../../../store/mastersettings/feesettings/feesettingsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";

// interface IUserDetails {
//   concession: number|string,
//   experience: number,
//   feeEmployeeConcessionId: number,
//   instituteDepartmentId: number,
//   instituteDepartmentName: string,
//   instituteFeeName: string,
//   instituteFeeNameId: number,
//   instituteId: number,
//   instituteName: boolean
// }
const validationSchema = Yup.object().shape({
  experience: Yup.string().required("Experience required."),
})
const EmployeeConcessionModal = (props: addNewEmployeeConcessionModalProps) => {
  const [error, setError] = useState(false);
  const intialValues = (modalData?: any) => {
    return {
      experience: modalData ? modalData.experience : ""
    }
  }

  const { updateInstEmployeeConcession, addInstEmployeeConcession, instFeeSettingError } = useAppSelector(({ instAcademics, instFeeSettings }) => ({
    addInstEmployeeConcession: instFeeSettings.addInstEmployeeConcession,
    updateInstEmployeeConcession: instFeeSettings.updateInstEmployeeConcession,
    instFeeSettingError: instFeeSettings.instFeeSettingError
  }), shallowEqual);
  const employeeConcessionRespRef = useRef<any>({
    prevAddInstEmployeeConcession: addInstEmployeeConcession,
    prevUpdateInstEmployeeConcession: updateInstEmployeeConcession,
    prevInstFeeSettingError: instFeeSettingError
  });
  useEffect(() => {
    const { prevInstFeeSettingError, prevAddInstEmployeeConcession, prevUpdateInstEmployeeConcession } = employeeConcessionRespRef.current;
    if (addInstEmployeeConcession && prevAddInstEmployeeConcession !== addInstEmployeeConcession) {
      props.toggle(true);
      toast.success("Employee Concession Added successfully.");
    }
    else if (updateInstEmployeeConcession && prevUpdateInstEmployeeConcession !== updateInstEmployeeConcession) {
      props.toggle(true);
      toast.success("Employee Concession Updated successfully.");
    }
    else if (instFeeSettingError && instFeeSettingError !== prevInstFeeSettingError) {
      const { details }: any = instFeeSettingError;
      toast.error(details);
    }
    employeeConcessionRespRef.current.prevAddInstEmployeeConcession = addInstEmployeeConcession;
    employeeConcessionRespRef.current.prevUpdateInstEmployeeConcession = updateInstEmployeeConcession;
    employeeConcessionRespRef.current.prevInstFeeSettingError = instFeeSettingError;
  }, [addInstEmployeeConcession, updateInstEmployeeConcession, instFeeSettingError]);
  // function getAddEditFeeName(editData?: any): IUserDetails {
  //   return {
  //     concession: editData?.concession || true,
  //     feeName: editData?.feeName || "",
  //     feeTypeId: editData?.feeTypeId || "1",
  //     includeChallan: editData?.includeChallan || true,
  //     instituteCurriculumId: editData?.instituteCurriculumId || "",
  //     instituteDepartmentId: editData?.instituteDepartmentId || 37,
  //     isAllowRefund: editData?.isAllowRefund || true,
  //     studentConcession: editData?.studentConcession || true,
  //     uniformSlab: editData?.uniformSlab || true
  //   }
  // }
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState<Array<number>>([]);
  const [editData, setEditData] = useState<any>([]);

  const [departments, setDepartments] = useState<any>([])
  const handleSelectAll = (e: any) => {
    let dpt = departments.map((li: any) => +li.departmentId);
    setIsCheckAll(pre => !pre);
    setIsCheck(dpt);

    if (isCheckAll) {
      setIsCheck([]);
      getFeeNamesByDeptApiCall([]);
    } else {
      getFeeNamesByDeptApiCall(dpt);
    }

  };

  const handleClick = (e: any) => {
    const { id, checked } = e.target;
    if (!checked) {
      let dpt = isCheck.filter(item => item !== +id)
      setIsCheck(dpt);
      getFeeNamesByDeptApiCall(dpt);
      isCheckAll && setIsCheckAll(false);
    }
    else {
      let dpt = [...isCheck, +id];
      setIsCheck(dpt);
      getFeeNamesByDeptApiCall(dpt);
      dpt.length === departments.length && setIsCheckAll(true)
    }
  };
  const dispatch = useAppDispatch();
  function getFeeNamesByDeptApiCall(departments?: any) {
    // const payload = { ...otherProps };
    dispatch(getInstFeeNameByDeptAct(generateActionPayload("get_inst_fee_name_by_dept", {
      departments: departments
    })));

  }
  const { instFeeNameByDeptResp, } = useAppSelector(({ instAcademics, instFeeSettings }) => ({
    instFeeNameByDeptResp: instFeeSettings.instFeeNameByDeptResp,

  }), shallowEqual);

  // let abc:any={};
  const [dept, setDept] = useState<any>({})
  const inputChangeHandler = (event: any) => {
    const { name, value } = event.target;

    setDept((pre: any) => ({ ...pre, [name]: value }))

  }
  const submitHandler = () => {
    let DeptFeesData: Array<{ instituteFeeNameId: number, concession: number }> = [];
    let id = Object.keys(dept);
    let values: Array<string> = Object.values(dept);

    id.map((i, index) => {
      +values[index] > 0 && DeptFeesData.push({
        instituteFeeNameId: +i,
        concession: +values[index]
      })
    })
    DeptFeesData.length === 0 && setError(true);
    if (!props.modalData && DeptFeesData.length > 0) {

      let submitData = {
        experience: +EmployeeConcessionModalFilterForm.values.experience,
        feeNameRequest: DeptFeesData
      }
      const params = { instituteId: props.instituteId };
      dispatch(addInstEmployeeConcessionAct(generateActionPayload("add_inst_employee_concession_dept", params, submitData)));
      getFeeNamesByDeptApiCall([]);
    }
    else {
      let submitData = {
        experience: +EmployeeConcessionModalFilterForm.values.experience,
        concession: DeptFeesData[0].concession,
        employeeConcessionId: props.modalData.feeEmployeeConcessionId
      }
      dispatch(updateInstEmployeeConcessionAct(generateActionPayload("update_inst_employee_concession_dept", undefined, submitData)));
      getFeeNamesByDeptApiCall([]);
    }
  }
  const EmployeeConcessionModalFilterForm = useFormik({
    enableReinitialize: true,
    validationSchema: validationSchema,
    initialValues: intialValues(props.modalData),
    onSubmit: (value, { resetForm }) => {
      submitHandler();
      setIsCheckAll(false);
      setIsCheck([]);
      resetForm();
    },
  });
  const roleColumns = useMemo(() => generateModalColumns(inputChangeHandler), []);
  useEffect(() => {
    setDepartments(props.departments)
  }, [props.departments])
  useEffect(() => {

    props.modalData && setEditData([{
      instituteDepartmentName: props.modalData.instituteDepartmentName,
      feeName: props.modalData.instituteFeeName,
      percentage: props.modalData.concession,
      instituteFeeNameId: props.modalData.instituteDepartmentId
    }])
  }, [props.modalData])


  const togglerHandler = () => {
    props.toggle();
    EmployeeConcessionModalFilterForm.resetForm();
    setIsCheck([]);
    setIsCheckAll(false);
    getFeeNamesByDeptApiCall([]);
  }
  return (
    <>
      <ModalContainer
        id="class-subject-modal"
        modalTitle={props.modalTitle}
        isOpen={props.isOpen}
        toggle={togglerHandler}
        submitHndlr={EmployeeConcessionModalFilterForm.handleSubmit}
        cancelHndlr={togglerHandler}
        cancelTitle={"Cancel"}
        submitTitle={"Submit"}
        modalSize={"md"}
        modalBodyClass="p-0"
      >
        <div className="tw-flex tw-flex-column tw-mb-3">
          <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-my-1 tw-px-3 tw-mb-4">
            <div className="tw-col-span-12">
              <SelectInput
                name="experience"
                labelText="Experience"
                value={EmployeeConcessionModalFilterForm.values.experience}
                onChange={EmployeeConcessionModalFilterForm.handleChange}
                formgroupClassName="tw-mb-0"
                menuItems={selectData2}
                valueKey="experience"
                textKey="experience"
                isDisabled={!!props.modalData}
                invalid={
                  EmployeeConcessionModalFilterForm.touched.experience &&
                    EmployeeConcessionModalFilterForm.errors.experience
                    ? true
                    : false
                }
                error={
                  EmployeeConcessionModalFilterForm.touched.experience &&
                    EmployeeConcessionModalFilterForm.errors.experience
                    ? EmployeeConcessionModalFilterForm.errors.experience
                    : ""
                }
              />
            </div>
          </div>
        </div>


        <div className="tw-grid tw-grid-cols-12 tw-mb-3 tw-px-4">
          <div className="tw-col-span-12">
            <h6 className="tw-text-base tw-font-semibold tw-mb-3">
              Department
            </h6>
            <div className="tw-flex tw-items-center">
              <input
                className="tw-w-4 tw-h-4 tw-text-blue-600 tw-bg-gray-100 tw-border-gray-300 tw-rounded focus:tw-ring-blue-500"
                type="checkbox"
                value=""
                id="flexCheckChecked"
                name="allSubject"
                onChange={handleSelectAll}
                checked={isCheckAll}
                disabled={!!props.modalData}
              />
              <label className="tw-ml-2 tw-text-sm tw-font-medium tw-text-gray-900" htmlFor="flexCheckChecked">All Department</label>
            </div>
          </div>
        </div>

        <div className="tw-grid tw-grid-cols-12 tw-px-4 tw-mb-4">
          {props.departments &&
            props.departments.map((item: any, index: number) => (
              <div key={index} className="tw-col-span-12 sm:tw-col-span-6 tw-mb-1">
                <div className="tw-flex tw-items-center">
                  <input
                    className="tw-w-4 tw-h-4 tw-text-blue-600 tw-bg-gray-100 tw-border-gray-300 tw-rounded focus:tw-ring-blue-500"
                    type="checkbox"
                    value=""
                    id={`${item.departmentId}`}
                    name={item?.departmentName}
                    onChange={handleClick}
                    checked={isCheck.includes(+item.departmentId)}
                    disabled={!!props.modalData}
                  />
                  <label className="tw-ml-2 tw-text-sm tw-font-medium tw-text-gray-900" htmlFor={`${item.departmentId}`}>{item?.departmentName}</label>
                </div>
              </div>
            ))}
        </div>
        <div className="tw-grid tw-grid-cols-12">
          {error && <span className="tw-text-red-500 tw-m-2">Please enter at least one concession</span>}
        </div>
        <div className="tw-grid tw-grid-cols-12 tw-mb-2">
          <div className="tw-col-span-12">
            <TableContainer
                columns={roleColumns || []}
                data={props.modalData ? [{
                instituteDepartmentName: props.modalData.instituteDepartmentName,
                feeName: props.modalData.instituteFeeName,
                percentage: props.modalData.concession,
                instituteFeeNameId: props.modalData.instituteDepartmentId
                }] : instFeeNameByDeptResp ? instFeeNameByDeptResp : []}
                divClass="table-responsive tw-mb-1"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                tdClass="tw-border-b-0"
            />
          </div>
        </div>
      </ModalContainer>
    </>
  );
};

export default EmployeeConcessionModal;
