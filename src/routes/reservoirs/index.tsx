import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservoirsApi } from '@/api/endpoints';
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

export const Route = createFileRoute('/reservoirs/')({
  component: ReservoirsList,
});

function ReservoirsList() {
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reservoirToDelete, setReservoirToDelete] = useState<number | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['reservoirs'],
    queryFn: reservoirsApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: reservoirsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservoirs'] });
      setDeleteDialogOpen(false);
      setReservoirToDelete(null);
    },
  });

  const onDeleteClick = (id: number) => {
    setReservoirToDelete(id);
    setDeleteDialogOpen(true);
  };

  const onConfirmDelete = () => {
    if (reservoirToDelete !== null) {
      deleteMutation.mutate(reservoirToDelete);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Reservoirs</h1>
        <Link to="/reservoirs/$id" params={{ id: 'new' }}>
          <Button>New</Button>
        </Link>
      </div>
      <Card className="p-2">
        {isLoading ? (
          <div className="p-4">Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.name_reservoir}</TableCell>
                  <TableCell className="font-mono text-xs">{p.project_id}</TableCell>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link to="/reservoirs/$id" params={{ id: String(p.id) }}>
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
              This action cannot be undone. This will permanently delete the reservoir.
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
