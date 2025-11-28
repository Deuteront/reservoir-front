import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { wellSchema, type WellFormValues } from '@/types/schemas';
import { wellsApi, projectsApi, reservoirsApi } from '@/api/endpoints';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect } from 'react';
import type { AxiosError } from 'axios';
import type { ApiError422, Project, Reservoir } from '@/types/api';

export const Route = createFileRoute('/wells/$id')({
  component: WellFormPage,
});

function WellFormPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = id === 'new';

  const form = useForm<WellFormValues>({
    resolver: zodResolver(wellSchema),
    defaultValues: {
      name: '',
      project_id: '',
      reservoir_details_id: 0,
      type_well_targets_id: 0,
      type_tubings_id: 0,
      type_functions_id: 0,
      entry_point_x: 0,
      entry_point_y: 0,
      entry_point_z: 0,
      target_x: 0,
      target_y: 0,
      target_z: 0,
      tec: 0,
    },
    mode: 'onChange',
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getAll,
  });

  const { data: reservoirs = [] } = useQuery({
    queryKey: ['reservoirs'],
    queryFn: reservoirsApi.getAll,
  });

  const { data: well } = useQuery({
    queryKey: ['wells', id],
    queryFn: () => wellsApi.getById(Number(id)),
    enabled: !isNew && id !== 'new',
  });

  useEffect(() => {
    if (well) {
      form.reset({
        name: well.name,
        project_id: well.project_id,
        reservoir_details_id: well.reservoir_details_id,
        type_well_targets_id: well.type_well_targets_id,
        type_tubings_id: well.type_tubings_id,
        type_functions_id: well.type_functions_id,
        entry_point_x: well.entry_point_x,
        entry_point_y: well.entry_point_y,
        entry_point_z: well.entry_point_z,
        target_x: well.target_x,
        target_y: well.target_y,
        target_z: well.target_z,
        tec: well.tec,
      });
    }
  }, [well, form]);

  const createMutation = useMutation({
    mutationFn: wellsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wells'] });
      navigate({ to: '/wells' });
    },
    onError: (error: AxiosError<ApiError422>) => {
      const detail = error.response?.data?.detail;
      if (detail && Array.isArray(detail)) {
        detail.forEach((d) => {
          const field = Array.isArray(d.loc) ? d.loc[d.loc.length - 1] : undefined;
          if (field && typeof field === 'string' && field in form.getValues()) {
            form.setError(field as keyof WellFormValues, { message: d.msg });
          }
        });
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (body: WellFormValues) => wellsApi.update({ id: Number(id), body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wells'] });
      queryClient.invalidateQueries({ queryKey: ['wells', id] });
      navigate({ to: '/wells' });
    },
    onError: (error: AxiosError<ApiError422>) => {
      const detail = error.response?.data?.detail;
      if (detail && Array.isArray(detail)) {
        detail.forEach((d) => {
          const field = Array.isArray(d.loc) ? d.loc[d.loc.length - 1] : undefined;
          if (field && typeof field === 'string' && field in form.getValues()) {
            form.setError(field as keyof WellFormValues, { message: d.msg });
          }
        });
      }
    },
  });

  const onSubmit = (values: WellFormValues) => {
    if (isNew) {
      createMutation.mutate(values);
    } else {
      updateMutation.mutate(values);
    }
  };

  return (
    <div className="p-4 max-w-xl space-y-4">
      <h1 className="text-xl font-semibold mb-4">{isNew ? 'Novo Well' : 'Editar Well'}</h1>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="project_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Projeto</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((p: Project) => (
                        <SelectItem key={p.project_id} value={p.project_id}>
                          {p.name_project}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reservoir_details_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reservatório</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(v) => field.onChange(Number(v))}
                    value={String(field.value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {reservoirs.map((r: Reservoir) => (
                        <SelectItem key={r.id} value={String(r.id)}>
                          {r.name_reservoir}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {(
            [
              'type_well_targets_id',
              'type_tubings_id',
              'type_functions_id',
              'entry_point_x',
              'entry_point_y',
              'entry_point_z',
              'target_x',
              'target_y',
              'target_z',
              'tec',
            ] as const
          ).map((name) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{name}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <div className="flex gap-2">
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate({ to: '/wells' })}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
