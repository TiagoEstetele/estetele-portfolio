import { Wifi, MapPin, Cpu, Send, ArrowDown } from 'lucide-react'
import { FloatingBadge } from '@/components/ui/FloatingBadge'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { MotionWrapper } from '@/components/ui/MotionWrapper'
import { fadeInUp } from '@/lib/animations'
import type { HeroTranslations } from '@/types'

interface HeroSectionProps {
  t: HeroTranslations
}

export function HeroSection({ t }: HeroSectionProps) {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[700px] flex-col items-center justify-center overflow-hidden px-5 py-20 sm:min-h-[820px] sm:px-10 sm:py-[100px] md:min-h-[940px] md:px-20 md:py-[120px]"
    >
      {/* Dot-grid background */}
      <div className="dot-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* Eclipse radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          top: '42%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1100px',
          height: '560px',
          background:
            'radial-gradient(ellipse at center, rgba(112,0,255,0.14) 0%, rgba(255,92,0,0.07) 45%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Ambient violet top-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          top: '-120px',
          left: '-80px',
          width: '520px',
          height: '520px',
          background: 'radial-gradient(ellipse, rgba(112,0,255,0.09) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />

      {/* Ambient tangerine bottom-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          bottom: '-60px',
          right: '-60px',
          width: '440px',
          height: '440px',
          background: 'radial-gradient(ellipse, rgba(255,92,0,0.08) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />

      {/* Floating Badges — hidden on mobile, visible on md+ */}
      <FloatingBadge
        icon={<Wifi size={14} />}
        text={t.badgeRemote}
        animationClass="float-a"
        className="hidden md:flex"
        style={{ top: '172px', left: '160px' }}
      />
      <FloatingBadge
        icon={<MapPin size={14} />}
        text={t.badgeLocation}
        animationClass="float-b"
        className="hidden md:flex"
        style={{ top: '390px', right: '140px' }}
      />
      <FloatingBadge
        icon={<Cpu size={14} />}
        text={t.badgeAi}
        animationClass="float-c"
        variant="violet"
        className="hidden md:flex"
        style={{ bottom: '220px', left: '130px' }}
      />

      {/* Central content */}
      <MotionWrapper
        variants={fadeInUp}
        className="relative z-10 flex w-full max-w-[880px] flex-col items-center gap-6 text-center md:gap-7"
      >
        {/* Eyebrow */}
        <SectionLabel text={t.eyebrow} withDot />

        {/* Headline */}
        <h1
          id="hero-heading"
          className="gradient-text m-0 text-[38px] font-extrabold leading-[1.08] tracking-[-0.035em] sm:text-[52px] md:text-[68px] md:leading-[1.04] md:tracking-[-0.042em] lg:text-[76px]"
        >
          {t.headline}
        </h1>

        {/* Sub-copy */}
        <p
          className="m-0 max-w-full text-base font-normal leading-[1.72] tracking-[-0.005em] sm:max-w-[520px] sm:text-lg md:max-w-[580px]"
          style={{ color: 'var(--muted)' }}
        >
          {t.subtextBefore}{' '}
          <span className="font-medium" style={{ color: 'rgba(237,237,237,0.85)' }}>
            {t.subtextTechs}
          </span>{' '}
          {t.subtextAnd}{' '}
          <span className="font-medium" style={{ color: 'rgba(237,237,237,0.85)' }}>
            {t.subtextStrapi}
          </span>
          {t.subtextAfter}
        </p>

        {/* CTAs */}
        <div className="mt-1 flex w-full flex-col items-center gap-3 sm:mt-2 sm:w-auto sm:flex-row sm:gap-3.5">
          <a
            href="#contact"
            className="cta-primary inline-flex w-full items-center justify-center gap-2.5 rounded-full px-[30px] py-[15px] text-[15px] font-semibold tracking-[-0.015em] sm:w-auto"
            style={{
              background: '#ededed',
              color: '#0a0a0a',
              fontFamily: 'inherit',
            }}
          >
            <Send size={15} aria-hidden="true" />
            {t.ctaContact}
          </a>
          <a
            href="#technologies"
            className="cta-secondary inline-flex w-full items-center justify-center gap-2.5 rounded-full px-[30px] py-[15px] text-[15px] font-medium tracking-[-0.015em] sm:w-auto"
            style={{
              background: 'transparent',
              color: 'rgba(237,237,237,0.85)',
              border: '1px solid rgba(237,237,237,0.18)',
              fontFamily: 'inherit',
            }}
          >
            {t.ctaStack}
            <ArrowDown size={14} style={{ color: 'rgba(237,237,237,0.4)' }} aria-hidden="true" />
          </a>
        </div>
      </MotionWrapper>

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-[120px]"
        style={{ background: 'linear-gradient(to bottom, transparent, #0a0a0a)' }}
      />
    </section>
  )
}
