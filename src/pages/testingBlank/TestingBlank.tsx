import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Input, Label, Row, Button, Form, FormFeedback, Alert } from 'reactstrap';
import { withRouter } from "react-router-dom";

const TestingBlank = () => {
    // document.title = "Basic SignIn | Velzon - React Admin & Dashboard Template";
    return (
        <React.Fragment>
            <div className="auth-page-content">
                <Container>
                    <Row>
                        <Col lg={12}>
                            <div className="text-center mt-sm-5 mb-4">
                                Testin Blank Layout
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default withRouter(TestingBlank);