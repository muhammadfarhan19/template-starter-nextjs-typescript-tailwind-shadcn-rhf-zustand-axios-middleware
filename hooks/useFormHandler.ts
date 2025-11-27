import { useForm, UseFormProps, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";

type InferSchema<TSchema extends z.ZodType<any, any>> = z.output<TSchema>;

interface UseFormHandlerOptions<
  TSchema extends z.ZodType<any, any>,
  TData = any,
  TError = Error,
  TContext = unknown
> {
  schema: TSchema;
  mutationFn: (data: InferSchema<TSchema>) => Promise<TData>;
  onSuccess?: (
    data: TData,
    variables: InferSchema<TSchema>,
    context: TContext
  ) => void;
  onError?: (
    error: TError,
    variables: InferSchema<TSchema>,
    context: TContext | undefined
  ) => void;
  successMessage?: string | ((data: TData) => string);
  errorMessage?: string | ((error: TError) => string);
  formOptions?: Omit<UseFormProps<InferSchema<TSchema>>, "resolver">;
  mutationOptions?: Omit<
    UseMutationOptions<TData, TError, InferSchema<TSchema>, TContext>,
    "mutationFn" | "onSuccess" | "onError"
  >;
}

interface UseFormHandlerReturn<
  TSchema extends z.ZodType<any, any>,
  TData = any,
  TError = Error,
  TContext = unknown
> {
  form: UseFormReturn<InferSchema<TSchema>>;
  mutation: UseMutationResult<TData, TError, InferSchema<TSchema>, TContext>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isLoading: boolean;
}

export function useFormHandler<
  TSchema extends z.ZodType<any, any>,
  TData = any,
  TError = Error,
  TContext = unknown
>({
  schema,
  mutationFn,
  onSuccess,
  onError,
  successMessage = "Operasi berhasil!",
  errorMessage = "Terjadi kesalahan. Silakan coba lagi.",
  formOptions,
  mutationOptions,
}: UseFormHandlerOptions<
  TSchema,
  TData,
  TError,
  TContext
>): UseFormHandlerReturn<TSchema, TData, TError, TContext> {
  type FormValues = InferSchema<TSchema>;

  // Setup React Hook Form dengan Zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    ...formOptions,
  });

  // Setup mutation dengan auto toast
  const mutation = useMutation<TData, TError, FormValues, TContext>({
    mutationFn,
    onSuccess: (data, variables, context) => {
      // Toast success
      const message =
        typeof successMessage === "function"
          ? successMessage(data)
          : successMessage;
      toast.success(message);

      // Reset form setelah success (opsional)
      form.reset();

      // Call custom onSuccess callback
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      // Toast error
      const message =
        typeof errorMessage === "function" ? errorMessage(error) : errorMessage;
      toast.error(message);

      // Call custom onError callback
      onError?.(error, variables, context);
    },
    ...mutationOptions,
  });

  // Handler untuk submit form
  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  return {
    form,
    mutation,
    onSubmit,
    isLoading: mutation.isPending,
  };
}

// Export type helper untuk kemudahan penggunaan
export type FormHandler<
  TSchema extends z.ZodType<any, any>,
  TData = any,
  TError = Error,
  TContext = unknown
> = UseFormHandlerReturn<TSchema, TData, TError, TContext>;

export type { InferSchema };
