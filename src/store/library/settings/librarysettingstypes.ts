export interface ISettingsListReducerState {
        // LibraryDetails
        libraryDetailsRequestListResp: any;
        getLibraryDetailsListByIdResp: any;
        editLibraryDetailRequestResp: any,
        saveLibraryDetailsListResp: any,
        delLibraryRequestResp: any,

        //Library Rooms
        libraryRoomsRequestListResp: any;
        getLibraryRoomsListByIdResp: any;
        editLibraryRoomsRequestResp: any,
        saveLibraryRoomsListResp: any,
        delLibraryRoomsRequestResp: any,

        //Library Shelf
        libraryShelfRequestListResp: any;
        getLibraryShelfsListByIdResp: any;
        editLibraryShelfsRequestResp: any,
        saveLibraryShelfsListResp: any,
        delLibraryShelfsRequestResp: any,

        //Library Rack
        libraryRackRequestListResp: any;
        getLibraryRacksListByIdResp: any;
        editLibraryRacksRequestResp: any,
        saveLibraryRacksListResp: any,
        delLibraryRacksRequestResp: any,

        //Library Publisher
        libraryPublisherRequestListResp: any;
        getLibraryPublisherListByIdResp: any;
        editLibraryPublisherRequestResp: any,
        saveLibraryPublisherListResp: any,
        delLibraryPublisherRequestResp: any,

        //Library Record
        libraryRecordRequestListResp: any;

        //Library Category
        libraryCategoryRequestListResp: any;
        saveLibraryCategoriesListResp:any;
        libraryCategoryItemByIdResp:any;
        editLibraryCategoryItemResp:any;
        delLibraryCategoryItemResp:any;

        //Library Language
        libraryLanguageRequestListResp: any;

        //library User Record Type
        libraryUserRecordTypeRequestListResp: any;
        editLibraryUserRecordTypeRequestResp: any;

        //library User Type
        libraryUserTypeRequestListResp: any;
        editLibraryUserTypeRequestResp: any;

        // reset

        librarylistResp: any;

        //Rack, Shelf, Room Delete Prompt
        deleteLibraryRackPromptListResp: any;

        //error state
        libraryDetailsErrorAct: any;
}