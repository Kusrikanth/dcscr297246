import { Container, Card, CardBody } from "reactstrap";

//Common Component
import BreadCrumb from "../../Components/Common/BreadCrumb";

const HelpDesk = () => {
    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb title="Help Desk" pageTitle="DPS" />
                <Card>
                    <CardBody>
                        <div className="tw-flex tw-justify-between tw-items-center tw-px-2">
                            Help Desk Screen
                        </div>
                    </CardBody>
                </Card>
            </Container>
        </div>
    )
}

export default HelpDesk;