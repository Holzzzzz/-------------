"use client";

import { motion } from "framer-motion";
import config from "../../../site.config.json";

export function Process() {
  return (
    <section id="process" className="py-24 sm:py-32 bg-muted/30 relative">
      {/* Decorative borders */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {config.process.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {config.process.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {config.process.steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              className="relative pt-20 group"
            >
              {/* Step number badge */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-red-500 text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-red-500/30 z-10">
                {step.number}
              </div>
              <div className="relative">
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-red-500 transition-colors duration-300 text-center relative inline-block">
                  {step.title}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full" />
                </h3>
                <p className="text-muted-foreground leading-relaxed text-center">
                  {step.description}
                </p>
              </div>

              {/* Connector line for desktop */}
              {index < config.process.steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-[calc(50%+28px)] w-[calc(100%-56px)] h-0.5 bg-gradient-to-r from-red-500/40 to-transparent">
                  <div className="absolute right-0 -top-1 w-2 h-2 rounded-full bg-red-500" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
