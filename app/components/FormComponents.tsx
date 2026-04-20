import React from "react"
import { AlertCircle } from "lucide-react"
import { Input } from "~/components/ui/input"
import { cn } from "~/lib/utils"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  required?: boolean
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, required, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-semibold uppercase tracking-[0.16em] text-slate-500"
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <Input
          ref={ref}
          className={cn(
            "h-13 rounded-[24px] border-slate-200 bg-white/80 px-4 text-sm shadow-sm placeholder:text-slate-400 focus-visible:border-slate-950 focus-visible:ring-0",
            error && "border-red-300 bg-red-50/60 focus-visible:border-red-500",
            className
          )}
          {...props}
        />

        {error ? (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        ) : helperText ? (
          <p className="text-sm leading-6 text-slate-500">{helperText}</p>
        ) : null}
      </div>
    )
  }
)

FormInput.displayName = "FormInput"

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  required?: boolean
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, helperText, required, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-semibold uppercase tracking-[0.16em] text-slate-500"
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          className={cn(
            "min-h-[168px] w-full rounded-[24px] border border-slate-200 bg-white/80 px-4 py-3 text-sm leading-7 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-950",
            error && "border-red-300 bg-red-50/60 focus:border-red-500",
            className
          )}
          {...props}
        />

        {error ? (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        ) : helperText ? (
          <p className="text-sm leading-6 text-slate-500">{helperText}</p>
        ) : null}
      </div>
    )
  }
)

FormTextarea.displayName = "FormTextarea"
