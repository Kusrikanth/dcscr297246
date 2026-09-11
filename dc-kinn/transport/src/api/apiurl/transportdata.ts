

export const transportdata = {
  //routes
  get_route_details_list: `/transport/api/transport-service/routes`,
  create_route_details: `/transport/api/transport-service/routes`,
  get_route_by_id: ({ routeId }: any) => `/transport/api/transport-service/routes/${routeId}`,
  update_route_details: ({ routeId, branchId }: any) => `/transport/api/transport-service/routes/${routeId}?branchId=${branchId}`,
  delete_route_details: ({ routeId }: any) => `/transport/api/transport-service/routes/${routeId}`,
  get_stop_byrouteid: ({ routeId, branchId }: any) => `/transport/api/v1/settings/all-stops/route/${routeId}?branchId=${branchId}&sortBy=stopName`,
  //slabs

  get_slabs_list: `/transport/api/transport-service/slabs`,
  create_slabs_list: `/transport/api/transport-service/slabs`,
  delete_slabs_list: ({ slabId }: any) => `/transport/api/transport-service/slabs/${slabId}`,
  get_slabs_list_by_id: ({ slabId }: any) => `/transport/api/transport-service/slabs/${slabId}`,
  edit_slabs_list: ({ slabId }: any) => `/transport/api/transport-service/slabs/${slabId}`,

  // vehicle type

  get_vehicle_type_list: `/transport/api/transport-service/vehicle-types`,
  create_vehicle_type_list: `/transport/api/transport-service/vehicle-types`,
  delete_vehicle_type_list: ({ vehicleId }: any) => `/transport/api/transport-service/vehicle-types/${vehicleId}`,
  get_vehicle_type_list_by_id: ({ vehicleId }: any) => `/transport/api/transport-service/vehicle-types/${vehicleId}`,
  edit_vehicle_type_list: `/transport/api/transport-service/vehicle-types`,

  // slabs terms

  get_slabs_terms_list: `/transport/api/transport-service/slab-terms`,
  create_slabs_terms_list: `/transport/api/transport-service/slab-terms`,
  get_slabs_terms_list_by_id: ({ id }: any) => `/transport/api/transport-service/slab-terms/${id}`,
  edit_slabs_terms_list: ({ id }: any) => `/transport/api/transport-service/slab-terms/${id}`,
  delete_slabs_terms_list: ({ id }: any) => `/transport/api/transport-service/slab-terms/${id}`,

  //transport request
  get_transport_request: `/transport/api/transport-service/service-requests`,
  create_transport_request: `/transport/api/transport-service/service-requests`,

  // all stops
  get_all_stops_list: `/transport/api/v1/settings/all-stops`,
  create_all_stops_list: `/transport/api/v1/settings/all-stops`,
  route_all_stops_list: ({ id, searchString }: any) => `/transport/api/transport-service/routes/fetchRoutes/forSetStops/${id}?searchString=${searchString}`,
  delete_all_stops_list: ({ id }: any) => `/transport/api/v1/settings/all-stops/${id}`,
  get_stops_by_routeid: ({ routeId, branchId }: any) => `/transport/api/v1/settings/all-stops/route/${routeId}?branchId=${branchId}`,
  nearest_stops: `/transport/api/v1/settings/all-stops/fetch-suggestions`,
  get_distance_fromstop: ({ stopId }: any) => `/transport/api/v1/settings/all-stops/fetch-distances/${stopId}`,
  // stop schedules
  get_stop_schedule_list: `/transport/api/transport-service/stop-schedules/all`,
  update_time_stop_schedule: `/transport/api/transport-service/stop-schedules`,
}

export const vehiclesdetails = {
  get_vehicle_details: `/transport/api/transport-service/vehicle-details`,
  get_vehicle_details_by_id: ({ id }: any) => `/transport/api/transport-service/vehicle-details/${id}`,
  update_vehicle_details: ({ id }: any) => `/transport/api/transport-service/vehicle-details/${id}`,
  del_vehicle_details: ({ id }: any) => `/transport/api/transport-service/vehicle-details/${id}`,
  create_vehicle_details: `/transport/api/transport-service/vehicle-details`,
  get_fuel_type_list: `/transport/api/transport-service/vehicle-details/fuel-types`,
  get_vehicle_manufacture_list: `/transport/api/v1/transport-service/vehicle-manufacturers`,
  get_vehicle_model_list: ({ manufacturerId }: any) => `/transport/api/v1/transport-service/vehicle-manufacturers/${manufacturerId}/vehicle-models`,
  export_vehicle_details: `/transport/api/transport-service/vehicle-details/export`,
  get_insurance_company_list: `/transport/api/transport-service/vehicle-details/insurance-company`,
  get_insurance_types_list: `/transport/api/transport-service/vehicle-details/insurance-types`,

  //Vehicle-Manufacture
  get_vehicle_manufacture_details: `/transport/api/v1/transport-service/vehicle-manufacturers/all`,
  get_vehicle_manufacture_by_id: ({ id }: any) => `/transport/api/v1/transport-service/vehicle-manufacturers/${id}`,
  get_vehicle_model_by_id: ({ id }: any) => `/transport/api/v1/transport-service/vehicle-manufacturers/vehicle-models/${id}`,
  save_vehicle_manufacture: `/transport/api/v1/transport-service/vehicle-manufacturers`,
  save_vehicle_manufacture_model: `/transport/api/v1/transport-service/vehicle-manufacturers/vehicle-models`,

}

export const transportrecords = {
  get_all_stu_trans_record: `/transport/api/transport-service/student-allocation-details`,
  get_new_request_list: `/transport/api/transport-service/service-requests`,
  get_receiptno_transport: `/transport/api/transport-service/service-requests/new-request/requestNumber`,
  get_terms_byslabid: `/transport/api/transport-service/slab-terms/new-request-terms`,
  approve_transport_request: `/transport/api/transport-service/service-requests/admin-approval`,
  get_transport_requestbyid: ({ requestId }: any) => `/transport/api/transport-service/service-requests/${requestId}`,
  approve_submitted_request: ({ requestId }: any) => `/transport/api/transport-service/service-requests/approve/${requestId}`,
  delete_transport_request: ({ requestId }: any) => `/transport/api/transport-service/service-requests/${requestId}`,
  export_new_transport_request: `/transport/api/transport-service/service-requests/export`,
  export_all_transport_request: `/transport/api/transport-service/student-allocation-details/export`,
  get_details_by_allocation_id: ({ id }: any) => `/transport/api/transport-service/student-allocation-details/${id}`,
  get_details_by_student_id: ({ id, academicYearId }: any) => `/transport/api/transport-service/student-allocation-details/student/${id}?academicYearId=${academicYearId}`,
  get_details_by_employee_id: ({ id }: any) => `/transport/api/transport-service/student-allocation-details/employee/${id}`,
  add_termination_request: `/transport/api/transport-service/service-requests/termination-request`,
  get_terms_for_termination_req: `/fee/api/studentFeeLedgers/student/transport-terms`,
  reject_termination_req: ({ requestId }: any) => `/transport/api/transport-service/service-requests/reject-request/${requestId}`,

  get_stu_tranport_record_list: `/transport/api/transport-service/student-allocation-details/students/transport-terms`,
  export_stu_tranport_record_list: `/transport/api/transport-service/student-allocation-details/export/students-terms`,

  get_emp_tranport_record_list: `/transport/api/transport-service/student-allocation-details/employees/allocation-details`,
  export_emp_tranport_record_list: `/transport/api/transport-service/student-allocation-details/export/employees-allocations`,

}

export const transportmanagement = {
  get_by_id_trans_manage: ({ routeId }: any) => `/transport/api/transport-service/routes/${routeId}/manageVehicle`,
  get_by_id_trans_manage_new: ({ routeId, academicYearId }: any) => `/transport/api/transport-service/transport-management/${routeId}?academicYearId=${academicYearId}`,
  get_transport_manage_list: `/transport/api/transport-service/routes/manageVehicles`,
  get_transport_manage_list_new: `/transport/api/transport-service/transport-management`,
  get_employee_based_on_category: ({ branchId }: any) => `/academic/api/v1/employees/employees-for-category/${branchId}`,
  edit_transport_manage: ({ routeId }: any) => `/transport/api/transport-service/routes/${routeId}/manageVehicle`,
  edit_transport_manage_new: ({ routeId }: any) => `/transport/api/transport-service/transport-management/${routeId}`,
  get_students_occupency_list: `/transport/api/transport-service/routes/allocation`,
  export_trans_manage: `/transport/api/transport-service/routes/export`,
  get_vehicle_trans_manage: `/transport/api/transport-service/vehicle-details/assign-vehicles`

}

export const transportconcessionUrl = {
  get_transport_concession_list: `/fee/api/fee-service/transportFeeConcessions/all`,
  get_transport_concession_by_id: ({ id }: any) => `/fee/api/fee-service/transportFeeConcessions/${id}`,
  create_transport_concession: ({ branchId, academicYearId }: any) => `/fee/api/fee-service/transportFeeConcessions?branchId=${branchId}&academicYearId=${academicYearId}`,
  edit_transport_concession: ({ id }: any) => `/fee/api/fee-service/transportFeeConcessions/${id}`,
  delete_transport_concession: ({ transportConcessionId }: any) => `/fee/api/fee-service/transportFeeConcessions/${transportConcessionId}`,
  export_transport_concession: `/fee/api/fee-service/transportFeeConcessions/concession/export`,
}

export const transportEmployeeUrl = {
  get_transport_employee: `/transport/api/transport-service/employees`,
  add_transport_employee: `/transport/api/transport-service/employees`,
  get_transport_employeebyid: ({ employeeId }: any) => `/transport/api/transport-service/employees/${employeeId}`,
  update_transport_employee: ({ employeeId }: any) => `/transport/api/transport-service/employees/${employeeId}`,
  actinact_transport_employee: ({ employeeId, status }: any) =>
    `/transport/api/transport-service/employees/change-status/${employeeId}?activeStatus=${status}`,
  delete_transport_employee: ({ employeeId }: any) => `/transport/api/transport-service/employees/${employeeId}`,
  get_employee_type_list: `/transport/api/transport-service/employee-types`,
  get_aadhar_validation: ({ aadharNo, transportEmployeeId }: any) => `/transport/api/transport-service/employees/validate-aadhar?aadharNo=${aadharNo}&transportEmployeeId=${transportEmployeeId}`,
  export_transport_employee: ({ branchId, employeeType, activeStatus }: any) => `/transport/api/transport-service/employees/export/?branchId=${branchId}&employeeType=${employeeType}&activeStatus=${activeStatus}`,
}

export const transportRegistrationUrl = {
  get_transport_registration: `/admission/api/admission-service/settings/admission-facility/opted-admission-facilities`,
  export_transport_registration: `/admission/api/admission-service/settings/admission-facility/opted-admission-facilities/export`,
}