"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Code2,
  Lightbulb,
  Users,
  Plug,
  Search,
  Shield,
} from "lucide-react";
import config from "../../../site.config.json";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  Lightbulb,
  Users,
  Plug,
  Search,
  Shield,
};

export function Services() {
  return (
    <section id="services" className="py-24 sm:py-32 relative">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {config.services.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {config.services.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {config.services.items.map((service, index) => {
            const Icon = iconMap[service.icon] || Code2;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl hover:shadow-red-500/10 border border-red-500/30 hover:border-red-500 transition-all duration-300 group relative overflow-hidden">
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardHeader className="relative">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500/10 to-red-500/5 flex items-center justify-center mb-4 group-hover:from-red-500/20 group-hover:to-red-500/10 transition-all duration-300 border border-red-500/20 group-hover:border-red-500/40">
                      <Icon className="h-6 w-6 text-red-500" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-red-500 transition-colors duration-300">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
