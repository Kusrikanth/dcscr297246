import { TextInput } from "../../../../Components/Common";
import Button from "../../../../Components/Common/Button";

const AddClassRoomModal = (props: any) => {
  return (
    <>
      <form onSubmit={() => { }}>

        <div className="tw-p-5">

          <div className="tw-space-y-4">

            <div className="tw-w-full">
              <TextInput
                name="buildingName"
                labelText="Building Name"
                labelClass="required"
                value={""}
                onChange={() => { }}
              />
            </div>

            <div className="tw-w-full">
              <TextInput
                name="floorName"
                labelText="Floor Name"
                labelClass="required"
                value={""}
                onChange={() => { }}
              />
            </div>

            <div className="tw-w-full">
              <TextInput
                name="roomNo"
                labelText="Room No"
                labelClass="required"
                value={""}
                onChange={() => { }}
              />
            </div>

          </div>

          <div className="tw-flex tw-justify-end tw-gap-3 tw-mt-6">

            <Button
              type="button"
              onClick={props.toggle}
              variant="secondary"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
            >
              {props.modalData ? "Update" : "Submit"}
            </Button>

          </div>

        </div>

      </form>
    </>
  );
};

export default AddClassRoomModal;
