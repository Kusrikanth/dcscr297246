import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";
import Photos from "./photos";
//Helper

//Custom Hooks


//Action Generator

const validationSchema = Yup.object().shape({

});

function getStudentData(studentDetails?: any): any {
    return ({
        id: "",
    })
}


export const UploadPhotos: React.FC<any> = ({ stepId }) => {
    const dispatch = useDispatch();
    return (
        <UncontrolledAccordion open={["documentGuidelines", "uploadPhotos"]}
            defaultOpen={["documentGuidelines", "uploadPhotos"]} stayOpen>
            <AccordionItem>
                <AccordionHeader tag="h4" targetId="documentGuidelines">
                    DOCUMENT SUBMISSION GUIDELINES
                </AccordionHeader>
                <AccordionBody accordionId="documentGuidelines">
                    <div className="mb-4">
                        <h6 className="text-dc-dark mb-2">
                            Specifications for uploading photographs
                        </h6>
                        <ul className="guideline-container">
                            <li>Photograph must be a recent passport size Color photograph.</li>
                            <li>Maximum size 50kb allowed in JPG or JPEG format.</li>
                            <li>Dimensions 200 x 230 pixels (preferred).</li>
                            <li><b>Scanned photographs:</b>&nbsp;If you scan a photograph,<br />
                                Set the scanner resolution to a minimum of 300 dpi (dots per inch). Crop the image in the scanner to the edge of the photograph,<br />
                                then use MS Paint to crop the image to the correct size.</li>
                        </ul>
                    </div>
                    <div>
                        <h6 className="text-dc-dark mb-2">
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
                </AccordionBody>
            </AccordionItem>
            <AccordionItem>
                <AccordionHeader tag="h4" targetId="uploadPhotos">
                    DOCUMENTS FOR SUBMISSION
                </AccordionHeader>
                <AccordionBody accordionId="uploadPhotos">
                    <Photos />
                </AccordionBody>
            </AccordionItem>
        </UncontrolledAccordion>
    )
}

export default UploadPhotos;