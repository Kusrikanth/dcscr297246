import { MouseEventHandler, useEffect, useRef, useState } from "react";
import {
  MultiSelectCheckbox,
  SelectInput,
  TextInput,
} from "../../../../Components/Common";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../../hooks/storehook";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { Button } from "reactstrap";
import * as Yup from "yup";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { createSlabsTermListAct, editSlabsTermListAct } from "../../../../store/transportation/transportationaction";
import { getInstAcademicTermAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";

const initialValues = {
  academicYearId : "",
  termTypeId : [],
  vehicleSlabTermsPriceAndSlabsDTO : [
    {
      slabId : "",
      termAmount : "",
      distanceRange : "",
    }
  ]
}


const validationSchema =  Yup.object().shape({
  academicYearId : Yup.string().required("Academic Year is Required").nullable(),
  termTypeId : Yup.array().required("Term Type is Required").test('notEmptyArr','Minimum 1 Term should be selected',(value:any) =>{ return value.length > 0; }),
  vehicleSlabTermsPriceAndSlabsDTO : Yup.array().of(
    Yup.object().shape({
      slabId: Yup.string().nullable().required('Slab Name is required'),
      termAmount: Yup.string().nullable().required('Term Amount is required'),
    })
  ),
})

const SlabsTermsModal = (props: any) => {
 const {slabTermId} = props || {};
 const dispatch = useDispatch()
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

 
  const {currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,showApiLoader ,academicYearListResp,getSlabsListResp,getSlabsTermsListByIdResp,academicTermListResp}: any = useAppSelector(({ transportrequest,appData,globalData,instAcademics }) => ({
    currentBranchIdResp: appData.currentBranchIdResp,
    currentInstIdResp: appData.currentInstIdResp,
    showApiLoader : globalData.showApiLoader,
    academicYearListResp:instAcademics.academicYearListResp,
    academicTermListResp:instAcademics.academicTermListResp,
    getSlabsListResp:transportrequest.getSlabsListResp,
    getSlabsTermsListByIdResp:transportrequest.getSlabsTermsListByIdResp,
  }), shallowEqual);

  const AddSlabsTermsForm = useFormik({
    initialValues: initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if(slabTermId){
        const payload = {
          amount : values?.vehicleSlabTermsPriceAndSlabsDTO?.length > 0 ? values?.vehicleSlabTermsPriceAndSlabsDTO[0]?.termAmount : "",
        }
        dispatch(editSlabsTermListAct(generateActionPayload("edit_slabs_terms_list",{id:slabTermId },payload)))
      }else{
        const payload = {
          branchId,
          instituteId,
          academicYearId : values.academicYearId,
          termTypeIds : values.termTypeId?.map((i:any)=>i?.instituteTermId),
          vehicleSlabTermsPriceAndSlabsDTO : values?.vehicleSlabTermsPriceAndSlabsDTO?.map((item:any)=>({
            slabId : item?.slabId,
            termAmount : item?.termAmount,
          }))
        }
        dispatch(createSlabsTermListAct(generateActionPayload("create_slabs_terms_list",undefined,payload)))

      }
    }
  });

  function addSlabTermsHandler() {
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({ slabId : "",termAmount : "",distanceRange : "", });
    }
  }

  function getTermNameHndler (value: any) {
    const payload = {
      instituteId,
      pageNo : 0,
      pageSize : 100,
      academicYearId : value,
      masterTermTypeId :1,
      sortBy:"termName",
      orderBy: "asc",
    }
    dispatch(
      getInstAcademicTermAct(
        generateActionPayload("get_inst_academic_term", undefined, payload)
      )
    );
  }

 const filterHndler = (event:any)=>{
  const {name,value} = event.target;
  AddSlabsTermsForm.setValues((prev:any)=>({...prev,[name]:value}));
  if(name === "academicYearId"){
    getTermNameHndler(value)
  }
 }

 useEffect(() => {
  if(academicYearListResp){
    let { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
    AddSlabsTermsForm.setValues((prev:any)=>({
      ...prev,
      academicYearId : academicYearId,
    }))
    getTermNameHndler(academicYearId)
  }
 }, [])
 
  
 
 function removeSlabTermsHndlr(event: React.MouseEvent<HTMLElement>) {
  const rowIndex = event.currentTarget.getAttribute("data-index");
  if (rowIndex !== undefined || rowIndex !== null) {
    formikArrayHelpers.current?.remove(Number(rowIndex));
  }
}

const slabChangeHndler = (event:any,index:number)=>{
  
  const distance = getSlabsListResp?.filter((i:any)=>+i?.slabId === +event.target.value)

  AddSlabsTermsForm.setValues((prev:any)=>({
    ...prev,
    vehicleSlabTermsPriceAndSlabsDTO : prev?.vehicleSlabTermsPriceAndSlabsDTO?.map((ele:any,i:number)=>{
      if(+i === +index){
        return {
          ...ele,
          slabId : event.target.value,
          distanceRange : distance?.length > 0 ?  distance[0]?.radius : "",
        }
      }
      return ele
    })
  }))
}

useEffect(() => {
 if(slabTermId && getSlabsTermsListByIdResp){
  const distance = getSlabsListResp?.filter((i:any)=>+i?.slabId === +getSlabsTermsListByIdResp?.slabsId)
  AddSlabsTermsForm.setValues((prev:any)=>({
    ...prev,
    academicYearId : `${getSlabsTermsListByIdResp?.academicYearId || ""}`,
    // termTypeId : `${getSlabsTermsListByIdResp?.termTypeId || ""}`,
    vehicleSlabTermsPriceAndSlabsDTO : [{
      slabId : `${getSlabsTermsListByIdResp?.slabsId || ""}`,
      termAmount : `${getSlabsTermsListByIdResp?.amount || ""}`,
      distanceRange : distance?.length > 0 ?  `${distance[0]?.radius || ""}` : "",
    }]
  }))

  getTermNameHndler(getSlabsTermsListByIdResp?.academicYearId)
 }
}, [getSlabsTermsListByIdResp])

useEffect(() => {
  if(academicTermListResp && slabTermId && getSlabsTermsListByIdResp){
    const termType = academicTermListResp?.data?.find((i:any)=>+i?.instituteTermId === +getSlabsTermsListByIdResp?.termTypeId)
    AddSlabsTermsForm.setFieldValue("termTypeId",[termType])
  }
}, [academicTermListResp])


function renderOptions(item: any) {
  return item?.termName;
}

function renderValue(selectedItems: any) {
  if (Array.isArray(selectedItems)) {
      return (<div className="text-truncate">
          {
              selectedItems.map((item, index) => {
                  return item?.termName + (index !== (selectedItems.length - 1) ? ', ' : '')
              })
          }
      </div>)
  }
}

function onSelectOptionHandler(selectedOptions: any, config?: any) {
  const { name } = config;
  if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
      AddSlabsTermsForm.setValues((prevState: any) => ({ ...prevState, [name]: selectedOptions }));
  } else {
      AddSlabsTermsForm.setValues((prevState: any) => ({ ...prevState, [name]: null }));
  }
}


  return (

      <div className="row" style={{padding:"1.25rem"}}>
        <div className="col-12">
          <div className="row mb-3">
            <div className="col-6">
            <SelectInput
                name="academicYearId"
                value={AddSlabsTermsForm.values.academicYearId}
                onChange={filterHndler}
                // inputClassName="bg-light border-0"
                formgroupClassName="mb-0"
                menuItems={academicYearListResp?.data || [] }
                valueKey="academicYearId"
                labelClass="required"
                isDisabled={slabTermId ? true : false}
                textKey="academicYearName"
                onBlur={AddSlabsTermsForm.handleBlur}
                labelText="Academic Year"
                invalid={(AddSlabsTermsForm.touched.academicYearId && AddSlabsTermsForm.errors.academicYearId) ? true : false}
                error={(AddSlabsTermsForm.touched.academicYearId && AddSlabsTermsForm.errors.academicYearId) ? AddSlabsTermsForm.errors.academicYearId : ""}
              />
            </div>
            <div className="col-6">
                   <MultiSelectCheckbox
                        name="termTypeId"
                        idKey="instituteAcademicTermId"
                        labelText="Term Name"
                        labelClass="required"
                        value={AddSlabsTermsForm.values.termTypeId}
                        renderValue={renderValue}
                        isDisabled={slabTermId ? true : false}
                        renderOptions={renderOptions}
                        onChange={onSelectOptionHandler}
                        searchKey="shortName"
                        options={academicTermListResp?.data || []}
                        invalid={(AddSlabsTermsForm.touched.termTypeId && AddSlabsTermsForm.errors.termTypeId) ? true : false}
                        error={(AddSlabsTermsForm.touched.termTypeId && AddSlabsTermsForm.errors.termTypeId) ? String(AddSlabsTermsForm.errors.termTypeId) : ""}
                    />
            </div>
          </div>
        </div>
        <div className="col mb-3">
          <div className="row">
            <div className="col-5">
              <div className="hstack">
                <h6 className="mb-0 me-2 form-label required">Slab Name</h6>
                
              </div>
            </div>
            <div className="col-3">
              <h6 className="mb-0 text-nowrap">
                Distance Range
              </h6>
            </div>
            <div className="col-3">
              <h6 className="mb-0 form-label required">Amount</h6>
            </div>
          </div>
        </div>

        <div className="col-12">
          
           <FormikProvider value={AddSlabsTermsForm}>
            <FieldArray name="vehicleSlabTermsPriceAndSlabsDTO">
              {(arrayHelpers: ArrayHelpers) => {
                if (!formikArrayHelpers.current) {
                  formikArrayHelpers.current = arrayHelpers;
                }
                return (
                  <>
                    {AddSlabsTermsForm.values.vehicleSlabTermsPriceAndSlabsDTO?.length > 0 &&
                      AddSlabsTermsForm.values.vehicleSlabTermsPriceAndSlabsDTO?.map((slabTerms:any, index:any) => {
                        const inputFieldErrors: any = AddSlabsTermsForm.errors.vehicleSlabTermsPriceAndSlabsDTO && AddSlabsTermsForm.errors.vehicleSlabTermsPriceAndSlabsDTO[index] || {};
                        const inputFieldTouched = AddSlabsTermsForm.touched.vehicleSlabTermsPriceAndSlabsDTO && AddSlabsTermsForm.touched.vehicleSlabTermsPriceAndSlabsDTO[index] || {};
                        return (
                          <div key={index} className="mb-3 row">
                            <div className="col-5">
                            <SelectInput
                               name={`vehicleSlabTermsPriceAndSlabsDTO[${index}].slabId`}
                                value={slabTerms.slabId}
                                onChange={(event:any)=>slabChangeHndler(event,index)}
                                valueKey="slabId"
                                isDisabled={slabTermId ? true : false}
                                onBlur={AddSlabsTermsForm.handleBlur}
                                textKey="slabName"
                                menuItems={getSlabsListResp || []}
                                invalid={(inputFieldTouched.slabId && inputFieldErrors.slabId) ? true : false}
                                  error={(inputFieldTouched.slabId && inputFieldErrors.slabId) ? inputFieldErrors.slabId : ""}
                                // labelText="Slab Name"
                              />
                            </div>
                            <div className="col-3">
                            <div  className="hstack justify-content-between">
                                 <TextInput
                                   name={`vehicleSlabTermsPriceAndSlabsDTO[${index}].distanceRange`}
                                   placeHolder="0.00 Kms"
                                   onChange={AddSlabsTermsForm.handleChange}
                                   value={slabTerms.distanceRange}
                                   formgroupClassName="mb-0"
                                  //  inputClassName="bg-light"
                                  isDisabled={true}
                                 />
                               </div>
                            </div>
                            <div className="col-3">
                            <div className="hstack ">
                               <TextInput
                                 name={`vehicleSlabTermsPriceAndSlabsDTO[${index}].termAmount`}
                                 placeHolder="₹ 0.00"
                                //  inputClassName="w-60"
                                 onChange={AddSlabsTermsForm.handleChange}
                                 value={slabTerms.termAmount}
                                 onBlur={AddSlabsTermsForm.handleBlur}
                                 invalid={(inputFieldTouched.termAmount && inputFieldErrors.termAmount) ? true : false}
                                  error={(inputFieldTouched.termAmount && inputFieldErrors.termAmount) ? inputFieldErrors.termAmount : ""}
                                 formgroupClassName="mb-0"
                               />
                                
                             </div>
                                
                            </div>
                             {(index !== 0) && 
                             <div className="col-1">
                             <Button data-index={index} onClick={removeSlabTermsHndlr} color="white" className="btn-sm btn-icon btn-rounded btn-hover-danger">
                             <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />                                </Button></div>}
                          </div>
                        )
                      })}
                  </>
                )
              }}
            </FieldArray>

          </FormikProvider>
          {!slabTermId && <div className="row">
                    <div className="col-12">
                        <button onClick={addSlabTermsHandler} type="button" className="btn btn-outline-primary btn-sm">
                            Add New
                        </button>
                    </div>
                </div>}
        </div>
        <div className='row'>
                <div className='d-flex w-auto ms-auto '>
                    <button
                        type="submit"
                        className="btn btn-light text-success mx-3 text-black"
                        onClick={props.toggle}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-success px-4"
                        onClick={(event:any) => { AddSlabsTermsForm.handleSubmit(event)}}
                        // disabled={(!studentData || showApiLoader) &&  true}
                    >
                        {/* {props.routeId ? "Update" : "Submit"} */}Submit
                    </button>
                </div>
            </div>
      </div>
   
  );
};

export default SlabsTermsModal;
