export const librarySettings = {

//Library Details
    get_library_details : `/library/api/v1/library-service/library-details/all`,
    get_library_details_list_by_id : ({id} : any)=> `/library/api/v1/library-service/library-details/${id}`,
    edit_library_details_list : ({id} : any)=> `/library/api/v1/library-service/library-details/${id}`,
    save_Library_details :  `/library/api/v1/library-service/library-details`,
    delete_Library_details_list : ({id} : any)=> `/library/api/v1/library-service/library-details/${id}`,

//Library Rooms
    get_library_rooms: `/library/api/v1/library-service/library-rooms/room-details`,
    get_library_rooms_list_by_id : ({id} : any)=> `/library/api/v1/library-service/library-rooms/${id}`,
    edit_library_rooms_list : ({id} : any)=> `/library/api/v1/library-service/library-rooms/${id}`,
    save_Library_rooms :  `/library/api/v1/library-service/library-rooms`,
    delete_Library_rooms_list : ({id} : any)=> `/library/api/v1/library-service/library-rooms/${id}`,

//Library Shelfs
    get_library_shelf: `/library/api/v1/library-service/libraryShelf/all`,
    get_library_shelfs_list_by_id : ({id} : any)=> `/library/api/v1/library-service/libraryShelf/${id}`,
    edit_library_shelfs_list : ({id} : any)=> `/library/api/v1/library-service/libraryShelf/${id}`,
    save_Library_shelfs :  `/library/api/v1/library-service/libraryShelf`,
    delete_Library_shelfs_list : ({id} : any)=> `/library/api/v1/library-service/libraryShelf/${id}`,
    
//Library Racks
    get_library_rack: `/library/api/v1/library-service/library-racks/all`,
    get_library_racks_list_by_id : ({id} : any)=> `/library/api/v1/library-service/library-racks/${id}`,
    edit_library_racks_list : ({id} : any)=> `/library/api/v1/library-service/library-racks/${id}`,
    save_Library_racks :  `/library/api/v1/library-service/library-racks`,
    delete_Library_racks_list : ({id} : any)=> `/library/api/v1/library-service/library-racks/${id}`,
   
//Library Publishers 
    get_library_publisher: `/library/api/v1/library-service/publisher/all`,
    get_library_Publishers_list_by_id : ({publisherId} : any)=> `/library/api/v1/library-service/publisher/${publisherId}`,
    edit_library_Publishers_list : ({publisherId} : any)=> `/library/api/v1/library-service/publisher/${publisherId}`,
    save_Library_Publishers :  `/library/api/v1/library-service/publisher`,
    delete_Library_Publishers_list : ({publisherId} : any)=> `/library/api/v1/library-service/publisher/${publisherId}`,

//Library Record 
    get_library_record: `/library/api/v1/library-service/library-recordType/all`,
    
//Library Category 
    get_library_category: `/library/api/v1/library-service/library-category/all`,
    get_library_category_by_id : ({categoryId}:any) => `/library/api/v1/library-service/library-category/${categoryId}`,
    save_library_categories:`/library/api/v1/library-service/library-category`,
    edit_library_category_item : ({categoryId}:any) => `/library/api/v1/library-service/library-category/${categoryId}`,
    del_library_category_item : ({categoryId}:any) => `/library/api/v1/library-service/library-category/${categoryId}`,
    
//Library Language 
    get_library_language: `/library/api/v1/library-service/library-language/all`,

    //library User Record Type
    get_library_user_record_type: `/library/api/v1/library-service/user-record-types/all`,
    edit_library_user_record_type : ({userTypeId} : any)=> `/library/api/v1/library-service/user-record-types/${userTypeId}`,

    //library User Type
    get_library_user_type: `/library/api/v1/library-service/user-type/fetch/all`,
    update_library_user_type: ({id} : any)=> `/library/api/v1/library-service/user-type/${id}`,

    //Rack, Shelf, Room Delete Promt
    delete_library_rack_prompt:  `/library/api/v1/library-service/library-book-collection/assigned-books`,
 }

 export const libraryBookCollection = {
    get_library_book_collection: `/library/api/v1/library-service/library-book-collection/all`,
    save_Library_book_collection :  `/library/api/v1/library-service/library-book-collection`,
    get_library_book_collection_list_by_id : ({id} : any)=> `/library/api/v1/library-service/library-book-collection/${id}`,
    edit_library_book_collection_list : ({id} : any)=> `/library/api/v1/library-service/library-book-collection/${id}`,
    delete_library_book_collection : ({id} : any)=> `/library/api/v1/library-service/library-book-collection/${id}`,
    export_library_book_collection : `/library/api/v1/library-service/library-book-collection/export`,
    bulk_upload_library_book_collection : `/library/api/v1/library-service/library-book-collection/bulk/upload`,
    download_static_library_book_collection_form: "/academic/api/academic-service/health-form/schoolform/download",

    get_library_book_collection_stats_count : `/library/api/v1/library-service/library-book-collection/stats`
 }
 export const libraryBookRenewal = {
    get_library_book_renewal: `/library/api/v1/library-service/book-renewable/all`,
    save_library_book_renewal : `/library/api/v1/library-service/book-renewable`,
 }

 export const libraryBookIssuance = {
    get_library_book_issuance: `/library/api/v1/library-service/book-issuance/all`,
    get_book_detail_by_accession_no : `/library/api/v1/library-service/book-issuance`,
    save_library_book_issuance : `/library/api/v1/library-service/book-issuance`,
    delete_library_book_issuance :({id}:any)=> `/library/api/v1/library-service/book-issuance/${id}`,
    get_book_issuance_user_list : `/library/api/v1/library-service/user-type/all`,
    get_library_book_issuance_stats_count : `/library/api/v1/library-service/book-issuance/stats`,
    export_library_book_issuance : `/library/api/v1/library-service/book-issuance/export`,
    export_books_over_due : `/library/api/v1/library-service/book-issuance/overdue-export`,
    
    //Borrowed Books
    get_library_borrowed_books_list : `/library/api/v1/library-service/book-issuance/highest-borrowed-books`,
    export_library_borrowed_books : `/library/api/v1/library-service/book-issuance/highest-borrowed-books-export`,
 }

 export const libraryBookReturn = {

    get_library_book_return_list : `/library/api/v1/library-service/library-book-return/all`,
    get_book_return_multiple_stu_list : `/library/api/v1/library-service/library-book-return/students/issuance-class-wise`,
    get_book_return_single_stu_list : `/library/api/v1/library-service/library-book-return/students/issuance`,
    save_library_book_return : `/library/api/v1/library-service/library-book-return`,
    get_book_return_employee_list : `/library/api/v1/library-service/library-book-return/employee/issuance`,
    get_book_return_recommend_list : `/library/api/v1/library-service/library-book-return/recommended/issuance`,

    get_book_list_stu_returns : `/library/api/v1/library-service/library-book-return/student/books`,
    get_book_list_emp_returns : `/library/api/v1/library-service/library-book-return/employee/books`,
    get_book_list_recommend_returns : `/library/api/v1/library-service/library-book-return/recommended/books`,
    export_library_return_collection : `/library/api/v1/library-service/library-book-return/export`,

    get_book_return_list_by_accession_no : `/library/api/v1/library-service/library-book-return/accession-number/books`,

    get_book_return_save_list : `/library/api/v1/library-service/library-book-return/issuance/issued-books`
    
 }
 export const libraryStockDetails = {

    get_library_stock_details_list : `/library/api/v1/library-service/library-stock-checking/stock-details`,
    get_library_stock_checking_details_list : `/library/api/v1/library-service/library-stock-checking/all`,
    get_library_stock_verification_list : `/library/api/v1/library-service/library-stock-checking/stock-verified-books`,
    get_library_stock_relocate_list : `/library/api/v1/library-service/library-stock-checking/stock-relocated-books`,
    export_library_stock_details_collection : `/library/api/v1/library-service/library-stock-checking/export`,
    get_library_relocate_save_list : `/library/api/v1/library-service/library-stock-checking/search/stock-relocated-books`,
    save_relocate_stock : `/library/api/v1/library-service/library-stock-checking`,
 }