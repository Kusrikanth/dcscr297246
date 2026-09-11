import React, { useState, useContext, useEffect, useMemo, useRef, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { Label, Input } from "reactstrap";
//Common Component
import { ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput } from "../../../../../../../Components/Common";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";
import GuardianDetail, { getGuardianInitialState } from "./GuardianDetail";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../../../hooks/storehook";

import FatherInfo, { getFatherInfoInitialState } from "./FatherInfo";
import MotherInfo, { getMotherInfoInitialState } from "./MotherInfo";
//Action Generator
import { generateActionPayload } from "../../../../../../../utility/reduxutility";
import {
    getOccupationAct, getQualificationAct, getDesignationsAct
} from "../../../../../../../store/masterdata/masterdataactions";
import { TABS_ACTIONS, StepperFormContext, stepInfo } from "../../helper";
import {
    getContributeStakeholderAct
} from "../../../../../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";
import {
    updateParentDetailsAct
} from "../../../../../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";

export const ParentGuardian: React.FC<any> = ({ branchId, instituteId, stepId, academicYearId }) => {
    const { submitCurrentFormCllbck } = useContext<any>(StepperFormContext);
    const [nextTypeState, setNextTypeState] = useState<any>(undefined);
    const childFormKeys = useRef<any>(null);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(getOccupationAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "occupation" })));
        dispatch(getDesignationsAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "DESIGNATION", sortBy: "designationName", orderBy: "asc", pageNo: 0, pageSize: 5000 })));
        dispatch(getQualificationAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "QUALIFICATIONS", pageNo: 0, pageSize: 5000 })));
        dispatch(getContributeStakeholderAct(generateActionPayload("contribute_stakeholder", undefined, { instituteId })));
    }, []);

    const currentStepMultiFormKeys = useMemo(() => {
        if (stepId) {
            const { multiFormKeys } = stepInfo.find(item => item.id === stepId) || {};
            if (Array.isArray(multiFormKeys)) {
                return multiFormKeys;
            }
            return [];
        }
        return [];
    }, [stepId]);
    const multiFormKeysToValidate = useRef(new Set());
    const childFormDataRef = useRef<any>({
        fatherInfo: {
            isValid: false,
            formData: undefined,
        },
        motherInfo: {
            isValid: false,
            formData: undefined
        },
        guardianInfo: {
            isValid: false,
            formData: undefined
        }
    });


    const { occupationResp, designationListResp, qualificationsListResp,
        contributeStakeHolderResp, updateParentDetailsResp } = useAppSelector(({ masterData,
            admissionRegistration }) => ({
                occupationResp: masterData.occupationResp,
                designationListResp: masterData.designationListResp,
                qualificationsListResp: masterData.qualificationsListResp,
                contributeStakeHolderResp: admissionRegistration.contributeStakeHolderResp,
                updateParentDetailsResp: admissionRegistration.updateParentDetailsResp
            }), shallowEqual);

    const studentInfoRespRef = useRef({
        prevUpdateParentDetailsResp: updateParentDetailsResp
    });

    useEffect(() => {
        const { prevUpdateParentDetailsResp } = studentInfoRespRef.current;
        if (updateParentDetailsResp && prevUpdateParentDetailsResp !== updateParentDetailsResp) {
            toast.success("Parent details submitted successfully.");

        }
    }, [updateParentDetailsResp]);


    function previousBtnHndlr(e: any) {
        submitCurrentFormCllbck(["fatherDetails", "motherDetails", "guardianDetails"], TABS_ACTIONS.PREVIOUS_TAB);
    }

    function submitParentDetailsApiCall() {
        const formDetails: any = childFormDataRef.current;
        const payload = Object.keys(formDetails).reduce((obj, item) => {
            Object.assign(obj, formDetails[item]?.formData);
            return obj
        }, {});
        const params = { studentId: "35690" };
        dispatch(updateParentDetailsAct(generateActionPayload("add_parent_details", params, payload)));
    }

    const storeMultiFormDataCallback = useCallback((multiFormKey: string, isValid: boolean, formData: any) => {
        if (Array.isArray(currentStepMultiFormKeys) && childFormDataRef.current[multiFormKey]) {
            let allFormsValid: boolean = true;
            childFormDataRef.current[multiFormKey] = {
                isValid,
                formData
            }
            multiFormKeysToValidate.current.add(multiFormKey);
            if (multiFormKeysToValidate.current.size === currentStepMultiFormKeys.length) {
                for (let i = 0; i < currentStepMultiFormKeys.length; i++) {
                    if (allFormsValid && !childFormDataRef.current[currentStepMultiFormKeys[i]].isValid) {
                        allFormsValid = false;
                        break;
                    }
                }
                if (allFormsValid) {
                    submitParentDetailsApiCall();
                } else {
                    for (let i = 0; i < currentStepMultiFormKeys.length; i++) {
                        childFormDataRef.current[currentStepMultiFormKeys[i]].isValid = false;
                    }
                }
            }
        }
    }, [currentStepMultiFormKeys]);


    function submitHndlr(e: any) {
        submitCurrentFormCllbck(currentStepMultiFormKeys, TABS_ACTIONS.NEXT_TAB);
    }

    return (
        <div className="row">
            {/* <div className="col-12 d-flex align-items-center mb-2">
                <h5 className="mb-1 me-4">{props.titleName || "Parent/Guardian"}</h5>
                <SelectInput
                    name="branchTypeId"
                    value={guardianTypeState}
                    onChange={onChangeGuardianHndlr}
                    formgroupClassName="mb-0"
                    menuItems={[{ id: "parent", name: "Parent" }, { id: "guardian", name: "Guardian" }]}
                    hideSelectOption={true}
                    valueKey="id"
                    textKey="name"
                />
            </div> */}
            {/* {(guardianTypeState === "parent") && <FatherDetails />}
                {(guardianTypeState === "guardian") && <GuardianDetail />} */}
            <div className="col-12 mb-3">
                <div className="border-bottom">
                    {/* <span className="fs-normal fw-bold d-block mb-2">3. {(guardianTypeState === "parent") ? "Parent Details" : "Guardian Details"}</span> */}
                    <span className="fs-normal fw-bold d-block mb-2">3. Parent Data</span>

                </div>

            </div>
            <div className="col-12">
                <UncontrolledAccordion open={["father-info", "mother-info",
                    "guardian-info"]}
                    defaultOpen={["father-info", "mother-info",
                        "guardian-info"]}
                    stayOpen>
                    <AccordionItem>
                        <FatherInfo
                            formId="fatherInfo"
                            occupationResp={occupationResp}
                            designationListResp={designationListResp}
                            qualificationsListResp={qualificationsListResp}
                            stakeHolderList={contributeStakeHolderResp}
                            storeMultiFormDataCallback={storeMultiFormDataCallback}
                        />
                    </AccordionItem>
                    <AccordionItem>
                        <MotherInfo
                            formId="motherInfo"
                            occupationResp={occupationResp}
                            designationListResp={designationListResp}
                            qualificationsListResp={qualificationsListResp}
                            stakeHolderList={contributeStakeHolderResp}
                            storeMultiFormDataCallback={storeMultiFormDataCallback}
                        />
                    </AccordionItem>
                    <AccordionItem>
                        <GuardianDetail
                            formId="guardianInfo"
                            occupationResp={occupationResp}
                            designationListResp={designationListResp}
                            qualificationsListResp={qualificationsListResp}
                            stakeHolderList={contributeStakeHolderResp}
                            storeMultiFormDataCallback={storeMultiFormDataCallback}
                        />
                    </AccordionItem>
                </UncontrolledAccordion>
            </div>
            <div className="col-12 text-end mt-2">
                <button type="button" onClick={previousBtnHndlr} className="btn btn-soft-success me-2">
                    Previous
                </button>
                <button type="button" onClick={submitHndlr} className="btn btn-success">
                    Next
                </button>
            </div>
        </div >
    )
}