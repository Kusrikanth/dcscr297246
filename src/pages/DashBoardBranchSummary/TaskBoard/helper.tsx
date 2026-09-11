import { getFormattedDateddMMMYYYY, getTimeFormat } from "../../../utility/dateutility";

export function transformEvents(response: any) {
    if (!response) {
        return [];
    }
  const borderColors = ["#d1f7c4", "#ffe69c", "#f9c1b6"]; 

    const filteredEvents = response.filter(
        (event: any) => event.eventStatus === "LIVE" || event.eventStatus === "UPCOMING"
    );

    const transformedEvents = filteredEvents.map((event : any, index : any) => {

        return {
            id: index + 1,
            date: getFormattedDateddMMMYYYY(event.startDate),
            time: getTimeFormat(event.startDate),
            caption: event.title,
            location: event.location,
            blColour: borderColors[index % borderColors.length],
            bgcolor: "bg-info",
            iconType: "ri-group-line",
            iconColor: "#0f65cd",
            iconBgColor: "#e6f9ff",
            src: event.iconUrl,
            status: {
                statusText: event.eventStatus === "LIVE" ? "Live" : "Upcoming",
                statusBgColor: event.eventStatus === "LIVE" ? "#D1F7C4" : "#FFEFC1",
                statusColor: event.eventStatus === "LIVE" ? "#4CAF50" : "#FFC107"
            }
        };
    });

    return transformedEvents;
}

export function transformedFeeds(response: any) {
    if (!response) {    
        return [];
    }
    
    const borderColors = ["#d1f7c4", "#ffe69c", "#f9c1b6"]; 
    const transformedFeeds = response.map((feed: any, index: any) => ({
        id: index + 1,
        addedOn: getFormattedDateddMMMYYYY(feed.date),
        eventTitle: feed.title,
        blColour: borderColors[index % borderColors.length],
    }));

    return transformedFeeds;
}