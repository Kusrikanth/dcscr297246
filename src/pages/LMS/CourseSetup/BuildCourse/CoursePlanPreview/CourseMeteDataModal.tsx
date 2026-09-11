import {
  AvatarGroupUpdated,
  StatusLabel,
} from "../../../../../Components/Common";

const createdByList = [
  {
    empId: 1,
    empCode: "EMP124",
    empName: "Arun Kumar",
    employeeImage: null,
  },
  {
    empId: 2,
    empCode: "EMP128",
    empName: "Varun Raj",
    employeeImage: null,
  },
];

const CourseMeteDataModal = () => {
  return (
    <>
      <div className="offcanvas-body">
        <div className="tw-border tw-rounded tw-py-4 tw-px-3 tw-relative tw-mb-8">
          <div className="tw-absolute tw-top-[0px] tw-left-[12px] tw-px-2 tw-py-1 tw-bg-white tw-rounded tw-transform -tw-translate-y-1/2 ">
            <p className="mb-0 tw-text-xs">Basic Details</p>
          </div>
          <div className="row">
            <p className="col-6 mb-0 tw-text-gray-500">Course Name </p>
            <p className="col-6 mb-0">: CBSE X Maths</p>
          </div>
          <div className="row">
            <p className="col-6 mb-0 tw-text-gray-500">Academic Year </p>
            <p className="col-6 mb-0">: 2024 - 2025</p>
          </div>
          <div className="row">
            <p className="col-6 mb-0 tw-text-gray-500">Curriculum </p>
            <p className="col-6 mb-0">: CBSE</p>
          </div>
          <div className="row">
            <p className="col-6 mb-0 tw-text-gray-500">Class </p>
            <p className="col-6 mb-0">: X</p>
          </div>
          <div className="row">
            <p className="col-6 mb-0 tw-text-gray-500">Subject </p>
            <p className="col-6 mb-0">: Maths</p>
          </div>
        </div>
        <div className="tw-border tw-rounded tw-py-4 tw-px-3 tw-relative tw-mb-8">
          <div className="tw-absolute tw-top-[0px] tw-left-[12px] tw-px-2 tw-py-1 tw-bg-white tw-rounded tw-transform -tw-translate-y-1/2">
            <p className="mb-0 tw-text-xs">Curriculum Blueprint info</p>
          </div>
          <div className="row">
            <p className="col-6 mb-0 tw-text-gray-500">Total Units </p>
            <p className="col-6 mb-0">: 6</p>
          </div>
          <div className="row">
            <p className="col-6 mb-0 tw-text-gray-500">Total Chapters </p>
            <p className="col-6 mb-0">: 12</p>
          </div>
          <div className="row">
            <p className="col-6 mb-0 tw-text-gray-500">Total Topics </p>
            <p className="col-6 mb-0">: 45</p>
          </div>
          <div className="row">
            <p className="col-6 mb-0 tw-text-gray-500">Total Sessions </p>
            <p className="col-6 mb-0">: 89</p>
          </div>
          <div className="row">
            <p className="col-6 mb-0 tw-text-gray-500">Academic Weeks </p>
            <p className="col-6 mb-0">: 40</p>
          </div>
        </div>
        <div className="tw-border tw-rounded tw-py-4 tw-px-3 tw-relative tw-mb-8">
          <div className="tw-absolute tw-top-[0px] tw-left-[12px] tw-px-2 tw-py-1 tw-bg-white tw-rounded tw-transform -tw-translate-y-1/2">
            <p className="mb-0 tw-text-xs">More Details</p>
          </div>
          <div className="row d-flex align-items-center">
            <p className="col-6 mb-0 tw-text-gray-500">Created By </p>
            <div className="col-6 mb-0 d-flex align-items-center">
              <span className="me-2">:</span>
              <AvatarGroupUpdated
                avatars={createdByList || []}
                imageKey="empImage"
                tooltipKey="empName"
                numberOfAvatarToShow={3}
                showLimitedAvatar={true}
                showAvatarName={true}
                uniqueAvatarKey="empId"
              ></AvatarGroupUpdated>
            </div>
          </div>
          <div className="row">
            <p className="col-6 mb-0 tw-text-gray-500">Last Updated </p>
            <p className="col-6 mb-0">: 24 Jul, 2025</p>
          </div>
          <div className="row">
            <p className="col-6 mb-0 tw-text-gray-500">Status </p>
            <div className="col-6 mb-0">
              <span className="me-2">:</span>
              <StatusLabel labelName="Pending" type="warning"></StatusLabel>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseMeteDataModal;
