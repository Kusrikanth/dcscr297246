import React from 'react'

const RegistrationForm = () => {
    return (
        <div className="tw-w-full">
            <div className="tw-bg-white">
                <section className="tw-border-b">
                    <div className="tw-max-w-7xl tw-mx-auto tw-px-4 tw-py-4">
                        <div className="tw-grid tw-grid-cols-2">
                            <div>
                                <img src="assets/images/logo.png" alt="logo" />
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="container" id="myWizard">
                        <div className="registration-form-body" style={{ maxWidth: "100%" }}>
                            <div className="tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-items-center tw-py-4 tw-border-b">
                                <div>
                                    <h2 className="tw-text-2xl tw-font-bold">REGISTRATION FORM</h2>
                                </div>
                                <div className="tw-mt-3 md:tw-mt-0">
                                    <a
                                        href="#"
                                        className="tw-bg-blue-600 tw-text-white tw-px-4 tw-py-2 tw-rounded"
                                    >
                                        DOWNLOAD PROSPECTUS
                                    </a>
                                </div>
                            </div>

                            <div className="tw-px-6 tw-py-4">
                                <div className="tw-w-full tw-bg-gray-200 tw-rounded tw-h-2">
                                    <div className="tw-bg-green-600 tw-h-2 tw-rounded"></div>
                                </div>
                                <div className="tw-flex tw-justify-between tw-text-sm tw-mt-2">
                                    <div>0%</div>
                                    <div>100%</div>
                                </div>
                            </div>

                            <div className="tw-px-6 tw-py-2">
                                <ul className="tw-flex tw-flex-wrap tw-gap-3 tw-text-sm">
                                    <li className="tw-font-semibold tw-text-green-600">
                                        Student Details
                                    </li>
                                    <li>Sports/ Co-Curricular</li>
                                    <li>Parent Details</li>
                                    <li>Communication Details</li>
                                    <li>Upload Documents</li>
                                    <li>Upload Photos</li>
                                    <li>Submission</li>
                                </ul>
                            </div>

                            <div className="tw-px-6 tw-py-4">
                                <form>
                                    <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-3 tw-gap-4">
                                        <div>
                                            <label className="tw-block tw-mb-1">Academic Year</label>
                                            <select className="tw-w-full tw-border tw-border-gray-300 tw-rounded tw-px-3 tw-py-2">
                                                <option>Lorem Ipsum</option>
                                                <option>Lorem Ipsum</option>
                                                <option>Lorem Ipsum</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="tw-block tw-mb-1">Campus</label>
                                            <select className="tw-w-full tw-border tw-border-gray-300 tw-rounded tw-px-3 tw-py-2">
                                                <option>Lorem Ipsum</option>
                                                <option>Lorem Ipsum</option>
                                                <option>Lorem Ipsum</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-3 tw-gap-4 tw-mt-4">
                                        <div>
                                            <label className="tw-block tw-mb-1">
                                                Application Number
                                            </label>
                                            <input
                                                type="text"
                                                value="NHAP220013"
                                                readOnly
                                                className="tw-w-full tw-border tw-border-gray-300 tw-rounded tw-px-3 tw-py-2 tw-bg-gray-100"
                                            />
                                        </div>

                                        <div>
                                            <label className="tw-block tw-mb-1">
                                                Application Date
                                            </label>
                                            <input
                                                type="text"
                                                value="12/09/2021"
                                                readOnly
                                                className="tw-w-full tw-border tw-border-gray-300 tw-rounded tw-px-3 tw-py-2 tw-bg-gray-100"
                                            />
                                        </div>

                                        <div>
                                            <label className="tw-block tw-mb-1">
                                                Curriculum Sought
                                            </label>
                                            <input
                                                type="text"
                                                value="CBSE"
                                                readOnly
                                                className="tw-w-full tw-border tw-border-gray-300 tw-rounded tw-px-3 tw-py-2 tw-bg-gray-100"
                                            />
                                        </div>
                                    </div>
                                    {/* <div className="tab-content">
                                        <div className="tab-pane fade in active" id="step1">
                                            <div className="well">
                                                <div className="row">
                                                    <div className="accordion" id="accordionPanelsStayOpenExample">
                                                        <div className="accordion-item">
                                                            <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                                                    BASIC INFORMATION
                                                                </button>
                                                            </h2>
                                                            <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
                                                                <div className="accordion-body">

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Student Name</label>
                                                                            <input name="studentName" type="text" placeholder="Student Name" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Gender</label>
                                                                            <input name="gender" type="text" placeholder="Gender" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Blood Group</label>
                                                                            <select name="bloodGroup" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Date of Birth</label>
                                                                            <input className="datepicker" name="dob" type="text" placeholder="DD/MM/YYYY" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Place of Birth</label>
                                                                            <input name="gender" type="pob" placeholder="Gender" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Nationality</label>
                                                                            <select name="bloodGroup" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Your Phone Number</label>
                                                                            <input type="tel" className="form-control" name="code" placeholder="+91" />
                                                                            <input type="tel" className="form-control" name="phone" placeholder="Your Phone Number" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Email Address</label>
                                                                            <input type="email" name="email" placeholder="Please enter details" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Admission Sought for*</label>
                                                                            <select name="bloodGroup" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>


                                                        <div className="accordion-item mt-40 custom-accordionTabCss">
                                                            <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
                                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="true" aria-controls="panelsStayOpen-collapseTwo">
                                                                    EDUCATION INFORMATION
                                                                </button>
                                                            </h2>
                                                            <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingTwo">
                                                                <div className="accordion-body">

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Last School Studied</label>
                                                                            <input name="school_studied" type="text" placeholder="Last School Studied" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Last Curriculum Studied</label>
                                                                            <select name="last_curriculum_studied" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Last Place of School Studied</label>
                                                                            <select name="last-plce-of-school-studied" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Last className Studied</label>
                                                                            <select name="last-className-studied" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Admission Type</label>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input" type="radio" id="inlineCheckbox1" value="Residential" name="inlineRadioOptions" />
                                                                                <label className="form-check-label">Residential</label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input" type="radio" id="inlineCheckbox2" value="Non-Residential" name="inlineRadioOptions" />
                                                                                <label className="form-check-label">Non-Residential</label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Are you an Employee of DPS?</label>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input" type="radio" id="inlineCheckbox3" value="yes" name="inlineRadioOptions1" />
                                                                                <label className="form-check-label">Yes</label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input" type="radio" id="inlineCheckbox4" value="no" name="inlineRadioOptions1" />
                                                                                <label className="form-check-label">No</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-12">
                                                                            <label>Reason for Seeking Admission</label>
                                                                            <textarea className="form-control" name="reason_for_seeking_admission" placeholder="Please enter details"></textarea>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>


                                                        <div className="accordion-item mt-40">
                                                            <h2 className="accordion-header" id="panelsStayOpen-headingThree">
                                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="true" aria-controls="panelsStayOpen-collapseThree">
                                                                    IDENTIFICATION INFORMATION
                                                                </button>
                                                            </h2>
                                                            <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingThree">
                                                                <div className="accordion-body">

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-12">
                                                                            <label>Select UID Number</label>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input" type="radio" id="inlineCheckbox5" value="Aadhaar Card" name="uidNumber" checked />
                                                                                <label className="form-check-label">Aadhaar Card</label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input" type="radio" id="inlineCheckbox6" value="Foreign National Passport Number" name="uidNumber" />
                                                                                <label className="form-check-label">Foreign National Passport Number</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>ID Number</label>
                                                                            <input name="idNumber" type="text" placeholder="Please enter details" />
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Identification Mark I</label>
                                                                            <input name="IdentificationMark1" type="text" placeholder="Please enter details" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Identification Mark II</label>
                                                                            <input name="IdentificationMark2" type="text" placeholder="Please enter details" />
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Religion</label>
                                                                            <select name="religion" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Caste</label>
                                                                            <select name="caste" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Mother Tongue</label>
                                                                            <select name="mother-tongue" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>First Language</label>
                                                                            <select name="FirstLanguage" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Second Language</label>
                                                                            <select name="SecondLanguage" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Third Language</label>
                                                                            <select name="ThirdLanguage" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>


                                                        <div className="accordion-item mt-40 custom-accordionTabCss">
                                                            <h2 className="accordion-header" id="panelsStayOpen-headingFour">
                                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseFour" aria-expanded="true" aria-controls="panelsStayOpen-collapseFour">
                                                                    FAMILY INFORMATION
                                                                </button>
                                                            </h2>
                                                            <div id="panelsStayOpen-collapseFour" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingFour">
                                                                <div className="accordion-body">


                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-5">
                                                                            <label>Whether the Candidate is a Single Child?</label>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input" type="radio" id="inlineCheckbox7" value="Yes" name="SingleChild" checked />
                                                                                <label className="form-check-label">Yes</label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input" type="radio" id="inlineCheckbox8" value="No" name="SingleChild" />
                                                                                <label className="form-check-label">No</label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-12 col-sm-7">
                                                                            <label>Whether the Candidate is a Specially Abled (Divyangajan)?</label>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input" type="radio" id="inlineCheckbox9" value="Yes" name="divyangajan" checked />
                                                                                <label className="form-check-label">Yes</label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input" type="radio" id="inlineCheckbox10" value="No" name="divyangajan" />
                                                                                <label className="form-check-label">No</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-12">
                                                                            <label>Health Status</label>
                                                                            <textarea className="form-control" name="healthStatus" placeholder="Please enter details"></textarea>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-5">
                                                                            <label>Does the candidate have any sibling?</label>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input" type="radio" id="inlineCheckbox7" value="Yes" name="sibling" checked />
                                                                                <label className="form-check-label">Yes</label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input" type="radio" id="inlineCheckbox12" value="No" name="sibling" />
                                                                                <label className="form-check-label">No</label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-12 col-sm-7">
                                                                            <label>Is the sibling studying in same school?</label>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input" type="radio" id="inlineCheckbox13" value="Yes" name="siblingStudyin" checked />
                                                                                <label className="form-check-label">Yes</label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input" type="radio" id="inlineCheckbox14" value="No" name="siblingStudyin" />
                                                                                <label className="form-check-label">No</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Sibling Student Name</label>
                                                                            <input name="school_studied" type="text" placeholder="Please enter details" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Sibling Student ID</label>
                                                                            <input name="school_studied" type="text" placeholder="Please enter details" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Sibling Student Curriculum</label>
                                                                            <select name="last-plce-of-school-studied" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Sibling Student Campus</label>
                                                                            <select name="last-className-studied" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Sibling Student className</label>
                                                                            <select name="last-plce-of-school-studied" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Sibling Student Section</label>
                                                                            <select name="last-plce-of-school-studied" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-12">
                                                                            <label>Sibling Student Details</label>
                                                                            <textarea className="form-control" placeholder="Please enter details"></textarea>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-12">
                                                                            <button type="button" className="btn btn-outline-green mr-30" >Add sibling details</button>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>


                                                        <div className="accordion-item mt-40">
                                                            <h2 className="accordion-header" id="panelsStayOpen-headingFive">
                                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseFive" aria-expanded="true" aria-controls="panelsStayOpen-collapseFive">
                                                                    FACILITIES REQUIRED
                                                                </button>
                                                            </h2>
                                                            <div id="panelsStayOpen-collapseFive" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingFive">
                                                                <div className="accordion-body">

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-12">
                                                                            <div className="form-check check-box">
                                                                                <input className="form-check-input" type="checkbox" value="" id="defaultCheck19" />
                                                                                <label className="form-check-label">
                                                                                    School Transport
                                                                                </label>
                                                                            </div>
                                                                            <div className="form-check  check-box">
                                                                                <input className="form-check-input" type="checkbox" value="" id="defaultCheck20" />
                                                                                <label className="form-check-label">
                                                                                    Lunch Facility
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>


                                                    </div>
                                                </div>
                                                <div className="row nav-buttons-bottom nav nav-pills">
                                                    <div className="container text-end">
                                                        <a className="btn btn-outline-secondary disabled prev mr-30" href="#">Previous</a>
                                                        <a href="#step2" data-toggle="tab" data-step="2" aria-expanded="true" className="btn btn-success next">Next</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="tab-pane" id="step2">
                                            <div className="well">
                                                <div className="row">
                                                    <div className="accordion" id="accordionPanelsStayOpenExample">
                                                        <div className="accordion-item">
                                                            <h2 className="accordion-header" id="panelsStayOpen-headingSix">
                                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseSix" aria-expanded="true" aria-controls="panelsStayOpen-collapseSix">
                                                                    DOCUMENT INFORMATION
                                                                </button>
                                                            </h2>
                                                            <div id="panelsStayOpen-collapseSix" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingSix">
                                                                <div className="accordion-body">

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Level</label>
                                                                            <select name="last-plce-of-school-studied" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-12">
                                                                            <label>Description</label>
                                                                            <textarea className="form-control" name="reason_for_seeking_admission" placeholder="Please enter details"></textarea>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Category</label>
                                                                            <select name="last-plce-of-school-studied" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Choose File</label>
                                                                            <select name="last-plce-of-school-studied" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Choose File</label>
                                                                            <input type="file" className="icondemo fileUpload" />
                                                                            <button type="button" className="btn btn-orange mr-30 mt-20" >UPLOAD</button>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-12">
                                                                            <button type="button" className="btn btn-outline-green mr-30" >Add Document</button>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                                <div className="row nav-buttons-bottom">
                                                    <div className="container text-end">
                                                        <button className="btn btn-outline-secondary prev mr-30" data-toggle="tab" data-step="1" aria-expanded="true" >Previous</button>
                                                        <button className="btn btn-success next" data-toggle="tab" data-step="3" aria-expanded="true" >Next</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="tab-pane" id="step3">
                                            <div className="well">
                                                <div className="row">
                                                    <div className="accordion" id="accordionPanelsStayOpenExample">
                                                        <div className="accordion-item">
                                                            <h2 className="accordion-header" id="panelsStayOpen-headingSeven">
                                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseSeven" aria-expanded="true" aria-controls="panelsStayOpen-collapseSeven">
                                                                    FATHER’S DETAILS
                                                                </button>
                                                            </h2>
                                                            <div id="panelsStayOpen-collapseSeven" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingSeven">
                                                                <div className="accordion-body">

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Name</label>
                                                                            <input name="fatherName" type="text" placeholder="Please enter details" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Nationality</label>
                                                                            <select name="nationality" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Occupation</label>
                                                                            <select name="occupation" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Qualification</label>
                                                                            <select name="occupation" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Specify Qualification</label>
                                                                            <input name="specifyQualification" type="text" placeholder="Please enter details" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Designation</label>
                                                                            <select name="designation" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Your Phone Number</label>
                                                                            <input type="tel" className="form-control" name="code" placeholder="+91" />
                                                                            <input type="tel" className="form-control" name="fatherPhone" placeholder="Your Phone Number" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Email Address</label>
                                                                            <input type="email" name="fatherEmail" placeholder="Your Email Address" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Aadhaar Number</label>
                                                                            <input type="text" name="aadher" placeholder="XXXX - XXXX - XXXX" />
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Name of the Organisation</label>
                                                                            <input type="text" className="form-control" name="organisation" placeholder="Please enter details" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-8">
                                                                            <label>Address of the Organisation</label>
                                                                            <input type="text" name="addressOfOrganisation" placeholder="Please enter details" />
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Name of the Organisation</label>
                                                                            <select name="nameOfTheOrganisation" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Are you a Single Parent?</label>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input" type="radio" id="inlineCheckbox21" value="Yes" name="singleParent" />
                                                                                <label className="form-check-label">Yes</label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input" type="radio" id="inlineCheckbox22" value="No" name="singleParent" />
                                                                                <label className="form-check-label">No</label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>If Yes, Choose from Below</label>
                                                                            <select name="choose" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>


                                                                </div>
                                                            </div>
                                                        </div>


                                                        <div className="accordion-item mt-40">
                                                            <h2 className="accordion-header" id="panelsStayOpen-headingEight">
                                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseEight" aria-expanded="true" aria-controls="panelsStayOpen-collapseEight">
                                                                    MOTHER’S DETAILS
                                                                </button>
                                                            </h2>
                                                            <div id="panelsStayOpen-collapseEight" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingEight">
                                                                <div className="accordion-body">

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Name</label>
                                                                            <input name="motherName" type="text" placeholder="Please enter details" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Nationality</label>
                                                                            <select name="motherNationality" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Occupation</label>
                                                                            <select name="motherOccupation" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Qualification</label>
                                                                            <select name="motherQualification" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Specify Qualification</label>
                                                                            <input name="motherSpecifyQualification" type="text" placeholder="Please enter details" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Designation</label>
                                                                            <select name="motherDesignation" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Your Phone Number</label>
                                                                            <input type="tel" className="form-control" name="code" placeholder="+91" />
                                                                            <input type="tel" className="form-control" name="motherPhone" placeholder="Your Phone Number" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Email Address</label>
                                                                            <input type="email" name="motherEmail" placeholder="Your Email Address" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Aadhaar Number</label>
                                                                            <input type="text" name="montherAadher" placeholder="XXXX - XXXX - XXXX" />
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Name of the Organisation</label>
                                                                            <input type="text" className="form-control" name="organisation" placeholder="Please enter details" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-8">
                                                                            <label>Address of the Organisation</label>
                                                                            <input type="text" name="addressOfOrganisation" placeholder="Please enter details" />
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Name of the Organisation</label>
                                                                            <select name="nameOfTheOrganisation" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Are you a Single Parent?</label>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input" type="radio" id="inlineCheckbox21" value="Yes" name="singleParent" />
                                                                                <label className="form-check-label">Yes</label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input" type="radio" id="inlineCheckbox22" value="No" name="singleParent" />
                                                                                <label className="form-check-label">No</label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>If Yes, Choose from Below</label>
                                                                            <select name="choose" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>


                                                                </div>
                                                            </div>
                                                        </div>


                                                        <div className="accordion-item mt-40">
                                                            <h2 className="accordion-header" id="panelsStayOpen-headingNine">
                                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseNine" aria-expanded="true" aria-controls="panelsStayOpen-collapseNine">
                                                                    GUARDIAN’S DETAILS
                                                                </button>
                                                            </h2>
                                                            <div id="panelsStayOpen-collapseNine" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingNine">
                                                                <div className="accordion-body">


                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Guardian</label>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input" type="radio" id="inlineCheckbox23" value="Yes" name="Guardian" />
                                                                                <label className="form-check-label">Yes</label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input" type="radio" id="inlineCheckbox24" value="No" name="Guardian" />
                                                                                <label className="form-check-label">No</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Name</label>
                                                                            <input name="guName" type="text" placeholder="Please enter details" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Nationality</label>
                                                                            <select name="guNationality" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>

                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Occupation</label>
                                                                            <select name="motherOccupation" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Designation</label>
                                                                            <select name="motherDesignation" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Aadhaar Number</label>
                                                                            <input type="text" name="montherAadher" placeholder="XXXX - XXXX - XXXX" />
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Your Phone Number</label>
                                                                            <input type="tel" className="form-control" name="code" placeholder="+91" />
                                                                            <input type="tel" className="form-control" name="motherPhone" placeholder="Your Phone Number" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Email Address</label>
                                                                            <input type="email" name="motherEmail" placeholder="Your Email Address" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Relation with Student</label>
                                                                            <select name="relationWithStudent" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>




                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                                <div className="row nav-buttons-bottom">
                                                    <div className="container text-end">
                                                        <button className="btn btn-outline-secondary prev mr-30" data-toggle="tab" data-step="2" aria-expanded="true" >Previous</button>
                                                        <button className="btn btn-success next" data-toggle="tab" data-step="4" aria-expanded="true" >Next</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="tab-pane" id="step4">
                                            <div className="well">
                                                <div className="row">
                                                    <div className="accordion" id="accordionPanelsStayOpenExample">
                                                        <div className="accordion-item">
                                                            <h2 className="accordion-header" id="panelsStayOpen-headingTen">
                                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTen" aria-expanded="true" aria-controls="panelsStayOpen-collapseTen">
                                                                    RESIDENTIAL ADDRESS
                                                                </button>
                                                            </h2>
                                                            <div id="panelsStayOpen-collapseTen" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingTen">
                                                                <div className="accordion-body">

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>H.No./ Flat No.</label>
                                                                            <input name="flatNo" type="text" placeholder="Please enter details" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Address Line 01</label>
                                                                            <input name="addressline1" type="text" placeholder="Please enter details" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Address Line 02 (Optional)</label>
                                                                            <input name="addressline2" type="text" placeholder="Please enter details" />
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Landmark</label>
                                                                            <input name="landmark" type="text" placeholder="Please enter details" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>City</label>
                                                                            <select name="city" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>State</label>
                                                                            <select name="state" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Pincode/ Zip Code</label>
                                                                            <input type="text" name="pincode" placeholder="Please enter details" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Country</label>
                                                                            <select name="country" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Location</label>
                                                                            <input type="text" name="location" className="Location" placeholder="Please start typing your location" />
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Distance from School</label>
                                                                            <select name="distanceFromSchool" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Area</label>
                                                                            <select name="area" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>


                                                        <div className="accordion-item mt-40">
                                                            <h2 className="accordion-header" id="panelsStayOpen-headingEleven">
                                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseEleven" aria-expanded="true" aria-controls="panelsStayOpen-collapseEleven">
                                                                    RESIDENTIAL ADDRESS
                                                                </button>
                                                            </h2>
                                                            <div id="panelsStayOpen-collapseEleven" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingEleven">
                                                                <div className="accordion-body">
                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-12">
                                                                            <label>Same as Residential Address</label>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input" type="radio" id="inlineCheckbox11" value="Yes" name="residential" />
                                                                                <label className="form-check-label">Yes</label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input" type="radio" id="inlineCheckbox12" value="No" name="residential" />
                                                                                <label className="form-check-label" >No</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>



                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>H.No./ Flat No.</label>
                                                                            <input name="flatNo" type="text" placeholder="Please enter details" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Address Line 01</label>
                                                                            <input name="addressline1" type="text" placeholder="Please enter details" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Address Line 02 (Optional)</label>
                                                                            <input name="addressline2" type="text" placeholder="Please enter details" />
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Landmark</label>
                                                                            <input name="landmark" type="text" placeholder="Please enter details" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>City</label>
                                                                            <select name="city" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>State</label>
                                                                            <select name="state" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Pincode/ Zip Code</label>
                                                                            <input type="text" name="pincode" placeholder="Please enter details" />
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Country</label>
                                                                            <select name="country" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Location</label>
                                                                            <input type="text" name="location" className="Location" placeholder="Please start typing your location" />
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Distance from School</label>
                                                                            <select name="distanceFromSchool" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Area</label>
                                                                            <select name="area" className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>

                                                <div className="row nav-buttons-bottom">
                                                    <div className="container text-end">
                                                        <button className="btn btn-outline-secondary prev mr-30" href="#step3" data-toggle="tab" data-step="3" aria-expanded="true" >Previous</button>
                                                        <button className="btn btn-success next" href="#step5" data-toggle="tab" data-step="5" aria-expanded="true" >Next</button>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>


                                        <div className="tab-pane" id="step5">
                                            <div className="well">
                                                <div className="row">
                                                    <div className="accordion" id="accordionPanelsStayOpenExample">
                                                        <div className="accordion-item">
                                                            <h2 className="accordion-header" id="panelsStayOpen-headingTwelve">
                                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwelve" aria-expanded="true" aria-controls="panelsStayOpen-collapseTwelve">
                                                                    DOCUMENTS FOR SUBMISSION
                                                                </button>
                                                            </h2>
                                                            <div id="panelsStayOpen-collapseTwelve" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingTwelve">
                                                                <div className="accordion-body">
                                                                    <div className="row textPara">
                                                                        <h5>Specifications for uploading documents</h5>
                                                                        <p>All files must be in JPG/JPEG-format to be accepted for uploading.However all the pages of report cards be saved as pdf format and then upload. Maximum size allowed 500kb. You must scan your original documents, Photographs of documents are acceptable</p>
                                                                        <p className="text-green"><b>Note :</b> Please save the entire document (all the pages) in pdf format and then upload. Size - 500kb(Only for Report Cards)</p>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-4">
                                                                            <label>Document Name</label>
                                                                            <input type="text" placeholder="Bonafide Certificate" readyonly>
                                                                        </div>
                                                                        <div className="col-4">
                                                                            <label>Choose File</label>
                                                                            <input type="file" className="icondemo fileUpload">
                                                                        </div>
                                                                        <div className="col-4">
                                                                            <button type="button" className="btn btn-orange mt-40" href="#">UPLOAD</button>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-4">
                                                                            <input type="text" placeholder="Date of Birth Certificate" readyonly>
                                                                        </div>
                                                                        <div className="col-4">
                                                                            <input type="file" className="icondemo fileUpload">
                                                                        </div>
                                                                        <div className="col-4">
                                                                            <button type="button" className="btn btn-orange" href="#">UPLOAD</button>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-4">
                                                                            <input type="text" placeholder="Report Card of Current Term of the Year" readyonly>
                                                                        </div>
                                                                        <div className="col-4">
                                                                            <input type="file" className="icondemo fileUpload">
                                                                        </div>
                                                                        <div className="col-4">
                                                                            <button type="button" className="btn btn-orange" href="#">UPLOAD</button>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-4">
                                                                            <input type="text" placeholder="Final Report Card of Last Year" readyonly>
                                                                        </div>
                                                                        <div className="col-4">
                                                                            <input type="file" className="icondemo fileUpload">
                                                                        </div>
                                                                        <div className="col-4">
                                                                            <button type="button" className="btn btn-orange" href="#">UPLOAD</button>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-4">
                                                                            <input type="text" placeholder="Final Report Card of Last Second Year" readyonly>
                                                                        </div>
                                                                        <div className="col-4">
                                                                            <input type="file" className="icondemo fileUpload">
                                                                        </div>
                                                                        <div className="col-4">
                                                                            <button type="button" className="btn btn-orange" href="#">UPLOAD</button>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-4">
                                                                            <input type="text" placeholder="Aadhaar Card/ Foreign National Passport" readyonly>
                                                                        </div>
                                                                        <div className="col-4">
                                                                            <input type="file" className="icondemo fileUpload">
                                                                        </div>
                                                                        <div className="col-4">
                                                                            <button type="button" className="btn btn-orange" href="#">UPLOAD</button>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-4">
                                                                            <input type="text" placeholder="Residential Address" readyonly>
                                                                        </div>
                                                                        <div className="col-4">
                                                                            <input type="file" className="icondemo fileUpload">
                                                                        </div>
                                                                        <div className="col-4">
                                                                            <button type="button" className="btn btn-orange" href="#">UPLOAD</button>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>


                                                        <div className="accordion-item mt-40">
                                                            <h2 className="accordion-header" id="panelsStayOpen-headingThirteen">
                                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThirteen" aria-expanded="true" aria-controls="panelsStayOpen-collapseThirteen">
                                                                    ACADEMIC DETAILS
                                                                </button>
                                                            </h2>
                                                            <div id="panelsStayOpen-collapseThirteen" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingThirteen">
                                                                <div className="accordion-body">
                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Latest Academic Percentage</label>
                                                                            <select className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="row">
                                                                            <label>Results of  Last className (2020)</label>
                                                                        </div>
                                                                        <div className="row">
                                                                            <div className="col">
                                                                                <label>Subject</label>
                                                                                <input type="text" placeholder="Please enter details">
                                                                            </div>
                                                                            <div className="col">
                                                                                <label>Maximum Marks</label>
                                                                                <input type="text" placeholder="Please enter details">
                                                                            </div>
                                                                            <div className="col">
                                                                                <label>Marks Obtained</label>
                                                                                <input type="text" placeholder="Please enter details">
                                                                            </div>
                                                                            <div className="col">
                                                                                <label>% of Marks</label>
                                                                                <input type="text" placeholder="Please enter details">
                                                                            </div>
                                                                            <div className="col">
                                                                                <label>Remarks</label>
                                                                                <input type="text" placeholder="Please enter details">
                                                                            </div>
                                                                        </div>

                                                                        <div className="row">
                                                                            <div className="col">
                                                                                <input type="text" placeholder="Please enter details">
                                                                            </div>
                                                                            <div className="col">
                                                                                <input type="text" placeholder="Please enter details">
                                                                            </div>
                                                                            <div className="col">
                                                                                <input type="text" placeholder="Please enter details">
                                                                            </div>
                                                                            <div className="col">
                                                                                <input type="text" placeholder="Please enter details">
                                                                            </div>
                                                                            <div className="col">
                                                                                <input type="text" placeholder="Please enter details">
                                                                            </div>
                                                                        </div>

                                                                        <div className="row">
                                                                            <div className="col">
                                                                                <input type="text" placeholder="Please enter details">
                                                                            </div>
                                                                            <div className="col">
                                                                                <input type="text" placeholder="Please enter details">
                                                                            </div>
                                                                            <div className="col">
                                                                                <input type="text" placeholder="Please enter details">
                                                                            </div>
                                                                            <div className="col">
                                                                                <input type="text" placeholder="Please enter details">
                                                                            </div>
                                                                            <div className="col">
                                                                                <input type="text" placeholder="Please enter details">
                                                                            </div>
                                                                        </div>

                                                                        <div className="row">
                                                                            <div className="col"><button type="button" className="btn btn-outline-green" href="#">Add Record</button></div>
                                                                        </div>


                                                                        <div className="row">
                                                                            <label>Results of  Last className (2019)</label>
                                                                        </div>
                                                                        <div className="row">
                                                                            <div className="col">
                                                                                <label>Subject</label>
                                                                                <input type="text" placeholder="Please enter details">
                                                                            </div>
                                                                            <div className="col">
                                                                                <label>Maximum Marks</label>
                                                                                <input type="text" placeholder="Please enter details">
                                                                            </div>
                                                                            <div className="col">
                                                                                <label>Marks Obtained</label>
                                                                                <input type="text" placeholder="Please enter details">
                                                                            </div>
                                                                            <div className="col">
                                                                                <label>% of Marks</label>
                                                                                <input type="text" placeholder="Please enter details">
                                                                            </div>
                                                                            <div className="col">
                                                                                <label>Remarks</label>
                                                                                <input type="text" placeholder="Please enter details">
                                                                            </div>
                                                                        </div>

                                                                        <div className="row">
                                                                            <div className="col">
                                                                                <input type="text" placeholder="Please enter details">
                                                                            </div>
                                                                            <div className="col">
                                                                                <input type="text" placeholder="Please enter details">
                                                                            </div>
                                                                            <div className="col">
                                                                                <input type="text" placeholder="Please enter details">
                                                                            </div>
                                                                            <div className="col">
                                                                                <input type="text" placeholder="Please enter details">
                                                                            </div>
                                                                            <div className="col">
                                                                                <input type="text" placeholder="Please enter details">
                                                                            </div>
                                                                        </div>

                                                                        <div className="row">
                                                                            <div className="col">
                                                                                <input type="text" placeholder="Please enter details">
                                                                            </div>
                                                                            <div className="col">
                                                                                <input type="text" placeholder="Please enter details">
                                                                            </div>
                                                                            <div className="col">
                                                                                <input type="text" placeholder="Please enter details">
                                                                            </div>
                                                                            <div className="col">
                                                                                <input type="text" placeholder="Please enter details">
                                                                            </div>
                                                                            <div className="col">
                                                                                <input type="text" placeholder="Please enter details">
                                                                            </div>
                                                                        </div>

                                                                        <div className="row">
                                                                            <div className="col"><button type="button" className="btn btn-outline-green" href="#">Add Record</button></div>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>

                                                    <div className="row nav-buttons-bottom">
                                                        <div className="container text-end">
                                                            <button className="btn btn-outline-secondary prev mr-30" href="#step4" data-toggle="tab" data-step="4" aria-expanded="true" >Previous</button>
                                                            <button className="btn btn-success next" href="#step6" data-toggle="tab" data-step="6" aria-expanded="true" >Next</button>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                        <div className="tab-pane" id="step6">
                                            <div className="well">
                                                <div className="row">
                                                    <div className="accordion" id="accordionPanelsStayOpenExample">
                                                        <div className="accordion-item">
                                                            <h2 className="accordion-header" id="panelsStayOpen-headingFourteen">
                                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseFourteen" aria-expanded="true" aria-controls="panelsStayOpen-collapseFourteen">
                                                                    DOCUMENT SUBMISSION GUIDELINES
                                                                </button>
                                                            </h2>
                                                            <div id="panelsStayOpen-collapseFourteen" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingFourteen">
                                                                <div className="accordion-body">
                                                                    <div className="row textPara">
                                                                        <h5>Specifications for uploading photographs</h5>
                                                                        <ul>
                                                                            <li>Photograph must be a recent passport size Color photograph.</li>
                                                                            <li>Maximum size 50kb allowed in JPG or JPEG format.</li>
                                                                            <li>Dimensions 200 x 230 pixels (preferred).</li>
                                                                            <li><b>Scanned photographs: </b>If you scan a photograph,
                                                                                Set the scanner resolution to a minimum of 300 dpi (dots per inch).
                                                                                Crop the image in the scanner to the edge of the photograph, then use MS Paint to crop the image to the correct size.</li>

                                                                        </ul>
                                                                        <h5 className="mt-20">Photo Type</h5>
                                                                        <ul>
                                                                            <li>Photo should be in full colour and of high quality to avoid any visible pixels.</li>
                                                                            <li>Photo must be taken in the last 3 months.</li>
                                                                            <li>Have a natural expression - smiling is allowed.</li>
                                                                            <li> Head should be positioned directly facing camera, centered and compose 80% of image. Photo should capture from slightly above top of hair to middle of chest.</li>
                                                                            <li>Subject (candidate) is in clear focus and distinguishable from the background. Solid colour backgrounds are best.</li>
                                                                            <li>Eyes must be open and looking at the camera. Glasses must not be tinted unless worn daily for medical purposes.</li>
                                                                            <li>The individual’s full face must be clearly visible.</li>
                                                                        </ul>
                                                                    </div>
                                                                    <div className="row mt-0"><button type="button" className="btn btn-orange" href="#">ADDITIONAL GUIDELINES</button></div>

                                                                </div>
                                                            </div>
                                                        </div>


                                                        <div className="accordion-item mt-40">
                                                            <h2 className="accordion-header" id="panelsStayOpen-headingThirteen">
                                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThirteen" aria-expanded="true" aria-controls="panelsStayOpen-collapseThirteen">
                                                                    DOCUMENTS FOR SUBMISSION
                                                                </button>
                                                            </h2>
                                                            <div id="panelsStayOpen-collapseThirteen" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingThirteen">
                                                                <div className="accordion-body">
                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Student Details</label>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Photo</label>
                                                                            <input type="file" className="icondemo fileUpload">
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <button type="button" className="btn btn-orange mt-40" href="#">UPLOAD</button>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <img src="assets/images/profile.png" className="profileImg">
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Father’s Details</label>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Photo</label>
                                                                            <input type="file" className="icondemo fileUpload">
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <button type="button" className="btn btn-orange mt-40" href="#">UPLOAD</button>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <img src="assets/images/profile.png" className="profileImg">
                                                                        </div>
                                                                    </div>

                                                                    <div className="row align-items-end">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Signature</label>
                                                                            <input type="file" className="icondemo fileUpload">
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <button type="button" className="btn btn-orange" href="#">UPLOAD</button>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <img src="assets/images/signature.png" className="profileImg">
                                                                        </div>
                                                                    </div>


                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Mother’s Details</label>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Photo</label>
                                                                            <input type="file" className="icondemo fileUpload">
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <button type="button" className="btn btn-orange mt-40" href="#">UPLOAD</button>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <img src="assets/images/profile.png" className="profileImg">
                                                                        </div>
                                                                    </div>

                                                                    <div className="row align-items-end">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Signature</label>
                                                                            <input type="file" className="icondemo fileUpload">
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <button type="button" className="btn btn-orange" href="#">UPLOAD</button>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <img src="assets/images/signature.png" className="profileImg">
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Guardian’s Details</label>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row align-items-end">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Photo</label>
                                                                            <input type="file" className="icondemo fileUpload">
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <button type="button" className="btn btn-orange" href="#">UPLOAD</button>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <img src="assets/images/profile.png" className="profileImg">
                                                                        </div>
                                                                    </div>

                                                                    <div className="row align-items-end">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Signature</label>
                                                                            <input type="file" className="icondemo fileUpload">
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <button type="button" className="btn btn-orange" href="#">UPLOAD</button>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <img src="assets/images/signature.png" className="profileImg">
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>

                                                <div className="row nav-buttons-bottom">
                                                    <div className="container text-end">
                                                        <button className="btn btn-outline-secondary prev mr-30" href="#step5" data-toggle="tab" data-step="5" aria-expanded="true" >Previous</button>
                                                        <button className="btn btn-success next" href="#step7" data-toggle="tab" data-step="7" aria-expanded="true" >Next</button>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>


                                        <div className="tab-pane" id="step7">
                                            <div className="well">
                                                <div className="row">
                                                    <div className="accordion" id="accordionPanelsStayOpenExample">
                                                        <div className="accordion-item">
                                                            <h2 className="accordion-header" id="panelsStayOpen-headingSixteen">
                                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseSixteen" aria-expanded="true" aria-controls="panelsStayOpen-collapseSixteen">
                                                                    DECLARATION
                                                                </button>
                                                            </h2>
                                                            <div id="panelsStayOpen-collapseSixteen" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingSixteen">
                                                                <div className="accordion-body">
                                                                    <div className="row textPara">
                                                                        <ul>
                                                                            <li>I hereby declare that name of my ward,date of birth,our names(Father and mother) mentioned in the form are correct to the best of our knowledge.
                                                                            </li>
                                                                            <li>Names mentioned above are as per the Birth certificate and Aadhar card.</li>
                                                                            <li>I am aware that Registration fee is non refundable. Obtaining application form/applying online does not imply admission. Admission is subject to availability of seats and eligibility of the student.</li>
                                                                            <li>In case of withdrawal of admission, I am aware that I am not entitled for refund of any fee deposited, irrespective of when my ward was admitted. I abide to pay fee dues if any.</li>
                                                                            <li>DPS does not have inter branch transfer policy.</li>
                                                                            <li>In the case of residential admission, I understand that after admission confirmation, request for day schooling is not entertained during the academic year.</li>
                                                                            <li>Request for changing from Cambridge International curriculum to CBSE is not accepted after registration and confirmation of admission.</li>
                                                                            <li>In case of any damage/loss caused to the school property by my ward, the damage charges will be paid to the school to the extent of the cost applicable.</li>
                                                                            <li>The school reserves the right to expel my ward anytime, including the final external examination period for indulging in any act of gross misconduct/indiscipline and on that cause any action taken by the school or any matter concerning, with my ward will be final and binding on me.</li>
                                                                            <li>DPS Nacharam plies school buses on the fixed routes with limited stops. It will not be obligatory on the part of the school authorities to make new bus stops. It will be the sole responsibility of us to escort the pupil to and fro from the respective bus stop. I am aware that the routes and stops are subject to changes and no request for pick up /drop of my ward other than the designated point and no request for travelling other than the designated route is accepted.</li>
                                                                            <li>I do understand that programming and philosophy of education at DPS is to emphasize overall development of the child along with sports, excursions and other co-curricular activities besides academics. I shall permit my ward to participate and fully cooperate with the school in this regard.</li>
                                                                            <li>I have no objection in receiving SMS from School.</li>
                                                                            <li>I abide by the given fee structure . I am aware that there is a different fee structure within the className and also aware that it is subject to revision every year. I abide to pay the fee in time.</li>
                                                                            <li> I abide to submit my ward's Transfer Certificate and copy of annual academic report card within the time stipulated by school for ratification of my ward's admission.</li>
                                                                            <li>I assure that the information provided in this application form is correct to the best of my knowledge and belief. I will not request for correction/changes in name of my ward/ in our (parents) names and date of birth of my ward. I promise to abide by the school rules and regulations and abide by any change of school timing,programmes,planning,etc.</li>

                                                                        </ul>
                                                                    </div>

                                                                    <div className="row justify-content-between">
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Relation with Student</label>
                                                                            <select className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <label>Relation with Student</label>
                                                                            <textarea className="form-control"></textarea>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>


                                                        <div className="accordion-item mt-40">
                                                            <h2 className="accordion-header" id="panelsStayOpen-headingSeventeen">
                                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseSeventeen" aria-expanded="true" aria-controls="panelsStayOpen-collapseSeventeen">
                                                                    UNDERTAKING
                                                                </button>
                                                            </h2>
                                                            <div id="panelsStayOpen-collapseSeventeen" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingSeventeen">
                                                                <div className="accordion-body">
                                                                    <div className="row">
                                                                        <ul>
                                                                            <li>I do hereby agree and declare that:</li>
                                                                        </ul>
                                                                        <p>1. My ward studying in className of Delhi Public School, Nacharam may be permitted to take part in Inter School Sports or Co-curricular competition /any camp / course / adventure / training / treks / swimming / NCC / mountaineering / rock climbing / hiking / skating / cycling / horse riding /yoga/ field trips/Excursions/or any adventure activities which involve risk, organized by the school for the students’ practice / show / competition at all levels. I undertake and agree to hold the school and its staff indemnified against all such claims that may arise out of any loss or fatal injury to the property or person which my ward may suffer while or in consequence of participation in any such activity.</p>

                                                                        <p>2. I understand that the school shall take all possible efforts to ensure the safety of my child in the school /school bus/ hostel. In spite of their efforts, in the unfortunate event of any injury/harm/accident/loss of life during the course of stay of my child in school /school bus/ hostel, I shall not hold the school or the authorities responsible for the same.</p>

                                                                        <p>3. I understand that the school mess is an optional facility and is outsourced to an agent. Though school shall take all precautions of food safety and hygiene, however in case of any health ailments arising due to this facility, I shall not hold the school or the authorities responsible for the same.</p>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-8">
                                                                            <label>Scholastic analysis process will be initiated. Please select one of the option for interaction.</label>
                                                                        </div>
                                                                        <div className="col-12 col-sm-4">
                                                                            <select className="form-select">
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                                <option>Please choose</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="optLink text-center"><a href="#">Request OTP</a></div>
                                                                    </div>

                                                                    <div className="row justify-content-center">
                                                                        <div className="col col-4 align-self-center">
                                                                            <label>Enter One Time Password (OTP)</label>
                                                                            <input type="text" placeholder="Please enter details">
                                                                        </div>
                                                                        <div className="col col-2">
                                                                            <button type="button" className="btn btn-orange mt-40" href="#">VERIFY</button>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>

                                                <div className="row nav-buttons-bottom">
                                                    <div className="container text-end">
                                                        <button className="btn btn-outline-secondary prev mr-30" href="#step6" data-toggle="tab" data-step="6" aria-expanded="true" >Previous</button>
                                                        <button className="btn btn-success next" href="#" data-toggle="tab" data-step="#" aria-expanded="true" >Next</button>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>







                                    </div> */}

                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default RegistrationForm
