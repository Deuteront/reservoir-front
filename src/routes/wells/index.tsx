import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wellsApi, projectsApi, reservoirsApi } from '@/api/endpoints';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState, useMemo } from 'react';

export const Route = createFileRoute('/wells/')({ component: WellsList });

function WellsList() {
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [wellToDelete, setWellToDelete] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedReservoir, setSelectedReservoir] = useState<string>('all');

  const { data, isLoading, error } = useQuery({
    queryKey: ['wells'],
    queryFn: wellsApi.getAll,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getAll,
  });

  const { data: reservoirs = [] } = useQuery({
    queryKey: ['reservoirs'],
    queryFn: reservoirsApi.getAll,
  });

  const items = useMemo(() => {
    if (!Array.isArray(data)) return [];

    let filtered = data;

    if (selectedProject !== 'all') {
      filtered = filtered.filter((w) => w.project_id === selectedProject);
    }

    if (selectedReservoir !== 'all') {
      filtered = filtered.filter((w) => w.reservoir_details_id === Number(selectedReservoir));
    }

    return filtered;
  }, [data, selectedProject, selectedReservoir]);

  const filteredReservoirs = useMemo(() => {
    if (selectedProject === 'all') return reservoirs;
    return reservoirs.filter((r) => r.project_id === selectedProject);
  }, [reservoirs, selectedProject]);

  const deleteMutation = useMutation({
    mutationFn: wellsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wells'] });
      setDeleteDialogOpen(false);
      setWellToDelete(null);
    },
  });

  const onDeleteClick = (id: number) => {
    setWellToDelete(id);
    setDeleteDialogOpen(true);
  };

  const onConfirmDelete = () => {
    if (wellToDelete !== null) {
      deleteMutation.mutate(wellToDelete);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Wells</h1>
        <Link to="/wells/$id" params={{ id: 'new' }}>
          <Button>New</Button>
        </Link>
      </div>

      <div className=" flex gap-4">
        <div>
          <Select onValueChange={setSelectedProject} value={selectedProject}>
            <SelectTrigger className={'min-w-[200px]'}>
              <SelectValue placeholder="Filter by Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.project_id} value={p.project_id}>
                  {p.name_project}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select onValueChange={setSelectedReservoir} value={selectedReservoir}>
            <SelectTrigger className={'min-w-[200px]'}>
              <SelectValue placeholder="Filter by Reservoir" />
            </SelectTrigger>
            <SelectContent className={'min-w-[200px]'}>
              <SelectItem value="all">All Reservoirs</SelectItem>
              {filteredReservoirs.map((r) => (
                <SelectItem key={r.id} value={String(r.id)}>
                  {r.name_reservoir}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="p-2">
        {isLoading ? (
          <div className="p-4">Loading...</div>
        ) : error ? (
          <div className="p-4 text-red-500">Error loading wells: {error.message}</div>
        ) : items.length === 0 ? (
          <div className="p-4 text-gray-500">No wells found</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Reservoir</TableHead>
                <TableHead>TEC</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((p) => {
                const project = projects.find((proj) => proj.project_id === p.project_id);
                const reservoir = reservoirs.find((res) => res.id === p.reservoir_details_id);

                return (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{project?.name_project || p.project_id}</TableCell>
                    <TableCell>{reservoir?.name_reservoir || p.reservoir_details_id}</TableCell>
                    <TableCell>{p.tec}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link to="/wells/$id" params={{ id: String(p.id) }}>
                          <Button variant="secondary">Edit</Button>
                        </Link>
                        <Button
                          variant="destructive"
                          onClick={() => onDeleteClick(p.id)}
                          disabled={deleteMutation.isPending}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the well.
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
