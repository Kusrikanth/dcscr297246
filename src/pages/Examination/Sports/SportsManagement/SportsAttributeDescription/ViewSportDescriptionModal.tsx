const ViewSportDescriptionModal = ({ isOpen, toggle, data }) => {
  if (!isOpen) return null;

  const { gradesAndDescriptions } = data;

  return (
    <div style={{ padding: "1.25rem" }}>
      <div className="row tw-mb-3 tw-p-2 tw-rounded tw-bg-slate-100">
        <div className="col-md-4">
          <p className="mb-0">Grade</p>
        </div>
        <div className="col-md-4">
          <p className="mb-0">Description</p>
        </div>
        <div className="col-md-4">
          <p className="mb-0">Label</p>
        </div>
      </div>
      <div className="tw-px-2">
        {gradesAndDescriptions.map((item) => (
          <div className="row">
            <div className="col-md-4 mb-3">
              <p className="">{item.grade}</p>
            </div>

            <div className="col-md-4 mb-3">
              <p>{item.description}</p>
            </div>

            <div className="col-md-4 mb-3">
              <p>{item.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="row">
        <div className="d-flex ms-auto w-auto">
          <button className="btn btn-light me-3" onClick={toggle}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewSportDescriptionModal;
