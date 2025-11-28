import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, type ProjectFormValues } from '@/types/schemas';
import { projectsApi } from '@/api/endpoints';
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
import { useEffect } from 'react';
import type { AxiosError } from 'axios';
import type { ApiError422 } from '@/types/api';

export const Route = createFileRoute('/projects/$id')({
  component: ProjectFormPage,
});

function ProjectFormPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = id === 'new';

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: { name_project: '', type_ccus_strategies_id: 0 },
    mode: 'onChange',
  });

  const { data: project } = useQuery({
    queryKey: ['projects', id],
    queryFn: () => projectsApi.getById(id),
    enabled: !isNew,
  });

  useEffect(() => {
    if (project) {
      form.reset({
        name_project: project.name_project,
        type_ccus_strategies_id: project.type_ccus_strategies_id,
      });
    }
  }, [project, form]);

  const createMutation = useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      navigate({ to: '/projects' });
    },
    onError: (error: AxiosError<ApiError422>) => {
      const detail = error.response?.data?.detail;
      if (detail && Array.isArray(detail)) {
        detail.forEach((d) => {
          const field = Array.isArray(d.loc) ? d.loc[d.loc.length - 1] : undefined;
          if (field && typeof field === 'string' && field in form.getValues()) {
            form.setError(field as keyof ProjectFormValues, { message: d.msg });
          }
        });
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (body: ProjectFormValues) => projectsApi.update({ project_id: id, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', id] });
      navigate({ to: '/projects' });
    },
    onError: (error: AxiosError<ApiError422>) => {
      const detail = error.response?.data?.detail;
      if (detail && Array.isArray(detail)) {
        detail.forEach((d) => {
          const field = Array.isArray(d.loc) ? d.loc[d.loc.length - 1] : undefined;
          if (field && typeof field === 'string' && field in form.getValues()) {
            form.setError(field as keyof ProjectFormValues, { message: d.msg });
          }
        });
      }
    },
  });

  const onSubmit = (values: ProjectFormValues) => {
    if (isNew) {
      createMutation.mutate(values);
    } else {
      updateMutation.mutate(values);
    }
  };

  return (
    <div className="p-4 max-w-xl">
      <h1 className="text-xl font-semibold mb-4">{isNew ? 'Novo Projeto' : 'Editar Projeto'}</h1>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name_project"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type_ccus_strategies_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CCUS Strategy ID</FormLabel>
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
          <div className="flex gap-2">
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate({ to: '/projects' })}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
