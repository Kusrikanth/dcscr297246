import DPS from "../../../../assets/images/brands/DPS.png";
import StudentCouncilFormX from "./StudentCouncilFormX";

const StudentCouncilElections = () => {

    return (
        <div className="instruction-new-container">
        <div className="header tw-mb-2">
          <img src={DPS} alt="Logo" className='mw-100' />
        </div>
  
        {/* <div className="header-content">
          <h5 className='fs-20'><span>{branchName}</span> - Application Form - 2023-24</h5>
        </div> */}
        <div className="header-content tw-py-3">
          <h5 className='content tw-m-0'>STUDENT COUNCIL ELECTIONS  - 2024-2025</h5>
          <h5 className='content tw-m-0'>NOMINATION FORM (CLASS 9,10)</h5>
        </div>
      <div>
      <StudentCouncilFormX />
      </div>
      <div className="instruction-footer tw-justify-start">
          <div className='tw-flex tw-items-center tw-text-start'>
            <p className="tw-text-white">
              {`© 2024-2025 Delhi Public School. All Rights Reserved`}
            </p>
          </div>
        </div>
      </div>
    )
};

export default StudentCouncilElections;