import { useState, useRef } from 'react';
import { Upload, X, Loader2, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
  /** Accepted file input types, e.g. "application/pdf" */
  accept?: string;
  /** Max file size in MB */
  maxSizeMB?: number;
  /** Text shown in the empty drop zone */
  label?: string;
  className?: string;
}

export function FileUpload({
  value,
  onChange,
  bucket = 'portfolio-assets',
  folder = 'files',
  accept = 'application/pdf',
  maxSizeMB = 10,
  label = 'Click to upload file',
  className,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type against the accept list (defaults to PDF)
    if (accept && accept !== '*' && !accept.split(',').some((t) => file.type === t.trim())) {
      toast.error(`Please select a valid file (${accept})`);
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File must be less than ${maxSizeMB}MB`);
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      onChange(publicUrl);
      toast.success('File uploaded successfully');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput('');
      setShowUrlInput(false);
    }
  };

  const fileName = value ? decodeURIComponent(value.split('/').pop() || 'file') : '';

  return (
    <div className={cn('space-y-3', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {value ? (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-background/60 p-3">
          <div className="p-2 rounded-lg bg-primary/10 shrink-0">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">Uploaded file</p>
            <p className="text-xs text-muted-foreground truncate">{fileName}</p>
          </div>
          <a href={value} target="_blank" rel="noopener noreferrer">
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8" title="View file">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onChange('')}
            title="Remove file"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={cn(
            'w-full h-28 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-colors',
            isUploading && 'pointer-events-none opacity-50'
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-7 w-7 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="text-xs text-muted-foreground">Max {maxSizeMB}MB</span>
            </>
          )}
        </div>
      )}

      {showUrlInput ? (
        <div className="flex gap-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/resume.pdf"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleUrlSubmit())}
          />
          <Button type="button" variant="outline" size="sm" onClick={handleUrlSubmit}>
            Add
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setShowUrlInput(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={() => setShowUrlInput(true)}
        >
          Or paste a URL instead
        </Button>
      )}
    </div>
  );
}
