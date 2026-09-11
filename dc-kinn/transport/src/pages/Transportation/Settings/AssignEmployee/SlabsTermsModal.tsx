import { MouseEventHandler, useState } from "react";
import {
  SelectInput,
  TextInput,
} from "../../../../Components/Common";
import { AcademicYear, TermsTypes } from "./helper";
import { ISlabsTermsModalProps, ISlabTermsType } from "./SlabsTerms";
import Button from "../../../../Components/Common/Button";

const SlabsTermsModal = (props: ISlabsTermsModalProps) => {
  const [slabsTermsListState, setSlabsTermsListState] = useState<
    Array<ISlabTermsType>
  >([
    { id: 1, slabName: "", distanceRange: "0.00 - 5.00 Kms", amount: 0 },
    { id: 2, slabName: "Testing", distanceRange: "0.00 - 5.00 Kms", amount: 0 },
  ]);

  function addSlabTermsHandler() {
    const length: number = slabsTermsListState.length,
      updatedSlabTermsList: Array<ISlabTermsType> = [...slabsTermsListState],
      lastId: number = updatedSlabTermsList[length - 1].id;
    updatedSlabTermsList.push({
      id: lastId + 1,
      slabName: "",
      distanceRange: "",
      amount: 0,
    });
    setSlabsTermsListState(updatedSlabTermsList);
  }

  function removeSlabTermsHndlr(event: React.MouseEvent<HTMLElement>) {
    const roleIndex: string | null =
        event.currentTarget.getAttribute("data-index"),
      updatedSlabTermsList: Array<ISlabTermsType> = [...slabsTermsListState];
    if (roleIndex) {
      updatedSlabTermsList.splice(Number(roleIndex), 1);
      setSlabsTermsListState(updatedSlabTermsList);
    }
  }

  return (
   
    <div style={{ padding: "1.25rem" }} className="tw-grid tw-grid-cols-12 tw-gap-4">

      <div className="tw-col-span-12">
        <div className="tw-grid tw-grid-cols-12 tw-gap-4">

          <div className="tw-col-span-12 md:tw-col-span-6">
            <SelectInput
              name="academicYear"
              value=""
              onChange={() => { }}
              valueKey="academicYearId"
              textKey="academicYear"
              menuItems={AcademicYear}
              labelText="Route"
            />
          </div>

          <div className="tw-col-span-12 md:tw-col-span-6">
            <SelectInput
              name="termName"
              value=""
              onChange={() => { }}
              valueKey="TermsId"
              textKey="TermsType"
              menuItems={TermsTypes}
              labelText="Vehicle"
            />
          </div>

          <div className="tw-col-span-12">
            <SelectInput
              name="termName"
              value=""
              onChange={() => { }}
              valueKey="TermsId"
              textKey="TermsType"
              menuItems={TermsTypes}
              labelText="Driver"
            />
          </div>

          <div className="tw-col-span-12">
            <SelectInput
              name="termName"
              value=""
              onChange={() => { }}
              valueKey="TermsId"
              textKey="TermsType"
              menuItems={TermsTypes}
              labelText="Attender"
            />
          </div>

          <div className="tw-col-span-12">
            <TextInput
              name="distanceRange"
              value=""
              labelText="In charge"
            />
          </div>

        </div>
      </div>

      <div className="tw-col-span-12 tw-flex tw-justify-end tw-gap-3 tw-mt-4">

        <Button
          type="button"
          variant="secondary"
          onClick={props.toggle}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
        >
          Submit
        </Button>

      </div>

    </div>
    
  );
};

export default SlabsTermsModal;
