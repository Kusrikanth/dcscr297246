import { useFormik } from "formik";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
    SelectInput,
    TextArea,
    TextInput,
} from "../../../../Components/Common";

const initialValues = {
  search: "",
  name: "",
  class: "",
  section: "",
  gender: "",
  applicationPost: "",
  house: "",
  overAllGrades: "",
  Specify: "",
  councilMember: "",
  schoolActivity: "",
  communityService: "",
  numberOfYears: "",
  propagateLeaderI: "",
  propagateLeaderII: "",
  yourManifestoI: "",
  yourManifestoII: "",
  yourManifestoIII: "",
  yourActions: "",
  teamBuilding: "",
};
const selectData3 = [
  {
    genderType: "MALE",
  },
  {
    genderType: "FEMALE",
  },
];
const selectData2 = [
  {
    houseType: "Ruby",
  },
  {
    houseType: "Topaz",
  },
];
const selectData1 = [
  {
    applicationPostType: "Leader",
  },
  {
    applicationPostType: "VC",
  },
];
const selectData4 = [
  {
    overAllGradesType: "Grade1",
  },
  {
    overAllGradesType: "GradeII",
  },
];
const selectData6 = [
  {
    numberOfYearsType: "I",
  },
  {
    numberOfYearsType: "II",
  },
];
const StudentCouncilFromXI = (props: any) => {
  const history = useHistory();
  const [studentCouncilFromXI, setStudentCouncilFromXI] = useState(initialValues);
  const StudentCouncilFromXI = useFormik({
    enableReinitialize: true,
    initialValues: studentCouncilFromXI,
    onSubmit: (values) => {},
  });
  const resetHandler = () => {
    StudentCouncilFromXI.resetForm();
  };
  const isFormFilled = Object.values(StudentCouncilFromXI.values).every(
    (value) => value !== ""
  );
  return (
    <div className="instruction-new-container">
      <div className="inner-instruction-container">
        <div className="instruction-heading">
          <span>GENERAL INSTRUCTIONS</span>
        </div>
        <div className="instruction-container-section-1">
          <ol>
            <li>
              <span className="fw-bold">
              Candidate selection process includes
              </span>
              <ol type="a">
                <li>Filing the nominations according to the school norms</li>
                <li>Online Essay writing</li>
                <li>Offline & Online Group Discussion</li>
                <li>Offline & Online Panel Interview (Shortlisted Candidates)</li>
              </ol>
            </li>
            <li>
            The nomination consists of two forms, Form A and Form B .It is mandatory for the contestant to fill and submit both the forms. Form B opens only after Form A is submitted.
              <br />
              Form B consists of online essay writing on a given topic .The essay should be an original work of the candidate (upto 200 words only). The window will be open for ONLY 30 MINUTES and the essay should be typed in the space provided.	

            </li>
            <li>
              <span className="fw-bold">Eligibility criteria</span>
              <ol type="a">
                <li>
                Student should have secured 70% and above in academics (However there will be relaxation of 15% for students contesting for sports related posts).
                </li>
                <li>
                No Retest students of annual examination are eligible to file their nominations for any posts.
                </li>
                <li>
                Extra edge for students who participated in MUN, IFBM, Youth Parliament, Olympiads, National & State level competitions.
                </li>
              </ol>
            </li>
            <li>
              Photograph (Must be passport size in school uniform only) with
              your name printed below it. The size of photograph should not be
              more than 100 kb. Only JPG/JPEG files are allowed.Refer the sample
              photograph attached
              <img src="" alt="photograph" />
            </li>
            <li>
              {" "}
              It is mandatory for all the short-listed candidates to appear for
              all selection processes (Essay writing, Group Discussion, Panel
              Interview, etc.). The candidature will get disqualified in case of
              any incomplete processes.
            </li>
            <li>
            For class 11 students, two previous consecutive years of schooling in DPS Nacharam is mandatory for white badge holders (not applicable for house captains. New admissions are also eligible for house captains)
            </li>
            <li>
            For class 12 students’ eligibility is relaxed to one year of schooling at DPS Nacharam for the following posts only::
              <ol type="a">
                <li>House Vice Captains</li>
                <li>DPS Chargers</li>
                <li>DPS Green Crusaders</li>
                <li>Selected posts</li>
              </ol>
              The list of elected and selected posts for XI are enclosed below.
            </li>
            <li>
              Student must mention manifesto and values in detail as marks are
              allotted for the same.
            </li>
            <li>
              CRITERIA for selected posts
              <ol type="a">
                <li>No separate nominations for selected posts</li>
                <li>
                  Shortlisted candidates of all other posts are eligible for
                  selected posts. The decision by the election committee will be
                  final.
                </li>
              </ol>
            </li>
            <li>
              Failing to complete/ meet any of the above criteria will
              automatically cancel the nomination.
              <ol type="a">
                <li>
                  Report card (kindly keep your document ready)must be produced
                  during the panel interview.
                </li>
                <li>
                  Relevant certificates (all achievements, Olympiads, Posts, PVA
                  or any other) must be produced during the panel interview.
                </li>
              </ol>
            </li>
          </ol>
          <div className="row form-inputs px-3">
            <div className="col-12 col-md-6 d-flex gap-5 justify-content-around">
              <label className="pe-md-4">Student ID </label>
              <TextInput
                name="search"
                formgroupClassName=" ps-md-4 mb-3"
                value={StudentCouncilFromXI.values.search}
                onChange={StudentCouncilFromXI.handleChange}
              />
            </div>
            <div className="col-12 col-md-6">
              <div className="row">
                <div className="col-12 d-flex gap-4">
                  <label>Upload Photo</label>
                  <div>
                    {" "}
                    <input type="file" className="icondemo fileUpload" />
                    <button type="button" className="button btn-green">
                      UPLOAD
                    </button>
                    <br />
                    <span className="text-danger fw-bold">
                      Max size allowed - 100 KB
                    </span>
                  </div>{" "}
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 d-flex gap-5 justify-content-around">
              <label className="pe-md-4">Student Name </label>
              <TextInput
                name="name"
                formgroupClassName=""
                value={StudentCouncilFromXI.values.name}
                onChange={StudentCouncilFromXI.handleChange}
              />
            </div>
            <div className="col-12 col-md-6 d-flex gap-5 justify-content-around"></div>
            <div className="col-12 col-md-6 d-flex gap-5 justify-content-around">
              <label className="pe-md-4"> Class </label>
              <TextInput
                name="class"
                formgroupClassName=" ps-md-5 ms-1 mb-3"
                value={StudentCouncilFromXI.values.class}
                onChange={StudentCouncilFromXI.handleChange}
              />
            </div>
            <div className="col-12 col-md-6 d-flex gap-5 justify-content-around"></div>
            <div className="col-12 col-md-6 d-flex gap-5 justify-content-around">
              <label className="pe-md-4"> Section </label>
              <TextInput
                name="section"
                formgroupClassName=" ps-md-4 ms-3 mb-3"
                value={StudentCouncilFromXI.values.section}
                onChange={StudentCouncilFromXI.handleChange}
              />
            </div>
            <div className="col-12 col-md-6 d-flex gap-5 justify-content-around"></div>
            <div className="col-12 col-md-6">
              <div className="row  d-flex justify-content-around">
                <div className="col-12 col-md-6  ps-md-5">
                  <label>Gender </label>
                </div>
                <div className="col-12 col-md-6">
                  <SelectInput
                    name="gender"
                    // labelText="Gender:"
                    value={StudentCouncilFromXI.values.gender}
                    onChange={StudentCouncilFromXI.handleChange}
                    menuItems={selectData3}
                    valueKey="genderType"
                    textKey="genderType"
                    formgroupClassName="mb-3"
                    inputClassName="w-80 ms-2"
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 d-flex gap-5 justify-content-around"></div>
            <div className="col-12 col-md-6">
              <div className="row  d-flex justify-content-around">
                <div className="col-12 col-md-6  ps-md-5">
                  <label> House </label>
                </div>
                <div className="col-12 col-md-6 ">
                  <SelectInput
                    name="house"
                    labelText=""
                    value={StudentCouncilFromXI.values.house}
                    onChange={StudentCouncilFromXI.handleChange}
                    menuItems={selectData2}
                    valueKey="houseType"
                    textKey="houseType"
                    formgroupClassName="mb-3"
                    inputClassName="w-80 ms-2"
                  />
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 d-flex gap-5 justify-content-around"></div>
            <div className="col-12 col-md-6">
              <div className="row  d-flex justify-content-around">
                <div className="col-12 col-md-6  ps-md-5">
                  <label>Application for the Post of </label>
                </div>
                <div className="col-12 col-md-6">
                  <SelectInput
                    name="applicationPost"
                    // labelText="	Application for the Post of:"
                    value={StudentCouncilFromXI.values.applicationPost}
                    onChange={StudentCouncilFromXI.handleChange}
                    menuItems={selectData1}
                    valueKey="applicationPostType"
                    textKey="applicationPostType"
                    formgroupClassName="mb-3"
                    inputClassName="w-80 ms-2"
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4"></div>
          </div>
          <div className="fw-bold mb-3 px-md-5">
            <h4 className="mb-0 flex-grow-1 ps-1"> ACADEMICS</h4>
          </div>
          <div className="row px-md-3">
            <div className="col-12 col-md-6">
              <div className="row  d-flex justify-content-around">
                <div className="col-12 col-md-6 ps-2 ps-md-5">
                  <label>Over All Grades </label>
                </div>
                <div className="col-12 col-md-6 ">
                  <SelectInput
                    name="overAllGrades"
                    // labelText=":"
                    value={StudentCouncilFromXI.values.overAllGrades}
                    onChange={StudentCouncilFromXI.handleChange}
                    menuItems={selectData4}
                    valueKey="overAllGradesType"
                    textKey="overAllGradesType"
                    formgroupClassName="mb-3"
                    inputClassName="w-80 ms-2"
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6"></div>
            <div className="col-12 col-md-6 mb-3">
              <div className="row  d-flex justify-content-around">
                <div className="col-12 col-md-6 ps-md-5">
                  {" "}
                  <label>Promoted without any retest </label>
                </div>
                <div className="col-12 col-md-6 ">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="inlineCheckbox23"
                      value="Yes"
                      name="Promoted without any retest"
                    />
                    <label className="form-check-label">Yes</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="inlineCheckbox24"
                      value="No"
                      name="Promoted without any retest"
                    />
                    <label className="form-check-label">No</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="fw-bold mb-3  px-md-5">
            <h4 className="mb-0 flex-grow-1 ps-1">
              {" "}
              SPORTS AND CO-CURRICULAR ACTIVITIES
            </h4>
          </div>
          <div className="row form-inputs px-3">
            <div className="col-12 col-md-6 mb-3  ps-md-5">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id="inlineCheckbox23"
                  value="InSchool"
                  name="school"
                />
                <label className="form-check-label">In School</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id="inlineCheckbox24"
                  value="InterSchool"
                  name="school"
                />
                <label className="form-check-label">Inter School</label>
              </div>
            </div>
            <div className="col-12 col-md-6"></div>
            <div className="col-12 col-md-6 d-flex gap-5 justify-content-around mb-3">
              <label className="pe-md-3"> Specify </label>
              <TextArea
                name="Specify"
                formgroupClassName=" ps-md-4 ms-3 mb-3"
                value={StudentCouncilFromXI.values.Specify}
                onChange={StudentCouncilFromXI.handleChange}
              />
            </div>
            <div className="col-12 col-md-6"></div>
            <div className="col-12 col-md-6">
              <div className="row  d-flex justify-content-around">
                <div className="col-12 col-md-6  ps-md-5 mb-3">
                  {" "}
                  <label> Held any post as Student Council Member </label>
                </div>
                <div className="col-12 col-md-6  ps-md-4">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="inlineCheckbox23"
                      value="Yes"
                      name="	Held any post as Student Council Member"
                    />
                    <label className="form-check-label">Yes</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="inlineCheckbox24"
                      value="No"
                      name="	Held any post as Student Council Member"
                    />
                    <label className="form-check-label">No</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6"></div>
            <div className="col-12 col-md-6 d-flex gap-5 justify-content-around mb-3">
              <label className="ps-1"> If yes, Specify </label>
              <TextArea
                name="councilMember"
                formgroupClassName=" ps-md-4 ms-3 mb-3"
                value={StudentCouncilFromXI.values.councilMember}
                onChange={StudentCouncilFromXI.handleChange}
              />
            </div>
            <div className="col-12 col-md-6"></div>
            <div className="col-12 col-md-6 mb-3">
              <div className="row  d-flex justify-content-around">
                <div className="col-12 col-md-6  ps-md-5">
                  {" "}
                  <label>
                    {" "}
                    Involvement in organizing any major school activity{" "}
                  </label>
                </div>
                <div className="col-12 col-md-6  ps-md-4">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="inlineCheckbox23"
                      value="Yes"
                      name="schoolActivity"
                    />
                    <label className="form-check-label">Yes</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="inlineCheckbox24"
                      value="No"
                      name="schoolActivity"
                    />
                    <label className="form-check-label">No</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6"></div>
            <div className="col-12 col-md-6 d-flex gap-5 justify-content-around mb-3">
              <label className="ps-1"> If yes, Specify </label>
              <TextArea
                name="schoolActivity"
                formgroupClassName=" ps-md-4 ms-3 mb-3"
                value={StudentCouncilFromXI.values.schoolActivity}
                onChange={StudentCouncilFromXI.handleChange}
              />
            </div>
            <div className="col-12 col-md-6"></div>
            <div className="col-12 col-md-6 mb-3">
              <div className="row  d-flex justify-content-around">
                <div className="col-12 col-md-6  ps-md-5">
                  {" "}
                  <label> Participation in Community service </label>
                </div>
                <div className="col-12 col-md-6  ps-md-4">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="inlineCheckbox23"
                      value="Yes"
                      name="Participation in Community service"
                    />
                    <label className="form-check-label">Yes</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="inlineCheckbox24"
                      value="No"
                      name="Participation in Community service"
                    />
                    <label className="form-check-label">No</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6"></div>
            <div className="col-12 col-md-6 d-flex gap-5 justify-content-around">
              <label className="ps-1"> If yes, Specify </label>
              <TextArea
                name="communityService"
                formgroupClassName=" ps-md-4 ms-3 mb-3"
                value={StudentCouncilFromXI.values.communityService}
                onChange={StudentCouncilFromXI.handleChange}
              />
            </div>
            <div className="col-12 col-md-6"></div>
            <div className="col-12 col-md-6">
              <div className="row  d-flex justify-content-around">
                <div className="col-12 col-md-6 ps-2 ps-md-5">
                  <label>Number of years in DPS, Nacharam </label>
                </div>
                <div className="col-12 col-md-6 ">
                  <SelectInput
                    name="numberOfYears"
                    // labelText=":"
                    value={StudentCouncilFromXI.values.numberOfYears}
                    onChange={StudentCouncilFromXI.handleChange}
                    menuItems={selectData6}
                    valueKey="numberOfYearsType"
                    textKey="numberOfYearsType"
                    formgroupClassName="mb-3"
                    inputClassName="w-80 ms-2"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="fw-bold mb-3  px-md-5">
            <h4 className="mb-0 flex-grow-1 ps-1">
              {" "}
              Two values you would exhibit and propagate as a leader :
            </h4>
          </div>
          <div className="row form-inputs px-3">
            <div className="col-12 col-md-6 d-flex ">
              <label className="ps-5"> 1 </label>
              <TextArea
                name="propagateLeaderI"
                formgroupClassName="w-100 ps-md-4 ms-3 mb-3"
                value={StudentCouncilFromXI.values.propagateLeaderI}
                onChange={StudentCouncilFromXI.handleChange}
              />
            </div>
            <div className="col-12 col-md-6"> (Allows 75 characters only)</div>
            <div className="col-12 col-md-6 d-flex ">
              <label className="ps-5"> 2 </label>
              <TextArea
                name="propagateLeaderII"
                formgroupClassName="w-100 ps-md-4 ms-3 mb-3"
                value={StudentCouncilFromXI.values.propagateLeaderII}
                onChange={StudentCouncilFromXI.handleChange}
              />
            </div>
            <div className="col-12 col-md-6"> (Allows 75 characters only)</div>
          </div>
          <div className="fw-bold mb-3  px-md-5">
            <h4 className="mb-0 flex-grow-1 ps-1">
              {" "}
              Give 3 points you would give importance to in your Manifesto :
            </h4>
          </div>
          <div className="row form-inputs px-3">
            <div className="col-12 col-md-6 d-flex ">
              <label className="ps-5"> 1 </label>
              <TextArea
                name="yourManifestoI"
                formgroupClassName="w-100 ps-md-4 ms-3 mb-3"
                value={StudentCouncilFromXI.values.yourManifestoI}
                onChange={StudentCouncilFromXI.handleChange}
              />
            </div>
            <div className="col-12 col-md-6"> (Allows 100 characters only)</div>
            <div className="col-12 col-md-6 d-flex ">
              <label className="ps-5"> 2 </label>
              <TextArea
                name="yourManifestoII"
                formgroupClassName="w-100 ps-md-4 ms-3 mb-3"
                value={StudentCouncilFromXI.values.yourManifestoII}
                onChange={StudentCouncilFromXI.handleChange}
              />
            </div>
            <div className="col-12 col-md-6"> (Allows 100 characters only)</div>
            <div className="col-12 col-md-6 d-flex ">
              <label className="ps-5"> 3 </label>
              <TextArea
                name="yourManifestoIII"
                formgroupClassName="w-100 ps-md-4 ms-3 mb-3"
                value={StudentCouncilFromXI.values.yourManifestoIII}
                onChange={StudentCouncilFromXI.handleChange}
              />
            </div>
            <div className="col-12 col-md-6"> (Allows 100 characters only)</div>
          </div>
          <div className="fw-bold mb-3  px-md-5">
            <h4 className="mb-0 flex-grow-1 ps-1">
              {" "}
              How would you incorporate school spirit in your actions?
            </h4>
          </div>
          <div className="row form-inputs px-3">
            <div className="col-12 col-md-6 d-flex ">
              <label className="ps-5"> 1 </label>
              <TextArea
                name="yourActions"
                formgroupClassName="w-100 ps-md-4 ms-3 mb-3"
                value={StudentCouncilFromXI.values.yourActions}
                onChange={StudentCouncilFromXI.handleChange}
              />
            </div>
            <div className="col-12 col-md-6"> (Allows 100 characters only)</div>
          </div>
          <div className="fw-bold mb-3  px-md-5">
            <h4 className="mb-0 flex-grow-1 ps-1">
              {" "}
              Which attribute do you think is the most important in team
              building?
            </h4>
          </div>
          <div className="row form-inputs px-3">
            <div className="col-12 col-md-6 d-flex ">
              <label className="ps-5"> 1 </label>
              <TextArea
                name="teamBuilding"
                formgroupClassName="w-100 ps-md-4 ms-3 mb-3"
                value={StudentCouncilFromXI.values.teamBuilding}
                onChange={StudentCouncilFromXI.handleChange}
              />
            </div>
            <div className="col-12 col-md-6"> (Allows 100 characters only)</div>
          </div>
          <div className="col-12 bottom-list">
            <div className="row buttons-group my-3 btn-classes w-100 text-center">
              <div className="col-md-3 "></div>
              <div className="col-12 col-md-3 mb-2 reset-button">
                <button
                  className="btn w-100 py-3 fs-16"
                  style={{
                    backgroundColor: "#a5abaf",
                    color: "white",
                  }}
                  onClick={resetHandler}
                >
                  Reset
                </button>
              </div>

              <div className="col-12 col-md-3 pay-button">
                <button
                  className="btn btn-green w-100 py-3 fs-16"
                  type="submit"
                  disabled={!isFormFilled}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCouncilFromXI;
