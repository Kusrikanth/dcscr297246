import { Container, Card, CardBody } from "reactstrap";

//Common Component
import BreadCrumb from "../../Components/Common/BreadCrumb";

const Communications = () => {
    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb title="Communications" pageTitle="DPS" />
                <Card>
                    <CardBody>
                        <div className="d-flex justify-content-between align-items-center px-2">
                            Communications Screen
                        </div>
                    </CardBody>
                </Card>
            </Container>
        </div>
    )
}

export default Communications;