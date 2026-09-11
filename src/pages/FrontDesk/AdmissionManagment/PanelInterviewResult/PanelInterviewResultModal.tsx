import React from 'react'
import { DateInput, SelectInput, TextInput } from '../../../../Components/Common'
import UncontrolledAccordionCard from '../../../../Components/Common/UncontrolledAccordionCard'
import AccordionCardItem from '../../../../Components/Common/AccordionCardItem'
import AccordionCardHeader from '../../../../Components/Common/AccordionCardHeader'
import AccordionCardBody from '../../../../Components/Common/AccordionCardBody'

const PanelInterviewResultModal = () => {
    return (
        <div>
            <div className='row g-3 my-1 px-4 mb-4'>
                <div className="col-xs-12 col-md-12 col-lg-6 col-xl-6">
                    <SelectInput
                        name="academicYearId"
                        value={""}
                        onChange={() => { }}
                        menuItems={[]}
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        defaultSelect='2022-23'
                        // inputClassName="bg-light border-0"
                        formgroupClassName="mb-0"
                        labelText='Academic Year'
                    />
                </div>

                <div className="col-xs-12 col-md-12 col-lg-6 col-xl-6">
                    <SelectInput
                        name="curriculumId"
                        value={""}
                        onChange={() => { }}
                        menuItems={[]}
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                        defaultSelect='CBSE'
                        // inputClassName="bg-light border-0"
                        formgroupClassName="mb-0"
                        labelText='Curriculum'
                    />
                </div>

                <div className="col-xs-12 col-md-12 col-lg-6 col-xl-6">
                    <SelectInput
                        name="classId"
                        value={""}
                        onChange={() => { }}
                        menuItems={[]}
                        valueKey="id"
                        textKey="shortName"
                        // inputClassName="bg-light border-0"
                        formgroupClassName="mb-0"
                        labelText='Class'
                    />
                </div>
                <div className="col-xs-12 col-md-12 col-lg-6 col-xl-6">
                    <DateInput
                        name={'interviewDate'}
                        value={""}
                        formgroupClassName="mb-0"
                        onChange={() => { }}
                        labelText='Interview Date'
                  
                    />
                </div>
                <div className="col-xs-12 col-md-12 col-lg-6 col-xl-6">
                    <TextInput
                        name="regNo"
                        labelText="Reg. No."
                        value={''}
                        onChange={() => { }}
                  
              
                    />
                </div>
                <div className="col-xs-12 col-md-12 col-lg-6 col-xl-6">
                    <TextInput
                        name="studentName"
                        labelText="Student Name"
                        value={''}
                        onChange={() => { }}
            
                    />
                </div>
            </div>
            <div>
                <UncontrolledAccordionCard
                    defaultOpen={[
                        '1',
                        '2',
                        '3',
                        '4',
                        '5',
                        '6'
                    ]}
                >
                    <AccordionCardItem>
                        <AccordionCardHeader targetId="1" title="Observation and Interviewer Report Student" />
                        <AccordionCardBody accordionId="1" style={{ borderTop: "0px", borderRadius: "0px 0px 5px 5px", padding: "0px", border: "0px" }} >
                            <div className='row'>
                                <div className='col-3'>
                                    <p>Academics : <span className='fw-bold'>Good</span></p>
                                </div>
                                <div className='col-3'>
                                    <p>Attitude : <span className='fw-bold'>Good</span></p>
                                </div>
                                <div className='col-3'>
                                    <p>Communication : <span className='fw-bold'>Good</span></p>
                                </div>
                            </div>
                        </AccordionCardBody>
                    </AccordionCardItem>

                    <AccordionCardItem>
                        <AccordionCardHeader targetId="2" title="Observation and Interviewer Report Student" />

                        <AccordionCardBody accordionId="2" style={{ borderTop: "0px", borderRadius: "0px 0px 5px 5px" }}>
                            <div className='row'>
                                <div className='col-3'>
                                    <p>Attitude : <span className='fw-bold'>Good</span></p>
                                </div>
                                <div className='col-3'>
                                    <p>Qualification : <span className='fw-bold'>Good</span></p>
                                </div>
                                <div className='col-3'>
                                    <p>Profession : <span className='fw-bold'>Good</span></p>
                                </div>
                                <div className='col-3'>
                                    <p>Finance : <span className='fw-bold'>Good</span></p>
                                </div>
                            </div>
                        </AccordionCardBody>
                    </AccordionCardItem>
                </UncontrolledAccordionCard>

            </div>
            <hr />
            <div className='row g-3 my-1 px-4 mb-4 d-flex align-items-center'>
                <div className='col-1'>
                    <p>Status</p>
                </div>
                <div className='col-5'>
                    <SelectInput
                        name="status"
                        value={""}
                        onChange={() => { }}
                        menuItems={[]}
                        valueKey="status"
                        textKey="status"
                        // inputClassName="bg-light border-0"
                        formgroupClassName="mb-0"
                    // labelText='Status'
                    />
                </div>
            </div>
            <div className='row'>
                <div className='d-flex w-auto ms-auto mx-4 my-3'>
                    <button
                        type="submit"
                        className="btn btn-light text-success mx-4"
                        onClick={() => { }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-success px-4"
                        onClick={() => { }}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PanelInterviewResultModal
