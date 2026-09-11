import React, {  useRef, useState, useEffect } from "react";
// import { Row, Col,  Button } from "reactstrap";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Common Component
import { TextInput, ModalContainer, Button } from "../../../../Components/Common";

// Formik validation
import * as Yup from "yup";
import {FieldArray, useFormik, ArrayHelpers, FormikProvider } from "formik";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
//Generate Action
import { generateActionPayload } from "../../../../utility/reduxutility";
import { addInstFeeDepartmentsAct, updateInstFeeDepartmentAct } from "../../../../store/mastersettings/feesettings/feesettingsactions";

//Common Utility
import { generateUniqueNumber } from "../../../../utility/commonutility";

interface DepartmentsInfo {
    uniqueId: string,
    // eslint-disable-next-line no-restricted-globals
    departmentName: string
}

interface IAddDepartmentsState {
    feeDepartments: Array<DepartmentsInfo>
}

const initialState: IAddDepartmentsState = {
    feeDepartments: [{
        uniqueId: generateUniqueNumber(),
        departmentName: ""
    }]
};

const validationSchema = Yup.object().shape({
    feeDepartments: Yup.array().of(
        Yup.object().shape({
            departmentName: Yup.string().required("Fee department name is required.")
                .matches(/^[^-\s][a-zA-Z\s-]+$/, 'Only alphabet with space, - character are allowed.'),
        })
    ),
});

function getInitialState(editData?: any): IAddDepartmentsState {
    const data: any = {
        uniqueId: generateUniqueNumber(),
        departmentName: "",
    };
    if (editData) {
        const { departmentId, departmentName } = editData || {};
        data.uniqueId = departmentId;
        data.departmentName = departmentName;
    }
    return { feeDepartments: [data] }
}


const AddFeeDepartment: React.FC<any> = (props) => {
    const [departmentListState, setDepartmentListState] = useState<IAddDepartmentsState>(getInitialState());
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

    const dispatch = useAppDispatch();
    const { addInstFeeDepartmentsResp, updateInstFeeDepartmentResp } = useAppSelector(({ instFeeSettings }) => ({
        addInstFeeDepartmentsResp: instFeeSettings.addInstFeeDepartmentsResp,
        updateInstFeeDepartmentResp: instFeeSettings.updateInstFeeDepartmentResp,
    }), shallowEqual);


    const addDepartmentRespRef = useRef<any>({
        prevAddInstFeeDepartmentsResp: addInstFeeDepartmentsResp,
        prevUpdateInstFeeDepartmentResp: updateInstFeeDepartmentResp
    });

    useEffect(() => {
        if (!props.isOpen) {
            addDepartmentForm.resetForm();
        }
    }, [props.isOpen]);

    useEffect(() => {
        if (props.editDepartmentDetails) {
            setDepartmentListState(getInitialState(props.editDepartmentDetails));
        } else {
            setDepartmentListState(getInitialState());
        }
    }, [props.editDepartmentDetails]);

    useEffect(() => {
        const { prevAddInstFeeDepartmentsResp, prevUpdateInstFeeDepartmentResp } = addDepartmentRespRef.current;
        if (addInstFeeDepartmentsResp && prevAddInstFeeDepartmentsResp !== addInstFeeDepartmentsResp) {
            props.toggle(true);
            toast.success("Fee Department added successfully.");
        } else if (updateInstFeeDepartmentResp && prevUpdateInstFeeDepartmentResp !== updateInstFeeDepartmentResp) {
            props.toggle(true);
            toast.success("Fee Department updated successfully.");
        }
        addDepartmentRespRef.current.prevAddInstFeeDepartmentsResp = addInstFeeDepartmentsResp;
        addDepartmentRespRef.current.prevUpdateInstFeeDepartmentResp = updateInstFeeDepartmentResp;
    }, [addInstFeeDepartmentsResp, updateInstFeeDepartmentResp]);

    function addNewDepartmentHndlr() {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({
                uniqueId: generateUniqueNumber(),
                id: "",
                departmentName: ""
            });
        }
    }

    function removeDepartmentHndlr(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined || rowIndex !== null) {
            formikArrayHelpers.current?.remove(Number(rowIndex));
        }
    }

    const addDepartmentForm = useFormik({
        enableReinitialize: true,
        initialValues: departmentListState,
        validationSchema,
        onSubmit: (values) => {
            if (props.feeDeptId) {
                const params = { instituteId: props.instituteId, departmentId: props.feeDeptId };
                const payload: any = values.feeDepartments[0];
                delete payload.uniqueId;
                dispatch(updateInstFeeDepartmentAct(generateActionPayload("update_inst_fee_dept", params, payload)));
            } else {
                const params = { instituteId: props.instituteId };
                const payload: any = values.feeDepartments.map((item: any) => ({ departmentName: item.departmentName }))
                dispatch(addInstFeeDepartmentsAct(generateActionPayload("add_inst_fee_dept", params, payload)));
            }
        },
    });

    return (
        <ModalContainer
            id="add-branch-modal"
            modalTitle={props.modalTitle}
            isOpen={props.isOpen}
            toggle={props.toggle}
            submitTitle={props.feeDeptId ? "Update" : "Submit"}
            submitHndlr={addDepartmentForm.handleSubmit}
            cancelHndlr={props.toggle}
            modalSize="md"
        >
            <div className="tw-grid tw-grid-cols-12">
                <div className="tw-col-span-12 tw-mb-3">
                    <div className="tw-grid tw-grid-cols-12">
                        <div className="tw-col-span-12">
                            <div className="tw-flex tw-items-center">
                                <h6 className="tw-mb-0 tw-mr-2 tw-text-base tw-font-semibold">Department Name</h6>
                                {!props.feeDeptId && (
                                    <Button 
                                        onClick={addNewDepartmentHndlr} 
                                        variant="soft" 
                                        className="tw-w-6 tw-h-6 tw-flex tw-justify-center tw-items-center"
                                    >
                                        <i className="ri-add-line tw-text-lg" />
                                    </Button>)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tw-col-span-12">
                    <FormikProvider value={addDepartmentForm}>
                        <FieldArray name="feeDepartments">
                            {(arrayHelpers: ArrayHelpers) => {
                                if (!formikArrayHelpers.current) {
                                    formikArrayHelpers.current = arrayHelpers;
                                }
                                return (
                                    <>
                                        {addDepartmentForm.values.feeDepartments.length > 0 &&
                                            addDepartmentForm.values.feeDepartments.map((department, index) => {
                                                const inputFieldErrors: any = addDepartmentForm.errors.feeDepartments && addDepartmentForm.errors.feeDepartments[index] || {};
                                                const inputFieldTouched = addDepartmentForm.touched.feeDepartments && addDepartmentForm.touched.feeDepartments[index] || {};
                                                return (
                                                    <div key={department.uniqueId} className="tw-grid tw-grid-cols-12 tw-mb-3">
                                                        <div className="tw-col-span-12">
                                                            <div className="tw-flex tw-items-center tw-gap-4">
                                                                <TextInput
                                                                    placeHolder="Department Name"
                                                                    name={`feeDepartments[${index}].departmentName`}
                                                                    value={department.departmentName}
                                                                    formgroupClassName="tw-mb-0 tw-flex-grow"
                                                                    onChange={addDepartmentForm.handleChange}
                                                                    invalid={(inputFieldTouched.departmentName && inputFieldErrors.departmentName) ? true : false}
                                                                    error={(inputFieldTouched.departmentName && inputFieldErrors.departmentName) ? inputFieldErrors.departmentName : ""}
                                                                />
                                                                {/* <TextInput
                                                                    name={`feeDepartments[${index}].shortName`}
                                                                    value={department.shortName}
                                                                    formgroupClassName="mb-0 w-80 me-4"
                                                                    onChange={addDepartmentForm.handleChange}
                                                                    invalid={(inputFieldTouched.shortName && inputFieldErrors.shortName) ? true : false}
                                                                    error={(inputFieldTouched.shortName && inputFieldErrors.shortName) ? inputFieldErrors.shortName : ""}
                                                                /> */}
                                                                {(index !== 0) && (
                                                                    <Button 
                                                                        data-index={index} 
                                                                        onClick={removeDepartmentHndlr} 
                                                                        variant="wrong"
                                                                    >
                                                                        <i className="ri-delete-bin-2-fill tw-text-lg" />
                                                                    </Button>)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                    </>
                                )
                            }}
                        </FieldArray>

                    </FormikProvider>
                </div>
            </div>
        </ModalContainer >
    )
}

export default React.memo(AddFeeDepartment);
