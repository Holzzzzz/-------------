"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles } from "lucide-react";
import config from "../../../site.config.json";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium text-muted-foreground mb-8"
        >
          <Sparkles className="h-4 w-4" />
          <span>{config.company.tagline}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl mx-auto leading-tight"
        >
          {config.hero.title.split(" ").map((word, i) => (
            <span key={i}>
              {i === 2 ? (
                <span className="text-gradient">{word}</span>
              ) : (
                word
              )}
              {" "}
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto sm:text-xl"
        >
          {config.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button size="lg" className="w-full sm:w-auto bg-red-500 hover:bg-red-600 glow-red transition-all duration-300" onClick={() => {
            document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            {config.hero.ctaPrimary}
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-red-500/30 hover:border-red-500 hover:bg-red-500/10 text-foreground transition-all duration-300" onClick={() => {
            document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            {config.hero.ctaSecondary}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 animate-bounce"
        >
          <a href="#services" aria-label="Scroll to services">
            <ArrowDown className="h-6 w-6 mx-auto text-muted-foreground" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
