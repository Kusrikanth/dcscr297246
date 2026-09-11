import { useEffect, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import {
  DateInput,
  SelectInput,
} from "../../../Components/Common";
import { toast } from "react-toastify";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {
  addInstAcademicYearAct,
  getInstAcademicYearAct,
  updateInstAcademicYearAct,
} from "../../../store/mastersettings/instacademics/instacademicactions";

//Interface & Types
import {
  IAcademicYearInfo,
  IAddAcademicYearModel,
} from "../../../store/mastersettings/instacademics/instacademictypes";
import {
  IAddEditAcademicYearRespRef,
} from "./academicyearstypes";
import {  select2 } from "./helper";
import { getAcademicYears, getMaxDateByYear, getMinDateByYear } from "../../../utility/dateutility";
import Button from "../../../Components/Common/Button";

// function getAcademicYears(year:string){
//   let years=[],y=2000;
//   while(y!== +year + 2){
//     years.push({year:`${y}`});
//     y++;
//   }
//   return years;
// }


function getAcademicName(year:string){
  return `20${year}`
}

function getAddEditAcademicData(
  editData?: IAcademicYearInfo
): IAddAcademicYearModel {
  
  return {
    academicYearId: editData?.academicYearId?`${editData?.academicYearId}`: "",
    startDate: editData?.startDate || "",
    endDate: editData?.endDate || "",
    startYear: editData?.startYear || "",
    endYear: editData?.endYear || "",
    isChallanDisplay: editData?editData?.isChallanDisplay?"true":"false" :""
  };
}

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required("Academic year required."),
  startDate: Yup.string().required("Start date required."),
  endDate: Yup.string().required("End date required."),
  startYear: Yup.string().required("Start Year required."),
  endYear: Yup.string().required("End Year required."),
  isChallanDisplay: Yup.string().required("Challan Display required."),
});

const AddEditAcademicYear: React.FC<any> = (props) => {
  const [addAcademicYearState, setAddAcademicYearState] =
    useState<IAddAcademicYearModel>(() => getAddEditAcademicData());
  const [yearList,setYearList]=useState<any>([]);
  const dispatch = useAppDispatch();
  const {
    addAcademicYearResp,
    updateAcademicYearResp,
    masterAcademicYearResp,
    academicYearListResp,
    showApiLoader,
  } = useAppSelector(
    ({ instAcademics, masterData,globalData }: any) => ({
      updateAcademicYearResp: instAcademics.updateAcademicYearResp,
      addAcademicYearResp: instAcademics.addAcademicYearResp,
      masterAcademicYearResp: masterData.masterAcademicYearResp,
      academicYearListResp: instAcademics.academicYearListResp,
      showApiLoader: globalData.showApiLoader,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (props.isOpen && !masterAcademicYearResp) {
      const params={instituteId:props.instituteId,pageNo:0,pageSize:100,orderBy:"desc",sortBy:"academicYearName"}
      dispatch(
        getInstAcademicYearAct(generateActionPayload("get_inst_academic_year",undefined,params))
      );
    } else if (!props.isOpen) {
      setAddAcademicYearState(getAddEditAcademicData());
      addAcademicYearForm.resetForm();
      setYearList([])
    }
  }, [props.isOpen]);

  const addEditAcademicYearRespRef = useRef<IAddEditAcademicYearRespRef>({
    prevAddAcademicYearResp: addAcademicYearResp,
    prevUpdateAcademicYearResp: updateAcademicYearResp,
  });

  useEffect(() => {
    const { prevAddAcademicYearResp, prevUpdateAcademicYearResp } =
      addEditAcademicYearRespRef.current;
    if (
      addAcademicYearResp &&
      addAcademicYearResp !== prevAddAcademicYearResp
    ) {
      props.toggle({pageNo:0,sortBy:""},true);
      toast.success("Academic year added successfully.");
    } else if (
      updateAcademicYearResp &&
      updateAcademicYearResp !== prevUpdateAcademicYearResp
    ) {
      props.toggle({pageNo:0,sortBy:""},true);
      toast.success("Academic year updated successfully.");
    }
    addEditAcademicYearRespRef.current.prevAddAcademicYearResp =
      addAcademicYearResp;
    addEditAcademicYearRespRef.current.prevUpdateAcademicYearResp =
      updateAcademicYearResp;
  }, [addAcademicYearResp, updateAcademicYearResp]);

  const addAcademicYearForm = useFormik({
    enableReinitialize: true,
    initialValues: addAcademicYearState,
    validationSchema,
    onSubmit: (values) => {
      if (props.academicYearId) {
        const params = { academicYearId: props.academicYearId },
         { academicYearId, ...payload } = values;
        dispatch(
          updateInstAcademicYearAct(
            generateActionPayload("update_inst_academic_year", params, {...payload,instituteAcademicYearId:props.editModalData&&props.editModalData.instituteAcademicYearId})
          )
        );
      } else {
        const params = { instituteId: props.instituteId },
          { academicYearId } = values,
          academicYearDetails = academicYearListResp&&academicYearListResp.data.find(
            (item: any) => item.academicYearId === +academicYearId
          );
          
        if (academicYearDetails) {
          const { academicYearName } = academicYearDetails,
            payload = { ...values,academicYearId:+values.academicYearId,isChallanDisplay:values.isChallanDisplay==="true"?true:false};
            
            dispatch(
            addInstAcademicYearAct(
              generateActionPayload("add_inst_academic_year", params, payload)
            )
            );
        }
      }
    },
  });

  useEffect(() => {
    if (props.isOpen && props.editModalData) {
      setAddAcademicYearState(getAddEditAcademicData(props.editModalData));
    }
    props.editModalData&&setYearList(getAcademicYears(+props.editModalData.endYear,2000,2,"asc"))
  }, [props.isOpen, props.editModalData]);
  // const submitHandler = () => {
  //   const params = { instituteId: 49 };
  //   let value = {
  //     ...addAcademicYearForm.values,
  //     academicYearId: +addAcademicYearForm.values.academicYearId,
  //   };

  //   dispatch(
  //     addInstAcademicYearAct(
  //       generateActionPayload("add_inst_academic_year", params, value)
  //     )
  //   );
  // };
  // const [selectedOp, setSelectedOp] = useState("");
  // const [startYear, setStartYear] = useState("");
  // const [endYear, setEndYear] = useState("");
  // const checkHandler = () => {
  //   let sYear = select1.filter((i) => i?.year === selectedOp.split("-")[0]);
  //   let eYear = select1.filter((i) => i?.year === selectedOp.split("-")[1]);

  //   if (sYear !== undefined && eYear !== undefined) {
  //     setStartYear(sYear[0]?.year);
  //     setEndYear(eYear[0]?.year);
  //   }
  // };

  const academicYearHandler=(e:any)=>{
    
    addAcademicYearForm.setValues(prev=>({...prev,academicYearId:e.target.value,startYear:e.target.selectedOptions[0].text.split('-')[0],endYear:e.target.selectedOptions[0].text.split('-')[1]}))
    setYearList(getAcademicYears(+e.target.selectedOptions[0].text.split('-')[1],2000,2,"asc"))
  }

  // useEffect(() => {
  //   checkHandler();
  // }, [selectedOp]);
  
  return (

    <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-p-3">

      <div className="tw-col-span-12">
        <SelectInput
          name="academicYearId"
          labelText="Year Name"
          value={addAcademicYearForm.values.academicYearId}
          onChange={academicYearHandler}
          invalid={
            addAcademicYearForm.touched.academicYearId &&
              addAcademicYearForm.errors.academicYearId
              ? true
              : false
          }
          error={
            addAcademicYearForm.touched.academicYearId &&
              addAcademicYearForm.errors.academicYearId
              ? addAcademicYearForm.errors.academicYearId
              : ""
          }
          menuItems={academicYearListResp ? academicYearListResp.data : []}
          valueKey="academicYearId"
          textKey="academicYearName"
          isDisabled={!!props.academicYearId}
        />
      </div>

      <div className="tw-col-span-12 md:tw-col-span-6">
        <SelectInput
          name="startYear"
          labelText="Start Year"
          menuItems={yearList}
          valueKey="year"
          textKey="year"
          onChange={addAcademicYearForm.handleChange}
          value={addAcademicYearForm.values.startYear}
          invalid={
            addAcademicYearForm.touched.startYear &&
              addAcademicYearForm.errors.startYear
              ? true
              : false
          }
          error={
            addAcademicYearForm.touched.startYear &&
              addAcademicYearForm.errors.startYear
              ? addAcademicYearForm.errors.startYear
              : ""
          }
        />
      </div>

      <div className="tw-col-span-12 md:tw-col-span-6">
        <SelectInput
          name="endYear"
          labelText="End Year"
          menuItems={yearList}
          valueKey="year"
          textKey="year"
          onChange={addAcademicYearForm.handleChange}
          value={addAcademicYearForm.values.endYear}
          invalid={
            addAcademicYearForm.touched.endYear &&
              addAcademicYearForm.errors.endYear
              ? true
              : false
          }
          error={
            addAcademicYearForm.touched.endYear &&
              addAcademicYearForm.errors.endYear
              ? addAcademicYearForm.errors.endYear
              : ""
          }
        />
      </div>

      <div className="tw-col-span-12 md:tw-col-span-6">
        <DateInput
          name="startDate"
          labelText="Start Date"
          value={addAcademicYearForm.values.startDate}
          onChange={addAcademicYearForm.handleChange}
          maxDate={getMaxDateByYear(`${addAcademicYearForm.values.startYear ? +addAcademicYearForm.values.startYear + 1 : 2099}`)}
          minDate={getMinDateByYear(`${addAcademicYearForm.values.startYear ? +addAcademicYearForm.values.startYear : 1970}`)}
          invalid={
            addAcademicYearForm.touched.startDate &&
              addAcademicYearForm.errors.startDate
              ? true
              : false
          }
          error={
            addAcademicYearForm.touched.startDate &&
              addAcademicYearForm.errors.startDate
              ? addAcademicYearForm.errors.startDate
              : ""
          }
        />
      </div>

      <div className="tw-col-span-12 md:tw-col-span-6">
        <DateInput
          name="endDate"
          labelText="End Date"
          value={addAcademicYearForm.values.endDate}
          onChange={addAcademicYearForm.handleChange}
          maxDate={getMaxDateByYear(`${addAcademicYearForm.values.endYear ? +addAcademicYearForm.values.endYear + 1 : 2099}`)}
          minDate={getMinDateByYear(`${addAcademicYearForm.values.endYear ? +addAcademicYearForm.values.endYear : 1970}`)}
          invalid={
            addAcademicYearForm.touched.endDate &&
              addAcademicYearForm.errors.endDate
              ? true
              : false
          }
          error={
            addAcademicYearForm.touched.endDate &&
              addAcademicYearForm.errors.endDate
              ? addAcademicYearForm.errors.endDate
              : ""
          }
        />
      </div>

      <div className="tw-col-span-12 md:tw-col-span-6">
        <SelectInput
          name="isChallanDisplay"
          labelText="Challan Display"
          value={addAcademicYearForm.values.isChallanDisplay}
          onChange={addAcademicYearForm.handleChange}
          menuItems={select2}
          valueKey="isChallanDisplayId"
          textKey="isChallanDisplayType"
          invalid={
            addAcademicYearForm.touched.isChallanDisplay &&
              addAcademicYearForm.errors.isChallanDisplay
              ? true
              : false
          }
          error={
            addAcademicYearForm.touched.isChallanDisplay &&
              addAcademicYearForm.errors.isChallanDisplay
              ? addAcademicYearForm.errors.isChallanDisplay
              : ""
          }
        />
      </div>

      <div className="tw-col-span-12 tw-flex tw-justify-end tw-gap-2 tw-mt-4 tw-mb-1">
        <Button
          type="button"
          variant="secondary"
          onClick={props.toggle}
        >
          Cancel
        </Button>

        <Button
          type="button"
          variant="primary"
          onClick={(event: any) => addAcademicYearForm.handleSubmit(event)}
          disabled={showApiLoader}
        >
          {props.academicYearId ? "Update" : "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default AddEditAcademicYear;
