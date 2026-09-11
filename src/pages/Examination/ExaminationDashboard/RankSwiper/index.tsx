import { UncontrolledTooltip } from "reactstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import {
  Pagination,
  EffectCoverflow,
  Autoplay,
} from "swiper";
import { CardItem } from "./CardList";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { transformStudentDataToCards } from "./helper";
import { useMemo } from "react";

const RankSwiper = (props: any) => {
  const studentsList = useMemo(() => transformStudentDataToCards(props.data), [props.data]);  
  return (
    <div className="swiper-container">
      <div className="card !tw-shadow-sm !tw-rounded-2xl">
        <div className="card-header !tw-rounded-t-2xl">
          <div className="tw-grid tw-grid-cols-2 tw-items-center">
            <div>
              <h4 className="card-title !tw-mb-0">Toppers List</h4>
            </div>
            <div>
              <div className="tw-flex tw-justify-end">
                {/* <button
                  id="export-btn"
                  className="btn btn-icon btn-rounded btn-soft-info p-2 ms-auto"
                >
                  <img
                    src={ExportIcon}
                    className="img-fluid h-100"
                    alt="Export"
                  />
                  <UncontrolledTooltip placement="bottom" target="export-btn">
                    Export
                  </UncontrolledTooltip>
                </button> */}
              </div>
            </div>
          </div>
        </div>
        <div className="card-body !tw-px-0">
          <div>
            <Swiper
              effect={"coverflow"}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={4}
              loop={studentsList?.length > 1 ? true : false}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              pagination={{
                el: ".swiper-pagination",
                clickable: true,
                dynamicBullets: true,
              }}
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 0 },
                480: { slidesPerView: 2, spaceBetween: 0 },
                768: { slidesPerView: 3, spaceBetween: 0 },
                1024: { slidesPerView: 4, spaceBetween: 0 },
                1300: { slidesPerView: 4, spaceBetween: 22 },
              }}
              modules={[EffectCoverflow, Pagination, Autoplay]}
              className="mySwiper swiper effect-coverflow-swiper tw-rounded-2xl !tw-pb-12"
            >
              {studentsList?.length > 0 ? <div className="swiper-wrapper">
                {studentsList?.map((student) => (
                  <SwiperSlide key={student.studentId}>
                    <CardItem student={student}></CardItem>
                  </SwiperSlide>
                ))}
              </div> : <div className="tw-text-center tw-pb-0">No record found</div>}
              <div className="swiper-pagination swiper-pagination-dark"></div>
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankSwiper;
