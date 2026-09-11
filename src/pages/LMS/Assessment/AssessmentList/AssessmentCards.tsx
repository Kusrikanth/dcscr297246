import BreadCrumb from "../../../../Components/Common/BreadCrumb";
type CSSWithVars = React.CSSProperties & {
    [key: string]: string | number;
};

const AssessmentCards = () => {
    const stats = [
        {
            title: "Total Assessments",
            value: 256,
            subtitle: "Active assessments in system",
            change: "+12% vs last month",
            bgColor: "#E8F0FE",
            overlayChildColor: "#CACBF0",
            circleColor: "rgb(202 216 246 / 25%)",
            borderColor: "#93C5FD", // light blue
            valueColor: "#2563EB",
            icon: "ri-bar-chart-line",
        },
        {
            title: "In Progress",
            value: 89,
            subtitle: "Currently being processed",
            change: "73% completion rate",
            bgColor: "#FFF4E5",
            overlayChildColor: "#CACBF0",
            circleColor: "rgb(252 217 193 / 25%)",
            borderColor: "#FDBA74", // light orange
            valueColor: "#F97316",
            icon: "ri-time-line",
        },
        {
            title: "Completed",
            value: 159,
            subtitle: "Successfully finished",
            change: "+23 this week",
            bgColor: "#ECFDF5",
            overlayChildColor: "#CACBF0",
            circleColor: "rgb(180 242 222 / 25%)",
            borderColor: "#6EE7B7", // light green
            valueColor: "#059669",
            icon: "ri-check-line",
        },
        {
            title: "Published Results",
            value: 48,
            subtitle: "Results made available",
            change: "8 pending review",
            bgColor: "#EEF2FF",
            overlayChildColor: "#CACBF0",
            circleColor: "rgb(222 220 247 / 25%)",
            borderColor: "#A5B4FC", // light purple
            valueColor: "#4F46E5",
            icon: "ri-bullseye-line",
        },
    ];

    // helper to convert hex color to rgba with alpha
    const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    return (
       <div className="row g-4">
                    {stats.map((stat, index) => (
                        <div className="col-md-6 col-xl-3 assessment-list" key={index}>
                            <div
                                className="card position-relative p-3 overflow-hidden"
                                style={{
                                    backgroundColor: stat.bgColor,
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
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="fw-semibold fs-14">{stat.title}</div>
                                    <div className="position-relative">
                                        <div
                                            className="overlay-child"
                                            style={{
                                                backgroundColor: stat.circleColor,
                                                position: "absolute",
                                                width: "50px",
                                                height: "50px",
                                                top: "-12px", // adjust to center vertically
                                                right: "-10px", // adjust for horizontal spacing
                                                borderRadius: "50%",
                                                zIndex: 0,
                                            }}
                                        ></div>
                                        <div className="position-relative d-inline-block">
                                            <div
                                                className="overlay-child"
                                                style={{
                                                    backgroundColor: stat.circleColor,
                                                    position: "absolute",
                                                    width: "50px",
                                                    height: "50px",
                                                    top: "50%",
                                                    left: "50%",
                                                    transform: "translate(-50%, -50%)",
                                                    borderRadius: "50%",
                                                    zIndex: 0,
                                                    borderBottomLeftRadius: "0px"
                                                }}
                                            ></div>
                                            <span
                                                style={{
                                                    position: "relative",
                                                    zIndex: 1,
                                                    color: stat.borderColor,
                                                    fontWeight: "bold",
                                                    fontSize: "22px",
                                                }}
                                            >
                                                {stat.value}
                                            </span>
                                        </div>

                                    </div>
                                </div>


                                <p className="mb-0 text-muted">{stat.subtitle}</p>
                                <div
                                    className="mt-2 small d-flex align-items-center fw-semibold"
                                    style={{ color: stat.valueColor }}
                                >
                                    <i className="ri-arrow-up-line me-1"></i>
                                    {stat.change}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
    );
};

export default AssessmentCards;
