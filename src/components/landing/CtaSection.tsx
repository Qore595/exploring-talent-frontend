"use client";

import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export function CtaSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const features = [
    "AI-powered candidate matching",
    "Intelligent resume parsing",
    "Profit optimization tools",
    "Comprehensive analytics dashboard",
    "Automated workflow management",
    "Secure data handling",
  ];

  return (
    <section
      ref={containerRef}
      className="py-20 relative overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-recruit-primary/10 to-recruit-secondary/10 blur-xl"
        style={{ opacity, y }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="p-8 md:p-12 flex flex-col justify-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-recruit-primary to-recruit-secondary">
                Ready to Transform Your Recruitment Process?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Join hundreds of companies already using QORE to streamline their hiring process, find better candidates, and optimize their recruitment budget.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center"
                  >
                    <CheckCircle2 className="h-5 w-5 text-recruit-primary mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-recruit-primary to-recruit-secondary text-white hover:opacity-90 transition-opacity w-full"
                  >
                    Get Started Now
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-recruit-primary text-recruit-primary hover:bg-recruit-primary/5 w-full"
                >
                  Schedule a Demo
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative hidden md:block"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-recruit-primary/20 to-recruit-secondary/20" />
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Modern office workspace"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <p className="text-white font-medium">
                    "QORE has helped us reduce our time-to-hire by 40% while improving the quality of our candidates."
                  </p>
                  <p className="text-white/80 text-sm mt-2">
                    — HR Director, Fortune 500 Company
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
