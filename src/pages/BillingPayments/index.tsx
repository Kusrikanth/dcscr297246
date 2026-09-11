import { Container, Card, CardBody } from "reactstrap";

//Common Component
import BreadCrumb from "../../Components/Common/BreadCrumb";

const BillingPayments = () => {
    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb title="Billing And Payments" pageTitle="DPS" />
                <Card>
                    <CardBody>
                        <div className="tw-flex tw-justify-between tw-items-center tw-px-2">
                            Billing And Payments Screen
                        </div>
                    </CardBody>
                </Card>
            </Container>
        </div>
    )
}

export default BillingPayments;