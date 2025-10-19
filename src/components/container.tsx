import { clsx } from 'clsx'

export function Container({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={clsx(className, 'px-2 lg:px-4')}>
      <div className="mx-auto max-w-2xl lg:max-w-7xl xl:max-w-[1440px]">{children}</div>
    </div>
  )
}
