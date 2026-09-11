import { useFormik } from "formik";
import * as Yup from "yup";
import { TextInput } from "../../../../Components/Common";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { updateWhatsappSettingsTemplateAct } from "../../../../store/communication/communicationactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useEffect } from "react";

const validationSchema = Yup.object().shape({
  campaignName: Yup.string().required("Campaign Name is required"),
});

export default function EditWhatsappSettingsTemplateModal({
  editItemId,
  toggle,
}: any) {
  const dispatch = useAppDispatch();
  const editWhatsappSettingsTemplateFormik = useFormik({
    initialValues: {
      campaignName: "",
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(
        updateWhatsappSettingsTemplateAct(
          generateActionPayload(
            "update_whatsapp_settings_template",
            undefined,
            {
              id: editItemId,
              campaignName: values.campaignName,
            }
          )
        )
      );
    },
  });

  const { showApiLoader, getWhatsappSettingsTemplatesResp } = useAppSelector(
    ({ globalData, communication }) => ({
      showApiLoader: globalData.showApiLoader,
      getWhatsappSettingsTemplatesResp:
        communication.getWhatsappSettingsTemplatesResp,
    }),
    shallowEqual
  );

  useEffect(() => {
    const templates = getWhatsappSettingsTemplatesResp?.content;
    if (Array.isArray(templates)) {
      const selectedItem = templates.find(
        (item: any) => item.id === editItemId
      );
      if (selectedItem) {
        editWhatsappSettingsTemplateFormik.setValues({
          campaignName: selectedItem.campaignName || "",
        });
      }
    }
  }, [editItemId, getWhatsappSettingsTemplatesResp]);

  return (
    <div className="tw-p-4">
      <div>
        <TextInput
          name="campaignName"
          value={editWhatsappSettingsTemplateFormik.values.campaignName}
          onChange={editWhatsappSettingsTemplateFormik.handleChange}
          onBlur={editWhatsappSettingsTemplateFormik.handleBlur}
          labelText="Campaign Name"
          formgroupClassName="mb-3"
          invalid={
            !!(
              editWhatsappSettingsTemplateFormik.touched.campaignName &&
              editWhatsappSettingsTemplateFormik.errors.campaignName
            )
          }
          error={
            editWhatsappSettingsTemplateFormik.touched.campaignName &&
            editWhatsappSettingsTemplateFormik.errors.campaignName
              ? editWhatsappSettingsTemplateFormik.errors.campaignName
              : ""
          }
        ></TextInput>
      </div>

      <div className="row">
        <div className="d-flex ms-auto w-auto">
          <button className="btn btn-light me-3" onClick={toggle}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-success"
            onClick={(event: any) =>
              editWhatsappSettingsTemplateFormik.handleSubmit(event)
            }
            disabled={showApiLoader}
          >
            {editItemId ? "Update" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
