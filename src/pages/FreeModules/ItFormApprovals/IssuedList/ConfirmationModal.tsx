import { default as AllowSvg } from "../../../../assets/imagesdps/academics/AllowSvg.svg?react";
import { useDispatch } from "react-redux";
import { sentItFormAct } from "../../../../store/fee/feeapprovals/feeapprovalactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import Button from "../../../../Components/Common/Button";
const ConfirmationModal = (props:any) => {

  const dispatch=useDispatch();

  const submitHandler=()=>{
    dispatch(sentItFormAct(generateActionPayload('sent_it_form',{itFormId:props.itFormId})));
  }

  return (
    <>
      <div className="tw-flex tw-flex-col tw-items-center tw-p-4">
        <div className="tw-flex tw-mb-3">
          <AllowSvg className="tw-mr-2 tw-inline-block" width="70px" height="70px" />
        </div>

        <h5 className="tw-mb-3 tw-text-lg tw-font-semibold">
          Are you sure?
        </h5>

        <h6 className="tw-font-normal tw-mb-4 tw-text-gray-700">
          You want to send this IT Form!
        </h6>
      </div>

<div className="tw-flex tw-justify-end tw-gap-4 tw-mx-4 tw-my-3">
  <Button
    type="button"
    variant="secondary"
    onClick={() => props.toggle()}
  >
    Cancel
  </Button>

  <Button
    type="submit"
    variant="primary"
    onClick={submitHandler}
  >
    Submit
  </Button>
</div>

    </>
  );
};

export default ConfirmationModal;
