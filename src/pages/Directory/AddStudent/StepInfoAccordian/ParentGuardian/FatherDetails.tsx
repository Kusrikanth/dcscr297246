import React, { useState } from "react";
import { Label, Input } from "reactstrap";
import { useFormik } from 'formik';
import * as Yup from "yup";
import {
    UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem,
    Collapse
} from "reactstrap";

//Common Component
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    UploadImage,
    RadioInputContainer
} from "../../../../../Components/Common";
//helper
import { yesNoOptions } from "../helper";
import FatherInfo from "./FatherInfo";
import MotherInfo from "./MotherInfo";


const validationSchema = Yup.object().shape({

});

function getFatherDetails(fatherDetail?: any): any {
    return ({
        id: "",
    })
}

export default function FatherDetails(props: any) {
   return (
        <React.Fragment>
           <div className="tw-grid tw-grid-cols-12 tw-gap-4">
               <div className="tw-col-span-12 tw-mb-3">
                   <div className="tw-border-b tw-pb-2">
                       <h5 className="tw-text-lg tw-font-semibold">
                           3. Parent Data
                       </h5>
                   </div>
               </div>
           </div>
            <UncontrolledAccordion open="father-info" defaultOpen={["father-info", "mother-info"]} stayOpen>
                <AccordionItem>
                    <FatherInfo />
                </AccordionItem>
                <AccordionItem>
                    <MotherInfo />
                </AccordionItem>
            </UncontrolledAccordion>
        </React.Fragment>

    )
}