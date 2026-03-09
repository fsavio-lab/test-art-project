import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Width of the animated gold rule in Tailwind units. Default: w-16 */
  ruleWidth?: string;
}

/**
 * Reusable animated page header.
 * Eyebrow → Title → Subtitle stagger in; a gold rule draws after.
 */
const PageHeader = ({ eyebrow, title, subtitle, ruleWidth = 'w-16' }: PageHeaderProps) => (
  <motion.div
    className="mb-16"
    variants={staggerContainer}
    initial="hidden"
    animate="show"
  >
    <motion.p
      variants={staggerItem}
      className="mb-2 font-body text-xs uppercase tracking-[0.4em] text-primary/60"
    >
      {eyebrow}
    </motion.p>

    <motion.h1
      variants={staggerItem}
      className="font-display text-5xl font-light text-foreground md:text-6xl"
    >
      {title}
    </motion.h1>

    {subtitle && (
      <motion.p
        variants={staggerItem}
        className="mt-4 max-w-xl font-body text-sm leading-relaxed text-muted-foreground"
      >
        {subtitle}
      </motion.p>
    )}

    {/* Animated gold rule */}
    <motion.div
      initial={{ scaleX: 0, originX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
      className={`mt-6 h-px bg-primary ${ruleWidth}`}
    />
  </motion.div>
);

export default PageHeader;
