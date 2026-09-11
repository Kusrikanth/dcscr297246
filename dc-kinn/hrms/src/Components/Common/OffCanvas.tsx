import React from "react";
import { Button, Card, CardBody, Col, Container, Offcanvas, OffcanvasBody, OffcanvasHeader, Row, UncontrolledTooltip, } from 'reactstrap';
import { Link } from 'react-router-dom';
import SimpleBar from 'simplebar-react';

export interface IOffCanvasProps {
  isOpen: boolean;
  id: string;
  headerTitle: string;
  closeHndlr: () => void;
  children: React.ReactNode;
  customClass?: string;
  width?: number; // optional width
}

export const OffCanvasContainer = (props: IOffCanvasProps) => {
  return (
    <Offcanvas
      isOpen={props.isOpen}
      direction="end"
      toggle={props.closeHndlr}
      id={props.id}
      className={`!tw-border-b ${props.customClass || ""}`}
      backdrop="static"
      style={{ width: props.width ? `${props.width}px` : undefined }}
    >
      <OffcanvasHeader toggle={props.closeHndlr} className="bg-custom-light" id={props.id}>
        {props.headerTitle}
      </OffcanvasHeader>
      {props.children}
    </Offcanvas>
  );
};
