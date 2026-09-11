import React from "react";
import { useHistory } from "react-router-dom";
import { Row, Col } from "reactstrap";

interface Props {
  title: string;
  link?: string;
  otherDetails?:any;
}

const BackButtonText = ({ title, link, otherDetails }: Props) => {
  const history = useHistory();
  return (
    <div>
      <div className="tw-flex tw-mb-3">
        <h6 className="text-primary tw-cursor-pointer tw-mb-0" onClick={() => {
          history.push(`${link}`,otherDetails)
        }}>{title}</h6>
      </div>
    </div>
  );
};

export default BackButtonText;
