import { useState, useEffect, useImperativeHandle, useContext, useRef } from "react";
import { shallowEqual } from "react-redux";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

import { Formik, FieldArray, Form, ArrayHelpers, FormikErrors, FormikProvider, useFormik } from "formik";

import * as Yup from "yup";
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch,
    UploadImage
} from "../../../../../Components/Common";

import StudentImgIcon from "../../../../../assets/imagesdps/directory/user-img.png";

//Helper
import {
    studentUIDTypes, yesNoOptions, admissionTypes, genderOptions, bloodGroupOptions,
    nationalityOptions, trueFalseOptions, languageOptions,
    houseNameOptions, admissionCategory, motherToungeOptions,
    religionOptions
} from "../helper";
import { StepperFormContext } from "../../helper";
//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import {
    getNationalityAct, getReligionAct, getBloodGroupAct, getGenderListAct
} from "../../../../../store/masterdata/masterdataactions";
import {
    getInstAcademicYearAct,
} from "../../../../../store/mastersettings/instacademics/instacademicactions";
import {
    getGlobalRecordsAct,
} from "../../../../../store/mastersettings/instituteinfo/instituteinfoactions";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";

//Common Utility
import { generateUniqueNumber } from "../../../../../utility/commonutility";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../../../Components/Common/Button";

//Old Data
// function getInitialState(initialState: any) {
//     return {
//         admissionAcademicYearId: initialState?.admissionAcademicYearId || "1",
//         admissionNo: initialState?.admissionNo || "2432",
//         dateOfAdmission: initialState?.dateOfAdmission || "2023-01-15T09:45:00",
//         studentName: initialState?.studentName || "Student Name",
//         aadharCardNo: initialState?.aadharCardNo || "123456789012",
//         genderId: initialState?.genderId || "1",
//         dob: initialState?.dob || "1980-10-01T09:45:00",
//         emailId: initialState?.emailId || "stesting@gmail.com",
//         contactNo: initialState?.contactNo || "1234567890",
//         birthPlace: initialState?.birthPlace || "Shars",
//         bloodGroupId: initialState?.bloodGroupId || "1",
//     }
// }


const validationSchema = Yup.object().shape({
    emergencyContactList: Yup.array().of(
        Yup.object().shape({
            emergencyContactPerson: Yup.string().required("Contact person required."),
            emergencyContactNo: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Contact number with 10 digit is valid.').required("Contact number required."),
            emergencyRelationId: Yup.string().required("Select relation type."),
        })
    ),
});

function getInitialState(editData?: any): any {
    const data: any = [];
    if (Array.isArray(editData)) {
        for (let i = 0; i < editData.length; i++) {
            const { emergencyContactNo, id, emergencyContactPerson, emergencyRelationId } = editData[i];
            data.push({
                uniqueId: id,
                id: id,
                emergencyContactPerson: emergencyContactPerson,
                emergencyContactNo: emergencyContactNo,
                emergencyRelationId: emergencyRelationId
            });
        }
    } else {
        data.push({
            uniqueId: generateUniqueNumber(),
            id: undefined,
            emergencyContactPerson: "",
            emergencyContactNo: "",
            emergencyRelationId: ""
        });
    }
    return { emergencyContactList: data }
    // const data: any = {
    //     uniqueId: generateUniqueNumber(),
    // emergencyContactPerson: "",
    // emergencyContactNo: "",
    // emergencyRelationId: ""
    // };
    // if (editData) {
    //     const { emergencyContactPerson, id, emergencyContactNo, emergencyRelationId } = editData || {};
    //     data.uniqueId = id;
    //     data.id = id;
    //     data.emergencyContactPerson = emergencyContactPerson;
    //     data.emergencyContactNo = emergencyContactNo;
    //     data.emergencyRelationId = emergencyRelationId;
    // }
    // return { emergencyContactList: [data] }
}


export default function EmergencyContacts({ branchId, instituteId }: any) {
    const [dependencyDetailsState, setDependencyDetailState] = useState<any>(getInitialState());
    const { currentMultiFormKeys, editEmployeeData,
        storeMultiFormData } = useContext<any>(StepperFormContext);
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

    const dispatch = useAppDispatch();
    const { relationTypeListResp } =
        useAppSelector(({ masterData, instAcademics }) => ({
            relationTypeListResp: masterData.relationTypeListResp
        }), shallowEqual);

    // useEffect(() => {
    //     const payload = { instituteId: 49, pageNo: 0, pageSize: 100 };
    //     dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
    //     dispatch(getGenderListAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "gender" })));
    //     dispatch(getBloodGroupAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "blood-group" })));
    // }, []);

    function addDetailsHndlr() {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({
                uniqueId: generateUniqueNumber(), emergencyContactPerson: "",
                emergencyContactNo: "",
                emergencyRelationId: ""
            });
        }
    }

    function removeDetailsHndlr(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined || rowIndex !== null) {
            formikArrayHelpers.current?.remove(Number(rowIndex));
        }
    }


    const dependencyDetailForm = useFormik({
        enableReinitialize: true,
        initialValues: dependencyDetailsState,
        validationSchema,
        onSubmit: (values: any) => {
            const { emergencyContactList } = values,
                payload = emergencyContactList.map((item: any) => {
                    const { uniqueId, ...otherInfo } = item;
                    return otherInfo;
                });
            storeMultiFormData("employeeEmergencyDetails", true, payload);
            // storeMultiFormData("employeeEmergencyDetails", true, formData);
        }
    })
    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes("employeeEmergencyDetails"))
            dependencyDetailForm.handleSubmit();
    }, [currentMultiFormKeys]);

    useEffect(() => {
        if (editEmployeeData) {
            const { employeeEmergencyDetails } = editEmployeeData,
                { formData } = employeeEmergencyDetails || {};
            if (formData)
                setDependencyDetailState(getInitialState(formData));
        }
    }, [editEmployeeData]);

    function onChangePhoneInput(phoneNumber: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = phoneNumber.substring(2);
        dependencyDetailForm.setFieldValue(name, updateDate);
    }
    return (
        <form onSubmit={dependencyDetailForm.handleSubmit}>
            <AccordionHeader tag="span" className="tw-text-base" targetId="emergency-details">
                Emergency Contacts
            </AccordionHeader>
            <AccordionBody accordionId="emergency-details">
                <div className="tw-flex tw-flex-wrap tw--mx-2">
                    <div className="tw-w-full tw-px-2">
                        <FormikProvider value={dependencyDetailForm}>
                            <FieldArray name="emergencyContactList">
                                {(arrayHelpers: ArrayHelpers) => {
                                    if (!formikArrayHelpers.current) {
                                        formikArrayHelpers.current = arrayHelpers;
                                    }
                                    return (
                                        <>
                                            {dependencyDetailForm.values.emergencyContactList.length > 0 &&
                                                dependencyDetailForm.values.emergencyContactList.map((details: any, index: any) => {
                                                    const inputFieldErrors: any = Array.isArray(dependencyDetailForm.errors.emergencyContactList) && dependencyDetailForm.errors.emergencyContactList[index] || {};
                                                    const inputFieldTouched = Array.isArray(dependencyDetailForm.touched.emergencyContactList) && dependencyDetailForm.touched.emergencyContactList[index] || {};
                                                    return (
                                                        <div key={details.uniqueId} className="tw-flex tw-flex-wrap tw--mx-2">
                                                            <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                                                                <TextInput
                                                                    name={`emergencyContactList[${index}].emergencyContactPerson`}
                                                                    labelText="Name"
                                                                    value={details.emergencyContactPerson}
                                                                    onChange={dependencyDetailForm.handleChange}
                                                                    onBlur={dependencyDetailForm.handleBlur}
                                                                    invalid={(inputFieldTouched.emergencyContactPerson && inputFieldErrors.emergencyContactPerson) ? true : false}
                                                                    error={(inputFieldTouched.emergencyContactPerson && inputFieldErrors.emergencyContactPerson) ? inputFieldErrors.emergencyContactPerson : ""}
                                                                    labelClass="required"
                                                                />
                                                            </div>
                                                            <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                                                                <SelectInput
                                                                    name={`emergencyContactList[${index}].emergencyRelationId`}
                                                                    labelText="Relationship Type"
                                                                    value={details.emergencyRelationId}
                                                                    onChange={dependencyDetailForm.handleChange}
                                                                    onBlur={dependencyDetailForm.handleBlur}
                                                                    invalid={(inputFieldTouched.emergencyRelationId && inputFieldErrors.emergencyRelationId) ? true : false}
                                                                    error={(inputFieldTouched.emergencyRelationId && inputFieldErrors.emergencyRelationId) ? inputFieldErrors.emergencyRelationId : ""}
                                                                    menuItems={relationTypeListResp?.data}
                                                                    valueKey="id"
                                                                    textKey="relationType"
                                                                    labelClass="required"
                                                                />
                                                            </div>
                                                            <div className="tw-w-full md:tw-w-3/12 tw-px-2">
                                                                <PhoneInput
                                                                    name={`emergencyContactList[${index}].emergencyContactNo`}
                                                                    labelText="Phone No"
                                                                    value={details.emergencyContactNo}
                                                                    inputClassName="tw-w-80"
                                                                    onChange={onChangePhoneInput}
                                                                    onBlur={dependencyDetailForm.handleBlur}
                                                                    invalid={(inputFieldTouched.emergencyContactNo && inputFieldErrors.emergencyContactNo) ? true : false}
                                                                    error={(inputFieldTouched.emergencyContactNo && inputFieldErrors.emergencyContactNo) ? inputFieldErrors.emergencyContactNo : ""}
                                                                    labelClass="required"
                                                                />
                                                            </div>
                                                            <div className="tw-w-full md:tw-w-1/12 tw-px-2 tw-flex tw-items-center tw-justify-center tw-mt-2">
                                                                {(index !== 0) && <Button
                                                                    variant="wrong"
                                                                    data-index={index}
                                                                    onClick={removeDetailsHndlr}
                                                                    color="white"
                                                                    className="!tw-p-2 tw-text-sm !tw-rounded-full "
                                                                >
                                                                    <HugeiconsIcon icon={Delete02StrokeStandard} className="tw-text-red-600" size={18} />
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
                    </div>
                    <div className="tw-w-full tw-px-2">
                        <Button
                            type="button"
                            variant="hoverInfo"
                            onClick={addDetailsHndlr}
                            value="click Me"
                        >
                            Add New
                        </Button>
                        {/* <button 
                    type="submit" 
                    className="tw-px-4 tw-py-2 tw-bg-green-600 tw-text-white tw-rounded hover:tw-bg-green-700 tw-transition-colors tw-font-medium"
                >
                    Submit
                </button> */}
                    </div>
                </div>
            </AccordionBody>
        </form>
    )
}