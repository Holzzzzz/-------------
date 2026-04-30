"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import config from "../../../site.config.json";

const formSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Введите корректный email"),
  phone: z.string().optional(),
  message: z.string().min(10, "Описание должно содержать минимум 10 символов"),
});

type FormData = z.infer<typeof formSchema>;

export function Contacts() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setSubmitError(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Ошибка отправки заявки");
      }

      setIsSubmitted(true);
      reset();
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка отправки";
      setSubmitError(message);
    }
  };

  return (
    <section id="contacts" className="py-24 sm:py-32 bg-muted/30 relative">
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
            {config.contacts.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {config.contacts.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/10 to-red-500/5 flex items-center justify-center shrink-0 border border-red-500/20">
                <Mail className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Email</h3>
                <a
                  href={`mailto:${config.company.email}`}
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                >
                  {config.company.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/10 to-red-500/5 flex items-center justify-center shrink-0 border border-red-500/20">
                <Phone className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Телефон</h3>
                <a
                  href={`tel:${config.company.phone.replace(/\s/g, "")}`}
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                >
                  {config.company.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/10 to-red-500/5 flex items-center justify-center shrink-0 border border-red-500/20">
                <MapPin className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Адрес</h3>
                <p className="text-muted-foreground">
                  {config.company.address}
                </p>
              </div>
            </div>

            {/* Socials */}
            <div className="pt-4">
              <h3 className="font-semibold text-foreground mb-3">Мы в соцсетях</h3>
              <div className="flex gap-3">
                {Object.entries(config.company.socials).map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-md bg-primary/10 text-sm font-medium text-primary hover:bg-primary/20 transition-colors capitalize group"
                  >
                    <span className="relative inline-block">
                      {key}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <Label htmlFor="name">
                  {config.contacts.form.nameLabel}
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  className="mt-1.5"
                  placeholder="Иван Иванов"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email">
                  {config.contacts.form.emailLabel}
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="mt-1.5"
                  placeholder="ivan@company.ru"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">
                  {config.contacts.form.phoneLabel}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  className="mt-1.5"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>

              <div>
                <Label htmlFor="message">
                  {config.contacts.form.messageLabel}
                </Label>
                <Textarea
                  id="message"
                  {...register("message")}
                  className="mt-1.5 min-h-[120px]"
                  placeholder="Расскажите о вашем проекте..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {submitError && (
                <p className="text-sm text-destructive text-center">
                  {submitError}
                </p>
              )}

              <Button
                type="submit"
                className="w-full text-white bg-red-500 hover:bg-red-600 glow-red transition-all duration-300 hover:scale-105 active:scale-95"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4 animate-pulse" />
                    Отправка...
                  </span>
                ) : isSubmitted ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    {config.contacts.form.successMessage}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    {config.contacts.form.submitLabel}
                  </span>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                {config.contacts.form.privacyText}
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
