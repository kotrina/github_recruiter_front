import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ApiError } from '@/utils/api';

interface ErrorCardProps {
  error: Error | ApiError;
  onRetry?: () => void;
  title?: string;
}

export function ErrorCard({ error, onRetry, title = 'Error' }: ErrorCardProps) {
  const getErrorMessage = (error: Error | ApiError): string => {
    if (error instanceof ApiError) {
      return error.message;
    }
    return 'Something went wrong while fetching data.';
  };

  return (
    <Alert className="border-destructive/50 bg-destructive/5">
      <AlertCircle className="h-4 w-4 text-destructive" />
      <div className="flex-1">
        <div className="font-medium text-destructive mb-1">{title}</div>
        <AlertDescription className="text-destructive/90">
          {getErrorMessage(error)}
        </AlertDescription>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-2 h-8"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Try Again
          </Button>
        )}
      </div>
    </Alert>
  );
}