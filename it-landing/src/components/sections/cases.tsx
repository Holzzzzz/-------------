"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import Image from "next/image";
import config from "../../../site.config.json";

function PartnerLogo({ src, alt }: { src?: string; alt: string }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="w-10 h-10 rounded-md bg-gradient-to-br from-red-500/10 to-red-500/5 flex items-center justify-center border border-red-500/20 group-hover:border-red-500/40 transition-all duration-300">
        <Building2 className="h-5 w-5 text-red-500" />
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-red-500/10 to-red-500/5 flex items-center justify-center border border-red-500/20 group-hover:border-red-500/40 transition-all duration-300 overflow-hidden">
      <Image
        src={src}
        alt={alt}
        width={40}
        height={40}
        className="object-contain p-1"
        onError={() => setError(true)}
      />
    </div>
  );
}

export function Cases() {
  return (
    <section id="cases" className="py-24 sm:py-32 relative">
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
            {config.cases.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {config.cases.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {config.cases.partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full border border-red-500/30 hover:border-red-500 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 group relative overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardContent className="pt-6 relative">
                  <div className="flex items-center gap-3 mb-3">
                    <PartnerLogo src={partner.logo} alt={partner.name} />
                    {partner.brandColor ? (
                      <div className="relative">
                        <h3 className="text-lg font-semibold text-foreground transition-opacity duration-300 group-hover:opacity-0">
                          {partner.name}
                        </h3>
                        <h3
                          className="text-lg font-semibold absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: `linear-gradient(90deg, ${partner.brandColor[0]}, ${partner.brandColor[1]})`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {partner.name}
                        </h3>
                      </div>
                    ) : (
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-red-500 transition-colors duration-300">
                        {partner.name}
                      </h3>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {partner.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
