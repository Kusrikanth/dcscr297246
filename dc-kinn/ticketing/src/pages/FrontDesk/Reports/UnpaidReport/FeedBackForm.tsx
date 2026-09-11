import React, {useCallback,useEffect,useMemo,useRef,useState, } from "react";
import { RadioInputContainer, TextInput, } from "../../../../Components/Common";
import DPS from "../../../../assets/images/brands/feedback-logo.png";
import { UncontrolledAccordion, AccordionItem, Collapse, AccordionHeader, AccordionBody, } from "reactstrap";

// AccordionComponents
import BasicInformation from "./BasicInformation";
import AdditionalInforamtion from "./AdditionalInforamtion";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateTokenForUserAct } from "../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { removeLocalStorage, setLocalStorage } from "../../../../utility/storageUtility";
import { shallowEqual } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { parseQueryStringToObject } from "../../../../utility/commonutility";
import { fillFeedbackFormAct, getFeedbackByIdAct } from "../../../../store/fee/feereport/feereportactions";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Button from "../../../../Components/Common/Button";

const initialValue:any = {
  academicYear : "",
  registrationNo : "",
  curriculum : "",
  class : "",
  fatherName:"",
  studentName:"",
  contactNo:"",
  email:"",
  address:"",
  necessaryInfo:"",
  furtherDetail:"",
  furtherDetYesInfo:"",
  furtherDetYesOtherInfo:"",
  proceedAdmission:"",
  proceedAdmissionNeedTimeInfo:"",
  suggestions:"",
}

const initialValueForReset = {
  necessaryInfo:"",
  furtherDetail:"",
  furtherDetYesInfo:"",
  furtherDetYesOtherInfo:"",
  proceedAdmission:"",
  proceedAdmissionNeedTimeInfo:"",
  suggestions:"",
}

const validationSchema = Yup.object().shape({
  necessaryInfo : Yup.string().nullable().required('Necessary information is required'),
  furtherDetail : Yup.string().nullable().required('Further Detail is required'),
  furtherDetYesInfo: Yup.string().nullable().when("furtherDetail", (furtherDetail, schema) => {
    if (furtherDetail === "YES") {
      return schema.required("Further Details Yes Information is required")
    }
  }),
  furtherDetYesOtherInfo:Yup.string().nullable().when("furtherDetYesInfo", (furtherDetYesInfo, schema) => {
    if (furtherDetYesInfo === "OTHERS") {
      return schema.required("Further Details Yes Other Information is required")
    }
  }),
  proceedAdmission : Yup.string().nullable().required('Proceed Admission is required'),
  proceedAdmissionNeedTimeInfo:Yup.string().nullable().when("proceedAdmission", (proceedAdmission, schema) => {
    if (proceedAdmission === "NEED TIME") {
      return schema.required("Proceed Admission Need Time Information is required")
    }
  }),

})
export default function FeedBackForm() {

  const dispatch = useAppDispatch()
  const history = useHistory()
  const params = useLocation().search;
const [initialValues,setInitialValues] = useState(initialValue)
const [formDisable, setFormDisable] = useState(false);
  const queryParamsObject = parseQueryStringToObject(params);

  const {
    generateTokenForUserResp,
    getFeedbackByIdResp,
    fillFeedbackFormResp,
    showApiLoader,
}: any = useAppSelector(
    ({
        applicationSale,feeReport,globalData
    }) => ({
      getFeedbackByIdResp:feeReport.getFeedbackByIdResp,
      fillFeedbackFormResp:feeReport.fillFeedbackFormResp,
        generateTokenForUserResp: applicationSale.generateTokenForUserResp,
        showApiLoader: globalData.showApiLoader,
    }),
    shallowEqual
);

const FeedbackFormRef = useRef({
  prevGenerateTokenForUserResp: generateTokenForUserResp,
  prevGetFeedbackByIdResp:getFeedbackByIdResp,
  prevFillFeedbackFormResp:fillFeedbackFormResp,
})
useEffect(() => {
  const { prevGenerateTokenForUserResp,prevGetFeedbackByIdResp,prevFillFeedbackFormResp } = FeedbackFormRef.current;

  if(generateTokenForUserResp && prevGenerateTokenForUserResp !== generateTokenForUserResp){
    setLocalStorage('accesstoken', generateTokenForUserResp.token);
    initalAPICalls();
  }else if(getFeedbackByIdResp && prevGetFeedbackByIdResp !== getFeedbackByIdResp){
    if(getFeedbackByIdResp){
      const {academicYear,registrationNo,curriculum,classShortName,fatherName,studentName,contactNo,email,address,necessaryInfo,furtherDetail,furtherDetYesInfo,furtherDetYesOtherInfo,proceedAdmission,proceedAdmissionNeedTimeInfo,suggestions} = getFeedbackByIdResp || {};
      if(necessaryInfo){
        setFormDisable(true)
      }
      FeedbackForm.setValues((prev:any)=>({
        ...prev,
        academicYear,registrationNo,curriculum,class:classShortName,fatherName,studentName,contactNo,email,address,necessaryInfo,furtherDetail,furtherDetYesInfo,furtherDetYesOtherInfo,proceedAdmission,proceedAdmissionNeedTimeInfo,suggestions,
      }))
    }
  }else if(fillFeedbackFormResp && prevFillFeedbackFormResp !== fillFeedbackFormResp){
    if(fillFeedbackFormResp){
      toast.success("Your feedback submitted Successfully.")
      history.push("/feedback-thank-you-page")
    }
  }

  FeedbackFormRef.current.prevGenerateTokenForUserResp = generateTokenForUserResp;
  FeedbackFormRef.current.prevGetFeedbackByIdResp = getFeedbackByIdResp;
  FeedbackFormRef.current.prevFillFeedbackFormResp = fillFeedbackFormResp;
}, [generateTokenForUserResp,getFeedbackByIdResp,fillFeedbackFormResp])

const FeedbackForm = useFormik({
  enableReinitialize: true,
  initialValues: initialValues,
  validationSchema,
  onSubmit: (values) => {
    const payload = {
      studentRegId : queryParamsObject?.regid,
      necessaryInfo:values?.necessaryInfo || "",
      furtherDetail:values?.furtherDetail || "",
      furtherDetYesInfo:values?.furtherDetYesInfo || "",
      furtherDetYesOtherInfo:values?.furtherDetYesOtherInfo || "",
      proceedAdmission:values?.proceedAdmission || "",
      proceedAdmissionNeedTimeInfo:values?.proceedAdmissionNeedTimeInfo || "",
      suggestions:values?.suggestions || "",
    }
    dispatch(fillFeedbackFormAct(generateActionPayload("fill_feedback_form", undefined,payload)));
   },
});

const initalAPICalls = ()=>{
  dispatch(getFeedbackByIdAct(generateActionPayload("get_feedback_by_id", {id:queryParamsObject?.regid})));
}

  useEffect(() => {
    const formData = new FormData();
    formData.append("clientName","WEB")
    formData.append("publicKey",import.meta.env.VITE_GENERATE_TOKEN_PUBLIC_KEY)
    removeLocalStorage('accesstoken')
    dispatch(generateTokenForUserAct(generateActionPayload("generate_token_for_user", undefined, formData, { tokenNotRequired: true })));
    return () => {
        
    }
}, []);

const filterHndler = (e:any)=>{
  const {name,value} = e.target;
  if(name === "furtherDetail" && value==="NO"){
    FeedbackForm.setValues((prev:any)=>({
      ...prev,
      [name] : value,
      furtherDetYesInfo:"",
      furtherDetYesOtherInfo:""
    }))
  } else if(name==="furtherDetYesInfo" && !(value==="OTHERS")){
    FeedbackForm.setValues((prev:any)=>({
      ...prev,
      [name] : value,
      furtherDetYesOtherInfo:""
    }))
  } else if(name === "proceedAdmission" && !(value==="NEED TIME")){
    FeedbackForm.setValues((prev:any)=>({
      ...prev,
      [name] : value,
      proceedAdmissionNeedTimeInfo:""
    }))
  }
  else{
    FeedbackForm.setValues((prev:any)=>({
      ...prev,
      [name] : value
    }))
  }

}

  return (
    <React.Fragment>
      <div className="instruction-new-container bg-light ">
        <div className="header-container text-center px-4">
          <img src={DPS} alt="Logo" className="mw-100" />
        </div>
        <div className="header-content text-center">
          <h5 className="content px-5">
            Online Enclosed Feedback form - Delhi Public School
          </h5>
        </div>
      </div>
      <div className="page-content feedback-form feedback-container">
        <div className="container-fluid">
          <div className="tw-flex tw-flex-wrap tw--mx-3">
            <div className="tw-w-full tw-px-3">
              <div className="tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow-sm tw-mb-3">
                <div className="tw-p-6">
                 {formDisable && <div className="tw-px-3 tw-pb-2 tw-pt-2 tw-text-lg" style={{color:"#198754"}}>
                  Your form has already been successfully submitted.
                  </div>}
                  <div className="tw-flex tw-flex-wrap tw--mx-3 tw-gap-y-4 tw-p-3 tw-border-b tw-border-gray-200">
                    <div className="tw-w-full md:tw-w-1/2 tw-px-3">
                      <TextInput
                        name="academicYear"
                        labelText="Academic Year"
                        labelClass={"tw-font-bold"}
                        value={FeedbackForm.values.academicYear}
                        formgroupClassName="tw-mb-0 tw-font-bold"
                        isDisabled
                      />
                    </div>
                    <div className="tw-w-full md:tw-w-1/2 tw-px-3">
                      <TextInput
                        name="registrationNo"
                        labelText="Registration Number"
                        labelClass={"tw-font-bold"}
                        formgroupClassName="tw-mb-0"
                        value={FeedbackForm.values.registrationNo}
                        isDisabled
                      />
                    </div>
                    <div className="tw-w-full md:tw-w-1/2 tw-px-3">
                      <TextInput
                        name="curriculum"
                        labelText="Curriculum"
                        labelClass={"tw-font-bold"}
                        formgroupClassName="tw-mb-0"
                        isDisabled
                        value={FeedbackForm.values.curriculum}
                      />
                    </div>
                    <div className="tw-w-full md:tw-w-1/2 tw-px-3">
                      <TextInput
                        name="class"
                        labelText="Class"
                        labelClass={"tw-font-bold"}
                        formgroupClassName="tw-mb-0"
                        isDisabled
                        value={FeedbackForm.values.class}
                        placeHolder="Class"
                      />
                    </div>
                    <UncontrolledAccordion
                      open="basicinformation"
                      defaultOpen={[
                        "basicinformation",
                        "additionalinforamtion",
                      ]}
                      stayOpen
                    >
                      <AccordionItem>
                        <BasicInformation initialValues={FeedbackForm.values} />
                      </AccordionItem>
                      <AccordionItem>
                      <AccordionHeader tag="h5" targetId="additionalinforamtion">
        Additional Inforamtion
      </AccordionHeader>
      <AccordionBody accordionId="additionalinforamtion">
        <div className="tw-flex tw-flex-wrap tw--mx-3 tw-gap-y-4 tw-py-3 radio-btn">
          <div className="tw-flex tw-flex-wrap tw--mx-2 tw-gap-y-2 tw-w-full tw-px-3">
            <div className="tw-w-full sm:tw-w-full tw-grid tw-px-2">
            <RadioInputContainer
                 name="necessaryInfo"
                 labelText="Are you given the necessary information about admission process ?"
                 labelClassName="tw-font-bold"
                 inputContainerClassName="tw-mt-2"
                 isDisabled={formDisable}
                 radioClassName="form-radio-green"
                 formgroupClassName="tw-mb-0"
                 radioOptions={[{ id: "YES", name: "YES" }, { id: "NO", name: "NO" }]}
                 value={FeedbackForm.values.necessaryInfo}
                 onChange={FeedbackForm.handleChange}
                 invalid={FeedbackForm.touched.necessaryInfo && FeedbackForm.errors.necessaryInfo ? true : false}
                error={FeedbackForm.touched.necessaryInfo && FeedbackForm.errors.necessaryInfo ? FeedbackForm.errors.necessaryInfo: ""}
                    />
            </div>
          </div>
          <div className="tw-flex tw-flex-wrap tw--mx-3 tw-gap-y-4 tw-w-full tw-px-3">
            <div className="tw-w-full sm:tw-w-full tw-grid tw-px-3">
               <RadioInputContainer
                 name="furtherDetail"
                 labelText="Do you require any details further ?"
                 labelClassName="tw-font-bold"
                 isDisabled={formDisable}
                 radioClassName="form-radio-green"
                 inputContainerClassName="tw-mt-2"
                 formgroupClassName="tw-mb-0"
                 radioOptions={[{ id: "YES", name: "YES" }, { id: "NO", name: "NO" }]}
                 value={FeedbackForm.values.furtherDetail}
                 onChange={filterHndler}
                 invalid={FeedbackForm.touched.furtherDetail && FeedbackForm.errors.furtherDetail ? true : false}
                error={FeedbackForm.touched.furtherDetail && FeedbackForm.errors.furtherDetail ? FeedbackForm.errors.furtherDetail: ""}
                    />
            </div>
              {FeedbackForm.values.furtherDetail === "YES" &&
            <div className="tw-w-full md:tw-w-1/2 tw-px-3">
               <RadioInputContainer
                 name="furtherDetYesInfo"
                 labelText="Please Select the option"
                 labelClassName="tw-font-bold"
                 isDisabled={formDisable}
                 radioClassName="form-radio-green"
                 inputContainerClassName="tw-mt-2 tw-flex-wrap"
                 formgroupClassName="tw-mb-0 tw-mt-2"
                 radioOptions={[{ id: "FEE", name: "FEE" }, { id: "CURRICULUM", name: "CURRICULUM" },{ id: "CAMPUS TOUR", name: "CAMPUS TOUR" },{ id: "OTHERS", name: "OTHERS" }]}
                 value={FeedbackForm.values.furtherDetYesInfo}
                 onChange={filterHndler}
                 invalid={FeedbackForm.touched.furtherDetYesInfo && FeedbackForm.errors.furtherDetYesInfo ? true : false}
                error={FeedbackForm.touched.furtherDetYesInfo && FeedbackForm.errors.furtherDetYesInfo ? FeedbackForm.errors.furtherDetYesInfo: ""}
                    />
            </div>
                    }
           {FeedbackForm.values.furtherDetYesInfo === "OTHERS" &&
            <div className="tw-w-full md:tw-w-1/2 tw-px-3">
            <TextInput
                 name="furtherDetYesOtherInfo"
                 labelText="Please specify"
                 labelClass={"tw-font-bold"}
                 isDisabled={formDisable}
                 formgroupClassName="tw-mb-0"
                 placeHolder="Please enter details"
                 value={FeedbackForm.values.furtherDetYesOtherInfo}
                 onChange={FeedbackForm.handleChange}
                 invalid={FeedbackForm.touched.furtherDetYesOtherInfo && FeedbackForm.errors.furtherDetYesOtherInfo ? true : false}
                error={FeedbackForm.touched.furtherDetYesOtherInfo && FeedbackForm.errors.furtherDetYesOtherInfo ? FeedbackForm.errors.furtherDetYesOtherInfo: ""}
               />
            </div>}
          </div>
          <div className="tw-flex tw-flex-wrap tw--mx-3 tw-gap-y-4 tw-w-full tw-px-3">
            <div className="tw-w-full lg:tw-w-1/2 tw-px-3">
            <RadioInputContainer
                 name="proceedAdmission"
                 labelText=" 	Are you interested to proceed further for admission ?"
                 labelClassName="tw-font-bold"
                 isDisabled={formDisable}
                 radioClassName="form-radio-green"
                 inputContainerClassName="tw-mt-2"
                 formgroupClassName="tw-mb-0"
                 radioOptions={[{ id: "YES", name: "YES" }, { id: "NO", name: "NO" },{ id: "NEED TIME", name: "NEED TIME" }]}
                 value={FeedbackForm.values.proceedAdmission}
                 onChange={filterHndler}
                 invalid={FeedbackForm.touched.proceedAdmission && FeedbackForm.errors.proceedAdmission ? true : false}
                error={FeedbackForm.touched.proceedAdmission && FeedbackForm.errors.proceedAdmission ? FeedbackForm.errors.proceedAdmission: ""}
                    />
            </div>
            <div className="tw-w-full lg:tw-w-1/2 tw-px-3">
                   {FeedbackForm.values.proceedAdmission === "NEED TIME" &&
                    <TextInput
              name="proceedAdmissionNeedTimeInfo"
              labelText="Please Specify"
              value={FeedbackForm.values.proceedAdmissionNeedTimeInfo}
              onChange={FeedbackForm.handleChange}
              isDisabled={formDisable}
              formgroupClassName="tw-mb-0"
              placeHolder="Please enter details"
              invalid={FeedbackForm.touched.proceedAdmissionNeedTimeInfo && FeedbackForm.errors.proceedAdmissionNeedTimeInfo ? true : false}
                error={FeedbackForm.touched.proceedAdmissionNeedTimeInfo && FeedbackForm.errors.proceedAdmissionNeedTimeInfo ? FeedbackForm.errors.proceedAdmissionNeedTimeInfo: ""}
            />}

            </div>
          </div>
          <div className="tw-w-full md:tw-w-1/2 tw-px-3">
            <TextInput
              name="suggestions"
              labelText="We will be happy to note suggestions from you, if any"
              labelClass={"tw-font-bold"}
              value={FeedbackForm.values.suggestions}
              isDisabled={formDisable}
              onChange={FeedbackForm.handleChange}
              formgroupClassName="tw-mb-0"
              placeHolder="Please enter suggestions"
              invalid={FeedbackForm.touched.suggestions && FeedbackForm.errors.suggestions ? true : false}
                error={FeedbackForm.touched.suggestions && FeedbackForm.errors.suggestions ? FeedbackForm.errors.suggestions: ""}
            />
          </div>
        </div>
      </AccordionBody>
                      </AccordionItem>
                    </UncontrolledAccordion>
                  </div>
                  {!formDisable && <div className="tw-flex tw-flex-wrap tw--mx-3 tw-gap-y-4 tw-p-3">
                    <div className="tw-w-full bottom-list tw-px-3">
                      <div className="tw-flex tw-flex-wrap -tw-mx-3 tw-my-3 buttons-group btn-classes tw-w-full tw-text-center">
                        <div className="md:tw-w-1/4 tw-px-3"></div>
                        <div className="tw-w-full md:tw-w-1/4 tw-mb-2 reset-button sm:tw-text-right tw-px-3">
                          <Button
                            variant="secondary"
                            onClick={()=>{
                              FeedbackForm.setValues((prev:any)=>({...prev,...initialValueForReset}))
                            }}
                          >
                            Reset
                          </Button>
                        </div>

                        <div className="tw-w-full md:tw-w-1/4 pay-button sm:tw-text-left tw-px-3">
                          <Button variant="primary" type="submit" onClick={(e:any)=>FeedbackForm.handleSubmit(e)} disabled={showApiLoader}>
                            Submit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>}
                </div>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </React.Fragment>
  );
}
