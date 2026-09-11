import React, { MouseEventHandler, useRef, useState, useEffect } from "react";
// import { Row, Col, Input, Button, Label } from "reactstrap";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Common Component
import { TextInput, ModalContainer, Button } from "../../../../Components/Common";

// Formik validation
import * as Yup from "yup";
import { Formik, FieldArray, useFormik, Form, ArrayHelpers, FormikErrors, FormikProvider } from "formik";


//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
//Generate Action
import { generateActionPayload } from "../../../../utility/reduxutility";
import { addInstDepartmentAct, updateInstDepartmentAct } from "../../../../store/mastersettings/instituteinfo/instituteinfoactions";

//Common Utility
import { generateUniqueNumber } from "../../../../utility/commonutility";

interface DepartmentsInfo {
    uniqueId: string,
    // eslint-disable-next-line no-restricted-globals
    name: string,
}

interface IAddDepartmentsState {
    departments: Array<DepartmentsInfo>
}

const initialState: IAddDepartmentsState = {
    departments: [{
        uniqueId: generateUniqueNumber(),
        name: "",
    }]
};

const validationSchema = Yup.object().shape({
    departments: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required("Name is required."),
            code: Yup.string().required("Code is required."),
        })
    ),
});

function getInitialState(editData?: any): IAddDepartmentsState {
    const data: any = {
        uniqueId: generateUniqueNumber(),
        name: ""
    };
    if (editData) {
        const { name, id, shortCode } = editData || {};
        data.uniqueId = id;
        data.name = name;
    }
    return { departments: [data] }
}


const AddFeeTypeModal: React.FC<any> = (props) => {
    const [departmentListState, setDepartmentListState] = useState<IAddDepartmentsState>(getInitialState());
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

    const dispatch = useAppDispatch();
    const { addInstDepartmentResp, updateInstDepartmentResp } = useAppSelector(({ instituteInfo }) => ({
        addInstDepartmentResp: instituteInfo.addInstDepartmentResp,
        updateInstDepartmentResp: instituteInfo.updateInstDepartmentResp,
    }), shallowEqual);


    const addDepartmentRespRef = useRef<any>({
        prevAddInstDepartmentResp: addInstDepartmentResp,
        prevUpdateInstDepartmentResp: updateInstDepartmentResp
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
        const { prevAddInstDepartmentResp, prevUpdateInstDepartmentResp } = addDepartmentRespRef.current;
        if (addInstDepartmentResp && prevAddInstDepartmentResp !== addInstDepartmentResp) {
            props.toggle(true);
            toast.success("Department added successfully.");
        } else if (updateInstDepartmentResp && prevUpdateInstDepartmentResp !== updateInstDepartmentResp) {
            props.toggle(true);
            toast.success("Department updated successfully.");
        }
        addDepartmentRespRef.current.prevAddInstDepartmentResp = addInstDepartmentResp;
        addDepartmentRespRef.current.prevUpdateInstDepartmentResp = updateInstDepartmentResp;
    }, [addInstDepartmentResp, updateInstDepartmentResp]);

    function addNewDepartmentHndlr() {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({ uniqueId: generateUniqueNumber(), name: "", code: "" });
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

            const params = { instituteId: props.instituteId, departmentId: props.departmentId },
                filterUniqueId = values.departments.map(item => ({ name: item.name }));

            if (props.departmentId) {
                const updateDepartmentPayload: any = filterUniqueId[0];
                dispatch(updateInstDepartmentAct(generateActionPayload("update_inst_department", params, updateDepartmentPayload)));
            } else {
                const addDepartmentPayload: any = { departments: filterUniqueId };
                dispatch(addInstDepartmentAct(generateActionPayload("add_inst_departments", params, addDepartmentPayload)));
            }
        },
    });

    return (
        <ModalContainer
            id="add-branch-modal"
            modalTitle={props.modalTitle}
            isOpen={props.isOpen}
            toggle={props.toggle}
            submitTitle={props.departmentId ? "Update" : "Submit"}
            submitHndlr={addDepartmentForm.handleSubmit}
            cancelHndlr={props.toggle}
            modalSize="md"
        >
            <div className="tw-grid tw-grid-cols-12">
                <div className="tw-col-span-12 tw-mb-3">
                    <div className="tw-grid tw-grid-cols-12">
                        <div className="tw-col-span-12">
                            <div className="tw-flex tw-items-center">
                                <h6 className="tw-mb-0 tw-mr-2 tw-text-base tw-font-semibold">Fee Type</h6>
                                {!props.departmentId && (
                                    <Button 
                                        onClick={addNewDepartmentHndlr} 
                                        variant="soft"
                                    >
                                        <i className="ri-add-line tw-text-lg" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tw-col-span-12">
                    <FormikProvider value={addDepartmentForm}>
                        <FieldArray name="departments">
                            {(arrayHelpers: ArrayHelpers) => {
                                if (!formikArrayHelpers.current) {
                                    formikArrayHelpers.current = arrayHelpers;
                                }
                                return (
                                    <>
                                        {addDepartmentForm.values.departments.length > 0 &&
                                            addDepartmentForm.values.departments.map((department, index) => {
                                                const inputFieldErrors: any = addDepartmentForm.errors.departments && addDepartmentForm.errors.departments[index] || {};
                                                const inputFieldTouched = addDepartmentForm.touched.departments && addDepartmentForm.touched.departments[index] || {};
                                                return (
                                                    <div key={department.uniqueId} className="tw-grid tw-grid-cols-12 tw-mb-3">
                                                        <div className="tw-col-span-12">
                                                            <div className="tw-flex tw-items-center tw-gap-4">
                                                                <TextInput
                                                                    name={`departments[${index}].name`}
                                                                    value={department.name}
                                                                    formgroupClassName="tw-mb-0 tw-flex-grow"
                                                                    onChange={addDepartmentForm.handleChange}
                                                                    invalid={(inputFieldTouched.name && inputFieldErrors.name) ? true : false}
                                                                    error={(inputFieldTouched.name && inputFieldErrors.name) ? inputFieldErrors.name : ""}
                                                                />

                                                                {(index !== 0) && (
                                                                    <Button 
                                                                        data-index={index} 
                                                                        onClick={removeDepartmentHndlr} 
                                                                        variant="wrong"
                                                                    >
                                                                        <i className="ri-delete-bin-2-fill tw-text-lg" />
                                                                    </Button>
                                                                )}
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

export default React.memo(AddFeeTypeModal);
