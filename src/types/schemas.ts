import { z } from 'zod';

export const projectSchema = z.object({
  name_project: z.string().min(1, 'Name is required'),
  type_ccus_strategies_id: z.number().int('Must be an integer'),
});
export type ProjectFormValues = z.infer<typeof projectSchema>;

export const reservoirSchema = z.object({
  name_reservoir: z.string().min(1, 'Name is required'),
  project_id: z.string().uuid('Invalid project'),
});
export type ReservoirFormValues = z.infer<typeof reservoirSchema>;

export const wellSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  project_id: z.string().uuid('Invalid project'),
  reservoir_details_id: z.number().int('Invalid reservoir'),
  type_well_targets_id: z.number().int(),
  type_tubings_id: z.number().int(),
  type_functions_id: z.number().int(),
  entry_point_x: z.number(),
  entry_point_y: z.number(),
  entry_point_z: z.number(),
  target_x: z.number(),
  target_y: z.number(),
  target_z: z.number(),
  tec: z.number(),
});
export type WellFormValues = z.infer<typeof wellSchema>;
