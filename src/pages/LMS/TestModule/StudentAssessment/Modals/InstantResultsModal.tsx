import { default as RejectSvg } from "../../../../../assets/imagesdps/academics/confirmation-icon.svg?react";
import ReactApexChart from "react-apexcharts";
import { UncontrolledTooltip } from "reactstrap";
import studentDummyImg from "../../../../../assets/imagesdps/student-default-img.png";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AnalysisTextLinkIcon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Download01Icon,
  NextIcon,
  TextCheckIcon,
  Tick01Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { DivideSignCircleIcon } from "@hugeicons-pro/core-solid-standard";

const InstantResults = ({ toggle, scoreData }) => {
  const { scoredMarks, condectedMarks } = scoreData;

  return (
    <div className="modal-body p-0">
      <div className="row w-100 mx-auto tw-px-4 tw-py-6 g-3">
        <div className="col-12 col-xl-6 tw-grid">
          <div className="tw-flex tw-items-center tw-border tw-rounded-lg tw-px-4 tw-py-3">
            <div className="tw-me-3">
              <img
                src={studentDummyImg}
                alt="student image"
                className="tw-w-12 tw-h-12 tw-shrink-0"
              ></img>
            </div>
            <div className="">
              <p className="tw-mb-1">Ananya Sharma</p>
              <ul className="tw-flex tw-ps-0 tw-gap-x-2 tw-mb-0 tw-text-gray-500 tw-text-xs tw-items-center">
                <li className="first:tw-list-none">
                  <span className="tw-px-2 tw-py-0.5 tw-rounded tw-bg-slate-200 tw-text-xs tw-border tw-border-slate-500 tw-text-slate-500">
                    STU-1023
                  </span>
                </li>
                <li className="tw-list-disc tw-ms-4">
                  <span className="tw-me-1">Class :</span>
                  <span>X - B</span>
                </li>
                <li className="tw-list-disc tw-ms-4">
                  <span className="tw-me-1">Roll No :</span>
                  <span>15</span>
                </li>
                <li className="tw-list-disc tw-ms-4">
                  <span className="tw-me-1">Rank :</span>
                  <span className="tw-me-1">1</span>
                  <span className="tw-text-[18px]">🏅</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-12 col-xl-6 tw-grid">
          <div className="tw-flex tw-items-center tw-border tw-rounded-lg tw-px-4 tw-py-3">
            <div className="">
              <div className="tw-mb-0 tw-flex tw-items-center">
                <p className="tw-mb-1 tw-text-lg tw-font-semibold tw-me-3">
                  Mathematics Weekly Assessment
                </p>
                <span className="tw-px-2 tw-py-0.5 tw-rounded tw-bg-slate-200 tw-text-xs tw-text-slate-500">
                  Live Worksheet
                </span>
              </div>
              <ul className="tw-flex tw-ps-0 tw-gap-x-2 tw-mb-0 tw-text-gray-500 tw-text-xs">
                <li className="first:tw-list-none">
                  <span>ASM1728</span>
                </li>
                <li className="tw-list-disc tw-ms-4">
                  <span>Maths</span>
                </li>
                <li className="tw-list-disc tw-ms-4">
                  <span>30 Q</span>
                </li>
                <li className="tw-list-disc tw-ms-4">
                  <span>30 Marks</span>
                </li>
                <li className="tw-list-disc tw-ms-4">
                  <span>15 Aug, 2025</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-12 col-xl-4 tw-grid">
          <ScoreChart
            scoredMarks={scoredMarks}
            condectedMarks={condectedMarks}
          ></ScoreChart>
        </div>
        <div className="col-12 col-xl-8 tw-grid">
          <ScoreSummary></ScoreSummary>
        </div>
        <div className="col-12 col-lg-auto mx-auto">
          <div className="card !tw-rounded-lg !tw-border shadow-none tw-w-full tw-max-w-full tw-overflow-hidden mb-0">
            <div className="card-header">
              <h4 className="mb-0 card-title">Questions Summary</h4>
            </div>
            <div className="card-body tw-flex tw-items-center tw-justify-center tw-flex-col">
              <div className="tw-grid tw-grid-cols-[repeat(8,_auto)] md:tw-grid-cols-[repeat(10,_auto)] lg:tw-grid-cols-[repeat(15,_auto)] tw-gap-2 tw-justify-center tw-mb-4">
                {Array.from({ length: 30 }, (_, i) => {
                  const num = i + 1;
                  const status = [2, 6, 10, 24, 30].includes(num)
                    ? "tw-border-red-500 tw-text-red-700 tw-bg-red-100"
                    : [4, 5, 7, 19].includes(num)
                    ? "tw-border-gray-500 tw-text-gray-700 tw-bg-gray-100"
                    : "tw-border-green-500 tw-text-green-700 tw-bg-green-100";

                  return (
                    <div
                      key={num}
                      className={`tw-border-2 tw-flex tw-items-center tw-justify-center tw-w-8 tw-h-8 tw-rounded-full tw-border ${status}`}
                    >
                      {num}
                    </div>
                  );
                })}
              </div>
              <div className="tw-flex tw-items-center tw-gap-4">
                <div className="tw-flex tw-items-center">
                  <div className="tw-w-3 tw-h-3 tw-rounded tw-bg-green-500 tw-me-1"></div>
                  <p className="mb-0">Correct</p>
                </div>
                <div className="tw-flex tw-items-center">
                  <div className="tw-w-3 tw-h-3 tw-rounded tw-bg-red-500 tw-me-1"></div>
                  <p className="mb-0">Wrong</p>
                </div>
                <div className="tw-flex tw-items-center">
                  <div className="tw-w-3 tw-h-3 tw-rounded tw-bg-gray-500 tw-me-1"></div>
                  <p className="mb-0">Un Attempted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-3 tw-border-t">
        <div className="tw-flex tw-gap-2 tw-justify-center">
          <button className="btn btn-outline-secondary" onClick={() => {}}>
            <HugeiconsIcon icon={TextCheckIcon} className="me-2" size={18} />
            Review Answers
          </button>
          <button className="btn btn-outline-success" onClick={() => {}}>
            <HugeiconsIcon icon={Download01Icon} className="me-2" size={18} />
            Download
          </button>
          <button className="btn btn-outline-primary" onClick={() => {}}>
            <HugeiconsIcon
              icon={AnalysisTextLinkIcon}
              className="me-2"
              size={18}
            />
            Detailed Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstantResults;

const ScoreChart = ({ scoredMarks, condectedMarks }) => {
  const percentage = (scoredMarks / condectedMarks) * 100;

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "radialBar",
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "60%",
        },
        track: {
          background: "#E6E6E6",
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: false,
          },
        },
      },
    },
    colors: ["#FF6600"],
    stroke: {
      lineCap: "round",
    },
  };

  const series = [percentage];

  return (
    <div className="card shadow-none !tw-border !tw-rounded-lg tw-overflow-hidden mb-0">
      <div className="card-header tw-flex tw-items-center">
        <h4 className="card-title mb-0 me-3">Score Summary</h4>
      </div>
      <div className="card-body tw-flex tw-items-center tw-flex-col">
        <div className="row tw-flex tw-items-end tw-w-full tw-mb-3">
          <div className="col-4 tw-flex tw-items-center tw-flex-col">
            <div className="tw-mb-2">
              <p className="tw-mb-0 tw-text-center">Accuracy</p>
            </div>
            <div className="tw-relative tw-w-full tw-h-20 tw-flex tw-items-center tw-justify-center tw-mb-2">
              <ReactApexChart
                options={options}
                series={series}
                type="radialBar"
                height={108}
              />
              <div className="tw-absolute tw-text-center">
                <p className="tw-font-bold tw-text-base mb-0">
                  {scoredMarks}/{condectedMarks}
                </p>
                <p className="tw-text-sm tw-text-gray-500 mb-0">
                  {percentage.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="col-8">
            <div className="tw-flex tw-items-center mb-1 tw-w-full tw-gap-y-2">
              <div className="tw-text-gray-500 tw-me-1 tw-text-xs tw-w-[50%]">
                Attempt No
              </div>
              <div className="tw-w-[50%] tw-text-xs">: 01</div>
            </div>
            <div className="tw-flex tw-items-center mb-1 tw-w-full">
              <div className="tw-text-gray-500 tw-me-1 tw-text-xs tw-w-[50%]">
                Attempt Code
              </div>
              <div className="tw-w-[50%] tw-text-xs">: ATM8912</div>
            </div>
            <div className="tw-flex tw-items-center mb-1 tw-w-full">
              <div className="tw-text-gray-500 tw-me-1 tw-text-xs tw-w-[50%]">
                Submitted At
              </div>
              <div className="tw-w-[50%] tw-text-xs">
                <span className="d-block">15 Aug, 2025</span>
                <span className="d-block">11:45 AM</span>
              </div>
            </div>
          </div>
        </div>
        <div className="tw-flex tw-items-center tw-flex-col">
          <div className="tw-inline-flex tw-mt-1 tw-text-red-700 tw-border tw-border-red-400 tw-bg-red-100 tw-rounded-md tw-px-2 tw-py-1 tw-text-xs tw-mb-2">
            Failed - Grade D
          </div>
        </div>
      </div>
    </div>
  );
};

const ScoreSummary = () => {
  return (
    <div className="card !tw-rounded-lg !tw-border shadow-none tw-w-full tw-max-w-full tw-overflow-hidden mb-0">
      <div className="card-header">
        <h4 className="card-title mb-0">Performance Overview</h4>
      </div>

      <div className="card-body">
        <div className="tw-flex tw-flex-col tw-items-center">
          <div className="tw-grid tw-grid-cols-2 xl:tw-grid-cols-[repeat(4,_1fr)] tw-gap-3 tw-mb-4 tw-w-full">
            <div className="tw-border tw-rounded-lg tw-px-2 tw-py-2">
              <div className="tw-flex tw-items-center">
                {/* <div className="tw-h-3 tw-w-3 tw-rounded tw-bg-yellow-500 tw-flex-shrink-0 tw-me-2"></div> */}
                <div className="tw-flex-1">
                  <p className="mb-0 tw-text-gray-500">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      className="tw-me-2 tw-text-yellow-500"
                      size={18}
                    />
                    Attempted
                  </p>
                  <p className="mb-0 tw-font-bold tw-text-lg tw-text-right">
                    20
                  </p>
                </div>
              </div>
            </div>
            <div className="tw-border tw-rounded-lg tw-px-2 tw-py-2">
              <div className="tw-flex tw-items-center">
                {/* <div className="tw-h-3 tw-w-3 tw-rounded tw-bg-green-500 tw-flex-shrink-0 tw-me-2"></div> */}
                <div className="tw-flex-1">
                  <p className="mb-0 tw-text-gray-500">
                    <HugeiconsIcon
                      icon={Tick01Icon}
                      className="tw-me-2 tw-text-green-500"
                      size={18}
                    />
                    Correct
                  </p>
                  <p className="mb-0 tw-font-bold tw-text-lg tw-text-right">
                    12
                  </p>
                </div>
              </div>
            </div>
            <div className="tw-border tw-rounded-lg tw-px-2 tw-py-2">
              <div className="tw-flex tw-items-center">
                {/* <div className="tw-h-3 tw-w-3 tw-rounded tw-bg-red-500 tw-flex-shrink-0 tw-me-2"></div> */}
                <div className="tw-flex-1">
                  <p className="mb-0 tw-text-gray-500">
                    <HugeiconsIcon
                      icon={Cancel01Icon}
                      className="tw-me-2 tw-text-red-500"
                      size={18}
                    />
                    In Correct
                  </p>
                  <p className="mb-0 tw-font-bold tw-text-lg tw-text-right">
                    8
                  </p>
                </div>
              </div>
            </div>
            <div className="tw-border tw-rounded-lg tw-px-2 tw-py-2">
              <div className="tw-flex tw-items-center">
                <div className="tw-flex-1">
                  <p className="mb-0 tw-text-gray-500">
                    <HugeiconsIcon
                      icon={NextIcon}
                      className="tw-me-2 tw-text-gray-500"
                      size={18}
                    />
                    Un Attempted
                  </p>
                  <p className="mb-0 tw-font-bold tw-text-lg tw-text-right">
                    10
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="tw-w-full">
            <div className="tw-flex tw-items-center tw-mb-4">
              <p className="tw-mb-0 tw-font-semibold tw-me-4">
                Difficulty level Analysis
              </p>
            </div>

            <div className="tw-flex tw-items-center tw-w-full tw-mb-2">
              <div className="tw-flex tw-h-3 tw-w-full tw-bg-gray-200 tw-rounded-full tw-overflow-hidden">
                <div
                  className="tw-bg-green-500 tw-h-full tw-w-[42%]"
                  aria-label="Medium difficulty 42%"
                ></div>
                <div
                  className="tw-bg-yellow-500 tw-h-full tw-w-[20%]"
                  aria-label="Low difficulty 20%"
                ></div>
                <div
                  className="tw-bg-red-500 tw-h-full tw-w-[38%]"
                  aria-label="High difficulty 38%"
                ></div>
              </div>
            </div>
            <div className="tw-flex tw-gap-6">
              <p className="tw-mb-0 tw-flex tw-items-center">
                <div className="tw-h-3 tw-w-3 tw-rounded tw-bg-green-500 tw-flex-shrink-0 tw-me-2"></div>
                <span className="tw-me-2">Easy </span>
                <span>: 12/15</span>
              </p>
              <p className="tw-mb-0 tw-flex tw-items-center">
                <div className="tw-h-3 tw-w-3 tw-rounded tw-bg-yellow-500 tw-flex-shrink-0 tw-me-2"></div>
                <span className="tw-me-2">Medium </span>
                <span>: 12/15</span>
              </p>
              <p className="tw-mb-0 tw-flex tw-items-center">
                <div className="tw-h-3 tw-w-3 tw-rounded tw-bg-red-500 tw-flex-shrink-0 tw-me-2"></div>
                <span className="tw-me-2">Hard </span>
                <span>: 12/15</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

{
  /*
<ModalContainerUpdated
  id="dummy-success-modal"
  toggle={() => {}}
  modalSize="lg"
  modalTitle="Instant Results"
  isOpen={true}
  // headerClassName="py-2 tw-bg-gradient-to-r tw-from-[#F24444] tw-to-[#FF914D]"
  // headerClassName="py-2 tw-bg-gradient-to-r tw-from-[#6A4CFF] tw-to-[#00C6FF]"
  headerClassName="py-2 tw-bg-gradient-to-r tw-from-[#FFB200] tw-to-[#27C26E]"
  modaClassName="result-modal-container"
  subTitleClassName="tw-text-white"
  modalSubtitle={
    <div className="tw-text-sm mb-0">
      <ul className="tw-flex tw-ps-0 tw-gap-x-2 tw-mb-0">
        <li className="first:tw-list-none">Live Worksheet</li>
        <li className="tw-list-disc tw-ms-4">Class X</li>
        <li className="tw-list-disc tw-ms-4">Science (MCQ)</li>
      </ul>
    </div>
  }
>
  <InstantResults
    toggle={() => {}}
    scoreData={{
      scoredMarks: 10,
      condectedMarks: 30,
    }}
  ></InstantResults>
</ModalContainerUpdated>;


// 2nd
<ModalContainerUpdated
        id="dummy-success-modal"
        toggle={() => {}}
        modalSize="xl"
        modalTitle="Instant Results"
        isOpen={true}
        // headerClassName="py-2 tw-bg-gradient-to-r tw-from-[#F24444] tw-to-[#FF914D]"
        // headerClassName="py-2 tw-bg-gradient-to-r tw-from-[#6A4CFF] tw-to-[#00C6FF]"
        headerClassName="py-2 tw-bg-gradient-to-r tw-from-[#FFB200] tw-to-[#27C26E]"
        modaClassName="result-modal-container"
        subTitleClassName="tw-text-white"
        modalSubtitle={
          <div className="tw-text-sm mb-0">
            <p className="tw-mb-0">🎉 Let’s turn mistakes into marks!</p>
          </div>
        }
      >
        <InstantResults
          toggle={() => {}}
          scoreData={{
            scoredMarks: 10,
            condectedMarks: 30,
          }}
        ></InstantResults>
      </ModalContainerUpdated>
*/
}
