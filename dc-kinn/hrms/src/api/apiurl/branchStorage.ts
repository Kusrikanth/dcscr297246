export const branchStorageSettings = {

    //Institute Branch Storage Settings
    get_branch_storage: `/file-system/api/filesystem/branch-storage`,
    save_branch_storage: `/file-system/api/filesystem/branch-storage`,
    get_branch_storage_by_id: ({ id }: any) => `/file-system/api/filesystem/branch-storage/${id}`,
    update_branch_storage: ({ id }: any) => `/file-system/api/filesystem/branch-storage/${id}`,

    //Branch Policies
    get_branch_policies: `/file-system/api/filesystem/file-policies`,
    update_branch_policies: `/file-system/api/filesystem/file-policies`,

    //User Groups
    get_user_groups_list: `/file-system/api/filesystem/user-groups`,
    save_user_groups: `/file-system/api/filesystem/user-groups/save`,
    get_user_groups_by_id: ({ id }: any) => `/file-system/api/filesystem/user-groups/${id}`,
    delete_user_groups: ({ id }: any) => `/file-system/api/filesystem/user-groups/${id}`,
    
    //User group members
    save_members_to_user_groups: ({ id }: any) => `/file-system/api/filesystem/user-groups/${id}/members`,
    delete_members_in_user_groups: ({ id }: any) => `/file-system/api/filesystem/user-groups/${id}/members`,
    get_members_in_user_groups: ({ id }: any) => `/file-system/api/filesystem/user-groups/${id}/members`,

    //user Profile Permissions
    get_user_access_profile_permissions_list: `/file-system/api/filesystem/permission-profiles`,
    save_user_access_profile_permissions: `/file-system/api/filesystem/permission-profiles`,
    get_user_access_profile_permissions_by_id: ({ id }: any) => `/file-system/api/filesystem/permission-profiles/${id}`,
    delete_user_access_profile: `/file-system/api/filesystem/permission-profiles`,
    delete_user_access_profile_permissions: `/file-system/api/filesystem/permission-profiles/permissions`,

    //File-Category
    get_file_category_list: `/file-system/api/file-manager/settings/categories`,
    save_file_category: `/file-system/api/file-manager/settings/categories/bulk`,

}

export const branchStorageManagement = {

    //Branch Storage All Files and Folders
    get_branch_storage_root_folders: `/file-system/api/filesystem/folders/tree/all`,
    get_branch_storage_folders_files_by_id: ({ id }: any) =>`/file-system/api/filesystem/folders/${id}`,
    get_branch_storage_folders_by_id: ({ id }: any) => `/file-system/api/filesystem/folders/${id}`,
    create_branch_storage_folder: `/file-system/api/filesystem/folders`,
    update_branch_storage_folder_name: ({ id }: any) => `/file-system/api/filesystem/folders/${id}`,
    update_branch_storage_file_name: `/file-system/api/filesystem/files/rename`,
    upload_branch_storage_file: `/file-system/api/filesystem/upload-sessions`,
    reupload_branch_storage_file: `/file-system/api/filesystem/upload-sessions/reupload`,
    download_branch_storage_files_bulk: `/file-system/api/filesystem/download/bulk`,
    preview_folder_file_details: ({ id }: any) => `/file-system/api/filesystem/files/${id}/preview`,
    download_branch_storage_single_file: ({ id }: any) => `/file-system/api/filesystem/files/${id}/download`,
    delete_multiple_folders_and_files: `/file-system/api/filesystem/recycle-bin`,
    save_user_storage_manage_access: `/file-system/api/filesystem/access/grants/bulk`,
    get_manage_access_summary: `/file-system/api/filesystem/access/grants/resource/summary`,
    revoke_manage_access: ({ resourceType, resourceId }: any) => `/file-system/api/filesystem/access/grants/resource?resourceType=${resourceType}&resourceId=${resourceId}`,
    get_branch_storage_suggested_files: `/file-system/api/filesystem/files/suggested`,
    get_branch_storage_trash_files: `/file-system/api/filesystem/recycle-bin`,
    restore_branch_storage_trash_files: `/file-system/api/filesystem/recycle-bin/restore`,
    get_branch_storage_audits_by_file: ({ id }: any) => `/file-system/api/filesystem/files/${id}/access/users`,
    get_branch_storage_audits_by_file_groups: ({ fileId, groupId }: any) => `/file-system/api/filesystem/files/${fileId}/access/groups/${groupId}`,
    
    //Dashboard
    get_branch_storage_management_details: `/file-system/api/filesystem/storage/dashboard`,
    get_branch_storage_management_file_type_details: `/file-system/api/filesystem/storage/cleanup/files`,
    get_branch_storage_management_file_type_category_details: `/file-system/api/filesystem/categories/files`,
    
    //Shared With Me
    get_branch_storage_shared_with_me_files: `/file-system/api/filesystem/browse/shared-with-me`,

    // Favorites
    get_branch_storage_favorite_files: `/file-system/api/favorites/users`,
    save_branch_storage_favorite_files: `/file-system/api/favorites`,

    //restore-version
    restore_branch_storage_file_version: ({ fileId, versionId }: any) => `/file-system/api/filesystem/files/${fileId}/versions/${versionId}/restore`,

    //Copy Folders & Files
    copy_branch_storage_folder_files: `/file-system/api/filesystem/folders/copy`,

    //Move Folders & Files
    move_branch_storage_folder_files: `/file-system/api/filesystem/folders/move`,

    //recent files
    get_branch_storage_recent_files: `/file-system/api/filesystem/files/recent`,

    //Teacher-Access
    //Storage-Access-files 
    get_login_based_storgae_accessible_branches: `/file-system/api/filesystem/browse/accessible-branches`,
    get_login_based_storage_root_folders_list: `/file-system/api/filesystem/browse/root`,
    get_login_based_storage_folders_files_by_id: ({ folderId }: any) => `/file-system/api/filesystem/browse/folder/${folderId}`,

    //recent files
    get_login_based_recent_files: `/file-system/api/filesystem/browse/recent`,
    
    // Favorites
    get_login_based_favorite_files: `/file-system/api/filesystem/browse/favorites`,
    
    //trash
    get_login_based_trash_files: `/file-system/api/filesystem/recycle-bin/user`,
}