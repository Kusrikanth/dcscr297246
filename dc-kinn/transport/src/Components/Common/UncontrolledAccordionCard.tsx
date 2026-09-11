import React from 'react'
import { UncontrolledAccordion } from "reactstrap";

interface UncontrolledAccordionProps {
  defaultOpen: string[];
  children: any;
}

const UncontrolledAccordionCard = (props: UncontrolledAccordionProps) => {
  return <UncontrolledAccordion defaultOpen={props?.defaultOpen} open="default" stayOpen>
    {props.children}
  </UncontrolledAccordion>;
}

export default UncontrolledAccordionCard