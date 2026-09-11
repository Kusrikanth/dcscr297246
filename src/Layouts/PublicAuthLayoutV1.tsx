import "./publicauthV1.scss";
import { withRouter } from "react-router-dom";

import HeaderLoginImg from "../assets/imagesdps/authiconV1/dc-dark-logo.png";
import AppleImg from "../assets/imagesdps/authiconV1/play-store.png";
import GooglePlayImg from "../assets/imagesdps/authiconV1/google-play.png";
import { useSelector } from "react-redux";
import { FullPageLoader } from "../Components/Common";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import FrontView1 from "../assets/imagesdps/authiconV1/front-view-1.png";
import FrontView2 from "../assets/imagesdps/authiconV1/front-view-2.png";
import FrontView3 from "../assets/imagesdps/authiconV1/front-view-3.png";

const images = [
  {
    imgSrc: FrontView1,
    overlay: "rgba(0, 0, 0, 0.2)",
    backgroundPosition: "right",
  },
  {
    imgSrc: FrontView2,
    overlay: "none",
    backgroundPosition: "center",
  },
  {
    imgSrc: FrontView3,
    overlay: "rgba(0, 0, 0, 0.2)",
    backgroundPosition: "left bottom",
  },
];
const quotations = [
  "Committed To Excellence In Education.",
  "Growth is a way of life, we have to grow at all times.",
  "The Bridge to a Brighter Tomorrow.",
];

const PublicAuthLayoutV1: React.FC<any> = ({ children }) => {
  const { showApiLoader } = useSelector((state: any) => ({
    showApiLoader: state.globalData.showApiLoader,
  }));
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 576);
  const [randomBackgroundImg, setRandomBackgroundImg] = useState<any>(
    images[0]
  );
  const [randomQuote, setRandomQuote] = useState<string>(quotations[0]);

  useEffect(function () {
    function handleIsMobile() {
      setIsMobile(window.innerWidth <= 576);
    }
    window.addEventListener("resize", handleIsMobile);
    return () => {
      window.removeEventListener("resize", handleIsMobile);
    };
  }, []);

  useEffect(function () {
    setRandomBackgroundImg(images[Math.floor(Math.random() * images.length)]);
    setRandomQuote(quotations[Math.floor(Math.random() * quotations.length)]);
  }, []);

  return (
    <>
      <ToastContainer />
      <section className="public-auth-v2">
        <div className="container-fluid px-0">
          <div className="row gy-5 gx-0">
            <img
              src={HeaderLoginImg}
              alt="header-logo"
              className="header-logo img-fluid mt-lg-0"
            ></img>
            <div className="col-12 col-lg-7 left-section d-none d-sm-block">
              <div
                className="front-view-img-container"
                style={{
                  backgroundImage: `url(${randomBackgroundImg.imgSrc})`,
                  backgroundPosition: isMobile
                    ? randomBackgroundImg.backgroundPosition
                    : "center",
                }}
              >
                {randomBackgroundImg.overlay !== "none" && (
                  <div
                    className="overlay"
                    style={{
                      backgroundColor: `${randomBackgroundImg.overlay}`,
                    }}
                  ></div>
                )}
              </div>
              <div className="left-section-content-container p-4 d-flex align-items-center">
                <h3 className="quotation-text mb-0">
                  {/* "Committed To Excellence In Education" */}
                  {`" ${randomQuote} "`}
                </h3>
              </div>
            </div>
            <div className="col-12 col-lg-5 right-section px-4 d-flex flex-column align-items-center justify-content-center">
              <div className="fs-7 application-status">
                {/* <span className="fw-bold me-1">Applied already?</span> */}
                <a href="/application-tracking" target="_blank" className="fw-bold text-info cursor-pointer">Track your application</a>
                &nbsp; | &nbsp; 
                <a href="/tc-tracking" target="_blank" className="fw-bold text-info cursor-pointer">Download Transfer Certificate (TC)</a>
              </div>
              <div className="row w-100 justify-content-center my-4 my-sm-5">
                <div className="col-12 col-md-6 col-lg-12 d-flex justify-content-center align-items-center pb-3 mb-4 mb-xxl-5">
                  {children}
                </div>
                <div className="col-12 d-flex justify-content-center align-items-center mb-3">
                  <div className="mobile-container p-3 mb-5 mb-lg-0">
                    <p className="mobile-text">Mobile Apps</p>
                    <div className="row align-items-center">
                      <div className="col-6">
                        <a
                          href="https://play.google.com/store/apps/details?id=com.sta.dpsdigitalcaampus"
                          rel="noreferrer"
                          target="_blank"
                        >
                          <img
                            src={GooglePlayImg}
                            alt="Google Play Store"
                            className="img-fluid"
                          ></img>
                        </a>
                      </div>
                      <div className="col-6">
                        <a
                          href="https://apps.apple.com/in/app/dc-digitalcaampus/id6504325051"
                          rel="noreferrer"
                          target="_blank"
                        >
                          <img
                            src={AppleImg}
                            alt="Apples Store"
                            className="img-fluid"
                          ></img>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="fs-7 powered-by">
                <span className="fw-bold me-2">Powered By</span>
                <span className="fw-bold text-info">STA Solutions Pvt Ltd</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {showApiLoader && <FullPageLoader></FullPageLoader>}
    </>
  );
};

export default withRouter(PublicAuthLayoutV1);
