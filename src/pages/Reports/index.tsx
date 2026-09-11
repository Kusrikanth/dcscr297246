import { Container, Card, CardBody } from "reactstrap";

//Common Component
import BreadCrumb from "../../Components/Common/BreadCrumb";

const Reports = () => {
    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb title="Reports" pageTitle="DPS" />
                <Card>
                    <CardBody>
                        <div className="tw-flex tw-justify-between tw-items-center tw-px-2">
                            Reports Screen
                        </div>
                    </CardBody>
                </Card>
            </Container>
        </div>
    )
}

export default Reports;