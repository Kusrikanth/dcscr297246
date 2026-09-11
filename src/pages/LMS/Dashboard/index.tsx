import React from 'react'
import BreadCrumb from '../../../Components/Common/BreadCrumb'
import Iframe from './Iframes'

const Dashboard = () => {
  return (
    <div className="page-content transportaion_dashboard_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Dashboard" pageTitle="LMS" />

          <div className="d-inline-block w-100">
            <div className="row">
              <div className="col-12">
                <Iframe></Iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Dashboard