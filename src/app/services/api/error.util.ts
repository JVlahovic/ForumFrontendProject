import {HttpErrorResponse} from '@angular/common/http';

//Helper for conversion of errors from Object Object to an actual error.

export function extractErrorMessage(err: HttpErrorResponse): string {
  if (typeof err.error === 'string' && err.error) {
    return err.error;
  }
  return err.error?.message
    ?? err.error?.detail
    ?? err.statusText
    ?? 'Something went wrong.';
}
