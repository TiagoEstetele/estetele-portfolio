import { Mail, Github, Linkedin } from 'lucide-react'
import type { ContactTranslations } from '@/types'

interface ContactCardProps {
  t: ContactTranslations
}

interface ContactItemProps {
  href: string
  icon: React.ReactNode
  label: string
  handle: string
  ariaLabel: string
}

function ContactItem({ href, icon, label, handle, ariaLabel }: ContactItemProps) {
  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className="group flex flex-col items-center gap-3 rounded-[18px] px-6 py-8 transition-colors duration-200 hover:bg-white/[0.04]"
      >
        <div
          className="c-icon flex h-[46px] w-[46px] items-center justify-center rounded-[13px] opacity-60 transition-opacity duration-200 group-hover:opacity-100"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.09)',
            color: '#ededed',
          }}
        >
          {icon}
        </div>
        <div className="text-center">
          <div
            className="c-label text-[15px] font-semibold tracking-[-0.015em] opacity-60 transition-opacity duration-200 group-hover:opacity-100"
            style={{ color: '#ededed' }}
          >
            {label}
          </div>
          <div className="mt-1 text-xs" style={{ color: 'var(--muted-xs)' }}>
            {handle}
          </div>
        </div>
      </a>
    </>
  )
}

export function ContactCard({ t }: ContactCardProps) {
  return (
    <div
      className="rounded-3xl p-2 backdrop-blur-2xl"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow:
          '0 0 80px rgba(112,0,255,0.07), 0 0 160px rgba(255,92,0,0.03), 0 40px 80px rgba(0,0,0,0.45)',
      }}
    >
      {/* Mobile: flex-col stack. sm+: 3-col grid with dividers */}
      <div className="flex flex-col sm:grid sm:grid-cols-[1fr_1px_1fr_1px_1fr]">
        <ContactItem
          href="mailto:estetele.dev@outlook.com"
          icon={<Mail size={20} />}
          label={t.emailLabel}
          handle="estetele.dev@outlook.com"
          ariaLabel={t.emailAriaLabel}
        />

        {/* Divider — horizontal on mobile, vertical on sm+ */}
        <div
          className="mx-6 h-px sm:mx-0 sm:h-auto"
          style={{ background: 'rgba(255,255,255,0.06)' }}
          aria-hidden="true"
        />

        <ContactItem
          href="https://github.com/TiagoEstetele"
          icon={<Github size={20} />}
          label={t.githubLabel}
          handle="@TiagoEstetele"
          ariaLabel={t.githubAriaLabel}
        />

        {/* Divider */}
        <div
          className="mx-6 h-px sm:mx-0 sm:h-auto"
          style={{ background: 'rgba(255,255,255,0.06)' }}
          aria-hidden="true"
        />

        <ContactItem
          href="https://www.linkedin.com/in/estetele/"
          icon={<Linkedin size={20} />}
          label={t.linkedinLabel}
          handle="in/estetele"
          ariaLabel={t.linkedinAriaLabel}
        />
      </div>
    </div>
  )
}
