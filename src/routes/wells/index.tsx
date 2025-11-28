import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wellsApi } from '@/api/endpoints';
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

export const Route = createFileRoute('/wells/')({ component: WellsList });

function WellsList() {
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [wellToDelete, setWellToDelete] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['wells'],
    queryFn: wellsApi.getAll,
  });

  const items = Array.isArray(data) ? data : [];

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
                <TableHead>Reservoir</TableHead>
                <TableHead>TEC</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.reservoir_details_id}</TableCell>
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
