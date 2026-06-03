import { SectionLabel } from '@/components/ui/SectionLabel'
import { ContactCard } from '@/components/ui/ContactCard'
import { MotionWrapper } from '@/components/ui/MotionWrapper'
import { fadeInUp } from '@/lib/animations'
import type { ContactTranslations } from '@/types'

interface ContactSectionProps {
  t: ContactTranslations
}

export function ContactSection({ t }: ContactSectionProps) {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden px-5 py-16 text-center sm:px-10 sm:py-20 md:px-20 md:py-[120px]"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '900px',
          height: '500px',
          background:
            'radial-gradient(ellipse, rgba(112,0,255,0.09) 0%, rgba(255,92,0,0.05) 50%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />

      {/* Horizontal rule */}
      <div
        aria-hidden="true"
        className="mx-auto mb-12 h-px max-w-[1200px] md:mb-20"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)',
        }}
      />

      <MotionWrapper
        variants={fadeInUp}
        className="relative z-10 mx-auto max-w-[820px]"
      >
        {/* Eyebrow pill */}
        <div className="mb-8 flex justify-center">
          <SectionLabel text={t.pill} />
        </div>

        {/* Headline */}
        <h2
          id="contact-heading"
          className="gradient-text m-0 mb-5 text-[34px] font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-[48px] md:text-[68px] md:leading-[1.04] md:tracking-[-0.042em]"
        >
          {t.headline}
        </h2>

        {/* Sub-copy */}
        <p
          className="m-0 mb-[60px] text-[17px] leading-[1.65] tracking-[-0.005em]"
          style={{ color: 'var(--muted-sm)' }}
        >
          {t.subtext}
        </p>

        {/* Contact card */}
        <ContactCard t={t} />

        {/* Footer */}
        <p className="mt-[72px] text-[13px] tracking-[-0.01em]" style={{ color: 'rgba(237,237,237,0.18)' }}>
          {t.footer}
        </p>
      </MotionWrapper>
    </section>
  )
}
