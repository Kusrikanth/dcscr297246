
import {TextInput, } from "../../../../Components/Common";
import {AccordionBody,AccordionHeader } from "reactstrap";

export default function AdditionalInforamtion() {
  return (
    <form>
      <AccordionHeader tag="h5" targetId="additionalinforamtion">
        Additional Inforamtion
      </AccordionHeader>
      <AccordionBody accordionId="additionalinforamtion">
        <div className="tw-flex tw-flex-wrap tw--mx-3 tw-gap-y-4 tw-py-3 radio-btn">
          <div className="tw-flex tw-flex-wrap tw--mx-3 tw-gap-y-4 tw-w-full tw-px-3">
            <div className="tw-w-full sm:tw-w-full tw-grid tw-px-3">
              <label className="tw-font-bold">
                Are you given the necessary information about admission process
                ?
              </label>
              <div>
                <div className="tw-inline-block tw-mr-4">
                  <input
                    className="tw-mr-1"
                    type="radio"
                    id="inlineCheckbox11"
                    value="Yes"
                    name="process"
                  />
                  <label className="tw-ml-1">Yes</label>
                </div>
                <div className="tw-inline-block tw-mr-4">
                  <input
                    className="tw-mr-1"
                    type="radio"
                    id="inlineCheckbox12"
                    value="No"
                    name="process"
                  />
                  <label className="tw-ml-1">No</label>
                </div>
              </div>
            </div>
          </div>
          <div className="tw-flex tw-flex-wrap tw--mx-3 tw-gap-y-4 tw-w-full tw-px-3">
            <div className="tw-w-full sm:tw-w-full tw-grid tw-px-3">
              <label className="tw-font-bold">Do you require any details further ?</label>
              <div>
                <div className="tw-inline-block tw-mr-4">
                  <input
                    className="tw-mr-1"
                    type="radio"
                    id="inlineCheckbox9"
                    value="Yes"
                    name="further"
                  />
                  <label className="tw-ml-1">Yes</label>
                </div>
                <div className="tw-inline-block tw-mr-4">
                  <input
                    className="tw-mr-1"
                    type="radio"
                    id="inlineCheckbox10"
                    value="No"
                    name="further"
                  />
                  <label className="tw-ml-1">No</label>
                </div>
              </div>
            </div>
          </div>
          <div className="tw-flex tw-flex-wrap tw--mx-3 tw-gap-y-4 tw-w-full tw-px-3">
            <div className="tw-w-full sm:tw-w-full tw-grid tw-px-3">
              <label className="tw-font-bold">Do you require any details further ?</label>
              <div>
                <div className="tw-inline-block tw-mr-4">
                  <input
                    className="tw-mr-1"
                    type="radio"
                    id="inlineCheckbox15"
                    value="Yes"
                    name="details"
                  />
                  <label className="tw-ml-1">Yes</label>
                </div>
                <div className="tw-inline-block tw-mr-4">
                  <input
                    className="tw-mr-1"
                    type="radio"
                    id="inlineCheckbox16"
                    value="No"
                    name="details"
                  />
                  <label className="tw-ml-1">No</label>
                </div>
                <div className="tw-inline-block tw-mr-4">
                  <input
                    className="tw-mr-1"
                    type="radio"
                    id="inlineCheckbox17"
                    value="NeedTime"
                    name="details"
                  />
                  <label className="tw-ml-1">Need Time</label>
                </div>
              </div>
            </div>
          </div>
          <div className="tw-w-full md:tw-w-1/2 tw-px-3">
            <TextInput
              name="address"
              labelText="We will be happy to note suggestions from you, if any"
              labelClass={"tw-font-bold"}
              formgroupClassName="tw-mb-0"
              placeHolder="Please enter details"
            />
          </div>
        </div>
      </AccordionBody>
    </form>
  );
}
