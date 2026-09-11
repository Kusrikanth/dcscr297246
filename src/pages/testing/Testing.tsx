
import React from 'react';
import { Col, Container, Row } from 'reactstrap';
//import COmponents
import BreadCrumb from '../../Components/Common/BreadCrumb';

const Testing = () => {
    // document.title = "Analytics | Velzon - React Admin & Dashboard Template";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Page" pageTitle="Sub Page" />
                    <Row>
                        <Col xxl={5}>
                            <div>Testing</div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Testing;