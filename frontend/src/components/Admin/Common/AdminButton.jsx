import React from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminButton({
  children,
  type = 'button',
  variant = 'secondary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  title,
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-colors duration-150 motion-reduce:transition-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 select-none focus-visible:outline-2 focus-visible:outline-offset-2';

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs rounded-md',
    md: 'px-3.5 py-2 text-xs',
    lg: 'px-4 py-2.5 text-sm',
    icon: 'p-2 text-xs',
  };

  const variantClasses = {
    primary:
      'bg-(--admin-primary) text-(--admin-white) shadow-xs hover:opacity-90 active:opacity-95 focus-visible:outline-(--admin-accent)',
    accent:
      'bg-(--admin-accent) text-(--admin-black) font-bold shadow-xs hover:brightness-105 active:brightness-95 focus-visible:outline-(--admin-primary)',
    secondary:
      'border border-(--admin-border) bg-(--admin-surface) text-(--admin-ink) shadow-2xs hover:bg-(--admin-background) active:bg-(--admin-background)/80 focus-visible:outline-(--admin-accent)',
    outline:
      'border border-(--admin-border) bg-transparent text-(--admin-ink) hover:bg-(--admin-background) focus-visible:outline-(--admin-accent)',
    danger:
      'bg-red-600 text-white shadow-xs hover:bg-red-700 active:bg-red-800 focus-visible:outline-red-500',
    dangerOutline:
      'border border-red-300 dark:border-red-800/60 bg-transparent text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 focus-visible:outline-red-500',
    ghost:
      'bg-transparent text-(--admin-ink)/80 hover:bg-(--admin-background) hover:text-(--admin-ink) focus-visible:outline-(--admin-accent)',
  };

  const finalClass = `${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${
    variantClasses[variant] || variantClasses.secondary
  } ${className}`;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={finalClass}
      title={title}
      {...props}
    >
      {loading ? (
        <Loader2 size={size === 'sm' ? 13 : 15} className="animate-spin" aria-hidden="true" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon size={size === 'sm' ? 13 : 15} aria-hidden="true" />
      ) : null}

      {children && <span>{children}</span>}

      {!loading && Icon && iconPosition === 'right' && (
        <Icon size={size === 'sm' ? 13 : 15} aria-hidden="true" />
      )}
    </button>
  );
}

