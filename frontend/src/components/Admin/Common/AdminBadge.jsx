import React from 'react';

export default function AdminBadge({
  children,
  variant = 'neutral',
  size = 'md',
  icon: Icon,
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center gap-1.5 font-medium rounded-full select-none';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
  };

  const variantClasses = {
    primary:
      'bg-(--admin-primary)/10 text-(--admin-primary) border border-(--admin-primary)/20 dark:bg-(--admin-primary)/20 dark:text-red-300',
    accent:
      'bg-(--admin-accent)/15 text-(--admin-title) border border-(--admin-accent)/30 dark:bg-(--admin-accent)/20',
    success:
      'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40',
    warning:
      'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/40',
    error:
      'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800/40',
    neutral:
      'bg-(--admin-background) text-(--admin-ink)/80 border border-(--admin-border)',
  };

  return (
    <span
      className={`${base} ${sizeClasses[size] || sizeClasses.md} ${
        variantClasses[variant] || variantClasses.neutral
      } ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 10 : 12} aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
}

