"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  delay?: number;
}

const Testimonial: React.FC<TestimonialProps> = ({
  quote,
  author,
  role,
  company,
  rating,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-5 w-5",
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            )}
          />
        ))}
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-6 italic">&ldquo;{quote}&rdquo;</p>
      <div className="mt-auto">
        <p className="font-semibold text-gray-900 dark:text-white">{author}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {role}, {company}
        </p>
      </div>
    </motion.div>
  );
};

export function TestimonialsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const testimonials = [
    {
      quote: "QORE has revolutionized our hiring process. The AI-powered matching has helped us find candidates that perfectly fit our company culture and job requirements.",
      author: "Sarah Johnson",
      role: "HR Director",
      company: "TechGrowth Inc.",
      rating: 5,
    },
    {
      quote: "The profit optimization feature has been a game-changer for our recruitment agency. We've increased our margins by 30% while still offering competitive rates to candidates.",
      author: "Michael Chen",
      role: "CEO",
      company: "Elite Staffing Solutions",
      rating: 5,
    },
    {
      quote: "I was skeptical about AI in recruitment, but QORE proved me wrong. The resume parsing is incredibly accurate and has saved our team countless hours of manual screening.",
      author: "Jessica Williams",
      role: "Talent Acquisition Manager",
      company: "Innovate Partners",
      rating: 4,
    },
    {
      quote: "The analytics dashboard gives us insights we never had before. We can now make data-driven decisions about our recruitment strategy and continuously improve our process.",
      author: "David Rodriguez",
      role: "Operations Director",
      company: "Global Talent Network",
      rating: 5,
    },
    {
      quote: "QORE has helped us reduce our time-to-hire by 40%. The automated workflow and candidate matching have streamlined our entire recruitment process.",
      author: "Emily Thompson",
      role: "Recruitment Lead",
      company: "Future Innovations",
      rating: 4,
    },
    {
      quote: "The customer support team at QORE is exceptional. They've been responsive and helpful throughout our implementation and beyond.",
      author: "Robert Kim",
      role: "IT Manager",
      company: "Nexus Solutions",
      rating: 5,
    },
  ];

  return (
    <section 
      ref={containerRef}
      className="py-20 relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
    >
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-recruit-primary/5 via-transparent to-recruit-secondary/5 blur-xl"
        style={{ opacity, y }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-recruit-primary to-recruit-secondary">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover how QORE has transformed recruitment processes for companies worldwide.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              company={testimonial.company}
              rating={testimonial.rating}
              delay={index * 0.1}
            />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-8 w-8 text-yellow-400 fill-yellow-400"
                />
              ))}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              4.9 out of 5 stars
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Based on 500+ reviews from satisfied clients
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
