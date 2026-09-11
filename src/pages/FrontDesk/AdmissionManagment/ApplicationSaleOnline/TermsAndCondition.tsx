
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";

const TermsAndCondition = (props: any) => {

  const {
    getRegistrationInstructionResp,

  } = useAppSelector(
    ({ admissionAvailabilityRequest }) => ({
      getRegistrationInstructionResp: admissionAvailabilityRequest.getRegistrationInstructionResp,
    }),
    shallowEqual
  );
  return (
    <>
      <div>
        {getRegistrationInstructionResp && (
          <div
            dangerouslySetInnerHTML={{
              __html: getRegistrationInstructionResp || ''
            }}
            className='mb-4 w-100'>
          </div>
        )}
      </div>
      <div className="terms-new-container">
        <div className="inner-terms-container m-0 py-2">
          <div className="button-container mt-0">
            <button className="button  py-2 px-4" onClick={props.toggle}>Proceed</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsAndCondition;
