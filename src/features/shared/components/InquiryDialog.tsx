import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const inquirySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.email('Invalid email address').max(255),
  message: z.string().trim().min(1, 'Message is required').max(2000),
});

type InquiryForm = z.infer<typeof inquirySchema>;

interface InquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artworkTitle: string;
  artworkId: string;
}

const InquiryDialog = ({ open, onOpenChange, artworkTitle, artworkId }: InquiryDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InquiryForm>({ resolver: zodResolver(inquirySchema) });

  const onSubmit = (_data: InquiryForm) => {
    // Placeholder submission handler
    // In production, send to backend with artworkId
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border bg-card">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-light text-foreground">
            Inquire About This Artwork
          </DialogTitle>
          <DialogDescription className="font-body text-sm text-muted-foreground">
            Fill out the form below and our team will respond within 24 hours.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-5" noValidate>
          {/* Artwork title (readonly) */}
          <div>
            <label htmlFor="inquiry-artwork" className="mb-1.5 block font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Artwork
            </label>
            <input
              id="inquiry-artwork"
              type="text"
              value={artworkTitle}
              readOnly
              className="w-full border border-border bg-muted px-4 py-3 font-body text-sm text-foreground outline-none"
              tabIndex={-1}
            />
            <input type="hidden" value={artworkId} />
          </div>

          {/* Name */}
          <div>
            <label htmlFor="inquiry-name" className="mb-1.5 block font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Name
            </label>
            <input
              id="inquiry-name"
              type="text"
              {...register('name')}
              className="w-full border border-border bg-card px-4 py-3 font-body text-sm text-foreground outline-none transition-colors focus:border-primary"
              autoFocus
            />
            {errors.name && <p className="mt-1 font-body text-xs text-destructive">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="inquiry-email" className="mb-1.5 block font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Email
            </label>
            <input
              id="inquiry-email"
              type="email"
              {...register('email')}
              className="w-full border border-border bg-card px-4 py-3 font-body text-sm text-foreground outline-none transition-colors focus:border-primary"
            />
            {errors.email && <p className="mt-1 font-body text-xs text-destructive">{errors.email.message}</p>}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="inquiry-message" className="mb-1.5 block font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Message
            </label>
            <textarea
              id="inquiry-message"
              rows={4}
              {...register('message')}
              className="w-full resize-none border border-border bg-card px-4 py-3 font-body text-sm text-foreground outline-none transition-colors focus:border-primary"
            />
            {errors.message && <p className="mt-1 font-body text-xs text-destructive">{errors.message.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-primary px-8 py-3 font-body text-xs uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-primary/90"
          >
            Send Inquiry
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InquiryDialog;
