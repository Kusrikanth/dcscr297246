import { useEffect, useContext, useMemo, useState, useRef } from "react";
import { shallowEqual } from "react-redux";
import { AccordionBody, AccordionHeader } from "reactstrap";

import { useFormik, FormikProvider, FieldArray, ArrayHelpers } from "formik";
import * as Yup from "yup";

import { TextInput, SelectInput, TextInputWithRegex } from "../../../Components/Common";


import { StepperFormContext } from "../helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
//Action Generators
import { generateActionPayload } from "../../../utility/reduxutility";
import {
    getBranchCurriculumAct, getBrchSectionsAct, getBranchClassAct, setBrchClassAct
} from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import {
    getAcademicLanguagesDataAct
} from "../../../store/mastersettings/instituteinfo/instituteinfoactions";
import {
    admissionCategroyAct, getRegistrationSecondLangAct, getRegistrationThirdLangAct
} from "../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";
import { getStreamList } from "../../../store/academic/assignGroup/assigngroupactions";
import { getSubjectListForCBSEList } from "../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";


const validationSchema = Yup.object().shape({
    firstLanguageId: Yup.string(),
    isSecondLanguage: Yup.boolean(),
    isThirdLanguage: Yup.boolean(),

    curriculumSoughtName: Yup.string(),
    admissionSoughtId: Yup.string(),
    classSequence: Yup.string(),
    groupId: Yup.string().test("isGroupRequired", "Group is required.", (value: any, schema: any) => {
        const { curriculumSoughtName, classSequence } = schema?.parent || {};
        if (!value && curriculumSoughtName &&
            curriculumSoughtName?.toString().toLowerCase() === 'cbse' &&
            !isNaN(classSequence) && Number(classSequence) >= 14) {
            return false;
        }
        return true;
    }),
    secondLanguageId: Yup.string().test("isSecondLanguage", "Second language is required.", (value: any, schema: any) => {
        if (!value && schema.parent?.isSecondLanguage) {
            return false;
        }
        return true;
    }).test("secondLanguageIdCheck", "Second language should not be same as first language.",
        (value: any, schema: any) => {
            if (schema.parent?.isSecondLanguage && value && value === schema.parent?.firstLanguageId) {
                return false
            }
            return true;
        }),
    thirdLanguageId: Yup.string().test("isThirdLanguage", "Third language is required.", (value: any, schema: any) => {
        if (!value && schema.parent?.isThirdLanguage) {
            return false;
        }
        return true;
    }).test("thirdLanguageIdCheck", "Third language should not be same as first language and second language.",
        (value: any, schema: any) => {
            if (value && schema.parent?.isThirdLanguage && ((value === schema.parent?.firstLanguageId) || (value === schema.parent?.secondLanguageId))) {
                return false
            }
            return true;
        }),
});

function getInitialState(initialState?: any) {
    let optionalSubjects: any[] = [];
    if (initialState) {
        let index = 1;
        while (initialState[`optionalSubjectId${index}`]) {
            optionalSubjects.push({
                subjectId: initialState[`optionalSubjectId${index}`]
            });
            index++;
        }
    }
    
    return {
        curriculumSoughtId: initialState?.curriculumSoughtId || "",
        curriculumSoughtName: initialState?.curriculumSoughtName || "",
        admissionSoughtId: initialState?.admissionSoughtId || "",
        classSequence: initialState?.classSequence || "",
        firstLanguageId: initialState?.firstLanguageId || "",
        secondLanguageId: initialState?.secondLanguageId || "",
        secondLanguageName: initialState?.secondLanguageName || "",
        thirdLanguageId: initialState?.thirdLanguageId || "",
        reasonForSeekingAdmission: initialState?.reasonForSeekingAdmission || "",
        groupId: initialState?.groupId || "",
        optionalSubjects: optionalSubjects.length > 0 ? optionalSubjects : initialState?.optionalSubjects || [],
        isSecondLanguage: false,
        isThirdLanguage: false,
    }
}

const initialValues = getInitialState();
export default function AcademicDetails({ stepId, formId, branchId, instituteId,
    sharedField,
    storeMultiFormDataCallback }: any) {
    const { currentMultiFormKeys, tabsData } = useContext<any>(StepperFormContext);
    const [subjectsCBSE, setSubjectsCBSE] = useState<any>([]);
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
    
    const dispatch = useAppDispatch();
    const { registrationSecondLangResp, registrationThirdLangResp,
        streamListResp, academicLanguages, branchClassResp, brchCurriculumResp, subjectListForCBSEResp } = useAppSelector(({ assignGroupInfo, admissionRegistration, branchAcademics, instituteInfo, applicationSale
        }) => ({
            academicLanguages: instituteInfo.academicLanguages,
            branchClassResp: branchAcademics.branchClassResp,
            registrationSecondLangResp: admissionRegistration.registrationSecondLangResp,
            registrationThirdLangResp: admissionRegistration.registrationThirdLangResp,
            streamListResp: assignGroupInfo.streamListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            subjectListForCBSEResp: applicationSale.subjectListForCBSEResp,
        }), shallowEqual);

    const academicRespRef = useRef({
        prevAcademicLanguages: academicLanguages,
        prevRegistrationThirdLangResp: registrationThirdLangResp,
        prevRegistrationSecondLangResp: registrationSecondLangResp
    });

    useEffect(() => {
        const brchCurriculumparams = { branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, brchCurriculumparams)));
        dispatch(admissionCategroyAct(generateActionPayload("admission_category")));
    }, []);

    useEffect(() => {
        const { prevAcademicLanguages, prevRegistrationSecondLangResp, prevRegistrationThirdLangResp } = academicRespRef.current;
        if (academicLanguages && prevAcademicLanguages !== academicLanguages) {
            const { data } = academicLanguages;
            if (Array.isArray(data)) {
                const englishLanguageId = data?.find((item: any) => item.languageName?.toLowerCase() === "english");
                if (englishLanguageId) {
                    academicDetailsForm.setFieldValue("firstLanguageId", englishLanguageId?.languageId);
                }
            }
        }
        if (registrationSecondLangResp && prevRegistrationSecondLangResp !== registrationSecondLangResp) {
            const { data } = registrationSecondLangResp;
            academicDetailsForm.setFieldValue("isSecondLanguage", Array.isArray(data) && data.length > 0);
        }
        if (registrationThirdLangResp && prevRegistrationThirdLangResp !== registrationThirdLangResp) {
            const { data } = registrationThirdLangResp;
            const { curriculumSoughtName, secondLanguageName, classSequence } = academicDetailsForm.values;
            if (curriculumSoughtName === 'CBSE' && !checkHigherClass(classSequence) &&
                Array.isArray(data) && data.length > 0 && !checkLowerClass(classSequence)
            ) {
                let showThirdLanguage = false;
                if (secondLanguageName !== "TELUGU") {
                    const teluguLang = data.find(item => item.languageName === "TELUGU");
                    academicDetailsForm.setFieldValue("thirdLanguageId", teluguLang?.languageId || "");
                    showThirdLanguage = true;
                } else {
                    showThirdLanguage = checkThirdLanguage(classSequence);
                }
                academicDetailsForm.setFieldValue("isThirdLanguage", showThirdLanguage);
            } else {
                academicDetailsForm.setFieldValue("isThirdLanguage", Array.isArray(data) && data.length > 0);
            }
        }
        academicRespRef.current.prevAcademicLanguages = academicLanguages;
        academicRespRef.current.prevRegistrationSecondLangResp = registrationSecondLangResp;
        academicRespRef.current.prevRegistrationThirdLangResp = registrationThirdLangResp;
    }, [academicLanguages, registrationSecondLangResp, registrationThirdLangResp]);

    const checkHigherClass = (classId: any) => {
        if (classId && branchClassResp?.content) {
            const classSequenceNo = +(branchClassResp.content.find(
                (cls: any) => +cls.id === +classId
            )?.classSequence?.toString())
            if (classSequenceNo >= 14) {
                return true
            } else {
                return false
            }
        }
        return false;
    }

    function getClassApiCall(curriculumId: string) {
        if (curriculumId) {
            const classParams = {
                branchId, pageNo: 0, pageSize: 100, sortBy: "className",
                orderBy: "asc", curriculumId: curriculumId
            };
            dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, classParams)));
        }
    }

    const academicDetailsForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values: any) => {
            const payload = { ...values };
            delete payload.isSecondLanguage;
            delete payload.curriculumSoughtName;
            delete payload.isThirdLanguage;
            if (payload.optionalSubjects && Array.isArray(payload.optionalSubjects)) {
                payload.optionalSubjects.forEach((sub: any, index: number) => {
                    if (sub.subjectId) {
                        payload[`optionalSubjectId${index + 1}`] = sub.subjectId;
                    }
                });
                delete payload.optionalSubjects;
            }
            
            storeMultiFormDataCallback(formId, true, academicDetailsForm.dirty, payload);
        }
    })

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes(formId)) {
            academicDetailsForm.handleSubmit();
        }
    }, [currentMultiFormKeys]);

    useEffect(() => {
        if (tabsData[stepId]) {
            const formData = getInitialState(tabsData[stepId]);
            const { curriculumSoughtId, academicYearId, classSequence, admissionSoughtId, groupId, curriculumSoughtName } = tabsData[stepId] || {};
            academicDetailsForm.resetForm({
                values: formData
            })
            if (Object.keys(tabsData[stepId]).length > 0) {
                if (curriculumSoughtId) {
                    getClassApiCall(curriculumSoughtId);
                }
                getSecondLangApiCall({
                    curriculumId: curriculumSoughtId, classId: admissionSoughtId,
                    academicYearId: academicYearId
                });
                getThirdLangApiCall({
                    curriculumId: curriculumSoughtId,
                    classId: admissionSoughtId,
                    academicYearId: academicYearId
                });
                const languagesPayload = { instituteId, pageNo: 0, pageSize: 100, sortBy: "languageName", orderBy: "asc" };
                dispatch(getAcademicLanguagesDataAct(generateActionPayload("get_academic_language_data", undefined, languagesPayload)));

                if (admissionSoughtId && !isNaN(classSequence) && Number(classSequence) >= 14) {
                    const streamApiPayload = {
                        academicYearId: academicYearId, curriculumId: curriculumSoughtId,
                        classId: admissionSoughtId, branchId: branchId, pageNo: 0, pageSize: 1000, sortBy: "streamGroupName", orderBy: "asc"
                    }
                    dispatch(getStreamList(generateActionPayload("get_stream_list", undefined, streamApiPayload)));
                    
                    if (curriculumSoughtName?.toLowerCase() === 'cbse' && groupId) {
                        const params = { 
                            instituteId: instituteId, 
                            classId: admissionSoughtId, 
                            groupId: groupId 
                        };
                        dispatch(getSubjectListForCBSEList(generateActionPayload('get_preadmission_subject_cbse', undefined, params)));
                    }
                }
            }
        }
    }, [tabsData, stepId]);

    function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (value) {
            getClassApiCall(value);
        }
        dispatch(setBrchClassAct(undefined));
        academicDetailsForm.setValues((prevState: any) => ({
            ...prevState, [name]: value, admissionSoughtId: "",
        }))
    }

    function getSecondLangApiCall(paramInfo: any) {
        const params = {
            instituteId,
            academicYearId: paramInfo?.academicYearId,
            branchId,
            curriculumId: paramInfo?.curriculumId,
            classId: paramInfo?.classId,
            type: 'SECOND'
        }
        dispatch(getRegistrationSecondLangAct(generateActionPayload("get_registration_lang", undefined, params)));
    }

    function getThirdLangApiCall(paramInfo: any) {
        const params = {
            instituteId,
            academicYearId: paramInfo?.academicYearId,
            branchId,
            curriculumId: paramInfo?.curriculumId,
            classId: paramInfo?.classId,
            type: 'THIRD'
        }
        dispatch(getRegistrationThirdLangAct(generateActionPayload("get_registration_lang", undefined, params)));
    }

    const checkLowerClass = (classSequenceNo: any) => {
        const num = Number(classSequenceNo);
        return !isNaN(num) && num <= 3;
    };

    const checkThirdLanguage = (classSequenceNo: any) => {
        const num = Number(classSequenceNo);
        return !isNaN(num) && [8, 9, 10, 11].includes(num);
    };

    const thirdLanguages = useMemo(() => {
        const { data } = registrationThirdLangResp || {};
        const { secondLanguageName } = academicDetailsForm.values;
        let filteredLanguages: any[] = [];
        if (Array.isArray(data)) {
            if (secondLanguageName === "TELUGU") {
                filteredLanguages = data.filter(item => item.languageName !== "TELUGU");
            } else {
                filteredLanguages = data;
            }
        }
        return filteredLanguages;
    }, [registrationThirdLangResp, academicDetailsForm.values.secondLanguageName]);

    function onChangeSecondLanguageHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        const { data: secondLanguage } = registrationSecondLangResp || {};
        const { data: thirdLanguage } = registrationThirdLangResp || {};
        if (academicDetailsForm.values.curriculumSoughtName === "CBSE" &&
            !checkHigherClass(academicDetailsForm.values.classSequence) &&
            !checkLowerClass(academicDetailsForm.values.classSequence)
        ) {
            if (!value) {
                academicDetailsForm.setValues(prevValues => ({
                    ...prevValues,
                    [name]: "",
                    secondLanguageName: "",
                    thirdLanguageId: "",
                    isThirdLanguage: false,
                }));
                return;
            }
            const selectedLang = secondLanguage.find(item => item.languageId === +value);
            const languageName = selectedLang?.languageName || "";
            const updatedValues = {
                [name]: value,
                secondLanguageName: languageName,
                thirdLanguageId: ""
            };
            if (languageName !== "TELUGU") {
                const teluguLang = thirdLanguage.find(item => item.languageName === "TELUGU");
                updatedValues.thirdLanguageId = teluguLang?.languageId || "";
                updatedValues.isThirdLanguage = true;
            } else {
                updatedValues.isThirdLanguage = checkThirdLanguage(academicDetailsForm.values.classSequence);
            }
            academicDetailsForm.setValues(prevValues => ({
                ...prevValues,
                ...updatedValues,
            }))
        } else {
            academicDetailsForm.setFieldValue(name, value);
        }
    }

   const handleGroupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    academicDetailsForm.handleChange(event);
    
    academicDetailsForm.setFieldValue('optionalSubjects', []);
    setSubjectsCBSE([]);
    
    if (value && academicDetailsForm.values.admissionSoughtId) {
        const params = { 
            instituteId: instituteId, 
            classId: academicDetailsForm.values.admissionSoughtId, 
            groupId: value 
        };
        dispatch(getSubjectListForCBSEList(generateActionPayload('get_preadmission_subject_cbse', undefined, params)));
    }
}

    useEffect(() => {
    if (subjectListForCBSEResp) {
        const { data } = subjectListForCBSEResp;
        if (data?.optionalSubjects && data.optionalSubjects.length > 0) {
            setSubjectsCBSE(data.optionalSubjects);
            
            const existingSubjects = academicDetailsForm.values.optionalSubjects;
            if (!existingSubjects || existingSubjects.length !== data.optionalSubjects.length) {
                let subjects: any = [];
                data.optionalSubjects.forEach((sub: any) => {
                    subjects.push({
                        subjectId: ""
                    })
                })
                academicDetailsForm.setFieldValue('optionalSubjects', subjects);
            }
        } else {
            academicDetailsForm.setFieldValue('optionalSubjects', []);
            setSubjectsCBSE([]);
        }
    }
}, [subjectListForCBSEResp])

    const { data: secondLanguage } = registrationSecondLangResp || {},
        { content: streamList } = streamListResp || {},
        { data: subjectForCBSE } = subjectListForCBSEResp || {},
        { curriculumSoughtName, classSequence, admissionSoughtId, groupId } = academicDetailsForm.values;
    const isRequiredGroupId = curriculumSoughtName?.toString().toLowerCase() === "cbse" && Number(classSequence) >= 14 || false;
    const isDisabledThirdLanguage = (curriculumSoughtName?.toString().toLowerCase() === "cbse" && academicDetailsForm.values.secondLanguageName && academicDetailsForm.values.secondLanguageName !== "TELUGU") || false;
    return (
        <form onSubmit={academicDetailsForm.handleSubmit}>
            <AccordionHeader tag="h5" targetId="academics">
                Academics
            </AccordionHeader>
            <AccordionBody accordionId="academics">
                <div className="row gx-3">
                    <div className="col-12 col-md-6 col-lg-4 col-xxl-3">
                        <SelectInput
                            name="curriculumSoughtId"
                            labelText="Curriculum Sought"
                            labelClass="required"
                            inputClassName="ng-input"
                            value={academicDetailsForm.values.curriculumSoughtId}
                            onChange={onChangeHandler}
                            menuItems={brchCurriculumResp?.data}
                            valueKey="branchCurriculumId"
                            textKey="curriculumName"
                            isDisabled={true}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4 col-xxl-3">
                        <SelectInput
                            name="admissionSoughtId"
                            labelText="Admission Sought to"
                            labelClass="required"
                            inputClassName="ng-input"
                            value={academicDetailsForm.values.admissionSoughtId}
                            onChange={academicDetailsForm.handleChange}
                            menuItems={branchClassResp?.content}
                            valueKey="id"
                            textKey="shortName"
                            isDisabled={true}
                        />
                    </div>
                    {isRequiredGroupId && <div className="col-12 col-md-6 col-lg-4 col-xxl-3">
                        <SelectInput
                            name="groupId"
                            labelClass="required"
                            labelText='Group'
                            inputClassName="ng-input"
                            value={academicDetailsForm.values.groupId}
                            onChange={handleGroupChange}
                            onBlur={academicDetailsForm.handleBlur}
                            menuItems={streamList}
                            valueKey="id"
                            textKey="shortName"
                            // isDisabled={true}
                            invalid={academicDetailsForm.touched.groupId &&
                                academicDetailsForm.errors.groupId
                                ? true
                                : false}
                            error={academicDetailsForm.touched.groupId &&
                                academicDetailsForm.errors.groupId
                                ? academicDetailsForm.errors.groupId
                                : ""}
                        />
                    </div>}
                    {curriculumSoughtName?.toLowerCase() === "cbse" && 
                     groupId && 
                     checkHigherClass(admissionSoughtId) && 
                     <FormikProvider value={academicDetailsForm}>
                        <FieldArray name="optionalSubjects">
                            {(arrayHelpers: ArrayHelpers) => {
                                if (!formikArrayHelpers.current) {
                                    formikArrayHelpers.current = arrayHelpers;
                                }
                                return <>
                                    {academicDetailsForm.values.optionalSubjects && 
                                     academicDetailsForm.values.optionalSubjects.map((sub: any, index: number) => {
                                        const inputFieldErrors: any = academicDetailsForm.errors.optionalSubjects && 
                                            academicDetailsForm.errors.optionalSubjects[index] || {};
                                        const inputFieldTouched: any = academicDetailsForm.touched.optionalSubjects && 
                                            academicDetailsForm.touched.optionalSubjects[index] || {};
                                        return <div className='col-12 col-md-6 col-lg-4 col-xxl-3' key={index}>
                                            <SelectInput
                                                name={`optionalSubjects[${index}].subjectId`}
                                                value={sub.subjectId}
                                                onChange={academicDetailsForm.handleChange}
                                                onBlur={academicDetailsForm.handleBlur}
                                                menuItems={subjectsCBSE[index]?.subjects || []}
                                                valueKey="subjectId"
                                                textKey="subjectName"
                                                // labelClass='required'
                                                inputClassName="ng-input"
                                                // isDisabled={true}
                                                labelText={`${subjectForCBSE?.mandatorySubjects.length + index + 1}th Subject`}
                                            />
                                        </div>
                                    })}
                                </>
                            }}
                        </FieldArray>
                    </FormikProvider>}

                    <div className="col-12 col-md-6 col-lg-4 col-xxl-3">
                        <SelectInput
                            name="firstLanguageId"
                            labelText="First Language"
                            labelClass="required"
                            inputClassName="ng-input"
                            value={academicDetailsForm.values.firstLanguageId}
                            onChange={academicDetailsForm.handleChange}
                            onBlur={academicDetailsForm.handleBlur}
                            invalid={(academicDetailsForm.touched.firstLanguageId && academicDetailsForm.errors.firstLanguageId) ? true : false}
                            error={(academicDetailsForm.touched.firstLanguageId && academicDetailsForm.errors.firstLanguageId) ? academicDetailsForm.errors.firstLanguageId : ""}
                            menuItems={academicLanguages?.data}
                            valueKey="languageId"
                            textKey="languageName"
                            isDisabled={true}
                        />
                    </div>
                    {academicDetailsForm.values.isSecondLanguage && <div className="col-12 col-md-6 col-lg-4 col-xxl-3">
                        <SelectInput
                            name="secondLanguageId"
                            labelText="Second Language"
                            labelClass="required"
                            inputClassName="ng-input"
                            value={academicDetailsForm.values.secondLanguageId}
                            onChange={onChangeSecondLanguageHandler}
                            onBlur={academicDetailsForm.handleBlur}
                            invalid={(academicDetailsForm.touched.secondLanguageId && academicDetailsForm.errors.secondLanguageId) ? true : false}
                            error={(academicDetailsForm.touched.secondLanguageId && academicDetailsForm.errors.secondLanguageId) ? academicDetailsForm.errors.secondLanguageId : ""}
                            menuItems={secondLanguage}
                            valueKey="languageId"
                            textKey="languageName"
                        />
                    </div>}

                    {academicDetailsForm.values.isThirdLanguage && <div className="col-12 col-md-6 col-lg-4 col-xxl-3">
                        <SelectInput
                            name="thirdLanguageId"
                            labelText="Third Language"
                            labelClass={academicDetailsForm.values.isThirdLanguage ? "required" : ""}
                            inputClassName="ng-input"
                            value={academicDetailsForm.values.thirdLanguageId}
                            onChange={academicDetailsForm.handleChange}
                            onBlur={academicDetailsForm.handleBlur}
                            isDisabled={isDisabledThirdLanguage}
                            invalid={(academicDetailsForm.touched.thirdLanguageId && academicDetailsForm.errors.thirdLanguageId) ? true : false}
                            error={(academicDetailsForm.touched.thirdLanguageId && academicDetailsForm.errors.thirdLanguageId) ? academicDetailsForm.errors.thirdLanguageId : ""}
                            menuItems={thirdLanguages}
                            valueKey="languageId"
                            textKey="languageName"
                        />
                    </div>}
                    <div className="col-12 col-xxl-6">
                        <TextInput
                            name="reasonForSeekingAdmission"
                            labelText="Reason for Seeking Admission"
                            inputClassName="ng-input"
                            maxLength={200}
                            value={academicDetailsForm.values.reasonForSeekingAdmission}
                            onChange={academicDetailsForm.handleChange}
                        />
                    </div>
                </div>
            </AccordionBody>
        </form>
    )
}