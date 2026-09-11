import coins from "../../../../assets/imagesdps/updatedDashboard/coins.svg";
import ytd from "../../../../assets/imagesdps/updatedDashboard/ytd.svg";
import week from "../../../../assets/imagesdps/updatedDashboard/week.svg";
import month from "../../../../assets/imagesdps/updatedDashboard/month.svg";

export const staticCardData:any = {
    todayCollectionDTO: {
        img: coins,
        bottomText: "Previous Day",
        label: "Today's Collection",
        amtKey : "todayCollection",
    },
    weekCollectionDTO: {
        img: week,
        bottomText: "Previous Week",
        label: "This Week's Collection (Last 7 days)",
        amtKey : "thisWeekCollection",
    },
    monthCollectionDTO: {
        img: month,
        bottomText: "Previous Month",
        label: "This Month's Collection (From 1st of this month)",
        amtKey : "thisMonthCollection",
    },
    yearCollectionDTO: {
        img: ytd,
        bottomText: "Previous YTD",
        label: "This Year's Collection (From April)",
        amtKey : "thisYearCollection",
    }
}