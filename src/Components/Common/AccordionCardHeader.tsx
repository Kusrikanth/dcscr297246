import React, { ReactNode } from "react";
import { Row, Col, AccordionHeader } from "reactstrap";

interface AccordionHeaderProps {
  targetId: string;
  title: ReactNode;
  accordionHeaderClass?: string;
  titleClass?: string;
}
const AccordionCardHeader = (props: AccordionHeaderProps) => {
  return (
    <AccordionHeader
      targetId={props.targetId}
      className={props.accordionHeaderClass && props.accordionHeaderClass}
    >
      <span className={props.titleClass}>{props.title}</span>
      {/* {props.title} */}
    </AccordionHeader>
  );
};

export default AccordionCardHeader;