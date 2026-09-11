import { DateInput, RadioInputContainer, Switch, TextInput, TimeInput } from '../../../../../../Components/Common'

const ResultSettings = ({ settingsFormik }) => {
  const scheduleOptions: Array<any> = [
    {
      id: "INSTANTLY",
      name: "Instantly",
      description: "Right after the assessment is evaluated"
    },
    {
      id: "AFTER_VALIDITY",
      name: "After Validity",
      description: "Right after the validity of the assessment is over"
    },
    {
      id: "MANUALLY",
      name: "Manually",
      description: "Publish results on a specific date and time"
    }
  ];


  return (
    <>
      <div className='card-body lms_form_switch'>
        <div className="p-2">
          <h4 className="card-title mb-0 fs-14">Result Settings</h4>
          <h4 className="text-muted mb-0 mt-1 fs-14 border-bottom pb-2">
            Choose when the students can view their results
          </h4>
        </div>   
        <div className="list-group">
          <RadioInputContainer
            name="resultReleaseMode"
            inputContainerClassName="mt-2"
            radioOptions={scheduleOptions}
            value={settingsFormik.values.resultReleaseMode}
            onChange={(e) => {
              settingsFormik.handleChange(e);
              if (e.target.value === "MANUALLY") {
                const datetime = settingsFormik.values.resultStartDate && settingsFormik.values.resultStartTime 
                  ? `${settingsFormik.values.resultStartDate}T${settingsFormik.values.resultStartTime}`
                  : "";
                settingsFormik.setFieldValue("releaseDatetime", datetime);
              }
            }}
          />
        </div> 
        {settingsFormik.values.resultReleaseMode?.toLowerCase() === "manually" && (
          <div className='row'>
            <div className='col-12 col-md-4'>
              <DateInput
                name="resultStartDate"
                labelText="Date"
                value={settingsFormik.values.resultStartDate}
                onChange={(e) => {
                  settingsFormik.handleChange(e);
                  const datetime = e.target.value && settingsFormik.values.resultStartTime
                    ? `${e.target.value}T${settingsFormik.values.resultStartTime}`
                    : "";
                  settingsFormik.setFieldValue("releaseDatetime", datetime);
                }}
              />
            </div>
            <div className='col-12 col-md-4'>
              <TimeInput
                name="resultStartTime"
                labelText='Time'
                value={settingsFormik.values.resultStartTime}
                onChange={(e) => {
                  settingsFormik.handleChange(e);
                  const datetime = settingsFormik.values.resultStartDate && e.target.value
                    ? `${settingsFormik.values.resultStartDate}T${e.target.value}`
                    : "";
                  settingsFormik.setFieldValue("releaseDatetime", datetime);
                }}
              />
            </div>
          </div>
        )}

        <div className='row align-items-center'>
          <div className='col-9 d-grid'>
            <span className='card-title fs-14 mb-0'>
              Show Correct Answers After Submission
            </span>
          </div>
          <div className='col-3 d-flex justify-content-center'>
            <Switch
              attributeId="showCorrectAnswersAfterSubmission"
              labelName=""
              checked={Boolean(settingsFormik.values.showCorrectAnswersAfterSubmission)}
              onChangeHndlr={(e) => {
                const checked = e.target.checked;
                settingsFormik.setFieldValue("showCorrectAnswersAfterSubmission", checked);
              }}
              className="form-switch-sm mb-0 pt-2 pb-2"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultSettings;