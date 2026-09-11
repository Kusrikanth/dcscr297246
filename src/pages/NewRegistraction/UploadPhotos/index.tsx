import React, { useState, useEffect, useCallback, useContext, useMemo, useRef } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";
//Helper
import { StepperFormContext, stepInfo } from "../helper";
import {
    Button,
    NgFileUploader
} from "../../../Components/Common";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { getCountriesAct } from "../../../store/masterdata/masterdataactions";
import { TABS_ACTIONS } from "../helper";
import Photos from "./Photos";
import { useHistory } from "react-router-dom";

export const UploadPhotos: React.FC<any> = ({ stepId, instituteId, branchId, }) => {
    const { nextStepHndlr, tabsData, isResubmission = false, submitCurrentFormCllbck } = useContext<any>(StepperFormContext);
    const history = useHistory();
    const multiFormKeysToValidate = useRef(new Set());
    const childFormDataRef = useRef<any>({
        uploadPhotos: {
            isValid: false,
            formData: undefined,
        }
    });

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


    const storeMultiFormDataCallback = (multiFormKey: string, isValid: boolean, formData: any) => {
        if (Array.isArray(currentStepMultiFormKeys) && childFormDataRef.current[multiFormKey]) {
            let allFormsValid: boolean = true, anyFormDirty = false;
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
                    if (isResubmission) {
                        redirectHandler();
                    } else {
                        nextStepHndlr(stepId, null);
                    }
                }
            }
        }
    }

    function previousBtnHndlr(e: any) {
        multiFormKeysToValidate.current.clear();
        submitCurrentFormCllbck(currentStepMultiFormKeys, TABS_ACTIONS.PREVIOUS_TAB);
    }

    function submitHndlr(e: any) {
        multiFormKeysToValidate.current.clear();
        submitCurrentFormCllbck(currentStepMultiFormKeys, TABS_ACTIONS.NEXT_TAB);
    }

    function redirectHandler() {
        const { studentProfile } = tabsData || {},
            { regNo, registrationId } = studentProfile || {};
        history.replace(`/thank-you-page`, {
            registrationId,
            registrationNo: regNo
        });
    }

    return (
        <>
            <UncontrolledAccordion open={["documentGuidelines", "uploadPhotos"]}
                defaultOpen={["documentGuidelines", "uploadPhotos"]} stayOpen>
                <AccordionItem>
                    <AccordionHeader tag="h4" targetId="documentGuidelines">
                        DOCUMENT SUBMISSION GUIDELINES
                    </AccordionHeader>
                    <AccordionBody accordionId="documentGuidelines">
                        <div className="tw-mb-4">
                            <h6 className="text-dc-dark tw-mb-2">
                                Specifications for uploading photographs
                            </h6>
                            <ul className="guideline-container">
                                <li>Photograph must be a recent passport size Color photograph.</li>
                                <li>Ensure that the size of the scanned image is not more than 1MB.If size of the file is more than 1 MB, then adjust the settings and upload.</li>
                                <li>Dimensions 200 x 230 pixels (preferred).</li>
                                <li><b>Scanned photographs:</b>&nbsp;If you scan a photograph,<br />
                                    Set the scanner resolution to a minimum of 300 dpi (dots per inch). Crop the image in the scanner to the edge of the photograph,<br />
                                    then use MS Paint to crop the image to the correct size.</li>
                            </ul>
                        </div>
                        <div>
                            <h6 className="text-dc-dark tw-mb-2">
                                Photo Type
                            </h6>
                            <ul className="guideline-container">
                                <li>Photo should be in full colour and of high quality to avoid any visible pixels.</li>
                                <li>Photo must be taken in the last 3 months.</li>
                                <li>Have a natural expression - smiling is allowed.</li>
                                <li>Head should be positioned directly facing camera, centered and compose 80% of image. Photo should capture from slightly above top of hair to middle of chest.</li>
                                <li>Subject (candidate) is in clear focus and distinguishable from the background. Solid colour backgrounds are best.</li>
                                <li>Eyes must be open and looking at the camera. Glasses must not be tinted unless worn daily for medical purposes.</li>
                                <li>The individual's full face must be clearly visible.</li>
                            </ul>
                        </div>
                        {/* <button className="btn btn-orange">
                            Additional Guidelines
                        </button> */}
                    </AccordionBody>
                </AccordionItem>
                <AccordionItem>
                    <AccordionHeader tag="h4" targetId="uploadPhotos">
                        DOCUMENTS FOR SUBMISSION
                    </AccordionHeader>
                    <AccordionBody accordionId="uploadPhotos">
                        <Photos stepId={stepId}
                            formId="uploadPhotos"
                            instituteId={instituteId}
                            branchId={branchId}
                            storeMultiFormDataCallback={storeMultiFormDataCallback}
                        />
                    </AccordionBody>
                </AccordionItem>
            </UncontrolledAccordion>
            <div className="row mt-3">
                <div className="col-12 text-end mt-2">
                    {/* <button type="submit" className="btn btn-soft-success me-2">
                 Cancel
             </button> */}
                    <Button type="button" onClick={previousBtnHndlr} variant="previous">
                        Previous
                    </Button>
                    {!isResubmission && <Button type="button" onClick={submitHndlr} variant="secondary">
                        Next
                    </Button>}
                    {
                        isResubmission &&
                        <Button type="button" onClick={submitHndlr} variant="primary">
                            Submit
                        </Button>
                    }
                </div>
            </div>
        </>
    )
}

export default UploadPhotos;