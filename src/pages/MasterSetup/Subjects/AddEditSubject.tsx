import React, { useEffect, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { TextInput, SelectInput, RadioInputContainer } from "../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import * as Yup from "yup";
import { useFormik } from "formik";
import { subjectTypeOptions, coscholasticData, scoscholasticData, languageTypeOptions } from "./helper";
import { addInstSubjectsAct, updateInstSubjectsAct } from "../../../store/mastersettings/instituteinfo/instituteinfoactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import Button from "../../../Components/Common/Button";

const initialValues = {
  shortName: "",
  subjectName: "",
  scholasticType: "",
  coScholasticType: "",
  subjectType: "",
  languageType: ""
};

const validationSchema = Yup.object().shape({
    subjectName: Yup.string().required("Subject is required."),
    shortName: Yup.string().required("Short name is required."),
    subjectType: Yup.string().required("Subject type is required."),
    coScholasticType: Yup.string()
        .nullable()
        .when("subjectType", {
            is: "COSCHOLASTIC",
            then: (schema) => schema.required("Co-scholastic is required."),
            otherwise: (schema) => schema.notRequired(),
        }),
    scholasticType: Yup.string()
        .nullable()
        .when("subjectType", {
            is: "SCHOLASTIC",
            then: (schema) => schema.required("SCHOLASTIC is required."),
            otherwise: (schema) => schema.notRequired(),
        }),
    languageType: Yup.mixed()
        .nullable()
        .when(["subjectType", "scholasticType"], {
            is: (subjectType: string, scholasticType: string) =>
                subjectType === "SCHOLASTIC" && scholasticType === "LANGUAGE",
            then: (schema) => Yup.string().required("Language is required."),
            otherwise: (schema) => Yup.string().nullable(),
        }),

});

const AddEditSubject: React.FC<any> = (props) => {
    const [toggleUIState, setToggleUIState] = useState({
        showCoScholasticType: false,
        showScholasticType: false
    });
    const dispatch = useAppDispatch();
    const { currentInstIdResp: instituteId, getInstSubjectsByIdResp, showApiLoader } = useAppSelector(({ instAcademics,
        appData, instituteInfo, globalData }) => ({
            currentInstIdResp: appData.currentInstIdResp,
            getInstSubjectsByIdResp: instituteInfo.getInstSubjectsByIdResp,
            showApiLoader: globalData.showApiLoader,
        }), shallowEqual);

    const addSubjectForm = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const payload: any = {
                subjectName: values.subjectName,
                shortName: values.shortName,
                scholasticType: values.scholasticType,
                coScholasticType: values.coScholasticType,
                subjectType: values.subjectType,
                languageType: values.languageType,
            };
            Object.keys(payload).forEach(key => {
                if (payload[key] === "") {
                    delete payload[key];
                }
            });
            if (payload.subjectType === "SCHOLASTIC") {
                delete payload.coScholasticType;
            } else if (payload.subjectType === "COSCHOLASTIC") {
                delete payload.scholasticType;
            }
            if (props.id) {
                const editPayload = [
                    {
                        id: props.id,
                        ...payload
                    }
                ];
                dispatch(updateInstSubjectsAct(generateActionPayload("update_inst_subjects", undefined, editPayload)));
            } else {
                const addPayload = {
                    instituteId,
                    requestDtoList: [payload],
                };
                dispatch(addInstSubjectsAct(generateActionPayload("save_inst_subjects", undefined, addPayload)));
            }
        }

    });
    
      const addExaminationDetailsRef = useRef({
        prevGetInstSubjectsByIdResp: getInstSubjectsByIdResp,
      })
  useEffect(() => {
    const { prevGetInstSubjectsByIdResp } = addExaminationDetailsRef.current || {};
    if (getInstSubjectsByIdResp && prevGetInstSubjectsByIdResp !== getInstSubjectsByIdResp) {
      if (props?.id) {
        const {
          subjectName,
          subjectShortName,
          subjectType,
          coScholasticType,
          scholasticType,
          languageType,
        } = getInstSubjectsByIdResp || {};

        addSubjectForm.setValues((prev) => ({
          ...prev,
          subjectName: subjectName,
          shortName: subjectShortName,
          subjectType: subjectType,
          coScholasticType: coScholasticType,
          scholasticType: scholasticType,
          languageType: languageType,
        }));
        if (subjectType === "COSCHOLASTIC") {
                setToggleUIState({
                    showCoScholasticType: true,
                    showScholasticType: false
                })
            } else if (subjectType === "SCHOLASTIC") {
                setToggleUIState({
                    showCoScholasticType: false,
                    showScholasticType: true,
                });
            } else {
                setToggleUIState({
                    showCoScholasticType: false,
                    showScholasticType: true,
                });
            }
      }
    }

    addExaminationDetailsRef.current.prevGetInstSubjectsByIdResp = getInstSubjectsByIdResp;
  }, [getInstSubjectsByIdResp]);
    function onChangeSubjectTypeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (value === "COSCHOLASTIC") {
            setToggleUIState({
                showCoScholasticType: true,
                showScholasticType: false
            })
            addSubjectForm.setValues((prevState: any) => ({
                ...prevState, scholasticType: undefined, [name]: value
            }))
        } else if (value === "SCHOLASTIC") {
            setToggleUIState({
                showCoScholasticType: false,
                showScholasticType: true,
            });
            addSubjectForm.setValues((prevState: any) => ({
                ...prevState, coScholasticType: undefined, scholasticType: "CORE", subjectAreaRequest: undefined, [name]: value
            }))
        } else if (value === "INTERNAL") {
            setToggleUIState({
                showCoScholasticType: false,
                showScholasticType: false,
            });
            addSubjectForm.setValues((prevState: any) => ({
                ...prevState, scholasticType: undefined, [name]: value, coScholasticType: undefined,
            }))
        }
    }

    return (

        <div className="tw-p-5">

            <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                <div className="tw-col-span-12 md:tw-col-span-6">
                    <TextInput
                        name="subjectName"
                        labelText="Subject Name"
                        labelClass="required"
                        value={addSubjectForm.values.subjectName}
                        onChange={addSubjectForm.handleChange}
                        invalid={(addSubjectForm.touched.subjectName && addSubjectForm.errors.subjectName) ? true : false}
                        error={(addSubjectForm.touched.subjectName && addSubjectForm.errors.subjectName) ? addSubjectForm.errors.subjectName : ""}
                    />
                </div>

                <div className="tw-col-span-12 md:tw-col-span-6">
                    <TextInput
                        name="shortName"
                        labelText="Short Name"
                        labelClass="required"
                        value={addSubjectForm.values.shortName}
                        onChange={addSubjectForm.handleChange}
                        invalid={(addSubjectForm.touched.shortName && addSubjectForm.errors.shortName) ? true : false}
                        error={(addSubjectForm.touched.shortName && addSubjectForm.errors.shortName) ? addSubjectForm.errors.shortName : ""}
                    />
                </div>

                <div className="tw-col-span-12 md:tw-col-span-6">
                    <SelectInput
                        name="subjectType"
                        labelText="Subject Type"
                        labelClass="required"
                        value={addSubjectForm.values.subjectType}
                        onChange={onChangeSubjectTypeHndlr}
                        invalid={(addSubjectForm.touched.subjectType && addSubjectForm.errors.subjectType) ? true : false}
                        error={(addSubjectForm.touched.subjectType && addSubjectForm.errors.subjectType) ? addSubjectForm.errors.subjectType : ""}
                        menuItems={subjectTypeOptions}
                        valueKey="id"
                        textKey="name"
                    />
                </div>

                {toggleUIState.showCoScholasticType && (
                    <div className="tw-col-span-12 md:tw-col-span-6">
                        <SelectInput
                            name="coScholasticType"
                            labelText="Coscholastic Type"
                            labelClass="required"
                            value={addSubjectForm.values.coScholasticType}
                            onChange={addSubjectForm.handleChange}
                            invalid={(addSubjectForm.touched.coScholasticType && addSubjectForm.errors.coScholasticType) ? true : false}
                            error={(addSubjectForm.touched.coScholasticType && addSubjectForm.errors.coScholasticType) ? addSubjectForm.errors.coScholasticType : ""}
                            menuItems={Array.isArray(coscholasticData) && (coscholasticData) || []}
                            valueKey="id"
                            textKey="name"
                        />
                    </div>
                )}

                {toggleUIState.showScholasticType && (
                    <div className="tw-col-span-12 md:tw-col-span-6">
                        <RadioInputContainer
                            name="scholasticType"
                            labelText="Scholastic Type"
                            inputContainerClassName="tw-mt-2"
                            radioOptions={scoscholasticData}
                            value={addSubjectForm.values.scholasticType}
                            onChange={addSubjectForm.handleChange}
                        />
                    </div>
                )}

                {addSubjectForm.values.subjectType === "SCHOLASTIC" &&
                    addSubjectForm.values.scholasticType === "LANGUAGE" && (
                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <SelectInput
                                name="languageType"
                                labelText="Language"
                                labelClass="required"
                                value={addSubjectForm.values.languageType}
                                onChange={addSubjectForm.handleChange}
                                menuItems={Array.isArray(languageTypeOptions) && (languageTypeOptions) || []}
                                valueKey="id"
                                textKey="name"
                                invalid={(addSubjectForm.touched.languageType && addSubjectForm.errors.languageType) ? true : false}
                                error={(addSubjectForm.touched.languageType && addSubjectForm.errors.languageType) ? addSubjectForm.errors.languageType : ""}
                            />
                        </div>
                    )}
            </div>
            <div className="tw-flex tw-gap-2 tw-justify-end tw-mt-4 tw-mb-1">

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
                    onClick={(event: any) => addSubjectForm.handleSubmit(event)}
                    disabled={showApiLoader}
                >
                    {props.subjectId ? "Update" : "Submit"}
                </Button>

            </div>

        </div>

    )
}

export default AddEditSubject;