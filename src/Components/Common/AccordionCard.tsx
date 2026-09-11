import React from "react";
import { Row, Col } from "reactstrap";
import { Accordion } from "reactstrap";
interface Props {
  title: string;
}
interface AccordionProps {
  accrodionClass?: string;
  // eslint-disable-next-line no-restricted-globals
  open: string | string[];
  toggleHandler: (accordionItem: any) => void;
  children: React.ReactNode;
}

const AccordionCard = (props: AccordionProps) => {
  return (
    <Accordion
      open={props.open}
      {...{
        toggle: props.toggleHandler,
      }}
      className={props.accrodionClass && props.accrodionClass}
    >
      {props.children}
    </Accordion>
  );
};

export default AccordionCard;
