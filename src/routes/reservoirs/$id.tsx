import { createFileRoute, useParams, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reservoirSchema, type ReservoirFormValues } from '@/types/schemas';
import { reservoirsApi, projectsApi } from '@/api/endpoints';
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
import type { ApiError422, Project } from '@/types/api';

export const Route = createFileRoute('/reservoirs/$id')({
  component: ReservoirFormPage,
});

function ReservoirFormPage() {
  const params = useParams({ strict: false });
  const id = params.id as string;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = id === 'new';

  const form = useForm<ReservoirFormValues>({
    resolver: zodResolver(reservoirSchema),
    defaultValues: { name_reservoir: '', project_id: '' },
    mode: 'onChange',
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getAll,
  });

  const { data: reservoir } = useQuery({
    queryKey: ['reservoirs', id],
    queryFn: () => reservoirsApi.getById(Number(id)),
    enabled: !isNew && id !== 'new',
  });

  useEffect(() => {
    if (reservoir) {
      form.reset({
        name_reservoir: reservoir.name_reservoir,
        project_id: reservoir.project_id,
      });
    }
  }, [reservoir, form]);

  const createMutation = useMutation({
    mutationFn: reservoirsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservoirs'] });
      navigate({ to: '/reservoirs' });
    },
    onError: (error: AxiosError<ApiError422>) => {
      const detail = error.response?.data?.detail;
      if (detail && Array.isArray(detail)) {
        detail.forEach((d) => {
          const field = Array.isArray(d.loc) ? d.loc[d.loc.length - 1] : undefined;
          if (field && typeof field === 'string' && field in form.getValues()) {
            form.setError(field as keyof ReservoirFormValues, { message: d.msg });
          }
        });
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (body: { name_reservoir: string }) =>
      reservoirsApi.update({ id: Number(id), body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservoirs'] });
      queryClient.invalidateQueries({ queryKey: ['reservoirs', id] });
      navigate({ to: '/reservoirs' });
    },
    onError: (error: AxiosError<ApiError422>) => {
      const detail = error.response?.data?.detail;
      if (detail && Array.isArray(detail)) {
        detail.forEach((d) => {
          const field = Array.isArray(d.loc) ? d.loc[d.loc.length - 1] : undefined;
          if (field && typeof field === 'string' && field in form.getValues()) {
            form.setError(field as keyof ReservoirFormValues, { message: d.msg });
          }
        });
      }
    },
  });

  const onSubmit = (values: ReservoirFormValues) => {
    if (isNew) {
      createMutation.mutate(values);
    } else {
      updateMutation.mutate({ name_reservoir: values.name_reservoir });
    }
  };

  return (
    <div className="p-4 max-w-xl">
      <h1 className="text-xl font-semibold mb-4">
        {isNew ? 'Novo Reservatório' : 'Editar Reservatório'}
      </h1>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name_reservoir"
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
          <div className="flex gap-2">
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate({ to: '/reservoirs' })}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
