import React, { useId } from 'react';

export function AdminInput({
  label,
  id: customId,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  hint,
  icon: Icon,
  className = '',
  inputClassName = '',
  rows = 3,
  multiline = false,
  ...props
}) {
  const generatedId = useId();
  const inputId = customId || generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  const commonInputClass = `w-full rounded-lg border border-(--admin-border) bg-(--admin-background) px-3 py-2 text-xs sm:text-sm text-(--admin-ink) placeholder:text-(--admin-ink)/45 transition-colors focus:border-(--admin-accent) focus:ring-2 focus:ring-(--admin-accent)/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
    error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
  } ${Icon ? 'pl-9' : ''} ${inputClassName}`;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold tracking-wide text-(--admin-heading)"
        >
          {label}
          {required && <span className="text-(--admin-accent) ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-(--admin-ink)/50">
            <Icon size={15} aria-hidden="true" />
          </div>
        )}

        {multiline ? (
          <textarea
            id={inputId}
            value={value ?? ''}
            onChange={(e) => {
              if (!onChange) return;
              try {
                onChange(e);
              } catch (err) {
                // Fallback nếu người dùng truyền hàm nhận trực tiếp string
                onChange(e.target.value);
              }
            }}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={commonInputClass}
            {...props}
          />
        ) : (
          <input
            id={inputId}
            type={type}
            value={value ?? ''}
            onChange={(e) => {
              if (!onChange) return;
              try {
                onChange(e);
              } catch (err) {
                onChange(e.target.value);
              }
            }}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={commonInputClass}
            {...props}
          />
        )}
      </div>

      {error ? (
        <p id={errorId} className="text-[11px] font-medium text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-[11px] text-(--admin-ink)/60">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function AdminSelect({
  label,
  id: customId,
  value,
  onChange,
  options = [],
  required = false,
  disabled = false,
  error,
  hint,
  placeholder = 'Chọn một mục...',
  className = '',
  selectClassName = '',
  ...props
}) {
  const generatedId = useId();
  const selectId = customId || generatedId;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold tracking-wide text-(--admin-heading)"
        >
          {label}
          {required && <span className="text-(--admin-accent) ml-0.5">*</span>}
        </label>
      )}

      <select
        id={selectId}
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value, e)}
        disabled={disabled}
        className={`w-full rounded-lg border border-(--admin-border) bg-(--admin-background) px-3 py-2 text-xs sm:text-sm text-(--admin-ink) transition-colors focus:border-(--admin-accent) focus:ring-2 focus:ring-(--admin-accent)/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
          error ? 'border-red-500' : ''
        } ${selectClassName}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lab = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={val} value={val}>
              {lab}
            </option>
          );
        })}
      </select>

      {error ? (
        <p className="text-[11px] font-medium text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[11px] text-(--admin-ink)/60">{hint}</p>
      ) : null}
    </div>
  );
}

