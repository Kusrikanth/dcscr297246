import React from "react";
import { AccordionBody } from "reactstrap";

const AccordionCardBody = (props: any) => {
  return (
    <AccordionBody accordionId={props.accordionId} style={props.style}>
      {props.children}
    </AccordionBody>
  );
};

export default AccordionCardBody;