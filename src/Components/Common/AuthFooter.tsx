import React from "react";
import { Container, Col } from "reactstrap";

export const AuthFooter: React.FC<any> = () => {
    return (
        <footer className="footer tw-start-0">
            <Container>
                <div className="tw-grid tw-grid-cols-12">
                    <div className="tw-col-span-12">
                        <div className="tw-text-center">
                            <p className="tw-mb-0">&copy; 2022 DelhiPublicSchool. Powered by: <a className="tw-link-info">STA Solution Pvt Ltd</a></p>
                        </div>
                    </div>
                </div>
            </Container>
        </footer>
    )

}