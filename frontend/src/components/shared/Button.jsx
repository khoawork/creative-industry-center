import Icon from './Icon.jsx'

export default function Button({ children, href, variant = 'primary', icon = 'arrow', iconPosition = 'end', iconSize, className = '', type = 'button', ...props }) {
  const classes = variant === 'text'
    ? 'text-link inline-flex items-center'
    : `button inline-flex items-center justify-center${variant === 'primary' ? '' : ` button--${variant}`}`
  const iconElement = icon && <Icon name={icon} size={iconSize ?? (variant === 'text' ? 15 : 18)} />
  const content = <>{iconPosition === 'start' && iconElement}{children}{iconPosition === 'end' && iconElement}</>

  return href
    ? <a href={href} className={`${classes} ${className}`.trim()} {...props}>{content}</a>
    : <button type={type} className={`${classes} ${className}`.trim()} {...props}>{content}</button>
}
