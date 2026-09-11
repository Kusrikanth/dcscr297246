import React from "react";
import { Card, CardHeader, CardBody, Row, Col, Container } from "reactstrap";
import BookIconWithInfo from "./BookIconWithInfo";
import { MoreActions } from "./MenuOptions";

// const actionOptions = [
//   {
//     id: "delete",
//     actionIcon: <i className="text-danger ri-delete-bin-5-fill fs-16"></i>,
//     actionName: "Delete",
//   },
// ];

interface ObjectProps {
  id?: any;
  cardName: string;
  subName: string;
  image: any;
  color: string;
}

interface Props {
  data: ObjectProps;
  key: number;
  actionOptions?: any;
}

const BookmarkCard = ({ data, key, actionOptions }: Props) => {
  return (
    <div className="bookmark_card_wrapper" key={key}>
      <Card>
        <CardBody>
          <Row>
            <Col xs="8">
              <BookIconWithInfo
                cardName={data?.cardName}
                subName={data?.subName}
                image={data?.image}
                color={data?.color}
              />
            </Col>
            <Col xs="4">
              <div className="option_button_wrapper">
                <MoreActions actionOptions={actionOptions} rowId={data.id} />
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default BookmarkCard;
