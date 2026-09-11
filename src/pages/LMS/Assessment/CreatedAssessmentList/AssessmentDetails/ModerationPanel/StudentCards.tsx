import { PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import { useModal } from "../../../../../../hooks/modalhook";
import { ModalContainerUpdated } from "../../../../../../Components/Common";
import AddModratores from "./AddModratores";

const StudentCards = () => {
    const { closeModal: closeAddUnitModal, modalState: addUnitState, openModal: openAddUnitModal } = useModal();
    const stats = [
        {
            title: "Evaluator",
            value: 80,
            subtitle: "Total participants in current assessment",
            assessmentName: "Mathematics Weekly Assessment",
            change: "Live monitoring active",
            bgColor: "#E8F0FE",
            overlayChildColor: "#CACBF0",
            circleColor: "rgb(202 216 246 / 25%)",
            borderColor: "#93C5FD", // light blue
            valueColor: "#2563EB",
            icon: "ri-bar-chart-line",
        }
    ];

    const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    const dummyClassSubjectList = [
        { cardName: "John Smith", shortName: "JS", color: "rgb(228, 169, 10)", bookColor: "rgb(255, 243, 211)" },
        { cardName: "Alice Johnson", shortName: "AJ", color: "rgb(253, 227, 222)", bookColor: "rgb(190, 29, 92)" },
        { cardName: "Raj Kumar", shortName: "RK", color: "rgb(216, 237, 249)", bookColor: "rgb(0, 126, 230)" }
    ]
    return (
        <>
            <div className="row g-4 mt-3">
                {stats.map((stat, index) => (
                    <div className="col-md-6 col-xl-3 mt-0 assessment-list" key={index}>
                        <div
                            className="card p-3 overflow-hidden"
                            style={{
                                backgroundColor: stat.bgColor,
                                borderTop: `4px solid ${stat.borderColor}`,
                                borderRadius: "10px",
                                boxShadow: `0px 4px 12px ${hexToRgba(stat.borderColor, 0.4)}`,
                            }}
                        >
                            <div className="d-flex justify-content-between align-items-start">
                                <div className="fw-semibold fs-14">{stat.title}</div>
                                {/* <div>
                                <button
                                    className="btn btn-outline-success float-end d-flex align-items-center py-1 mb-2 px-2"
                                >
                                    <i className="ri-add-line" />
                                </button>
                            </div> */}
                            </div>
                            <div
                                className="bg-white shadow-lg p-3 mt-2 d-flex flex-column"
                                style={{ borderRadius: "10px", height: "250px" }}
                            >
                                {/* Title & edit button */}
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="fs-14 fw-bold">
                                        {stat.assessmentName.length > 15
                                            ? stat.assessmentName.slice(0, 15) + "..."
                                            : stat.assessmentName}
                                    </div>
                                    <button className="btn border-0 p-1">
                                        <HugeiconsIcon
                                            icon={PencilEdit02Icon}
                                            className="text-muted"
                                            size={16}
                                        />
                                    </button>
                                </div>

                                {/* Subtitle */}
                                <p className="mb-2 text-muted text-truncate">{stat.subtitle}</p>

                                {/* Dates */}
                                <div className="d-flex justify-content-between text-muted my-1">
                                    <span>Start Date</span>
                                    <span>End Date</span>
                                </div>
                                <div className="d-flex justify-content-between fw-medium mb-3">
                                    <span>14 Aug 2025</span>
                                    <span>14 Aug 2025</span>
                                </div>

                                {/* Progress */}
                                <div>
                                    <div
                                        className="progress"
                                        style={{
                                            height: "6px",
                                            backgroundColor: hexToRgba(stat.borderColor, 0.15),
                                        }}
                                    >
                                        <div
                                            className="progress-bar"
                                            role="progressbar"
                                            style={{
                                                width: `${stat.value}%`,
                                                backgroundColor: stat.valueColor,
                                            }}
                                            aria-valuenow={stat.value}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                        ></div>
                                    </div>
                                    <small className="text-muted mt-1 d-block mb-3">
                                        {stat.value}% completed
                                    </small>
                                </div>

                                {/* Avatars + Add button */}
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="avatar-group d-flex">
                                        {dummyClassSubjectList.map((sub: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className="avatar-group-item p-2"
                                                data-bs-toggle="tooltip"
                                                title={sub.cardName}
                                                style={{
                                                    backgroundColor: sub.color,
                                                    color: sub.bookColor,
                                                    borderRadius: "50%",
                                                    width: "36px",
                                                    height: "36px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontWeight: "500",
                                                }}
                                            >
                                                {sub.shortName}
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        className="btn btn-outline-primary py-1 px-2"
                                        style={{ borderRadius: "50%" }}
                                        onClick={() => { openAddUnitModal(); }}
                                    >
                                        <i className="ri-add-line" />
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
            <ModalContainerUpdated
                id="add-examination"
                isOpen={addUnitState.showModal}
                toggle={() => closeAddUnitModal()}
                modalTitle="Assign"
                modalSize="md"
            >
                <AddModratores
                    toggle={closeAddUnitModal}
                    id={addUnitState.modalData}
                />
            </ModalContainerUpdated>
        </>
    );
};

export default StudentCards;
