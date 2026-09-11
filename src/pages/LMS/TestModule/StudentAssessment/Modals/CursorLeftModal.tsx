import { default as RejectSvg } from "../../../../../assets/imagesdps/academics/confirmation-icon.svg?react";

const CursorLeftModal = ({ onOkay }) => (
  <div className="modal-body p-0 pt-2">
    <div className="tw-flex tw-flex-col tw-items-center tw-justify-center p-3">
      <div className="mb-3 text-center">
        <div className="tw-flex tw-mb-3 justify-content-center">
          <RejectSvg width="52px" height="52px" />
        </div>
        <h4 className="mb-2">Cursor Left Exam Window</h4>
        <p className="mb-0 text-muted fs-12">
          Keep your mouse inside the exam window. Move the cursor back to
          continue.
        </p>
      </div>
    </div>
    <div className="p-3 tw-border-t">
      <div className="tw-flex tw-justify-center">
        <button className="btn btn-danger" onClick={onOkay}>
          Okay
        </button>
      </div>
    </div>
  </div>
);

export default CursorLeftModal;
