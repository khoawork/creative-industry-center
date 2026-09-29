import Icon from './Icon.jsx'

/**
 * Modern Tailwind CSS Button component supporting multiple variants, sizes, and icon placements.
 */
export default function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  icon = 'arrow',
  iconPosition = 'end',
  iconSize,
  className = '',
  type = 'button',
  disabled = false,
  ...props
}) {
  // Base classes for all buttons
  const baseClasses = 'inline-flex items-center justify-center font-bold transition-all duration-200 select-none'

  // Variant classes using Tailwind CSS
  const variantClasses = {
    primary: 'bg-[#680007] hover:bg-[#520005] text-white shadow-sm hover:shadow-md active:scale-[0.98]',
    outline: 'bg-white hover:bg-amber-50/60 border border-[#d49520] text-[#680007] shadow-sm hover:shadow active:scale-[0.98]',
    secondary: 'bg-white hover:bg-amber-50/60 border border-[#d49520] text-[#680007] shadow-sm hover:shadow active:scale-[0.98]',
    white: 'bg-white hover:bg-amber-50 text-[#680007] shadow-md hover:shadow-xl active:scale-[0.98] border border-transparent',
    gold: 'bg-[#f4b42c] hover:bg-[#ffd058] text-[#490003] shadow-md hover:shadow-lg active:scale-[0.98]',
    'gold-outline': 'bg-transparent hover:bg-[#f4b42c]/10 border border-[#f4b42c]/70 text-[#f4b42c] active:scale-[0.98]',
    text: 'bg-transparent text-[#680007] hover:text-[#b45309] p-0 shadow-none !rounded-none',
    'text-gold': 'bg-transparent text-[#b45309] hover:text-[#680007] p-0 shadow-none !rounded-none',
  }[variant] || 'bg-[#680007] hover:bg-[#520005] text-white shadow-sm'

  // Size classes
  const sizeClasses = variant === 'text' || variant === 'text-gold'
    ? ''
    : {
        xs: 'px-3 py-1.5 text-xs rounded-md gap-1.5',
        sm: 'px-4 py-2 text-xs md:text-sm rounded-md gap-1.5',
        md: 'px-6 py-3 text-sm md:text-base rounded-lg gap-2',
        lg: 'px-7 py-3.5 text-base md:text-lg rounded-lg gap-2.5',
        pill: 'px-6 py-2.5 text-xs md:text-sm rounded-full gap-2',
        'pill-sm': 'px-4 py-1.5 text-xs rounded-full gap-1.5',
      }[size] || 'px-6 py-3 text-sm md:text-base rounded-lg gap-2'

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'

  // Resolve icon element
  let iconElement = null
  if (icon) {
    if (typeof icon === 'string') {
      const defaultIconSize = variant === 'text' || variant === 'text-gold' || size === 'xs' || size === 'sm' || size === 'pill-sm' ? 16 : 18
      iconElement = <Icon name={icon} size={iconSize ?? defaultIconSize} className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
    } else {
      iconElement = icon
    }
  }

  const content = (
    <>
      {iconPosition === 'start' && iconElement}
      <span>{children}</span>
      {iconPosition === 'end' && iconElement}
    </>
  )

  const combinedClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${className}`.trim().replace(/\s+/g, ' ')

  if (href) {
    return (
      <a href={href} className={combinedClasses} aria-disabled={disabled} {...props}>
        {content}
      </a>
    )
  }

  return (
    <button type={type} disabled={disabled} className={combinedClasses} {...props}>
      {content}
    </button>
  )
}
