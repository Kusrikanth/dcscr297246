import React, { useEffect, useMemo, useState } from "react";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import {
  HugeiconsIcon
} from "@hugeicons/react";
import { LicenseThirdPartyIcon, LibraryIcon, Orbit02Icon, TvIssueIcon, Orbit01Icon } from "@hugeicons-pro/core-stroke-standard";
import LibraryBookSummary from "./LibraryBookSummary";
import RecentlyCirculatedBooks from "./RecentlyCirculatedBooks";
import TopReaders from "./TopReaders";
import MostIssuedBooks from "./MostIssuedBooks";
import TopCircullatedBooks from "./TopCircullatedBooks";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { getLibrarySummaryAct } from "../../../../store/library/bookcollection/bookcollectionaction";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
  Icon: any;
}

const LibrarySummary = () => {
  const [activeId, setActiveId] = useState<any>("libraryBooksSummary");
  const [currentPageSizeState, setCurrentPageSizeState] = useState<any>(10);
  const dispatch = useAppDispatch();

  const librarySummaryApiCall = (otherProps?: any) => {
    const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};

    let payload = {
      branchId,
      instituteId,
      academicYearId,
      filter: activeId,
      ...otherProps,
    };
    dispatch(getLibrarySummaryAct(generateActionPayload('library_dashboard_data', undefined, payload)))
  }

  const { currentBranchIdResp: branchId, currentInstIdResp: instituteId,
    academicYearListResp, getLibrarySummaryResp
  } = useAppSelector(
    ({ instAcademics, appData, libraryBookCollection }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getLibrarySummaryResp: libraryBookCollection.getLibrarySummaryResp,
    }),
    shallowEqual
  );

  useEffect(() => {
    librarySummaryApiCall();
  }, [activeId,branchId,instituteId,])

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "libraryBooksSummary",
      labelName: "Library Books Summary",
      customPadding: "0px 5px 5px 5px",
      Icon: (
        <HugeiconsIcon icon={LibraryIcon}
          size={24}
          color={activeId === "libraryBooksSummary" ? "#0AB39C" : "#9599AD"}
          className="tw-me-2"
        />
      ),
    },
    {
      id: "topReaders",
      labelName: "Top Readers",
      customPadding: "0px 5px 5px 5px",
      Icon: (
        <HugeiconsIcon icon={LicenseThirdPartyIcon}
          size={24}
          color={activeId === "topReaders" ? "#0AB39C" : "#9599AD"}
          className="tw-me-2"
        />
      ),
    },
    {
      id: "recentCirculatedBooks",
      labelName: "Recently Books Circulated",
      customPadding: "0px 5px 5px 5px",
      Icon: (
        <HugeiconsIcon
          icon={Orbit02Icon}
          size={24}
          color={
            activeId === "recentCirculatedBooks" ? "#0AB39C" : "#9599AD"
          }
          className="tw-me-2"
        />
      ),
    },
    {
      id: "mostIssuedBooks",
      labelName: "Most Issued Books",
      customPadding: "0px 5px 5px 5px",
      Icon: (
        <HugeiconsIcon icon={TvIssueIcon}
          size={24}
          color={activeId === "mostIssuedBooks" ? "#0AB39C" : "#9599AD"}
          className="tw-me-2"
        />
      ),
    },
    {
      id: "topCirculatedBooks",
      labelName: "Top Circulated Books",
      customPadding: "0px 5px 5px 5px",
      Icon: (
        <HugeiconsIcon icon={Orbit01Icon}
          size={24}
          color={activeId === "topCirculatedBooks" ? "#0AB39C" : "#9599AD"}
          className="tw-me-2"
        />
      ),
    },
  ];

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "libraryBooksSummary":
        return LibraryBookSummary;
      case "recentCirculatedBooks":
        return RecentlyCirculatedBooks;
      case "topReaders":
        return TopReaders;
      case "mostIssuedBooks":
        return MostIssuedBooks;
      case "topCirculatedBooks":
        return TopCircullatedBooks;

      default:
        return null;
    }
  }

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    setCurrentPageSizeState(0);
    return (
      <TabComponent />
    );
  }, [activeId]);

  return (
    <>
      <div className="tw-bg-white tw-rounded-lg tw-mb-5 tw-py-3 tw-overflow-hidden tw-min-h-[420px]">
        <div className="tw-pb-0 tw-border-b">
          <div className="tw-flex tw-items-center">
            <UpdatedHorizontalTab
              MenuOptions={MenuOptions}
              clickMenuHandler={clickMenuHandler}
              activeTabId={activeId}
              horizontalClass="tw-pl-0 tw-overflow-auto tw-whitespace-nowrap"
            />
          </div>
        </div>
        <div className="tw-p-0">
          <div className="tw-w-full">{activeComponent}</div>
        </div>
      </div>
    </>
  );
};

export default LibrarySummary;
