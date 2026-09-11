import React from "react";
import { AccordionItem } from "reactstrap";

const AccordionCardItem = (props: any) => {
  return <AccordionItem>{props.children}</AccordionItem>;
};

export default AccordionCardItem;