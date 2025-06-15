"use client";

import { motion } from "framer-motion";
import { Circle, Cpu, FileText, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function FloatingElement({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

function FeatureIcon({
  icon: Icon,
  gradient,
  delay,
}: {
  icon: React.ElementType;
  gradient: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
      }}
      className={cn(
        "flex items-center justify-center rounded-full p-3",
        "bg-gradient-to-r to-transparent",
        gradient,
        "backdrop-blur-[2px] border border-white/[0.15]",
        "shadow-[0_4px_16px_0_rgba(255,255,255,0.1)]"
      )}
    >
      <Icon className="h-6 w-6 text-white" />
    </motion.div>
  );
}

interface TalentSparkHeroProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  description?: string;
}

export function TalentSparkHero({
  badge = "TalentPulse-Powered Recruitment Engine",
  title = "QORE",
  subtitle = "The Core of Recruitment Excellence",
  description = "Our intelligent platform streamlines your hiring process with advanced resume parsing, precise candidate matching, and profit optimization.",
}: TalentSparkHeroProps) {
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]">
      <div className="absolute inset-0 bg-gradient-to-br from-recruit-primary/[0.05] via-transparent to-recruit-secondary/[0.05] blur-3xl" />

      <div className="absolute inset-0 overflow-hidden">
        <FloatingElement
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-recruit-primary/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />

        <FloatingElement
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-recruit-secondary/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />

        <FloatingElement
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-violet-400/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />

        <FloatingElement
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-indigo-600/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />

        <FloatingElement
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-blue-500/[0.15]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            custom={0}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 md:mb-12"
          >
            <Circle className="h-2 w-2 fill-recruit-primary/80" />
            <span className="text-sm text-white/60 tracking-wide">
              {badge}
            </span>
          </motion.div>

          <motion.div
            custom={1}
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-2 md:mb-4 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                {title}
              </span>
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8 tracking-tight">
              <span
                className={cn(
                  "bg-clip-text text-transparent bg-gradient-to-r from-recruit-primary via-recruit-secondary to-recruit-tertiary"
                )}
              >
                {subtitle}
              </span>
            </h2>
          </motion.div>

          <motion.div
            custom={2}
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-base sm:text-lg md:text-xl text-white/40 mb-8 leading-relaxed font-light tracking-wide max-w-2xl mx-auto px-4">
              {description}
            </p>
          </motion.div>

          <motion.div
            custom={3}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <Link to="/login">
              <Button
                size="lg"
                className="bg-gradient-to-r from-recruit-primary via-recruit-secondary to-recruit-tertiary text-white hover:opacity-90 transition-opacity"
              >
                Get Started
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-white/10 text-white/80 hover:bg-white/5"
            >
              Book a Demo
            </Button>
          </motion.div>

          <motion.div
            custom={4}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            <div className="flex flex-col items-center gap-3 p-4 rounded-lg bg-white/[0.03] border border-white/[0.08]">
              <FeatureIcon
                icon={FileText}
                gradient="from-recruit-primary/[0.2]"
                delay={1.2}
              />
              <h3 className="text-lg font-medium text-white/90">Resume Parsing</h3>
              <p className="text-sm text-white/60">Extract key information from resumes automatically</p>
            </div>

            <div className="flex flex-col items-center gap-3 p-4 rounded-lg bg-white/[0.03] border border-white/[0.08]">
              <FeatureIcon
                icon={Cpu}
                gradient="from-recruit-secondary/[0.2]"
                delay={1.4}
              />
              <h3 className="text-lg font-medium text-white/90">Candidate Matching</h3>
              <p className="text-sm text-white/60">Find the perfect fit with TalentPulse-powered matching</p>
            </div>

            <div className="flex flex-col items-center gap-3 p-4 rounded-lg bg-white/[0.03] border border-white/[0.08]">
              <FeatureIcon
                icon={PieChart}
                gradient="from-recruit-tertiary/[0.2]"
                delay={1.6}
              />
              <h3 className="text-lg font-medium text-white/90">Profit Optimization</h3>
              <p className="text-sm text-white/60">Maximize ROI with data-driven insights</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
    </div>
  );
}
