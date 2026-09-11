import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Pagination, EffectCoverflow, Autoplay } from "swiper";
import ToppersChart from "./ToppersChart";
import { HugeiconsIcon } from "@hugeicons/react";
import { Award01Icon } from '@hugeicons-pro/core-solid-standard';
import { Crown02Icon } from '@hugeicons-pro/core-solid-standard';
import { Medal06Icon } from "@hugeicons-pro/core-stroke-standard";

function CardItem({ student }: any) {
    const {
        studentName,
        studentRank,
        studentImage,
        sectionName,
        bgColor,
        totalScore,
        totalMarks,
    } = student;

    const firstLetter = studentName ? studentName.trim().charAt(0).toUpperCase() : "";

    const replaceBrokenImg = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;
        target.style.display = "none";
    };

    const rankNumber = Number(studentRank?.replace("#", ""));
    const colorArr = [
        { bgColor: "#FFF9C4", txtColor: "#827717" },
        { bgColor: "#BBDEFB", txtColor: "#0D47A1" },
        { bgColor: "#C8E6C9", txtColor: "#1B5E20" },
        { bgColor: "#FFE0B2", txtColor: "#E65100" },
        { bgColor: "#F8BBD0", txtColor: "#880E4F" },
    ];
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const letterColors = alphabet.reduce((acc: any, letter, index) => {
        const colorIndex = index % colorArr.length;
        acc[letter] = {
            foreground: colorArr[colorIndex].txtColor,
            background: colorArr[colorIndex].bgColor,
        };
        return acc;
    }, {});
    const awardColors: { [key: number]: string } = {
        1: "#f5a623",
        2: "#E65D0A",
        3: "#9CA3AF",
        4: "#245CA5",
    };

    const awardColor = awardColors[rankNumber] || "#CA8A04";
    
    const getRankWithSuffix = (rank: number) => {
        const j = rank % 10,
            k = rank % 100
        if (j === 1 && k !== 11) return `${rank}st`
        if (j === 2 && k !== 12) return `${rank}nd`
        if (j === 3 && k !== 13) return `${rank}rd`
        return `${rank}th`
    }

    const rankWithSuffix = getRankWithSuffix(rankNumber)
    return (
        <>
            <div
                className="card student-rank-card mb-0 mx-auto mt-4 !tw-shadow-[rgba(99,99,99,0.2)_0px_2px_8px_0px]"
                style={{
                    borderRadius: "5px",
                    border: "none",
                    maxWidth: "320px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease"
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 12px 35px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
                }}
            >
                <div className="position-relative">
                    <div
                        className="position-absolute d-flex align-items-center justify-content-start"
                        style={{
                            top: "-20px",
                            left: "-25px",
                            fontSize: "20px",
                            borderRadius: "25px",
                            backgroundColor: awardColor,
                            zIndex: 999,
                            padding: "6px 16px",
                            gap: "3px",
                        }}
                    >
                        {rankNumber === 1 ? (
                            <HugeiconsIcon
                                icon={Crown02Icon}
                                size={18}
                                color="#FFFFFF"
                            />
                        ) : (
                            <HugeiconsIcon
                                icon={Medal06Icon}
                                size={18}
                                color="#fafafa"

                            />
                        )}
                        <span
                            className="fs-20 fw-bold text-white"
                            style={{
                                lineHeight: "1",
                                display: "inline-block",
                                minWidth: "25px",
                                textAlign: "center",
                            }}
                        >
                            {rankWithSuffix}
                        </span>
                    </div>
                </div>
                <div
                    className="card-header border-0 position-relative"
                    style={{
                        borderRadius: "20px 20px 0 0",
                        padding: "24px 20px"
                    }}
                >
                    <div className="d-flex flex-column justify-content-center align-items-center position-relative" style={{
                        textAlign: "center"
                    }}>
                        <div className="d-flex justify-content-center align-items-center overflow-hidden position-relative tw-shadow" style={{
                            borderRadius: "50%", border: "3px solid rgba(255,255,255,0.3)", width: "70px", height: "70px", backgroundColor:
                                studentImage ? "transparent" : letterColors[firstLetter]?.background || "#FFF9C4", color: studentImage ? "#fff" :
                                    letterColors[firstLetter]?.foreground || "#827717", fontWeight: "bold", fontSize: "28px",
                            flexShrink: 0, marginBottom: "12px",
                        }}>
                            {studentImage ? (
                                <img src={studentImage} alt="student" className="img-fluid" onError={replaceBrokenImg} style={{
                                    borderRadius: "50%"
                                    , width: "100%", height: "100%", objectFit: "cover",
                                }} />
                            ) : (
                                <span>{firstLetter}</span>
                            )}
                        </div>
                        <h4 className="mb-1 fs-18 fw-bold mt-3 !tw-truncate tw-w-[84%]">
                            {studentName
                                ? studentName
                                    .toLowerCase()
                                    .replace(/\b\w/g, (char) => char.toUpperCase())
                                : ""}
                        </h4>
                        <p className="mb-0 fw-medium" style={{ color: "#878A99" }}>
                            Section  {sectionName}
                        </p>
                        <div
                            className="position-absolute tw-shadow-[rgba(99,99,99,0.2)_0px_2px_8px_0px]"
                            style={{
                                width: "40px",
                                height: "40px",
                                top: "50px",
                                right: "15px",
                                fontSize: "30px",
                                backgroundColor: "white",
                                borderRadius: "25px",
                                zIndex: 10,
                            }}
                        >
                            <HugeiconsIcon
                                icon={Award01Icon}
                                size={24}
                                color={awardColor}
                                className="mb-2"
                            />
                        </div>
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="d-grid align-items-center pt-0 p-4">
                        <div className="me-4" style={{ flexShrink: 0 }}>
                            <ToppersChart
                                value={totalScore}
                                total={totalMarks}
                                rank={rankNumber}
                            />
                        </div>
                        <div className="flex-grow-1">
                            <div className="text-center">
                                <div className="mt-3">
                                    <div className="d-flex justify-content-center align-items-center">
                                        <span
                                            className="fw-bold fs-30"
                                            style={{
                                                background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}e6 100%)`,
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                            }}
                                        >
                                            {totalScore}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
interface AssessmentWiseTopStudentsDetailsProps {
    getAssessmentWiseTopStudentsDetailsResp: any;
}

const AssessmentWiseTopStudentsDetails = ({
    getAssessmentWiseTopStudentsDetailsResp,
}: AssessmentWiseTopStudentsDetailsProps) => {

    const rankColorsMap: { [position: number]: { bgColor: string; rankBgColor: string } } = {
        1: { bgColor: "#0ab39c", rankBgColor: "#85d9ce" },
        2: { bgColor: "#405189", rankBgColor: "#a0a8c4" },
        3: { bgColor: "#f7b84b", rankBgColor: "#fbdca5" },
    };

    const studentsList =
        getAssessmentWiseTopStudentsDetailsResp
            ?.filter((student) => student.position <= 3)
            .map((student) => {
                const { bgColor, rankBgColor } = rankColorsMap[student.position] || { bgColor: "#ccc", rankBgColor: "#eee" };
                return {
                    studentId: student.studentId,
                    studentName: student.studentName,
                    studentRank: `#${student.position}`,
                    studentMarks: `${student.totalScore}/${student.totalMarks}`,
                    studentPercentage: `${student.accuracyPerc?.toFixed(2) ?? 0}%`,
                    studentImage: student.studentImage || null,
                    bgColor,
                    rankBgColor,
                    sectionName: student.sectionName,
                    totalScore: student.totalScore ?? 0,
                    totalMarks: student.totalMarks ?? 0,
                };
            }) || [];

    return (
        <div className="swiper-container lms_toppers">
            <div className="card !tw-shadow-sm" style={{ backgroundColor: "#F9FAFB" }}>
                <div className="card-header" style={{ backgroundColor: "#F9FAFB" }}>
                    <div className="row align-items-center">
                        <div className="col-12 pe-0">
                            <h4 className="card-title mb-0 flex-grow-1 fs-15">Leaders board</h4>
                        </div>
                    </div>
                </div>
                <div className="card-body pt-0 mt-3">
                    {studentsList.length === 0 ? (
                        <div className="tw-text-center tw-pb-4 tw-text-gray-500 pt-3">No record found</div>
                    ) : (
                        <Swiper
                            grabCursor={true}
                            centeredSlides={true}
                            slidesPerView={4}
                            loop={studentsList.length > 1}
                            autoplay={{
                                delay: 2500,
                                disableOnInteraction: false,
                            }}
                            pagination={{
                                clickable: true,
                                dynamicBullets: true,
                            }}
                            breakpoints={{
                                320: { slidesPerView: 1, spaceBetween: 15 },
                                480: { slidesPerView: 2, spaceBetween: 15 },
                                768: { slidesPerView: 3, spaceBetween: 32 },
                                1024: { slidesPerView: 3, spaceBetween: 36 },
                                1400: { slidesPerView: 4, spaceBetween: 36 },
                            }}
                            modules={[Pagination, Autoplay]}
                            className="mySwiper swiper tw-rounded-2xl !tw-pb-5 pt-3 mt-3 fade-overlay-swiper"
                        >
                            {studentsList.map((student) => (
                                <SwiperSlide key={student.studentId}>
                                    <CardItem student={student} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssessmentWiseTopStudentsDetails;