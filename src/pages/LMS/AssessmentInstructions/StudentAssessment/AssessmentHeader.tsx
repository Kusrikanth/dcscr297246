import {
    AccordionBody,
    AccordionHeader,
} from "reactstrap";
import studentImg from "../../../../assets/imagesdps/student-default-img.png";

export default function AssessmentHeader() {
    return (
        <>
            <AccordionHeader tag="div" targetId="assessment-header">
                Student Login Details
            </AccordionHeader>
            <AccordionBody accordionId="assessment-header">
                <div className="row">
                    <div className="col-3 d-flex">
                        <div className="tw-size-20 tw-rounded-full tw-flex tw-me-4">
                            <img
                                src={studentImg}
                                alt="student-img"
                                className="tw-w-full tw-h-full tw-rounded-full tw-border tw-border-slate-200 tw-flex-shrink-0"
                            ></img>
                        </div>
                        <div className="d-flex gap-2 flex-column">
                            <div className="d-flex align-items-center">
                                <p className="mb-0 fs-12 text-muted me-1 fs-12">Name :</p>
                                <p className="mb-0 fs-12">Arun Kumar</p>
                            </div>
                            <div className="d-flex align-items-center">
                                <p className="mb-0 fs-12 text-muted me-1 fs-12">Student Id :</p>
                                <p className="mb-0 fs-12">NAH1234</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-9">
                        <div className="row gy-2">
                            <div className="col-6 col-lg-4 col-xl-3 d-flex align-items-center">
                                <p className="mb-0 fs-12 text-muted me-1 fs-12">Curriculum :</p>
                                <p className="mb-0 fs-12">CBSE</p>
                            </div>

                            <div className="col-6 col-lg-4 col-xl-3 d-flex align-items-center">
                                <p className="mb-0 fs-12 text-muted me-1 fs-12">Class :</p>
                                <p className="mb-0 fs-12">X</p>
                            </div>

                            <div className="col-6 col-lg-4 col-xl-3 d-flex align-items-center">
                                <p className="mb-0 fs-12 text-muted me-1 fs-12">Subject :</p>
                                <p className="mb-0 fs-12">English</p>
                            </div>

                            <div className="col-6 col-lg-4 col-xl-3 d-flex align-items-center">
                                <p className="mb-0 fs-12 text-muted me-1 fs-12">
                                    Assignment Name :
                                </p>
                                <p className="mb-0 fs-12">Live work Sheet</p>
                            </div>

                            <div className="col-6 col-lg-4 col-xl-3 d-flex align-items-center">
                                <p className="mb-0 fs-12 text-muted me-1 fs-12">
                                    Total Marks :
                                </p>
                                <p className="mb-0 fs-12">50</p>
                            </div>

                            <div className="col-6 col-lg-4 col-xl-3 d-flex align-items-center">
                                <p className="mb-0 fs-12 text-muted me-1 fs-12">Duration :</p>
                                <p className="mb-0 fs-12">1Hr 30mins</p>
                            </div>
                            <div className="col-6 col-lg-4 col-xl-3 d-flex align-items-center">
                                <p className="mb-0 fs-12 text-muted me-1 fs-12">
                                    Assignment Id :
                                </p>
                                <p className="mb-0 fs-12">ASM89187</p>
                            </div>

                            <div className="col-6 col-lg-4 col-xl-3 d-flex align-items-center">
                                <p className="mb-0 fs-12 text-muted me-1 fs-12">User Id :</p>
                                <p className="mb-0 fs-12">NAH1213</p>
                            </div>
                            <div className="col-6 col-lg-4 col-xl-3 d-flex align-items-center">
                                <p className="mb-0 fs-12 text-muted me-1 fs-12">IP Address :</p>
                                <p className="mb-0 fs-12">12123419087</p>
                            </div>
                            <div className="col-6 col-lg-4 col-xl-3 d-flex align-items-center">
                                <p className="mb-0 fs-12 text-muted me-1 fs-12">Login Time :</p>
                                <p className="mb-0 fs-12">10:58AM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AccordionBody>
        </>
    );
}