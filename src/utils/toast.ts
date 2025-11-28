import { toast } from 'sonner';
import type { ApiError422, ApiErrorDetail } from '@/types/api';

export function toastSuccess(message: string) {
  toast.success(message);
}

export function toastError(message: string) {
  toast.error(message);
}

export function toastApi422(error: ApiError422 | { detail?: ApiErrorDetail[] } | unknown) {
  const details = (error as ApiError422)?.detail;
  if (Array.isArray(details) && details.length > 0) {
    details.forEach((d) => {
      const path = Array.isArray(d.loc) ? d.loc.join('.') : '';
      toast.error(`${path ? `${path}: ` : ''}${d.msg}`);
    });
  } else {
    toast.error('Validation error (422)');
  }
}
