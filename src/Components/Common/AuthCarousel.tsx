import React from "react";
import { Col } from "reactstrap";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";

// Import Images
import logoLight from "../../assets/imagesdps/logo-md.png";


export const AuthCarousel: React.FC<any> = () => {
    return (
        <React.Fragment>
            <Col lg={6}>
                <div className="lg:tw-p-12 tw-p-6 auth-one-bg tw-h-full">
                    <div className="bg-overlay"></div>
                    <div className="tw-relative tw-h-full tw-flex tw-flex-col">
                        <div className="tw-mb-6">
                            <Link to="/dashboard" className="tw-block">
                                <img src={logoLight} alt="" height="60" />
                            </Link>
                        </div>
                        <div className="tw-mt-auto">
                            <div className="tw-mb-4">
                                <i className="ri-double-quotes-l display-4 text-success"></i>
                            </div>

                            <Carousel showThumbs={false} autoPlay={true} showArrows={false} showStatus={false} infiniteLoop={true} className="carousel slide" >
                                <div className="carousel-inner tw-text-center tw-text-white tw-pb-12">
                                    <div className="item">
                                        <p className="tw-text-[15px] tw-italic">" One book, one pen, one child and one teacher can change the world. "</p>
                                    </div>
                                </div>
                                <div className="carousel-inner tw-text-center tw-text-white tw-pb-12">
                                    <div className="item">
                                        <p className="tw-text-[15px] tw-italic">" One book, one pen, one child and one teacher can change the world. "</p>
                                    </div>
                                </div>
                                <div className="carousel-inner tw-text-center tw-text-white tw-pb-12">
                                    <div className="item">
                                        <p className="tw-text-[15px] tw-italic">" One book, one pen, one child and one teacher can change the world. "</p>
                                    </div>
                                </div>
                            </Carousel>

                        </div>
                    </div>
                </div>
            </Col>
        </React.Fragment >
    );
};
