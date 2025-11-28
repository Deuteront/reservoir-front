import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '@/api/endpoints';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

export const Route = createFileRoute('/projects/')({
  component: ProjectsList,
});

function ProjectsList() {
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getAll,
  });

  const items = Array.isArray(data) ? data : [];

  const deleteMutation = useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    },
  });

  const onDeleteClick = (id: string) => {
    setProjectToDelete(id);
    setDeleteDialogOpen(true);
  };

  const onConfirmDelete = () => {
    if (projectToDelete) {
      deleteMutation.mutate(projectToDelete);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Projects</h1>
        <Link to="/projects/$id" params={{ id: 'new' }}>
          <Button>New</Button>
        </Link>
      </div>
      <Card className="p-2">
        {isLoading ? (
          <div className="p-4">Loading...</div>
        ) : error ? (
          <div className="p-4 text-red-500">Error loading projects: {error.message}</div>
        ) : items.length === 0 ? (
          <div className="p-4 text-gray-500">No projects found</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>UUID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((p) => (
                <TableRow key={p.project_id}>
                  <TableCell className="font-mono text-xs">{p.project_id}</TableCell>
                  <TableCell>{p.name_project}</TableCell>
                  <TableCell>{p.type_ccus_strategies_id}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link to="/projects/$id" params={{ id: p.project_id }}>
                        <Button variant="secondary">Edit</Button>
                      </Link>
                      <Button
                        variant="destructive"
                        onClick={() => onDeleteClick(p.project_id)}
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={onConfirmDelete}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
