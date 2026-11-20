import {HttpErrorResponse} from '@angular/common/http';

//Error Handler expanded here again, statusText is removed because deprecated.

export function extractErrorMessage(err: HttpErrorResponse): string {

  // For plain text
  if (typeof err.error === 'string' && err.error.trim()) {
    return err.error;
  }

  // For structured bodies
  const bodyMessage = err.error?.message ?? err.error?.detail;
  if (bodyMessage) {
    return bodyMessage;
  }

  //If Backend isn't reachable
  if (err.status === 0) {
    return 'Cannot reach the server. Check your connection.';
  }

  //Status based fallbacks for the future
  switch (err.status) {
    case 400: return 'The request was invalid.';
    case 401: return 'Please log in to continue.';
    case 403: return 'You do not have permission to do that.';
    case 404: return 'Not found.';
    case 409: return 'That action conflicts with the current state.';
    case 422: return 'That request could not be processed.';
    case 429: return 'Too many requests. Please slow down.';
    case 500: return 'Server error. Please try again later.';
    case 502:
    case 503:
    case 504: return 'The server is temporarily unavailable.';
    default:  return 'Something went wrong.';
  }
}
