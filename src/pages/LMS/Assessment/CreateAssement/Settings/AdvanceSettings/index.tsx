import { useFormik } from 'formik'
import { RadioInputContainer } from './RadioInputContainer';
import { Switch, TextInputWithRegex } from '../../../../../../Components/Common';

const AdvanceSettings = ({ settingsFormik }) => {

  const negativeOptions: Array<any> = [
    { id: "FIXED", name: "Fixed" },
    { id: "PERCENTAGE", name: "Percentage" }
  ];

  return (
    <>
      <div className="card-body mt-3 px-4 lms_form_switch">
        <div className="list-group fs-12 px-2">
          <div className="row">
            {/* Left Column */}
            <div className="col-12 col-md-6">
              {/* Marks Mode */}
              <RadioInputContainer
                name="marksPointsMode"
                labelText="Marks/Points Mode"
                    inputContainerClassName="mt-2 tw-ml-[4.5rem]"
                radioOptions={[
                  { id: "Auto", name: "Auto" },
                  { id: "Manual", name: "Manual" },
                ]}
                value={settingsFormik.values.marksPointsMode}
                onChange={settingsFormik.handleChange}
                showTooltipIcon={true}
                containerClassName=" tw-justify-between"
                tooltipText={`<strong>Auto</strong> - Marks/Points will be calculated...`}
              />

              {settingsFormik.values.marksPointsMode === "Manual" && (

                <div className='row'>
                  <label className="col-8">Marks for Correct Answer</label>
                  <div className='col-4'>
                    <TextInputWithRegex
                      allowedInputRegex="^[0-9]+$"
                      name="marksForCorrectAnswer"
                      labelText=""
                      value={settingsFormik.values.marksForCorrectAnswer}
                      onChange={settingsFormik.handleChange}
                      formgroupClassName="d-flex align-items-center mb-3"
                      labelClass="me-3 w-50"
                      inputClassName="flex-grow-1"
                    />
                  </div>
                </div>
              )}

              {/* Negative Marking */}
              <div className="row mb-3 align-items-center ">
                <label className="col-8">Negative Marking</label>
                <div className="col-3 d-flex">
                  <Switch
                    attributeId="negativeMarking"
                    checked={Boolean(settingsFormik.values.negativeMarking)}
                    onChangeHndlr={(e) => {
                      const checked = e.target.checked;
                      settingsFormik.setFieldValue("negativeMarking", checked);
                    }}
                    className="form-switch-sm"
                  />
                </div>
              </div>

              {settingsFormik.values.negativeMarking && (
                <>
                  {/* <div className='row'>
                    <label className="col-8">Negative Marking Type</label>
                    <div className='col-4'>
                      <RadioInputContainer
                        name="negativeMarkingType"
                        labelText=""
                        inputContainerClassName="mt-2"
                        radioOptions={negativeOptions}
                        value={settingsFormik.values.negativeMarkingType}
                        onChange={settingsFormik.handleChange}
                      />
                    </div>
                  </div> */}
                  <RadioInputContainer
                    name="negativeMarkingType"
                    labelText="Negative Marking Type"
                    inputContainerClassName="mt-2 tw-ml-[4.5rem]"
                    radioOptions={negativeOptions}
                    value={settingsFormik.values.negativeMarkingType}
                    onChange={settingsFormik.handleChange}
                    // showTooltipIcon={true}
                    containerClassName=" tw-justify-between"
                  // tooltipText={`<strong>Auto</strong> - Marks/Points will be calculated...`}
                  />
                  {settingsFormik.values.negativeMarkingType === "FIXED" && (
                    <div className='row'>
                      <label className="col-8">Negative Marks</label>
                      <div className='col-4'>
                        <TextInputWithRegex
                          allowedInputRegex="^[0-9]+$"
                          name="negativeMarks"
                          labelText=""
                          value={settingsFormik.values.negativeMarks}
                          onChange={settingsFormik.handleChange}
                          formgroupClassName="d-flex align-items-center mb-3"
                          labelClass="me-5 w-50"
                          inputClassName="flex-grow-1"
                        />
                      </div>
                    </div>
                  )}
                  {settingsFormik.values.negativeMarkingType === "PERCENTAGE" && (
                    <div className='row'>
                      <label className="col-8">Negative Percentage</label>
                      <div className='col-4'>
                        <TextInputWithRegex
                          allowedInputRegex="^[0-9]+$"
                          name="negativeMarks"
                          labelText=""
                          value={settingsFormik.values.negativeMarks}
                          onChange={settingsFormik.handleChange}
                          formgroupClassName="d-flex align-items-center mb-3"
                          labelClass="me-5 w-50"
                          inputClassName="flex-grow-1"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className='row'>
                <label className="col-8">Pass Percentage</label>
                <div className='col-4'>
                  <TextInputWithRegex
                    allowedInputRegex="^[0-9]+$"
                    name="passPercentage"
                    labelText=""
                    value={settingsFormik.values.passPercentage}
                    onChange={settingsFormik.handleChange}
                    formgroupClassName="d-flex align-items-center mb-3"
                    labelClass="me-4 w-50"
                    inputClassName="flex-grow-1"
                  />
                </div>
              </div>
                       {[
                { name: "shuffleQuestions", label: "Shuffle Questions" },
                { name: "shuffleOptions", label: "Shuffle Options" },
                { name: "restrictAttempts", label: "Restrict Attempts" },
                { name: "disableFinishButton", label: "Disable Finish Button" },
                { name: "enableQuestionListView", label: "Enable Question List" },
                { name: "hideSolutions", label: "Hide Solutions" },
              ].map((item) => {
                const isShuffleQuestions = item.name === "shuffleQuestions";
                const isShuffleOptions = item.name === "shuffleOptions";
                const disableSwitch =
                  (isShuffleQuestions && settingsFormik.values.shuffleOptions) ||
                  (isShuffleOptions && settingsFormik.values.shuffleQuestions);

                return (
                  <div className="row mb-3 align-items-center" key={item.name}>
                    <label className="col-8">{item.label}</label>
                    <div className="col-3 d-flex">
                      <Switch
                        attributeId={item.name}
                        checked={Boolean(settingsFormik.values[item.name])}
                        onChangeHndlr={(e) => {
                          const checked = e.target.checked;
                          settingsFormik.setFieldValue(item.name, checked);
                        }}
                        className="form-switch-sm"
                        isDisabled={disableSwitch}
                      />
                    </div>
                  </div>
                );
              })}

              {settingsFormik.values.restrictAttempts && (
                <div className='row'>
                  <label className="col-8">Number of Attempts</label>
                  <div className='col-4'>
                    <TextInputWithRegex
                      allowedInputRegex="^[0-9]+$"
                      name="noOfAttempts"
                      labelText=""
                      value={settingsFormik.values.noOfAttempts}
                      onChange={settingsFormik.handleChange}
                      formgroupClassName="d-flex align-items-center mb-3"
                      labelClass="me-3 w-50"
                      inputClassName="flex-grow-1"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </>
  );
};


export default AdvanceSettings