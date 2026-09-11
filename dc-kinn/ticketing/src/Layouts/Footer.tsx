import React from 'react';
import { shallowEqual } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';
import { useAppSelector } from '../hooks/storehook';

const Footer = () => {
    const { currentInstIdResp: instituteId, instituteListResp } =
        useAppSelector(({ appData, instituteInfo }) => ({
            currentInstIdResp: appData.currentInstIdResp,
            instituteListResp: instituteInfo.instituteListResp
        }), shallowEqual);
    const { instituteName } = instituteListResp?.data?.find((item: any) => item.id === +instituteId) || {};
    return (
        <React.Fragment>
            <footer className="footer">
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-6'>
                            {new Date().getFullYear()} © {instituteName}.
                        </div>
                        <div className='col-6'>
                            <div className="text-sm-end d-none d-sm-block">
                                Powered by <a className="fw-medium link-info">STA Solutions Pvt Ltd.</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </React.Fragment>
    );
};

export default Footer;