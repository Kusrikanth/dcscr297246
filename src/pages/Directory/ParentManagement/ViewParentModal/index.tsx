import React, {  useEffect ,useMemo, useRef } from "react";
import { shallowEqual } from "react-redux";

//Common Component

import { UncontrolledAccordion,  AccordionItem, } from "reactstrap";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

import FatherInfo from "./FatherInfo";
import MotherInfo from "./MotherInfo";
import GuardianDetail from "./GuardianDetail";

//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import {
    getOccupationAct, getQualificationAct, getDesignationsAct
} from "../../../../store/masterdata/masterdataactions";
import {
    getParentDetailsByIdAct
} from "../../../../store/directory/studentmanagement/studentmanagementactions";
import Button from "../../../../Components/Common/Button";

export default function ViewparentModal({ parentId, closeModalHndlr }: any) {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(getOccupationAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "occupation" })));
        dispatch(getDesignationsAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "DESIGNATION", sortBy: "designationName", orderBy: "asc", pageNo: 0, pageSize: 5000 })));
        dispatch(getQualificationAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "QUALIFICATIONS", pageNo: 0, pageSize: 100 })));
        if (parentId) {
            dispatch(getParentDetailsByIdAct(generateActionPayload("get_parentdetails_byid", { parentId })));
        }
    }, [parentId]);
    const { parentDetailsByIdResp, occupationResp, designationListResp, qualificationsListResp } = useAppSelector(({ masterData, directoryStudent }) => ({
        occupationResp: masterData.occupationResp,
        designationListResp: masterData.designationListResp,
        qualificationsListResp: masterData.qualificationsListResp,
        parentDetailsByIdResp: directoryStudent.parentDetailsByIdResp
    }), shallowEqual);

    return (
       <div className="tw-flex tw-flex-col">

            {/* Accordion Section */}
            <div className="tw-w-full">
                <UncontrolledAccordion
                    open="father-info"
                    defaultOpen={["father-info"]}
                    stayOpen
                >
                    <AccordionItem>
                        <FatherInfo
                            occupationResp={occupationResp}
                            designationListResp={designationListResp}
                            qualificationsListResp={qualificationsListResp}
                            parentDetails={parentDetailsByIdResp}
                        />
                    </AccordionItem>

                    <AccordionItem>
                        <MotherInfo
                            occupationResp={occupationResp}
                            designationListResp={designationListResp}
                            qualificationsListResp={qualificationsListResp}
                            parentDetails={parentDetailsByIdResp}
                        />
                    </AccordionItem>

                    <AccordionItem>
                        <GuardianDetail
                            occupationResp={occupationResp}
                            designationListResp={designationListResp}
                            qualificationsListResp={qualificationsListResp}
                            parentDetails={parentDetailsByIdResp}
                        />
                    </AccordionItem>
                </UncontrolledAccordion>
            </div>

            {/* Footer */}
            <div className="tw-w-full tw-text-right tw-mt-2">
                <Button
                    type="button"
                    onClick={closeModalHndlr}
                    variant="secondary"
                >
                    Close
                </Button>
            </div>

        </div>
    )
}