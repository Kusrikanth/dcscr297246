import React, { MouseEventHandler, useRef, useState, useEffect } from "react";
import { Row, Col, Input, Label } from "reactstrap";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Common Component
import { TextInput, ModalContainer } from "../../../Components/Common";

// Formik validation
import * as Yup from "yup";
import { Formik, FieldArray, useFormik, Form, ArrayHelpers, FormikErrors, FormikProvider } from "formik";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
//Generate Action
import { generateActionPayload } from "../../../utility/reduxutility";
import { addFeeCategoryAct, updateFeeCategoryAct } from "../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";

//Common Utility
import { generateUniqueNumber } from "../../../utility/commonutility";
import Button from "../../../Components/Common/Button";
// Interface and Types

const validationSchema = Yup.object().shape({
    categories: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required("Name is required.")
                .matches(/^[^-\s][a-zA-Z\s-]+$/, 'Only alphabet with space, - character are allowed.'),
            // shortName: Yup.string().required("Code is required.")
            //     .matches(/^[^-\s][a-zA-Z\s-]+$/, 'Only alphabet with space, - character are allowed.')
        })
    ),
});

function getInitialState(editData?: any): any {
    const data: any = {
        uniqueId: generateUniqueNumber(),
        name: "",
        shortName: ""
    };
    if (editData) {
        const { name, id, shortName } = editData || {};
        data.uniqueId = id;
        data.name = name;
        data.shortName = shortName;
    }
    return { categories: [data] }
}


const AddFeeCategories: React.FC<any> = (props) => {
    const [categoriesListState, setCategoriesListState] = useState<any>(getInitialState());
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

    const dispatch = useAppDispatch();
    const { addFeeCategoryResp, updateFeeCategoryResp } = useAppSelector(({ masterFeeSettings }) => ({
        addFeeCategoryResp: masterFeeSettings.addFeeCategoryResp,
        updateFeeCategoryResp: masterFeeSettings.updateFeeCategoryResp,
    }), shallowEqual);


    const addFeeCategoryRespRef = useRef<any>({
        prevAddFeeCategoryResp: addFeeCategoryResp,
        prevUpdateFeeCategoryResp: updateFeeCategoryResp
    });

    useEffect(() => {
        if (!props.isOpen) {
            addFeeCategoryForm.resetForm();
        }
    }, [props.isOpen]);

    useEffect(() => {
        if (props.editCategoryDetails) {
            setCategoriesListState(getInitialState(props.editCategoryDetails));
        } else {
            setCategoriesListState(getInitialState());
        }
    }, [props.editCategoryDetails]);

    useEffect(() => {
        const { prevAddFeeCategoryResp, prevUpdateFeeCategoryResp } = addFeeCategoryRespRef.current;
        if (addFeeCategoryResp && prevAddFeeCategoryResp !== addFeeCategoryResp) {
            props.toggle(true);
            toast.success("Fee category added successfully.");
        } else if (updateFeeCategoryResp && prevUpdateFeeCategoryResp !== updateFeeCategoryResp) {
            props.toggle(true);
            toast.success("Fee category updated successfully.");
        }
        addFeeCategoryRespRef.current.prevAddFeeCategoryResp = addFeeCategoryResp;
        addFeeCategoryRespRef.current.prevUpdateFeeCategoryResp = updateFeeCategoryResp;
    }, [addFeeCategoryResp, updateFeeCategoryResp]);

    function addNewFeeCategoryHndlr() {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({ uniqueId: generateUniqueNumber(), name: "", shortName: "" });
        }
    }

    function removeDepartmentHndlr(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined || rowIndex !== null) {
            formikArrayHelpers.current?.remove(Number(rowIndex));
        }
    }

    const addFeeCategoryForm = useFormik({
        enableReinitialize: true,
        initialValues: categoriesListState,
        validationSchema,
        onSubmit: (values) => {
            const params = { instituteId: props.instituteId, feeCategoryId: props.feeCategoryId },
                filterUniqueId = values.categories.map((item: any) => ({ name: item.name, shortName: item.shortName }));

            if (props.feeCategoryId) {
                const updateCategoryPayload: any = filterUniqueId[0];
                dispatch(updateFeeCategoryAct(generateActionPayload("update_fee_category", params, updateCategoryPayload)));
            } else {
                const addFeeCategoriesPayload: any = { categories: filterUniqueId };
                dispatch(addFeeCategoryAct(generateActionPayload("add_fee_category", params, addFeeCategoriesPayload)));
            }
        },
    });

    function handlFromSubmit(event: any) {
        event?.stopPropagation();
    }

    return (
        <ModalContainer
            id="add-branch-modal"
            modalTitle={props.modalTitle}
            isOpen={props.isOpen}
            toggle={props.toggle}
            submitTitle={props.feeCategoryId ? "Update" : "Submit"}
            submitHndlr={addFeeCategoryForm.handleSubmit}
            cancelHndlr={props.toggle}
            modalSize="md"
        >
            <Row>
                <Col xs={12} className="tw-mb-3">
                    <Row>
                        <Col xs={12}>
                            <div className="tw-flex tw-items-center">
                                <h6 className="tw-mb-0 tw-mr-2">Category Name</h6>

                                {!props.feeCategoryId && (
                                    <Button
                                        onClick={addNewFeeCategoryHndlr}
                                        color="outline-primary"
                                        variant="hoverInfo"
                                        className="!tw-p-0"
                                    >
                                        <i className="ri-add-line tw-text-lg" />
                                    </Button>
                                )}
                            </div>
                        </Col>

                        {/* 
      <Col xs={6}>
        <h6 className="tw-mb-0">Short Code</h6>
      </Col> 
      */}
                    </Row>
                </Col>

                <Col xs={12}>
                    <FormikProvider value={addFeeCategoryForm}>
                        <FieldArray name="categories">
                            {(arrayHelpers: ArrayHelpers) => {
                                if (!formikArrayHelpers.current) {
                                    formikArrayHelpers.current = arrayHelpers;
                                }

                                return (
                                    <>
                                        {addFeeCategoryForm.values.categories.length > 0 &&
                                            addFeeCategoryForm.values.categories.map(
                                                (category: any, index: any) => {
                                                    const inputFieldErrors: any =
                                                        (Array.isArray(addFeeCategoryForm.errors.categories) &&
                                                            addFeeCategoryForm.errors.categories[index]) ||
                                                        {};

                                                    const inputFieldTouched =
                                                        (Array.isArray(addFeeCategoryForm.touched.categories) &&
                                                            addFeeCategoryForm.touched.categories[index]) ||
                                                        {};

                                                    return (
                                                        <Row key={category.uniqueId} className="tw-mb-3">
                                                            <Col xs={12}>
                                                                <div className="tw-flex tw-items-center">
                                                                    <TextInput
                                                                        name={`categories[${index}].name`}
                                                                        value={category.name}
                                                                        formgroupClassName="tw-mb-0 tw-w-4/5 tw-mr-4"
                                                                        onChange={addFeeCategoryForm.handleChange}
                                                                        invalid={
                                                                            inputFieldTouched.name &&
                                                                                inputFieldErrors.name
                                                                                ? true
                                                                                : false
                                                                        }
                                                                        error={
                                                                            inputFieldTouched.name &&
                                                                                inputFieldErrors.name
                                                                                ? inputFieldErrors.name
                                                                                : ""
                                                                        }
                                                                    />

                                                                    {index !== 0 && (
                                                                        <Button
                                                                            data-index={index}
                                                                            onClick={removeDepartmentHndlr}
                                                                            color="white"
                                                                            variant="wrong"
                                                                        >
                                                                            <i className="ri-delete-bin-2-fill" />
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    );
                                                }
                                            )}
                                    </>
                                );
                            }}
                        </FieldArray>
                    </FormikProvider>
                </Col>
            </Row>

        </ModalContainer >
    )
}

export default React.memo(AddFeeCategories);
