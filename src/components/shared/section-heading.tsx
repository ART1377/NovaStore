// src/components/shared/section-heading.tsx
import Link from 'next/link';

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel = 'مشاهده همه',
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-5">
      <div>
        {eyebrow ? (
          <p className="text-nova-muted text-xs font-semibold">{eyebrow}</p>
        ) : null}
        <h2 className="mt-1 text-2xl font-black tracking-tight md:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="text-nova-primary mt-2 max-w-2xl text-sm leading-7">
            {description}
          </p>
        ) : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="hidden shrink-0 text-sm font-bold underline underline-offset-4 sm:block"
        >
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}
