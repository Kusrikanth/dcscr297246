import { useEffect, useMemo, useRef, useState } from "react";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import { ModalContainerUpdated, SelectInput } from "../../../../Components/Common";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { exportClassWiseStrengthAct, getClassWiseStrengthListAct } from "../../../../store/FrontDesk/Reports/reportsactions";
import ReactApexChart from "react-apexcharts";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";
import { useModal } from "../../../../hooks/modalhook";
import { toast } from "react-toastify";
import { downloadExcelFile } from "../../../../utility/commonutility";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import Button from "../../../../Components/Common/Button";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
  Icon: any;
}

const inititalValues = {
  branchId: "",
  academicYearId: "",
}

const StrengthBarView = (props: any) => {
  // const { branchId } = props || {}
  const [activeId, setActiveId] = useState<any>("curriculum-wise");
  const [filterState, setFilterState] = useState(inititalValues);
  const { closeModal: closeExportModal, openModal: openExportModal, modalState: exportModalState } = useModal()
  const dispatch = useAppDispatch();

  const {
    currentInstIdResp: instituteId, currentBranchIdResp: branchId, academicYearListResp, brchCurriculumResp,
    branchListResp, getClassWiseStrengthListResp, exportClassWiseStrengthResp } =
    useAppSelector(({ appData, branch, instAcademics, branchAcademics, reports }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      branchListResp: branch.branchListResp,
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      getClassWiseStrengthListResp: reports.getClassWiseStrengthListResp,
      exportClassWiseStrengthResp: reports.exportClassWiseStrengthResp,
    }), shallowEqual)

    const clasWiseStrengthRef = useRef({
      prevExportClassWiseStrengthResp: exportClassWiseStrengthResp,
    });
  
    useEffect(() => {
      const { prevExportClassWiseStrengthResp } = clasWiseStrengthRef.current;
      if (exportClassWiseStrengthResp && exportClassWiseStrengthResp !== prevExportClassWiseStrengthResp) {
        toast.success("Exported successfully");
        closeExportModal()
        downloadExcelFile(exportClassWiseStrengthResp, "class_wise_strength");
      }
      clasWiseStrengthRef.current.prevExportClassWiseStrengthResp = exportClassWiseStrengthResp;
  
    }, [exportClassWiseStrengthResp]);

    
  const exportSubmitHndlr = () => {
    const payload = {
      academicYearId: filterState.academicYearId,
      branchId,
      instituteId,
      type: activeId === "curriculum-wise"
      ? "CURRICULUM"
      : activeId === "gender-wise"
      ? "GENDER"
      : "",
  };
    dispatch(exportClassWiseStrengthAct(generateActionPayload("export_class_wise_strength", undefined, payload, {
      responseType: 'blob'
    })));
  }

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "curriculum-wise",
      labelName: "Curriculum",
      customPadding: "0px 5px 5px 5px",
      Icon: "",
    },
    {
      id: "gender-wise",
      labelName: "Gender",
      customPadding: "0px 5px 5px 5px",
      Icon: "",
    },
  ];

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event;
    const menuId = currentTarget.getAttribute("data-id") || "";
    setActiveId(menuId);
    classWiseStrengthApiCall({ type: menuId === "curriculum-wise" ? "CURRICULUM" : "GENDER" })
  }

  useEffect(() => {
    if (academicYearListResp) {
      const yearId = academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
      setFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
      classWiseStrengthApiCall({ academicYearId: yearId })
    }
  }, [academicYearListResp]);

  const classWiseStrengthApiCall = (otherProps?: any) => {
    const payload = {
      branchId ,
      instituteId,
      academicYearId: filterState.academicYearId,
      type: activeId === "curriculum-wise" ? "CURRICULUM" : "GENDER",
      ...otherProps,
    };
    if (payload.academicYearId) {
      dispatch(getClassWiseStrengthListAct(generateActionPayload('get_class_wise_strength', undefined, payload)))
    }
  }

  const tableData = useMemo(() => {
    if (Array.isArray(getClassWiseStrengthListResp)) {
      const uniqueClasses = [...new Set(getClassWiseStrengthListResp.map(item => item.shortName))];
      if (activeId === "curriculum-wise") {
        const result = uniqueClasses.map(shortName => {
          const cbseCount = getClassWiseStrengthListResp
            .filter((item: any) => item.shortName === shortName && item.curriculumName === "CBSE")
            .reduce((sum, item) => sum + (item.studentsCount || 0), 0);

          const eyCount = getClassWiseStrengthListResp
            .filter((item: any) => item.shortName === shortName && item.curriculumName === "EARLY YEARS")
            .reduce((sum, item) => sum + (item.studentsCount || 0), 0);

          const cambridgeCount = getClassWiseStrengthListResp
            .filter((item: any) => item.shortName === shortName && item.curriculumName === "CAMBRIDGE INTERNATIONAL")
            .reduce((sum, item) => sum + (item.studentsCount || 0), 0);

          const totalCount = cbseCount + eyCount + cambridgeCount;

          return {
            className: shortName,
            cbseCount,
            eyCount,
            cambridgeCount,
            totalCount
          };
        });
        return result
      }
      else {
        const result = uniqueClasses.map((shortName: any) => {
          const maleCount = getClassWiseStrengthListResp
            .filter((item: any) => item.shortName === shortName && item.genderName === "MALE")
            .reduce((sum, item) => sum + (item.studentsCount || 0), 0);

          const femaleCount = getClassWiseStrengthListResp
            .filter((item: any) => item.shortName === shortName && item.genderName === "FEMALE")
            .reduce((sum, item) => sum + (item.studentsCount || 0), 0);

          const totalCount = maleCount + femaleCount;

          return {
            className: shortName,
            maleCount,
            femaleCount,
            totalCount
          };
        });
        return result
      }
    }
  }, [getClassWiseStrengthListResp, activeId])

  const series: ApexAxisChartSeries | ApexNonAxisChartSeries = useMemo(() => {
    if (activeId === "curriculum-wise") {
      return [
        {
          name: "CBSE",
          type: "column",
          data: tableData?.map((item: any) => item?.cbseCount || 0) ?? [],
          color: "#0AB39C",
        },
        {
          name: "CAMBRIDGE INTERNATIONAL",
          type: "column",
          data: tableData?.map((item: any) => item?.cambridgeCount || 0) ?? [],
          color: "#405189",
        },
        {
          name: "EARLY YEARS",
          type: "column",
          data: tableData?.map((item: any) => item?.eyCount || 0) ?? [],
          color: "#33b2df",
        },
        // {
        //   name: "Total",
        //   type: "column",
        //   data: tableData?.map((item: any) => item?.totalCount || 0),
        //   color: "#F06548D9",
        // },
      ];
    } else {
      return [
        {
          name: "MALE",
          type: "column",
          data: tableData?.map((item: any) => item?.maleCount || 0) ?? [],
          color: "#0AB39C",
        },
        {
          name: "FEMALE",
          type: "column",
          data: tableData?.map((item: any) => item?.femaleCount || 0) ?? [],
          color: "#405189",
        },
        // {
        //   name: "Total",
        //   type: "column",
        //   data: tableData?.map((item: any) => item?.totalCount || 0),
        //   color: "#F06548D9",
        // },
      ];
    }
  }, [tableData, activeId]);

  const newOptions: ApexCharts.ApexOptions = useMemo(
    () => {
      return {
        chart: {
          type: "bar",
          height: 350,
          stacked: true,
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: true,
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: "bottom",
                offsetX: -10,
                offsetY: 0,
              },
            },
          },
        ],
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "50%",
            borderRadiusApplication: "end",
            borderRadiusWhenStacked: "last",
            dataLabels: {
              total: {
                enabled: true,
                style: {
                  fontSize: "10px",
                  fontWeight: 600,
                },
              },
            },
          },
        },
        xaxis: {
          categories: tableData?.map((item: any) => item?.className),
        },
        legend: {
          position: "bottom",
        },
        fill: {
          opacity: 1,
        },
        colors: [
          "#405189",
          "#0AB39C",
          "#FEB019",
          "#f06548",
          "#2A9D8F",
          "#E9C46A",
          "#F4A261",
        ],
      }
    }, [tableData, activeId]
  )

  return (
    <>
      <div className="tw-w-full">

        <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-100">

          <div className="tw-px-6 tw-py-4 tw-border-b tw-border-gray-100">

            <div className="tw-flex tw-flex-col lg:tw-flex-row lg:tw-items-center lg:tw-justify-between tw-gap-4">

              <h4 className="tw-text-[16px] tw-font-[500] tw-text-gray-800 text-align-center tw-mb-0">
                Class wise Strength
              </h4>

              <div className="tw-flex tw-flex-col sm:tw-flex-row tw-gap-4 sm:tw-items-center sm:tw-justify-end tw-w-full lg:tw-w-auto">

                <div className="tw-overflow-x-auto tw-whitespace-nowrap">
                  <UpdatedHorizontalTab
                    MenuOptions={MenuOptions}
                    clickMenuHandler={clickMenuHandler}
                    activeTabId={activeId}
                    horizontalClass="tw-flex tw-justify-end tw-gap-2 horizontal-menu-updated-style"
                  />
                </div>

                <Button
                  id="export-btn"
                  onClick={openExportModal}
                  variant="exportBtn"
                >
                  <img src={ExportIcon} alt="Export" className="tw-w-5 tw-h-5" />
                </Button>

                <UncontrolledTooltip placement="bottom" target="export-btn">
                  Export
                </UncontrolledTooltip>

              </div>

            </div>

          </div>

          <div className="tw-p-6">

            <div className="tw-w-full">
              <ReactApexChart
                options={newOptions}
                series={series}
                type="bar"
                height={350}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="export-class-by-branch-status-modal"
        isOpen={exportModalState.showModal}
        toggle={closeExportModal}
        modalTitle="Export Class Wise Strenght"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportModalState.showModal}
          toggle={closeExportModal}
          instituteId={instituteId}
          branchId={""}
          submitHndlr={exportSubmitHndlr}
          feature="academic"
          subFeature={"class_wise_strength"}
          remarksText="Enter remarks to Export Class Wise Strenght ?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default StrengthBarView;
