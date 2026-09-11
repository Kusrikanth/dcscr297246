import { BookEditIcon, BookOpen02Icon, Bookshelf03Icon, News01Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";

export const transformApiResponseToCardData = (response: any, curriculumResponse?: any) => {

  const curriculumData = curriculumResponse?.data || [];
  
  const displayCurricula = curriculumData.slice(0, 3);
  
  const curriculumWiseBooksCount = response?.items?.curriculumWiseBooksCount || {};

  return [
    {
      cardTitle: "Items Count",
      cardCount: (response?.items?.totalItemsCount ?? 0).toString(),
      icon: <HugeiconsIcon icon={Bookshelf03Icon} size={24} color={"#000000"} />,
      bgColor: "#E1E2F6",
      subTextOne: displayCurricula[0]?.shortName || "N/A",
      subTextTwo: displayCurricula[1]?.shortName || "N/A", 
      subTextThree: displayCurricula[2]?.shortName || "N/A",
      subCountOne: (curriculumWiseBooksCount[displayCurricula[0]?.shortName] ?? 0).toString(),
      subCountTwo: (curriculumWiseBooksCount[displayCurricula[1]?.shortName] ?? 0).toString(),
      subCountThree: (curriculumWiseBooksCount[displayCurricula[2]?.shortName] ?? 0).toString(),
      overlayColor: "#B0B2D4",
      overlayChildColor: "#CACBF0",
    },
    {
      cardTitle: "Today's Books Circulation",
      cardCount: ((response?.todaysBooksCirculation[0]?.ISSUED ?? 0) + (response?.todaysBooksCirculation[0]?.RETURNED ?? 0) + (response?.todaysBooksCirculation[0]?.OVERDUE ?? 0)).toString(),
      icon: <HugeiconsIcon icon={BookOpen02Icon} size={24} color={"#000000"} />,
      bgColor: "#F8EFE2",
      subTextOne: "Issued Books",
      subTextTwo: "Returned Books",
      subTextThree: "Over due Books",
      subCountOne: (response?.todaysBooksCirculation[0]?.ISSUED ?? 0).toString(),
      subCountTwo: (response?.todaysBooksCirculation[0]?.RETURNED ?? 0).toString(),
      subCountThree: (response?.todaysBooksCirculation[0]?.OVERDUE ?? 0).toString(),
      overlayColor: "#D7C5A9",
      overlayChildColor: "#EDE0C8",
    },
    {
      cardTitle: "Discarded Books",
      cardCount: (response?.discardedBooks?.discardedTotalBooks ?? 0).toString(),
      icon: <HugeiconsIcon icon={BookEditIcon} size={26} color={"#000000"} />,
      bgColor: "#EFF7E2",
      subTextOne: "Damage Books",
      subTextTwo: "Lost Books",
      subTextThree: "Renwal",
      subCountOne: (response?.discardedBooks?.damagedBooksCount ?? 0).toString(),
      subCountTwo: (response?.discardedBooks?.lostBooksCount ?? 0).toString(),
      subCountThree: (response?.discardedBooks?.renewalBooksCount ?? 0).toString(),
      overlayColor: "#C7D3B2",
      overlayChildColor: "#DDEABA",
    },
    {
      cardTitle: "Periodicals Count",
      cardCount: (response?.periodicals?.periodicalsTotalCount ?? 0).toString(),
      icon: <HugeiconsIcon icon={News01Icon} size={26} color={"#000000"} />,
      bgColor: "#ebeedf",
      subTextOne: "Specimen",
      subTextTwo: "No of CD's",
      subTextThree: "New Arrivals",
      subCountOne: (response?.periodicals?.periodicalsBooksCount?.SPECIMEN ?? 0).toString(),
      subCountTwo: (response?.periodicals?.periodicalsBooksCount?.CD ?? 0).toString(),
      subCountThree: (response?.periodicals?.periodicalsNewArrivalsCount ?? 0).toString(),
      overlayColor: "#C1C4A8",
      overlayChildColor: "#D4D7C3",
    },
  ];
};