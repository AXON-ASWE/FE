import { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { EyeIcon } from '../icons';

type ValidRule = {
  rule: RegExp | null;
  message: string;
};

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  validRules?: ValidRule[];
  error?: string; // ✅ thêm
};

export const TextField = ({
  label,
  icon,
  type,
  id,
  children,
  validRules = [],
  error, // ✅ nhận error từ ngoài
  ...props
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const isPasswordField = type === 'password';
  const inputType = isPasswordField && showPassword ? 'text' : type;

  const handleValidation = (value: string) => {
    const err = validRules.find((rule) => rule.rule && !rule.rule.test(value));
    setLocalError(err ? err.message : null);
  };

  // ✅ Ưu tiên error được truyền từ ngoài
  const displayError = error || localError;

  return (
    <div className="space-y-2 flex flex-col">
      <div className="flex justify-between">
        <Label
          className={`text-sm font-medium leading-none ${
            displayError ? 'text-red-500' : ''
          }`}
          htmlFor={id}
        >
          {label}
        </Label>

        {children && <div className="ml-auto">{children}</div>}
      </div>

      <div className="relative inline-block h-9 w-full">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
        )}

        <Input
          id={id}
          type={inputType}
          className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 ${
            icon ? 'pl-10' : ''
          } ${displayError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          {...props}
          onChange={(e) => {
            props.onChange?.(e);
            handleValidation(e.target.value);
          }}
        />

        {isPasswordField && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
              aria-label="Toggle password visibility"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <EyeIcon />
            </button>
          </span>
        )}
      </div>

      {displayError && (
        <div className="text-sm text-red-500">
          <p>{displayError}</p>
        </div>
      )}
    </div>
  );
};
