import { useMemo, useState } from "react";
import { TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import UpdatedHorizontalTab from "../../../Components/Common/UpdatedHorizontalTab";
import UpcomingAssessment from "./UpcomingAssessment";
import AttemptedAssessment from "./AttemptedSssessment";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
  Icon: any;
}

const assessementItems = [
  {
    id: 1,
    title: "Continuous Learning: Embrace Lifelong Education",
    subtitle: "Lifelong Education Overview",
    questions: 5,
    createdAt: "Jan 31, 2025",
    marks: 14,
    duration: "02:30 hrs.",
    statusLabel: "Upcoming",
    image: "",
  },
  {
    id: 2,
    title: "Critical Thinking & Problem Solving",
    subtitle: "Problem Solving Skills",
    questions: 10,
    createdAt: "Feb 10, 2025",
    marks: 20,
    duration: "01:45 hrs.",
    statusLabel: "Attempted",
    image: "",
  },
  {
    id: 3,
    title: "21st Century Communication Skills",
    subtitle: "Verbal & Written Skills",
    questions: 8,
    createdAt: "Mar 05, 2025",
    marks: 18,
    duration: "02:00 hrs.",
    statusLabel: "Upcoming",
    image: "",
  },
  {
    id: 4,
    title: "Digital Literacy and Safety",
    subtitle: "Understanding Cyber Ethics",
    questions: 6,
    createdAt: "Apr 12, 2025",
    marks: 12,
    duration: "01:30 hrs.",
    statusLabel: "Attempted",
    image: "",
  },
  {
    id: 5,
    title: "Environmental Awareness Quiz",
    subtitle: "Sustainability & Ecology",
    questions: 7,
    createdAt: "May 02, 2025",
    marks: 15,
    duration: "01:20 hrs.",
    statusLabel: "Upcoming",
    image: "",
  },
  {
    id: 6,
    title: "Financial Literacy Test",
    subtitle: "Basic Budgeting Skills",
    questions: 9,
    createdAt: "May 22, 2025",
    marks: 16,
    duration: "01:40 hrs.",
    statusLabel: "Attempted",
    image: "",
  },
  {
    id: 7,
    title: "Social and Emotional Learning",
    subtitle: "Empathy & Teamwork",
    questions: 6,
    createdAt: "Jun 10, 2025",
    marks: 10,
    duration: "01:15 hrs.",
    statusLabel: "Upcoming",
    image: "",
  },
  {
    id: 8,
    title: "Cybersecurity Fundamentals",
    subtitle: "Protecting Digital Identity",
    questions: 8,
    createdAt: "Jun 25, 2025",
    marks: 18,
    duration: "02:00 hrs.",
    statusLabel: "Attempted",
    image: "",
  },
  {
    id: 9,
    title: "Entrepreneurship Basics",
    subtitle: "Innovation & Startups",
    questions: 11,
    createdAt: "Jul 05, 2025",
    marks: 22,
    duration: "02:15 hrs.",
    statusLabel: "Upcoming",
    image: "",
  },
  {
    id: 10,
    title: "Ethics in AI and Technology",
    subtitle: "Responsible Innovation",
    questions: 7,
    createdAt: "Jul 20, 2025",
    marks: 17,
    duration: "01:50 hrs.",
    statusLabel: "Attempted",
    image: "",
  },
];

const StudentAssessmenets = () => {
  const [activeId, setActiveId] = useState("upcoming");
  const [assessementList, setAssessementList] = useState(assessementItems);

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "upcoming",
      labelName: "Upcoming",
      customPadding: "0px 5px 5px 5px",
      Icon: "",
    },
    {
      id: "attempted",
      labelName: "Attempted",
      customPadding: "0px 5px 5px 5px",
      Icon: "",
    },
  ];

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event;
    const menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId || "");
  }

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "upcoming":
        return UpcomingAssessment;
      case "attempted":
        return AttemptedAssessment;
      default:
        return null;
    }
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);

    return (
      <TabComponent
        assessementList={assessementList.filter(
          (ele) => ele?.statusLabel?.toLocaleLowerCase() === activeId
        )}
      ></TabComponent>
    );
  }, [activeId]);

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="LMS" pageTitle="LMS" />
          <div className="row">
            <div className="col-12">
              <div className="card" id="tasksList">
                <div className="card-header">
                  <div className="row d-flex align-items-center">
                    <div className="col-12 col-lg-4">
                      <h4 className="card-title mb-0 flex-grow-1">
                        Assessment
                      </h4>
                    </div>
                    <div className="col-12 col-lg-8 ms-auto">
                      <div className="row d-flex align-items-center justify-content-end gx-3">
                        <div className="col-4">
                          <div className="search-box">
                            <TextInput
                              name="searchString"
                              formgroupClassName="mb-0"
                              placeHolder="Search"
                              value=""
                              onChange={() => {}}
                            ></TextInput>
                            <i className="ri-search-line search-icon"></i>
                          </div>
                        </div>
                        <div className="col-auto">
                          <UpdatedHorizontalTab
                            MenuOptions={MenuOptions}
                            clickMenuHandler={clickMenuHandler}
                            activeTabId={activeId}
                            horizontalClass="overflow-auto text-nowrap justify-content-end horizontal-menu-updated-style"
                          ></UpdatedHorizontalTab>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-body">{activeComponent}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentAssessmenets;
