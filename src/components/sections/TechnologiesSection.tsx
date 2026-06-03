import {
  LayoutTemplate,
  Server,
  Database,
  DatabaseZap,
  Terminal,
  Bot,
} from 'lucide-react'
import { TechCard } from '@/components/ui/TechCard'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { MotionWrapper } from '@/components/ui/MotionWrapper'
import { stagger, scaleIn, fadeInUp } from '@/lib/animations'
import { TECH_CATEGORIES } from '@/lib/tech-data'
import type { TechTranslations, TechCategoryId } from '@/types'
import type { LucideIcon } from 'lucide-react'

interface TechnologiesSectionProps {
  t: TechTranslations
}

const iconMap: Record<TechCategoryId, LucideIcon> = {
  frontend: LayoutTemplate,
  backend: Server,
  cms: Database,
  database: DatabaseZap,
  devops: Terminal,
  ai: Bot,
}

export function TechnologiesSection({ t }: TechnologiesSectionProps) {
  return (
    <section
      id="technologies"
      aria-labelledby="tech-heading"
      className="mx-auto box-border max-w-[1440px] px-5 py-16 sm:px-10 sm:py-20 md:px-20 md:py-[120px]"
    >
      {/* Section header */}
      <MotionWrapper variants={fadeInUp} className="mb-12 text-center md:mb-[72px]">
        <div className="mb-6 flex justify-center">
          <SectionLabel text={t.pill} />
        </div>
        <h2
          id="tech-heading"
          className="m-0 mb-3.5 text-[30px] font-bold leading-[1.1] tracking-[-0.03em] sm:text-[38px] md:text-[50px] md:tracking-[-0.035em]"
          style={{ color: '#ededed' }}
        >
          {t.heading}
        </h2>
        <p
          className="mx-auto max-w-[460px] text-[15px] leading-[1.65] md:text-base"
          style={{ color: 'var(--muted-sm)' }}
        >
          {t.subtext}
        </p>
      </MotionWrapper>

      {/* Bento grid — 1 col mobile, 2 col tablet, 3 col desktop */}
      <MotionWrapper
        variants={stagger}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-3"
        amount={0.1}
      >
        {TECH_CATEGORIES.map((category, index) => {
          const Icon = iconMap[category.id]
          const catT = t.categories[category.id]

          return (
            <MotionWrapper key={category.id} variants={scaleIn} delay={index * 0.05}>
              <TechCard
                category={category}
                name={catT.name}
                subtitle={catT.sub}
                icon={<Icon size={18} aria-hidden="true" />}
              />
            </MotionWrapper>
          )
        })}
      </MotionWrapper>
    </section>
  )
}
