import { useEffect } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormGroup, Input, Label } from "reactstrap";
import { SelectInput, TextInput } from "../../../../../Components/Common";
import { useAppSelector } from "../../../../../hooks/storehook";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import { saveDisciplineSettingsDomainItemByIdAct, updateDisciplineSettingsDomainItemByIdAct } from "../../../../../store/examination/pvaReports/pvaReportsActions";


const DEFAULT_COLOR = "#364574";

const initialValues = {
  academicYearId: "",
  domains: [
    {
      domainName: "",
      color: DEFAULT_COLOR,
    },
  ],
};

const validationSchema = Yup.object({
  academicYearId: Yup.string().required("Academic Year is required."),

  domains: Yup.array()
    .of(
      Yup.object({
        domainName: Yup.string()
          .trim()
          .required("Domain name is required"),
        color: Yup.string().required("Color is required"),
      })
    )
    .min(1, "At least one domain is required"),
});

const AddEditDomainModal = ({
  toggle,
  editItemId,
}:any) => {
  const dispatch = useDispatch();

  const {
    showApiLoader,
    branchId,
    academicYearListResp,
    getDisciplineSettingsDomainItemByIdResp,
    currentInstIdResp: instituteId,
  } = useAppSelector(
    ({ globalData, appData, instAcademics, pvaReports }: any) => ({
      showApiLoader: globalData.showApiLoader,
      branchId: appData.currentBranchIdResp,
      academicYearListResp: instAcademics.academicYearListResp,
      getDisciplineSettingsDomainItemByIdResp:
        pvaReports.getDisciplineSettingsDomainItemByIdResp,
      currentInstIdResp: appData.currentInstIdResp,
    }),
    shallowEqual
  );

  const domainFormik = useFormik<any>({
    initialValues,
    validationSchema,
    enableReinitialize: false,

    onSubmit: (values) => {

      if (editItemId) {
        const payload = {
          domainName:values.domains?.[0]?.domainName || "",
          color:values.domains?.[0]?.color || DEFAULT_COLOR
        };
        dispatch(
          updateDisciplineSettingsDomainItemByIdAct(
            generateActionPayload(
              "update_discipline_settings_domain_item_by_id",
              { id: editItemId },
              payload
            )
          )
        );

      }
      else {
        const formattedDomains = values.domains.map((domain) => ({
          domainName: domain.domainName.trim(),
          color: domain.color || DEFAULT_COLOR,
        }));
        const payload = {
          instituteId,
          branchId,
          academicYearId: values.academicYearId,
          domains: formattedDomains,
        };

        dispatch(
          saveDisciplineSettingsDomainItemByIdAct(
            generateActionPayload(
              "save_discipline_settings_domain_item_by_id",
              undefined,
              payload
            )
          )
        );
      }
    },
  });

  const {
    values,
    errors,
    touched,
    setFieldValue,
    setValues,
    handleChange,
    handleBlur,
    handleSubmit,
  } = domainFormik;


  useEffect(() => {
    const yearId =
      academicYearListResp &&
      academicYearListResp.data.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      )?.academicYearId;

    setFieldValue("academicYearId", yearId);
  }, [academicYearListResp]);


  useEffect(() => {
    if (!editItemId || !getDisciplineSettingsDomainItemByIdResp) {
      return;
    }

    const response = getDisciplineSettingsDomainItemByIdResp?.data
      ? getDisciplineSettingsDomainItemByIdResp.data
      : getDisciplineSettingsDomainItemByIdResp;

    const responseDomains = Array.isArray(response?.domains)
      ? response.domains
      : [];

    setValues({
      academicYearId: String(response?.academicYearId ?? ""),
      domains:
        responseDomains.length > 0
          ? responseDomains.map((domain: any) => ({
              id: domain?.id ?? domain?.domainId,
              domainName: domain?.domainName ?? "",
              color:
                domain?.color ??
                domain?.colorCode ??
                domain?.tableHeaderColor ??
                DEFAULT_COLOR,
            }))
          : [
              {
                domainName: "",
                color: DEFAULT_COLOR,
              },
            ],
    });
  }, [editItemId, getDisciplineSettingsDomainItemByIdResp, setValues]);

  useEffect(() => {
    if (getDisciplineSettingsDomainItemByIdResp && editItemId) {
      const {
        academicYearId,
        domainName,
        color,
        id,
      } = getDisciplineSettingsDomainItemByIdResp;

      setValues({
        academicYearId: academicYearId || "",
        domains: [
          {
            id: id,
            domainName: domainName || "",
            color: color || "#364574",
          },
        ],
      });
    }
  }, [
    getDisciplineSettingsDomainItemByIdResp,
    editItemId,
    setValues,
  ]);

  const addDomain = () => {
    setFieldValue("domains", [
      ...values.domains,
      {
        domainName: "",
        color: DEFAULT_COLOR,
      },
    ]);
  };

  const removeDomain = (index: number) => {
    if (values.domains.length === 1) {
      return;
    }

    const updatedDomains = values.domains.filter(
      (_, domainIndex) => domainIndex !== index
    );

    setFieldValue("domains", updatedDomains);
  };

  const getDomainNameError = (index: number) => {
    const domainTouched = touched.domains?.[index];
    const domainError = errors.domains?.[index];

    if (
      domainTouched &&
      typeof domainTouched === "object" &&
      domainTouched.domainName &&
      domainError &&
      typeof domainError === "object"
    ) {
      return domainError.domainName ?? "";
    }

    return "";
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ padding: "1.25rem" }}>
        <div className="row">
          <div className="col-12 mb-3">
            <SelectInput
              name="academicYearId"
              labelText="Academic Year"
              labelClass="required"
              value={values.academicYearId}
              menuItems={academicYearListResp?.data ?? []}
              valueKey="academicYearId"
              textKey="academicYearName"
              isDisabled={Boolean(editItemId)}
              onChange={handleChange}
              onBlur={handleBlur}
              invalid={Boolean(
                touched.academicYearId && errors.academicYearId
              )}
              error={
                touched.academicYearId && errors.academicYearId
                  ? String(errors.academicYearId)
                  : ""
              }
            />
          </div>
        </div>

        <div className="row align-items-start mb-4 border-bottom pb-3 mx-auto w-100">
          <div className="col-md-8">
            <h5 className="mb-0">Domains</h5>
          </div>
          <div className="col-md-2">
            <h5 className="mb-0">Color</h5>
          </div>
          {
            !editItemId ? 
            <div className="col-md-2">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={addDomain}
              >
                + Add Domain
              </button>
            </div> : null
          }

        </div>

        {values.domains.map((domain, index) => {
          const domainNameError = getDomainNameError(index);

          return (
            <div
              key={domain.id ?? index}
              className="row align-items-start mb-3"
            >
              <div className="col-md-8">
                <TextInput
                  name={`domains.${index}.domainName`}
                  value={domain.domainName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  labelClass="required"
                  invalid={Boolean(domainNameError)}
                  error={domainNameError}
                  formgroupClassName="mb-3"
                  placeHolder="Enter domain"
                />
              </div>

              <div className="col-md-2">
                <FormGroup className="">
                  <Input
                    id={`domains.${index}.color`}
                    name={`domains.${index}.color`}
                    type="color"
                    className="form-control form-control-color w-100"
                    value={domain.color || DEFAULT_COLOR}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </div>

              <div className="col-md-2">
                <button
                  type="button"
                  className="btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white"
                  onClick={() => removeDomain(index)}
                  disabled={values.domains.length === 1}
                >
                  <HugeiconsIcon
                    icon={Delete02StrokeStandard}
                    className="text-danger"
                    size={18}
                  />
                </button>
              </div>
            </div>
          );
        })}


        <div className="row mt-4">
          <div className="d-flex ms-auto w-auto">
            <button
              type="button"
              className="btn btn-light me-3"
              onClick={toggle}
              disabled={showApiLoader}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-success"
              disabled={showApiLoader}
            >
              {editItemId ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddEditDomainModal;