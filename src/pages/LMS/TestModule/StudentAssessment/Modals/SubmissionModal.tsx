import { default as ApproveSvg } from "../../../../../assets/imagesdps/academics/ApproveSvg.svg?react";

const SubmissionSuccessModal = ({ toggle }) => (
  <div className="modal-body p-0 pt-2">
    <div className="tw-flex tw-flex-col">
      <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-border-b px-3 py-2">
        <div className="tw-flex tw-mb-3 justify-content-center">
          <ApproveSvg width="52px" height="52px" fill="#0ab39c" />
        </div>
        <h4 className="mb-1">Submission successful</h4>
        <p className="mb-0 text-muted fs-12">
          Your answers have been recorded.
        </p>
      </div>
      <div className="tw-grid tw-gap-y-1 p-3">
        <div className="row tw-flex tw-items-center tw-mb-0">
          <div className="col-5 tw-text-gray-500">Student</div>
          <div className="col-7 tw-text-base tw-font-medium">: Chinmay Mathur</div>
        </div>
        <div className="row tw-flex tw-items-center tw-mb-0">
          <div className="col-5 tw-text-gray-500">Student ID</div>
          <div className="col-7 tw-text-base tw-font-medium">: 1231463</div>
        </div>
        <div className="row tw-flex tw-items-center tw-mb-0">
          <div className="col-5 tw-text-gray-500">Class / Section</div>
          <div className="col-7 tw-text-base tw-font-medium">: 10 - C</div>
        </div>
        <div className="row tw-flex tw-items-center tw-mb-0">
          <div className="col-5 tw-text-gray-500">Attempt ID</div>
          <div className="col-7 tw-text-base tw-font-medium">: AT:2025-08-24-1231463</div>
        </div>
        <div className="row tw-flex tw-items-center tw-mb-0">
          <div className="col-5 tw-text-gray-500">Submitted At</div>
          <div className="col-7 tw-text-base tw-font-medium">: 24 Aug 2025, 10:38 AM IST</div>
        </div>
        <div className="row tw-flex tw-items-center tw-mb-0">
          <div className="col-5 tw-text-gray-500">Result publication</div>
          <div className="col-7 tw-text-base tw-font-medium">: Sun, 24 Aug 2025, 12:00 PM IST</div>
        </div>
      </div>
    </div>
    <div className="p-3 tw-border-t">
      <div className="tw-flex tw-justify-center">
        <button className="btn btn-success" onClick={toggle}>
          Back to Home
        </button>
      </div>
    </div>
  </div>
);

export default SubmissionSuccessModal;
