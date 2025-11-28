export interface ApiErrorDetail {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface ApiError422 {
  detail: ApiErrorDetail[];
}

export interface Project {
  name_project: string;
  type_ccus_strategies_id: number;
  id: number;
  project_id: string;
  created_at: string;
}

export interface ProjectCreate {
  name_project: string;
  type_ccus_strategies_id: number;
}

export interface ProjectUpdate {
  name_project: string;
  type_ccus_strategies_id: number;
}

export interface Reservoir {
  name_reservoir: string;
  project_id: string;
  id: number;
  created_at: string;
}

export interface ReservoirCreate {
  name_reservoir: string;
  project_id: string;
}

export interface ReservoirUpdate {
  name_reservoir: string;
}

export interface WellTarget {
  name: string;
  project_id: string;
  reservoir_details_id: number;
  type_well_targets_id: number;
  type_tubings_id: number;
  type_functions_id: number;
  entry_point_x: number;
  entry_point_y: number;
  entry_point_z: number;
  target_x: number;
  target_y: number;
  target_z: number;
  tec: number;
  id: number;
  created_at: string;
}

export interface WellTargetCreate {
  name: string;
  project_id: string;
  reservoir_details_id: number;
  type_well_targets_id: number;
  type_tubings_id: number;
  type_functions_id: number;
  entry_point_x: number;
  entry_point_y: number;
  entry_point_z: number;
  target_x: number;
  target_y: number;
  target_z: number;
  tec: number;
}

export interface WellTargetUpdate {
  name: string;
  type_well_targets_id: number;
  type_tubings_id: number;
  type_functions_id: number;
  entry_point_x: number;
  entry_point_y: number;
  entry_point_z: number;
  target_x: number;
  target_y: number;
  target_z: number;
  tec: number;
}
