"use client";

import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion, useAnimate, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileText, Users, PieChart, Zap, Brain, Target, BarChart3, Briefcase } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  index?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  className,
  index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(155, 135, 245, 0.2)" }}
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-background p-6 shadow-sm transition-all duration-200 hover:shadow-md",
        className
      )}
    >
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-recruit-primary/10 opacity-70" />
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-recruit-primary/10 text-recruit-primary">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
};

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}

function hexToRgb(hex: string): number[] {
  hex = hex.replace("#", "");
  const hexInt = parseInt(hex, 16);
  const red = (hexInt >> 16) & 255;
  const green = (hexInt >> 8) & 255;
  const blue = hexInt & 255;
  return [red, green, blue];
}

const Particles: React.FC<ParticlesProps> = ({
  className = "",
  quantity = 30,
  staticity = 50,
  ease = 50,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = React.useRef<HTMLDivElement>(null);
  const context = React.useRef<CanvasRenderingContext2D | null>(null);
  const circles = React.useRef<any[]>([]);
  const mousePosition = useMousePosition();
  const mouse = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = React.useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

  React.useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();
    window.addEventListener("resize", initCanvas);

    return () => {
      window.removeEventListener("resize", initCanvas);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    onMouseMove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mousePosition.x, mousePosition.y]);

  React.useEffect(() => {
    initCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  const initCanvas = () => {
    resizeCanvas();
    drawParticles();
  };

  const onMouseMove = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = mousePosition.x - rect.left - w / 2;
      const y = mousePosition.y - rect.top - h / 2;
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    }
  };

  type Circle = {
    x: number;
    y: number;
    translateX: number;
    translateY: number;
    size: number;
    alpha: number;
    targetAlpha: number;
    dx: number;
    dy: number;
    magnetism: number;
  };

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current.length = 0;
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);
    }
  };

  const circleParams = (): Circle => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const translateX = 0;
    const translateY = 0;
    const size = Math.floor(Math.random() * 2) + 1;
    const alpha = 0;
    const targetAlpha = parseFloat((Math.random() * 0.3 + 0.1).toFixed(1));
    const dx = (Math.random() - 0.5) * 0.2;
    const dy = (Math.random() - 0.5) * 0.2;
    const magnetism = 0.1 + Math.random() * 4;
    return {
      x,
      y,
      translateX,
      translateY,
      size,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
    };
  };

  const rgb = hexToRgb(color);

  const drawCircle = (circle: Circle, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha } = circle;
      context.current.translate(translateX, translateY);
      context.current.beginPath();
      context.current.arc(x, y, size, 0, 2 * Math.PI);
      context.current.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
      context.current.fill();
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        circles.current.push(circle);
      }
    }
  };

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(
        0,
        0,
        canvasSize.current.w,
        canvasSize.current.h
      );
    }
  };

  const drawParticles = () => {
    clearContext();
    const particleCount = quantity;
    for (let i = 0; i < particleCount; i++) {
      const circle = circleParams();
      drawCircle(circle);
    }
  };

  const remapValue = (
    value: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number
  ): number => {
    const remapped =
      ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return remapped > 0 ? remapped : 0;
  };

  const animate = () => {
    clearContext();
    circles.current.forEach((circle: Circle, i: number) => {
      // Handle the alpha value
      const edge = [
        circle.x + circle.translateX - circle.size, // distance from left edge
        canvasSize.current.w - circle.x - circle.translateX - circle.size, // distance from right edge
        circle.y + circle.translateY - circle.size, // distance from top edge
        canvasSize.current.h - circle.y - circle.translateY - circle.size, // distance from bottom edge
      ];
      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapClosestEdge = parseFloat(
        remapValue(closestEdge, 0, 20, 0, 1).toFixed(2)
      );
      if (remapClosestEdge > 1) {
        circle.alpha += 0.02;
        if (circle.alpha > circle.targetAlpha) {
          circle.alpha = circle.targetAlpha;
        }
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge;
      }
      circle.x += circle.dx + vx;
      circle.y += circle.dy + vy;
      circle.translateX +=
        (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
        ease;
      circle.translateY +=
        (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
        ease;
      // circle gets out of the canvas
      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size
      ) {
        // remove the circle from the array
        circles.current.splice(i, 1);
        // create a new circle
        const newCircle = circleParams();
        drawCircle(newCircle);
        // update the circle position
      } else {
        drawCircle(
          {
            ...circle,
            x: circle.x,
            y: circle.y,
            translateX: circle.translateX,
            translateY: circle.translateY,
            alpha: circle.alpha,
          },
          true
        );
      }
    });
    window.requestAnimationFrame(animate);
  };

  return (
    <div className={className} ref={canvasContainerRef} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
};

function useMousePosition(): { x: number; y: number } {
  const [mousePosition, setMousePosition] = React.useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });

  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return mousePosition;
}

interface HighlighterItemProps {
  children: React.ReactNode;
  className?: string;
}

const HighlighterItem: React.FC<React.PropsWithChildren<HighlighterItemProps>> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`relative overflow-hidden p-px before:pointer-events-none before:absolute before:-left-48 before:-top-48 before:z-30 before:h-96 before:w-96 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-recruit-primary before:opacity-0 before:blur-[100px] before:transition-opacity before:duration-500 after:absolute after:inset-0 after:z-10 after:rounded-3xl after:opacity-0 after:transition-opacity after:duration-500 before:hover:opacity-20 after:group-hover:opacity-100 ${className}`}
    >
      {children}
    </div>
  );
};

interface HighlightGroupProps {
  children: React.ReactNode;
  className?: string;
  refresh?: boolean;
}

const HighlightGroup: React.FC<HighlightGroupProps> = ({
  children,
  className = "",
  refresh = false,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition();
  const mouse = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerSize = React.useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const [boxes, setBoxes] = React.useState<HTMLElement[]>([]);

  React.useEffect(() => {
    containerRef.current &&
      setBoxes(
        Array.from(containerRef.current.children).map(
          (el) => el as HTMLElement
        )
      );
  }, []);

  React.useEffect(() => {
    initContainer();
    window.addEventListener("resize", initContainer);

    return () => {
      window.removeEventListener("resize", initContainer);
    };
  }, [setBoxes]);

  React.useEffect(() => {
    onMouseMove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mousePosition]);

  React.useEffect(() => {
    initContainer();
  }, [refresh]);

  const initContainer = () => {
    if (containerRef.current) {
      containerSize.current.w = containerRef.current.offsetWidth;
      containerSize.current.h = containerRef.current.offsetHeight;
    }
  };

  const onMouseMove = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const { w, h } = containerSize.current;
      const x = mousePosition.x - rect.left;
      const y = mousePosition.y - rect.top;
      const inside = x < w && x > 0 && y < h && y > 0;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
        boxes.forEach((box) => {
          const boxX =
            -(box.getBoundingClientRect().left - rect.left) + mouse.current.x;
          const boxY =
            -(box.getBoundingClientRect().top - rect.top) + mouse.current.y;
          box.style.setProperty("--mouse-x", `${boxX}px`);
          box.style.setProperty("--mouse-y", `${boxY}px`);
        });
      }
    }
  };

  return (
    <div className={className} ref={containerRef}>
      {children}
    </div>
  );
};

export function EnhancedFeatures() {
  const [scope, animate] = useAnimate();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100]);

  React.useEffect(() => {
    animate(
      [
        ["#pointer", { left: 200, top: 60 }, { duration: 0 }],
        ["#resume-parsing", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: 50, top: 102 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#resume-parsing", { opacity: 0.4 }, { at: "-0.3", duration: 0.1 }],
        ["#candidate-matching", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: 224, top: 170 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#candidate-matching", { opacity: 0.4 }, { at: "-0.3", duration: 0.1 }],
        ["#profit-optimization", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: 88, top: 198 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#profit-optimization", { opacity: 0.4 }, { at: "-0.3", duration: 0.1 }],
        ["#ai-powered", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: 200, top: 60 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#ai-powered", { opacity: 0.5 }, { at: "-0.3", duration: 0.1 }],
      ],
      {
        repeat: Number.POSITIVE_INFINITY,
      }
    );
  }, [animate]);

  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Resume Parsing",
      description: "Automatically extract and analyze candidate information from resumes with our advanced AI parsing technology.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Candidate Matching",
      description: "Match candidates to job requirements with precision using our intelligent matching algorithms.",
    },
    {
      icon: <PieChart className="h-6 w-6" />,
      title: "Profit Optimization",
      description: "Optimize your recruitment budget and maximize ROI with data-driven insights and recommendations.",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "TalentPulse-Powered Insights",
      description: "Gain valuable insights into your recruitment process with our TalentPulse-powered analytics dashboard.",
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Intelligent Screening",
      description: "Automate initial candidate screening with TalentPulse to save time and improve quality of hires.",
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Precision Targeting",
      description: "Target the right candidates with TalentPulse-powered job posting optimization and candidate sourcing.",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Performance Analytics",
      description: "Track and analyze recruitment performance metrics to continuously improve your hiring process.",
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Workflow Automation",
      description: "Streamline your recruitment workflow with automated scheduling, notifications, and follow-ups.",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden" ref={containerRef}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-recruit-primary/5 via-transparent to-recruit-secondary/5 blur-xl"
        style={{ opacity, y }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-recruit-primary to-recruit-secondary"
          >
            TalentPulse-Powered Recruitment
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto max-w-2xl text-muted-foreground"
          >
            QORE uses cutting-edge TalentPulse technology to streamline your recruitment process and find the perfect candidates faster.
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>

        <HighlightGroup className="group mt-16 h-full">
          <div className="group/item h-full">
            <HighlighterItem className="rounded-3xl p-6">
              <div className="relative z-20 h-full overflow-hidden rounded-3xl border border-border bg-background">
                <Particles
                  className="absolute inset-0 -z-10 opacity-10 transition-opacity duration-1000 ease-in-out group-hover/item:opacity-100"
                  quantity={200}
                  color={"#9b87f5"}
                  vy={-0.2}
                />
                <div className="flex justify-center">
                  <div className="flex h-full flex-col justify-center gap-10 p-4 md:h-[300px] md:flex-row">
                    <div
                      className="relative mx-auto h-[270px] w-[300px] md:h-[270px] md:w-[300px]"
                      ref={scope}
                    >
                      <Zap className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-recruit-primary" />
                      <div
                        id="ai-powered"
                        className="absolute bottom-12 left-14 rounded-3xl border border-border bg-background/80 px-2 py-1.5 text-xs opacity-50"
                      >
                        AI-Powered
                      </div>
                      <div
                        id="candidate-matching"
                        className="absolute left-2 top-20 rounded-3xl border border-border bg-background/80 px-2 py-1.5 text-xs opacity-50"
                      >
                        Candidate Matching
                      </div>
                      <div
                        id="profit-optimization"
                        className="absolute bottom-20 right-1 rounded-3xl border border-border bg-background/80 px-2 py-1.5 text-xs opacity-50"
                      >
                        Profit Optimization
                      </div>
                      <div
                        id="resume-parsing"
                        className="absolute right-12 top-10 rounded-3xl border border-border bg-background/80 px-2 py-1.5 text-xs opacity-50"
                      >
                        Resume Parsing
                      </div>

                      <div id="pointer" className="absolute">
                        <svg
                          width="16.8"
                          height="18.2"
                          viewBox="0 0 12 13"
                          className="fill-recruit-primary"
                          stroke="white"
                          strokeWidth="1"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 5.50676L0 0L2.83818 13L6.30623 7.86537L12 5.50676V5.50676Z"
                          />
                        </svg>
                        <span className="relative -top-1 left-3 rounded-3xl bg-recruit-primary px-2 py-1 text-xs text-primary-foreground">
                          TalentPulse
                        </span>
                      </div>
                    </div>

                    <div className="flex h-full flex-col justify-center p-2 md:ml-10 md:w-[400px]">
                      <div className="flex flex-col items-center">
                        <h3 className="mt-6 pb-1 font-bold">
                          <span className="text-2xl md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-recruit-primary to-recruit-secondary">
                            Transform Your Recruitment
                          </span>
                        </h3>
                      </div>
                      <p className="mb-4 text-center text-muted-foreground">
                        Experience the power of AI-driven recruitment with QORE
                      </p>
                      <div className="flex justify-center">
                        <Link to="/login">
                          <Button className="bg-gradient-to-r from-recruit-primary to-recruit-secondary hover:opacity-90 text-white">
                            Get Started Today
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </HighlighterItem>
          </div>
        </HighlightGroup>
      </div>
    </section>
  );
}
