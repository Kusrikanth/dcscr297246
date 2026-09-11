import { useFormik } from "formik";
import { StatusLabel, TextInput, UserDetails } from "../../../Components/Common";
const initialValues = {
  searchString: "",
}
const AdvanceFilterModal = (props: any) => {
  const stats = [
    {
      title: "Total Assigend",
      value: 120,
      change: "Total Assigned Students",
      bgColor: "#E8F0FE",
      overlayChildColor: "#CACBF0",
      circleColor: "rgb(202 216 246 / 25%)",
      borderColor: "#93C5FD",
      valueColor: "#2563EB",
      icon: "ri-bar-chart-line",
    },
    {
      title: "Eligible",
      value: 116,
      change: "Total Eligible Students",
      bgColor: "#FFF4E5",
      overlayChildColor: "#CACBF0",
      circleColor: "rgb(252 217 193 / 25%)",
      borderColor: "#FDBA74",
      valueColor: "#F97316",
      icon: "ri-time-line",
    },
    {
      title: "Not Eligible",
      value: 24,
      change: "Not Eligible Students",
      bgColor: "#ECFDF5",
      overlayChildColor: "#CACBF0",
      circleColor: "rgb(180 242 222 / 25%)",
      borderColor: "#6EE7B7",
      valueColor: "#059669",
      icon: "ri-check-line",
    },
    {
      title: "Resolved",
      value: 3,
      change: "Resolved Students",
      bgColor: "#FEF2F2",
      overlayChildColor: "#CACBF0",
      circleColor: "rgb(254 202 202 / 25%)",
      borderColor: "#FCA5A5",
      valueColor: "#DC2626",
      icon: "ri-plug-line",
    },
  ];
  const students = [
    {
      id: "STU001",
      name: "Alice Johnson",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      status: { type: "success", label: "Eligible" },
      resloved: "1/5"
    },
    {
      id: "STU002",
      name: "Brian Smith",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      status: { type: "warning", label: "Not Eligible" },
      resloved: "2/5"
    },
    {
      id: "STU003",
      name: "Chloe Williams",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg",
      status: { type: "info", label: "Pending" },
      resloved: "3/5"
    },
    {
      id: "STU004",
      name: "Daniel Brown",
      avatar: "https://randomuser.me/api/portraits/men/85.jpg",
      status: { type: "danger", label: "Resolved" },
      resloved: "4/5"
    },
  ];

  const questionTypesForm = useFormik({
    initialValues,
    onSubmit: (values) => {
    },
  });
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <>
      <div className="offcanvas-body">
        <div className="row g-4 mt-2">
          {stats.map((stat, index) => (
            <div className="col-12 col-md-6 mt-0 assessment-list" key={index}>
              <div
                className="card position-relative p-3 overflow-hidden"
                style={{
                  borderTop: `4px solid ${stat.borderColor}`,
                  borderRadius: "10px",
                  boxShadow: `0px 4px 12px ${hexToRgba(stat.borderColor, 0.4)}`,
                }}
              >
                <div
                  className="overlay-child"
                  style={{
                    backgroundColor: stat.circleColor,
                  }}
                ></div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="fw-semibold fs-14">{stat.title}</div>
                  <div className={`tw-w-10 tw-h-10 tw-rounded-full tw-bg-white tw-flex tw-items-center tw-justify-center tw-font-semibold`}
                    style={{ color: stat.valueColor }}
                  >
                    {stat.value}
                  </div>
                </div>
                <div
                  className="mt-2 small d-flex align-items-center fw-semibold"
                  style={{ color: stat.valueColor }}
                >
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="row">
          <div className="col-12">
            <div className="search-box">
              <TextInput
                name="searchString"
                formgroupClassName="mb-0"
                placeHolder="Search..."
                value={questionTypesForm.values.searchString}
                onChange={questionTypesForm.handleChange}
                labelText="Search"
                floatingLabel
              />
              <i className="ri-search-line search-icon"></i>
            </div>
          </div>
        </div>
        <div className="row mt-3 bg-light p-3">
          <div className="col-6">
            <div className="hstack">
              <h6 className="form-label required me-2">Student Name</h6>
            </div>
          </div>
          <div className="col-4">
            <h6 className="form-label required">
              Status
            </h6>
          </div>
          <div className="col-2">
            Resloved
          </div>
        </div>
        {students.map((student, index) => (
          <div className="row mt-3" key={index}>
            <div className="col-6">
              <UserDetails
                showAvatar
                imageUrl={student.avatar}
                displayName={student.name}
                displayId={student.id}
                size="xs"
              />
            </div>
            <div className="col-4">
              <StatusLabel
                type={student.status.type}
                labelName={student.status.label}
              />
            </div>
            <div className="col-2">
              {student.resloved}
              </div>
          </div>
        ))}
      </div>
      <div className="border-top p-2 text-center">
        <div className="hstack gap-2 justify-content-end">
          <button type="submit" onClick={props.toggle} className="btn btn-light">
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default AdvanceFilterModal;
