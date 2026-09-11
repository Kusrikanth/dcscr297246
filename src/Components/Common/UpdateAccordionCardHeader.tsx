import React from "react";
import { Row, Col, AccordionHeader } from "reactstrap";
import { Checkbox } from "./Checkbox";

interface AccordionHeaderProps {
  targetId: string;
  title: string;
  accordionHeaderClass?: string;
  titleClass?: string;
  showCheckbox?: boolean;
  extraDetails?: any;
  checkedBoxHandler?: any;
}
const UpdateAccordionCardHeader = (props: AccordionHeaderProps) => {
  return (
    <AccordionHeader
      targetId={props.targetId}
      className={props.accordionHeaderClass && props.accordionHeaderClass}
    >
      <div className="tw-flex tw-items-center tw-w-full">
        {props.showCheckbox && (
          <Checkbox
            onClick={(e: any) => {
              e.stopPropagation();
            }}
            onChange={(e: any) => props.checkedBoxHandler(e, props.title)}
          />
        )}
        <span className={props.titleClass}>{props.title}</span>
        <span className="tw-ms-auto tw-text-blue-500 tw-pe-4">{`[ ${props.extraDetails.totalRoutes} ]`}</span>
      </div>
    </AccordionHeader>
  );
};

export default UpdateAccordionCardHeader;
