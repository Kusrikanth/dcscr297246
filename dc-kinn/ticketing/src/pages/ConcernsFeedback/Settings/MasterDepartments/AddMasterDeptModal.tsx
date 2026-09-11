
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import {
    InputCheckbox,
    MultiSelectCheckbox,
    TextInput,
} from "../../../../Components/Common";
import React, { useEffect, useRef } from "react";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { saveMasterComplaintDeptAct } from "../../../../store/concernsfeedback/complaintdepartment/complaintdepartmentaction";
import { getEmployeeByFilterAct } from "../../../../store/directory/employeemanagement/employeemanagementactions";
import { renderOptionsEmployee, renderValueStaff } from "./helper";


const initialValues: any = {
    isDisplayParent: false,
    isDisplayEmployee: false,
    isBoth: false,
    departmentName: "",
    shortName: "",
    branchIds: [],
};

const validationSchema = Yup.object().shape({
    departmentName: Yup.string().required('Short Name is required'),
    branchIds: Yup.array().min(1, 'Branch is required').required('Branch is required'),
 
})

const AddMasterDeptModal: React.FC<any> = (props) => {

    const dispatch = useAppDispatch();
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);


    const { currentBranchIdResp: branchId,
        currentInstIdResp: instituteId, showApiLoader,branchListResp, getMasterComplaintDeptListResp } = useAppSelector(({ vehicleDetailRequest, transportrequest, appData, globalData, branch, complaintDepartment }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            branchListResp: branch.branchListResp,
            getMasterComplaintDeptListResp: complaintDepartment.getMasterComplaintDeptListResp,

        }), shallowEqual);

    const addMasterDeptForm: any = useFormik({
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            const { departmentName, shortName, isDisplayParent, isDisplayEmployee,isBoth } = values || {};
            const payload: any = {
                instituteId,
                branchIds: values?.branchIds?.map((ele: any) => ele?.branchId),
                departmentName,
                shortName,
                isDisplayParent,
                isDisplayEmployee,
                isBoth
            }
            if(props.id){
                payload.instituteDeptId = props.id
            }     
            
            dispatch(saveMasterComplaintDeptAct(generateActionPayload("save_master_dept_list_update", undefined, payload)));
        },
    });

    function addSlabHandler() {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({ id: generateUniqueNumber(), department: "", });
        }
    }

    function removeSlabHndlr(event: React.MouseEvent<HTMLElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined || rowIndex !== null) {
            formikArrayHelpers.current?.remove(Number(rowIndex));
        }
    }

    function selectStudentHndlr(selectedOptions: any[], config?: any) {
        const { name } = config;
        if (Array.isArray(selectedOptions)) {
            const updated = selectedOptions.map((item) => ({
                ...item,
                isPrefilled: item.isPrefilled || false,
            }));
            addMasterDeptForm.setFieldValue(name, updated);
        } else {
            addMasterDeptForm.setFieldValue(name, []);
        }
    }

    function onSearchMultiSelectHandleremployee(name: any, value: string) {
        if (value) {
            const params = { searchString: value };
            dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, { instituteGroupId: 1 })));
        }
    }

        
    useEffect(() => {
        if (
            getMasterComplaintDeptListResp?.data?.length > 0 &&
            props.id &&
            (branchListResp?.data?.length ?? 0) > 0
        ) {
            const data = getMasterComplaintDeptListResp?.data.find(
                (ele: any) => +ele.id === +props.id
            );

            if (!data) return;

            const selectedBranches = branchListResp?.data.filter((branch: any) =>
                data.branchIds?.includes(branch.branchId))
                .map((branch: any) => ({
                    ...branch,
                    isPrefilled: true,
                }));

            const isParent = !!data.isDisplayParent;
            const isEmployee = !!data.isDisplayEmployee;

            addMasterDeptForm.setFieldValue("isDisplayParent", isParent);
            addMasterDeptForm.setFieldValue("isDisplayEmployee", isEmployee);
            addMasterDeptForm.setFieldValue("isBoth", isParent && isEmployee);

            addMasterDeptForm.setFieldValue("departmentName", data.departmentName);
            addMasterDeptForm.setFieldValue("shortName", data.shortName);
            addMasterDeptForm.setFieldValue("branchIds", selectedBranches);
            prevValuesRef.current = {
                isBoth: isParent && isEmployee,
                isDisplayParent: isParent,
                isDisplayEmployee: isEmployee,
            };

        }
    }, [getMasterComplaintDeptListResp, props.id, branchListResp]);


    const prevValuesRef = useRef({
        isBoth: false,
        isDisplayParent: false,
        isDisplayEmployee: false,
    });
    const bothClickedRef = useRef(false);

    useEffect(() => {
        const { isBoth, isDisplayParent, isDisplayEmployee } = addMasterDeptForm.values;
        const prev = prevValuesRef.current;

        if (isBoth !== prev.isBoth) {
            if (bothClickedRef.current) {
                if (isBoth) {
                    addMasterDeptForm.setFieldValue("isDisplayParent", true, false);
                    addMasterDeptForm.setFieldValue("isDisplayEmployee", true, false);
                } else {
                    addMasterDeptForm.setFieldValue("isDisplayParent", false, false);
                    addMasterDeptForm.setFieldValue("isDisplayEmployee", false, false);
                }
            }
            bothClickedRef.current = false;
            prevValuesRef.current = { isBoth, isDisplayParent, isDisplayEmployee };
            return;
        }
        if (
            isDisplayParent !== prev.isDisplayParent ||
            isDisplayEmployee !== prev.isDisplayEmployee
        ) {
            if (isDisplayParent && isDisplayEmployee) {
                addMasterDeptForm.setFieldValue("isBoth", true, false);
            }
            if (prev.isBoth && (!isDisplayParent || !isDisplayEmployee)) {
                addMasterDeptForm.setFieldValue("isBoth", false, false);
            }
        }

        prevValuesRef.current = { isBoth, isDisplayParent, isDisplayEmployee };
    }, [addMasterDeptForm.values.isBoth, addMasterDeptForm.values.isDisplayParent, addMasterDeptForm.values.isDisplayEmployee]);

    return (
        <>

            <div className="row" style={{ padding: "1.25rem" }}>
                <div className="mb-3 col-12">
                    <div className="hstack">
                        <h6 className="mb-0 me-2 form-label required">Branch</h6>
                    </div>
                </div>
                <div className="mb-3 col-12">
                    <MultiSelectCheckbox
                        name="branchIds"
                        idKey="branchId"
                        defaultSelect="Select Branches"
                        value={addMasterDeptForm.values.branchIds}
                        renderValue={(selectedItems: any, removeItemHandler: any) =>
                            renderValueStaff(selectedItems, removeItemHandler, !!props.id)
                        }
                        shouldDisableOption={(item: any) => {
                            if (!props.id) return false;
                            return addMasterDeptForm.values.branchIds?.some(
                                (selected: any) =>
                                    selected.branchId === item.branchId &&
                                    selected.isPrefilled === true
                            );
                        }}
                        renderOptions={renderOptionsEmployee}
                        onChange={selectStudentHndlr}
                        onSearchHandler={onSearchMultiSelectHandleremployee}
                        options={branchListResp?.data || []}
                        invalid={(addMasterDeptForm.touched.branchIds && addMasterDeptForm.errors.branchIds) ? true : false}
                        error={(addMasterDeptForm.touched.branchIds && addMasterDeptForm.errors.branchIds) ? addMasterDeptForm.errors.branchIds : ""}
                    />
                </div>
                <div className="mb-3 col-12">
                    <div className="hstack">
                        <h6 className="mb-0 me-2 form-label required">Department Name</h6>
                    </div>
                </div>
                <div className="mb-3 col-12">

                    <TextInput
                        name={`departmentName`}
                        value={addMasterDeptForm.values.departmentName}
                        formgroupClassName="mb-0"
                        onChange={addMasterDeptForm.handleChange}
                        onBlur={addMasterDeptForm.handleBlur}
                        invalid={(addMasterDeptForm.touched.departmentName && addMasterDeptForm.errors.departmentName) ? true : false}
                        error={(addMasterDeptForm.touched.departmentName && addMasterDeptForm.errors.departmentName) ? addMasterDeptForm.errors.departmentName : ""}
                    />
                </div>
                <div className="mb-3 col-12">
                    <div className="hstack">
                        <h6 className="mb-0 me-2 form-label ">Short Name</h6>
                    </div>
                </div>
                <div className="mb-3 col-12">

                    <TextInput
                        name={`shortName`}
                        value={addMasterDeptForm.values.shortName}
                        formgroupClassName="mb-0"
                        onChange={addMasterDeptForm.handleChange}
                        onBlur={addMasterDeptForm.handleBlur}

                    />
                </div>

                <div className='col-12 d-flex mb-3'>
                    <InputCheckbox
                        formgroupClassName='me-3'
                        name="isDisplayParent"
                        labelName="Display to Parent"
                        value={addMasterDeptForm.values.isDisplayParent}
                        onChange={addMasterDeptForm.handleChange}
                        
                    />
                    <InputCheckbox
                        formgroupClassName='me-3'
                        name="isDisplayEmployee"
                        labelName="Display to Employee"
                        value={addMasterDeptForm.values.isDisplayEmployee}
                        onChange={addMasterDeptForm.handleChange}
                    />
                    <InputCheckbox
                        formgroupClassName="me-3"
                        name="isBoth"
                        labelName="Both"
                        value={addMasterDeptForm.values.isBoth}
                        onChange={(e: any) => {
                            bothClickedRef.current = true;
                            addMasterDeptForm.handleChange(e);
                        }}
                    />
                </div>

                {/* <div className="col-12">
                    <FormikProvider value={addMasterDeptForm}>
                        <FieldArray name="departmentName">
                            {(arrayHelpers: ArrayHelpers) => {
                                if (!formikArrayHelpers.current) {
                                    formikArrayHelpers.current = arrayHelpers;
                                }
                                return (
                                    <>
                                        {addMasterDeptForm.values.departmentName?.length > 0 &&
                                            addMasterDeptForm.values.departmentName?.map((department: any, index: any) => {
                                                const inputFieldErrors = addMasterDeptForm.errors.departmentName && addMasterDeptForm.errors.departmentName[index] || {};
                                                const inputFieldTouched = addMasterDeptForm.touched.departmentName && addMasterDeptForm.touched.departmentName[index] || {};

                                                return (
                                                    <div key={department.id} className="mb-3 row">

                                                        <div className="col-12 d-flex">
                                                            <div className="w-80">

                                                                <TextInput
                                                                    name={`departmentName[${index}].department`}
                                                                    value={department.department}
                                                                    formgroupClassName="mb-0"
                                                                    onChange={addMasterDeptForm.handleChange}
                                                                    onBlur={addMasterDeptForm.handleBlur}
                                                                    invalid={(inputFieldTouched.department && inputFieldErrors.department) ? true : false}
                                                                    error={(inputFieldTouched.department && inputFieldErrors.department) ? inputFieldErrors.department : ""}
                                                                />
                                                            </div>

                                                            {(index !== 0) && <Button data-index={index} onClick={removeSlabHndlr} color="white" className="btn-sm btn-icon btn-rounded btn-hover-danger ms-3">
                                                            <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />
                                                            </Button>}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                    </>
                                )
                            }}
                        </FieldArray>

                    </FormikProvider>
                    {!props?.vehicleId && <div className="row">
                        <div className="col-12">
                            <button onClick={addSlabHandler} type="button" className="btn btn-outline-primary btn-sm">
                                Add New
                            </button>
                        </div>
                    </div>}
                </div> */}
                <div className='row'>
                    <div className='d-flex w-auto ms-auto '>
                        <button
                            type="submit"
                            className="btn btn-light mx-3"
                            onClick={props.toggle}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-success px-4"
                            onClick={(event: any) => { addMasterDeptForm.handleSubmit(event) }}
                            disabled={showApiLoader}
                        >
                          {props?.id ? "Update" : "Submit"}
                        </button>
                    </div>
                </div>
            </div>

        </>
    );
};

export default React.memo(AddMasterDeptModal);

