import api from './axios';
import type {
  Project,
  ProjectCreate,
  ProjectUpdate,
  Reservoir,
  ReservoirCreate,
  ReservoirUpdate,
  WellTarget,
  WellTargetCreate,
  WellTargetUpdate,
} from '@/types/api';

export const projectsApi = {
  getAll: async () => {
    const { data } = await api.get<Project[]>('/api/v1/reservoir/projects');
    return data;
  },
  getById: async (project_id: string) => {
    const { data } = await api.get<Project>(`/api/v1/reservoir/projects/${project_id}`);
    return data;
  },
  create: async (body: ProjectCreate) => {
    const { data } = await api.post<Project>('/api/v1/reservoir/projects', body);
    return data;
  },
  update: async ({ project_id, body }: { project_id: string; body: ProjectUpdate }) => {
    const { data } = await api.put<Project>(`/api/v1/reservoir/projects/${project_id}`, body);
    return data;
  },
  delete: async (project_id: string) => {
    await api.delete(`/api/v1/reservoir/projects/${project_id}`);
  },
};

export const reservoirsApi = {
  getAll: async () => {
    const { data } = await api.get<Reservoir[]>('/api/v1/reservoir/reservoir_details');
    return data;
  },
  getById: async (id: number) => {
    const { data } = await api.get<Reservoir>(`/api/v1/reservoir/reservoir_details/${id}`);
    return data;
  },
  create: async (body: ReservoirCreate) => {
    const { data } = await api.post<Reservoir>('/api/v1/reservoir/reservoir_details', body);
    return data;
  },
  update: async ({ id, body }: { id: number; body: ReservoirUpdate }) => {
    const { data } = await api.put<Reservoir>(`/api/v1/reservoir/reservoir_details/${id}`, body);
    return data;
  },
  delete: async (id: number) => {
    await api.delete(`/api/v1/reservoir/reservoir_details/${id}`);
  },
};

export const wellsApi = {
  getAll: async () => {
    const { data } = await api.get<WellTarget[]>('/api/v1/reservoir/well_targets');
    return data;
  },
  getById: async (id: number) => {
    const { data } = await api.get<WellTarget>(`/api/v1/reservoir/well_targets/id/${id}`);
    return data;
  },
  getByProjectId: async (project_id: string) => {
    const { data } = await api.get<WellTarget[]>(
      `/api/v1/reservoir/well_targets/project_id/${project_id}`,
    );
    return data;
  },
  create: async (body: WellTargetCreate) => {
    const { data } = await api.post<WellTarget>('/api/v1/reservoir/well_targets', body);
    return data;
  },
  update: async ({ id, body }: { id: number; body: WellTargetUpdate }) => {
    const { data } = await api.put<WellTarget>(`/api/v1/reservoir/well_targets/${id}`, body);
    return data;
  },
  delete: async (id: number) => {
    await api.delete(`/api/v1/reservoir/well_targets/${id}`);
  },
};
