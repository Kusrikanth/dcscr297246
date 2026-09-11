import React, { useState, useContext, useEffect, useMemo, useRef } from "react";
import { shallowEqual } from "react-redux";
import { Label, Input } from "reactstrap";
//Common Component
import { ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput } from "../../../../../Components/Common";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

import FatherDetails from "./FatherDetails";
import GuardianDetail, { getGuardianInitialState } from "./GuardianDetail";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";

import { StepperFormContext } from "../../helper";
import FatherInfo, { getFatherInfoInitialState } from "./FatherInfo";
import MotherInfo, { getMotherInfoInitialState } from "./MotherInfo";
//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import {
    getOccupationAct, getQualificationAct, getDesignationsAct,
    getMasterIncomeAct
} from "../../../../../store/masterdata/masterdataactions";
import { TABS_ACTIONS } from "../../helper";
import Button from "../../../../../Components/Common/Button";

export const ParentGuardian: React.FC<any> = (props) => {
    const { submitCurrentFormCllbck, updateFormKeyDataHndlr, storeMultiFormData } = useContext<any>(StepperFormContext);
    const [guardianTypeState, setGuradianTypeState] = useState<any>("parent");
    const [nextTypeState, setNextTypeState] = useState<any>(undefined);
    const childFormKeys = useRef<any>(null);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(getOccupationAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "occupation" })));
        dispatch(getDesignationsAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "DESIGNATION", sortBy: "designationName", orderBy: "asc", pageNo: 0, pageSize: 5000 })));
        dispatch(getQualificationAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "QUALIFICATIONS", pageNo: 0, pageSize: 2000 })));
        dispatch(getMasterIncomeAct(generateActionPayload("get_master_income")));
        
    }, []);
    const { occupationResp, designationListResp, qualificationsListResp } = useAppSelector(({ masterData }) => ({
        occupationResp: masterData.occupationResp,
        designationListResp: masterData.designationListResp,
        qualificationsListResp: masterData.qualificationsListResp,
    }), shallowEqual);

    function onChangeGuardianHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        // setGuradianTypeState(value);
        setNextTypeState(value);
        if (value === "parent") {
            childFormKeys.current = ["guardianDetails"];
        } else if (value === "guardian") {
            childFormKeys.current = ["fatherDetails", "motherDetails"];
        }
    }

    function submitHndlr(e: any) {
        // if (guardianTypeState === "parent") {
        //     updateFormKeyDataHndlr("guardianDetails", getGuardianInitialState(undefined));
        // } else {
        //     updateFormKeyDataHndlr("fatherDetails", getFatherInfoInitialState(undefined));
        //     updateFormKeyDataHndlr("motherDetails", getMotherInfoInitialState(undefined));
        // }
        submitCurrentFormCllbck(["fatherDetails", "motherDetails", "guardianDetails"], TABS_ACTIONS.NEXT_TAB);
    }
    function previousBtnHndlr(e: any) {
        submitCurrentFormCllbck(["fatherDetails", "motherDetails", "guardianDetails"], TABS_ACTIONS.PREVIOUS_TAB);
    }



    // const activeComponet = useMemo(() => {
    //     if (guardianTypeState === "parent") {
    //         return (
    //             <>
    //                 <AccordionItem>
    //                     <FatherInfo occupationResp={occupationResp} />
    //                 </AccordionItem></>
    //         )
    //     } else {

    //     }
    // }, [guardianTypeState]);

    function updateGuardianTypeHndlr(validatedKeys?: any) {
        var currentFormKeys = childFormKeys.current;
        if (Array.isArray(currentFormKeys)) {
            const indexOfKey = currentFormKeys.indexOf(validatedKeys);
            if (indexOfKey >= 0) {
                currentFormKeys.splice(indexOfKey, 1);
                childFormKeys.current = currentFormKeys;
            }
        }
        if (Array.isArray(currentFormKeys) && currentFormKeys.length === 0) {
            setGuradianTypeState(nextTypeState);
        }
        setNextTypeState(undefined);
    }

    return (
        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
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
            <div className="tw-col-span-12 tw-mb-3">
                <div className="tw-border-b">
                    <span className="tw-text-base tw-font-bold tw-block tw-mb-2">
                        3. Parent Guardian Details
                    </span>
                </div>
            </div>
            <div className="tw-col-span-12">
                <UncontrolledAccordion
                    open="father-info"
                    defaultOpen={["father-info", "mother-info", "guardian-info"]}
                    stayOpen
                >
                    <AccordionItem>
                        <FatherInfo
                            occupationResp={occupationResp}
                            designationListResp={designationListResp}
                            qualificationsListResp={qualificationsListResp}
                        />
                    </AccordionItem>
                    <AccordionItem>
                        <MotherInfo
                            occupationResp={occupationResp}
                            designationListResp={designationListResp}
                            qualificationsListResp={qualificationsListResp}
                        />
                    </AccordionItem>
                    <AccordionItem>
                        <GuardianDetail
                            occupationResp={occupationResp}
                            designationListResp={designationListResp}
                            qualificationsListResp={qualificationsListResp}
                        />
                    </AccordionItem>
                </UncontrolledAccordion>
            </div>

            <div className="tw-col-span-12 tw-text-right tw-mt-2">
                <Button
                    type="button"
                    onClick={previousBtnHndlr}
                    variant="secondary"
                >
                    Previous
                </Button>
                <Button
                    type="button"
                    onClick={submitHndlr}
                    variant="primary"
                >
                    Next
                </Button>
            </div>
        </div >
    )
}