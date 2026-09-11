
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import PaymentReceived from "./PaymentReceived";

const FeePaymentsRecords = () => {
  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Fee Payments" pageTitle="Fee" />

          <div className="card">
            <div className="card-header">
              <div className="tw-flex tw-items-center">
                <div className="tw-w-1/2">
                  <h4 className="card-title tw-mb-0 tw-flex-grow">
                    Fee Payments Records
                  </h4>
                </div>
              </div>
            </div>
            <PaymentReceived />
          </div>
        </div>
      </div>
    </>
  );
};

export default FeePaymentsRecords;
