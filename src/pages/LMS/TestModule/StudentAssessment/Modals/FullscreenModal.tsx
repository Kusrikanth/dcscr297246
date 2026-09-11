import { default as RejectSvg } from "../../../../../assets/imagesdps/academics/confirmation-icon.svg?react";

const FullscreenModal = ({ onReturn, onAcknowledge }) => (
  <div className="modal-body p-0 pt-2">
    <div className="tw-flex tw-flex-col tw-items-center tw-justify-center p-3">
      <div className="mb-3 text-center">
        <div className="tw-flex tw-mb-3 justify-content-center">
          <RejectSvg width="52px" height="52px" />
        </div>
        <h4 className="mb-2">Fullscreen Mode Required</h4>
        <p className="mb-0 text-muted fs-12">
          You left fullscreen. The exam must stay in fullscreen at all times.
          Resuming in 10s once fullscreen restored.
        </p>
      </div>
    </div>
    <div className="p-3 tw-border-t">
      <div className="tw-flex tw-gap-2 tw-justify-center">
        <button className="btn btn-success" onClick={onReturn}>
          Return to Fullscreen
        </button>
        <button
          className="btn btn-outline-light !tw-text-gray-700 !tw-border-gray-400"
          onClick={onAcknowledge}
        >
          I Understand
        </button>
      </div>
    </div>
  </div>
);

export default FullscreenModal;
