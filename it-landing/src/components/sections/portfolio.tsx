"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FolderOpen, ImageOff } from "lucide-react";
import Image from "next/image";

/* ============================================================
   Компонент изображения с fallback
   ============================================================ */
function ProjectImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground">
        <ImageOff className="h-10 w-10 mb-2 opacity-50" />
        <span className="text-xs">Добавьте изображение</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover transition-transform duration-500 group-hover:scale-105"
      sizes="400px"
      onError={() => setError(true)}
    />
  );
}

/* ============================================================
   ПРОЕКТЫ — заполняйте вручну: замените пути в массиве projects
   ============================================================ */
const projects = [
  {
    id: 1,
    title: "Корпоративный портал",
    description: "Разработка внутренней CRM-системы для крупного ритейлера",
    image: "/images/project-1.jpg",
  },
  {
    id: 2,
    title: "Мобильное приложение",
    description: "iOS и Android приложение для сервиса доставки",
    image: "/images/project-2.jpg",
  },
  {
    id: 3,
    title: "E-commerce платформа",
    description: "Масштабируемый маркетплейс с интеграцией платежей",
    image: "/images/project-3.jpg",
  },
  {
    id: 4,
    title: "Система аналитики",
    description: "Dashboard для real-time мониторинга бизнес-метрик",
    image: "/images/project-4.jpg",
  },
  {
    id: 5,
    title: "Интеграция ERP",
    description: "Связка 1C, SAP и внешних сервисов в единую экосистему",
    image: "/images/project-5.jpg",
  },
  {
    id: 6,
    title: "AI-ассистент для банка",
    description: "Интеллектуальный чат-бот для поддержки клиентов с NLP",
    image: "/images/project-6.jpg",
    tech: "Python, TensorFlow, FastAPI, React, PostgreSQL, Docker",
  },
];



/* ============================================================
   МЕТРИКИ — редактируйте значения при необходимости
   ============================================================ */
const stats = [
  { label: "Выполненных заказов", value: 127, suffix: "+" },
  { label: "Средняя цена заказа", value: 850, suffix: "K ₽", prefix: "" },
  { label: "Довольных клиентов", value: 98, suffix: "%" },
  { label: "Успешных проектов", value: 100, suffix: "%" },
];

/* ============================================================
   Хук: анимированный счётчик
   ============================================================ */
function useCountUp(
  target: number,
  duration: number = 2000,
  startOnView: boolean = true
) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted, startOnView]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number | null = null;
    let rafId: number;

    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = easeOutQuart(progress);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [hasStarted, target, duration]);

  return { count, ref };
}

/* ============================================================
   Компонент: карточка статистики
   ============================================================ */
function StatCard({
  label,
  value,
  suffix,
  prefix,
  delay,
}: {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  delay: number;
}) {
  const { count, ref } = useCountUp(value, 2000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      ref={ref}
      className="relative group"
    >
      <div className="text-center p-8 rounded-2xl border border-red-500/20 bg-background hover:border-red-500/50 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300">
        <div className="flex items-baseline justify-center min-h-[3.5rem] sm:min-h-[4.5rem] mb-2">
          <span className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight leading-none tabular-nums">
            {prefix}{count}
          </span>
          <span className="text-4xl sm:text-5xl font-bold text-red-500 tracking-tight leading-none ml-1">
            {suffix}
          </span>
        </div>
        <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
          {label}
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   Карусель: десктоп — CSS marquee, мобильные — JS autoplay + drag
   ============================================================ */
function CarouselTrack({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobileRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkMobile = () => {
      isMobileRef.current = window.innerWidth < 768;
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Автопрокрутка на всех устройствах через requestAnimationFrame
    const speed = 1.2;
    const autoScroll = () => {
      if (!isDraggingRef.current && container) {
        container.scrollLeft += speed;
        // Бесшовный цикл: когда дошли до середины (дубль), сбрасываем на начало
        const half = container.scrollWidth / 2;
        if (container.scrollLeft >= half - 10) {
          container.scrollLeft = 0;
        }
      }
      rafRef.current = requestAnimationFrame(autoScroll);
    };
    rafRef.current = requestAnimationFrame(autoScroll);

    // Touch drag — только на мобильных
    const onTouchStart = (e: TouchEvent) => {
      if (!isMobileRef.current) return;
      isDraggingRef.current = true;
      startXRef.current = e.touches[0].clientX;
      scrollLeftRef.current = container.scrollLeft;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isMobileRef.current || !isDraggingRef.current) return;
      e.preventDefault();
      const delta = startXRef.current - e.touches[0].clientX;
      container.scrollLeft = scrollLeftRef.current + delta;
    };

    const onTouchEnd = () => {
      if (!isMobileRef.current) return;
      isDraggingRef.current = false;
    };

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("resize", checkMobile);
      cancelAnimationFrame(rafRef.current);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="overflow-x-auto md:overflow-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="flex w-max">
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   Компонент: секция Portfolio
   ============================================================ */
export function Portfolio() {
  return (
    <section id="portfolio" className="py-24 sm:py-32 relative bg-muted/30 overflow-hidden">
      {/* Декоративные границы */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium text-muted-foreground mb-6">
            <FolderOpen className="h-4 w-4 text-red-500" />
            <span>Наши работы</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Портфолио проектов
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Реальные кейсы, которые демонстрируют наш опыт и подход к работе
          </p>
        </motion.div>
      </div>

      {/* ===== Карусель ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        className="relative mb-24 group/marquee"
      >
        {/* Fade masks по краям — только на десктопе */}
        <div className="hidden md:block pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-32 bg-gradient-to-r from-muted/30 to-transparent z-10" />
        <div className="hidden md:block pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-32 bg-gradient-to-l from-muted/30 to-transparent z-10" />

        <CarouselTrack>
          {/* Первый набор */}
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[380px] mx-2 sm:mx-3"
            >
              <div className="group relative overflow-hidden rounded-2xl border border-red-500/20 hover:border-red-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10 bg-background">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <ProjectImage src={project.image} alt={project.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-red-500 transition-colors duration-300 mb-2 relative inline-block">
                    {project.title}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full" />
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {/* Дублированный набор для бесшовности */}
          {projects.map((project) => (
            <div
              key={`dup-${project.id}`}
              className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[380px] mx-2 sm:mx-3"
            >
              <div className="group relative overflow-hidden rounded-2xl border border-red-500/20 hover:border-red-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10 bg-background">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <ProjectImage src={project.image} alt={project.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-red-500 transition-colors duration-300 mb-2 relative inline-block">
                    {project.title}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full" />
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CarouselTrack>
      </motion.div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Статистика */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Наши показатели
          </h3>
          <p className="mt-3 text-muted-foreground">
            Цифры, которые говорят сами за себя
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              prefix={stat.prefix}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
