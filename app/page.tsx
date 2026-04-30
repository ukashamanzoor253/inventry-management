// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  BarChart3,
  Users,
  Target,
  TrendingUp,
  Shield,
  Lightbulb,
  ChevronRight,
  Star,
  Quote,
  Briefcase,
  Globe,
  Award,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Results", href: "#results" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-md border-b border-gray-200"
          : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-white font-semibold text-lg">U</span>
            </div>

            <span
              className={`text-lg lg:text-xl font-semibold tracking-tight ${scrolled ? "text-gray-900" : "text-white"
                }`}
            >
              UKasha
              <span className="text-indigo-600 ml-1">Consultancy</span>
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`relative text-sm font-medium transition-colors ${scrolled ? "text-gray-700" : "text-white/90"
                  } hover:text-indigo-600`}
              >
                {link.label}

                {/* underline animation */}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}

            {/* CTA */}
            <a
              href="#contact"
              className="ml-4 px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-full hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md"
            >
              Book Consultation
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-lg ${scrolled ? "text-gray-900" : "text-white"
              }`}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-lg">
            <div className="px-6 py-6 space-y-5">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-gray-800 font-medium text-base hover:text-indigo-600 transition"
                >
                  {link.label}
                </a>
              ))}

              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-5 py-3 bg-indigo-600 text-white font-medium rounded-full shadow-sm"
              >
                Book Consultation
              </a>
            </div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── Hero Section ───────────────────────────────────────────
function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
          alt="Modern office"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-gray-900/70 to-purple-900/80" />
      </div>

      {/* Floating Shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-indigo-300 text-sm font-medium mb-8">
            <Star size={14} className="fill-current" />
            Trusted by 200+ businesses worldwide
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Transform Your Business
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              With Strategic Excellence
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            UKasha Consultancy delivers data-driven strategies, operational
            excellence, and sustainable growth solutions tailored to your unique
            business challenges.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#contact"
              className="group px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full transition-all hover:shadow-xl hover:shadow-indigo-500/30 flex items-center gap-2"
            >
              Schedule Free Consultation
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
            <a
              href="#services"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 transition-all"
            >
              Explore Services
            </a>
          </div>
        </div>

        {/* Stats Bar */}
        <div
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {[
            { value: "200+", label: "Clients Served" },
            { value: "95%", label: "Success Rate" },
            { value: "$50M+", label: "Revenue Generated" },
            { value: "15+", label: "Years Experience" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </div>
      </div>
    </section>
  );
}

// ─── Services Section ───────────────────────────────────────
function Services() {
  const services = [
    {
      icon: BarChart3,
      title: "Business Strategy",
      description:
        "Develop comprehensive roadmaps that align your vision with market opportunities and drive sustainable competitive advantage.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Target,
      title: "Digital Transformation",
      description:
        "Modernize operations with cutting-edge technology solutions that enhance efficiency, agility, and customer experience.",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: TrendingUp,
      title: "Growth Consulting",
      description:
        "Accelerate revenue with data-driven growth strategies, market expansion plans, and performance optimization frameworks.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Shield,
      title: "Risk Management",
      description:
        "Identify, assess, and mitigate business risks with robust frameworks that protect your assets and ensure compliance.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Users,
      title: "Leadership Development",
      description:
        "Build high-performing teams through executive coaching, talent strategy, and organizational culture transformation.",
      color: "from-orange-500 to-amber-500",
    },
    {
      icon: Lightbulb,
      title: "Innovation Advisory",
      description:
        "Foster innovation ecosystems that unlock new revenue streams, enhance product development, and future-proof your business.",
      color: "from-rose-500 to-red-500",
    },
  ];

  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-sm font-semibold rounded-full mb-4">
            Our Expertise
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Solutions That Drive <span className="text-indigo-600">Results</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We combine deep industry knowledge with analytical rigor to deliver
            transformative solutions across every aspect of your business.
          </p>
        </div>

        <div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative p-8 bg-gray-50 hover:bg-white rounded-2xl border border-gray-100 hover:border-indigo-100 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5"
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}
              >
                <service.icon className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                {service.description}
              </p>
              <a
                href="#contact"
                className="inline-flex items-center text-indigo-600 font-semibold text-sm group-hover:gap-2 transition-all"
              >
                Learn more <ChevronRight size={16} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── About Section ──────────────────────────────────────────
function About() {
  return (
    <section id="about" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div >
            <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-sm font-semibold rounded-full mb-4">
              About Us
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Why Leaders Choose{" "}
              <span className="text-indigo-600">UKasha</span>
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Founded with a vision to bridge the gap between ambition and
              achievement, UKasha Consultancy has grown into a trusted partner
              for organizations seeking transformative change.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Our team of seasoned consultants brings decades of combined
              experience across industries including finance, technology,
              healthcare, and manufacturing. We don't just advise — we roll up
              our sleeves and work alongside your team to implement solutions
              that stick.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  icon: Award,
                  title: "Certified Experts",
                  desc: "Industry-recognized certifications",
                },
                {
                  icon: Globe,
                  title: "Global Reach",
                  desc: "Serving clients across 30+ countries",
                },
                {
                  icon: Briefcase,
                  title: "Proven Methodology",
                  desc: " battle-tested frameworks",
                },
                {
                  icon: Users,
                  title: "Dedicated Teams",
                  desc: "Personalized attention for every client",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="text-indigo-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div


            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
                alt="Team collaboration"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-indigo-400 to-purple-400"
                        />
                      ))}
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold text-gray-900">
                        50+ Expert Consultants
                      </div>
                      <div className="text-gray-500">
                        Ready to help you grow
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Results / Case Studies ─────────────────────────────────
function Results() {
  const results = [
    {
      metric: "340%",
      label: "Revenue Growth",
      client: "Tech Startup",
      desc: "Scaled from $2M to $8.8M ARR in 18 months through market expansion strategy.",
    },
    {
      metric: "$12M",
      label: "Cost Savings",
      client: "Manufacturing Corp",
      desc: "Optimized supply chain and operations, reducing overhead by 35%.",
    },
    {
      metric: "85%",
      label: "Efficiency Gain",
      client: "Healthcare Provider",
      desc: "Digital transformation reduced patient wait times and improved care delivery.",
    },
    {
      metric: "3x",
      label: "Market Share",
      client: "Retail Chain",
      desc: "Strategic repositioning captured dominant position in emerging markets.",
    },
  ];

  return (
    <section id="results" className="py-24 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-indigo-500/20 text-indigo-300 text-sm font-semibold rounded-full mb-4">
            Proven Impact
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Results That <span className="text-indigo-400">Speak</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Real outcomes from real partnerships. Here's how we've helped
            organizations achieve extraordinary results.
          </p>
        </div>

        <div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {results.map((result) => (
            <div
              key={result.client}
              className="group relative p-8 bg-gray-800/50 hover:bg-gray-800 rounded-2xl border border-gray-700 hover:border-indigo-500/50 transition-all duration-300"
            >
              <div className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {result.metric}
              </div>
              <div className="text-lg font-semibold text-white mb-1">
                {result.label}
              </div>
              <div className="text-sm text-indigo-400 font-medium mb-3">
                {result.client}
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                {result.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ───────────────────────────────────────────
function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "CEO, Nexus Technologies",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
      content:
        "UKasha transformed our approach to market expansion. Their strategic insights were invaluable, and the team's dedication to our success was evident in every interaction.",
    },
    {
      name: "James Chen",
      role: "COO, Meridian Health",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
      content:
        "The digital transformation roadmap UKasha developed reduced our operational costs by 40% while significantly improving patient outcomes. Truly exceptional work.",
    },
    {
      name: "Amara Okafor",
      role: "Founder, Elevate Retail",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
      content:
        "Working with UKasha felt like gaining a strategic partner, not just a consultant. They understood our vision and helped us achieve 3x growth in under two years.",
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-sm font-semibold rounded-full mb-4">
            Client Stories
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Trusted by <span className="text-indigo-600">Leaders</span>
          </h2>
        </div>

        <div
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="relative p-8 bg-gray-50 rounded-2xl border border-gray-100"
            >
              <Quote
                className="absolute top-6 right-6 text-indigo-200"
                size={40}
              />
              <p className="text-gray-700 leading-relaxed mb-6 relative z-10">
                "{t.content}"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              </div>
              <div className="flex gap-1 mt-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    className="text-amber-400 fill-current"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Book a free 30-minute strategy session with our experts and discover
            how UKasha Consultancy can accelerate your growth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#contact"
              className="group px-8 py-4 bg-white text-indigo-600 font-bold rounded-full transition-all hover:shadow-xl hover:scale-105 flex items-center gap-2"
            >
              Book Free Consultation
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
            <a
              href="tel:+1234567890"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/20 transition-all"
            >
              Call Us Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact Section ────────────────────────────────────────
function Contact() {
  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          <div >
            <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-sm font-semibold rounded-full mb-4">
              Get In Touch
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Let's Start a <span className="text-indigo-600">Conversation</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Whether you're looking to scale, transform, or optimize, we're here
              to help. Reach out and let's discuss how we can partner for
              success.
            </p>

            <div className="space-y-6">
              {[
                {
                  icon: Phone,
                  label: "Phone",
                  value: "+1 (234) 567-8900",
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: "hello@ukashaconsultancy.com",
                },
                {
                  icon: MapPin,
                  label: "Address",
                  value: "123 Business Avenue, New York, NY 10001",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <item.icon className="text-indigo-600" size={20} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{item.label}</div>
                    <div className="font-semibold text-gray-900">
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100"
          >
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="john@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="Your Company"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How Can We Help?
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ─────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <span className="text-xl font-bold text-white">
                UKasha<span className="text-indigo-400">Consultancy</span>
              </span>
            </div>
            <p className="text-gray-400 max-w-sm leading-relaxed">
              Empowering organizations with strategic excellence, operational
              innovation, and sustainable growth solutions since 2010.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {["Home", "Services", "About Us", "Case Studies", "Contact"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase().replace(" ", "-")}`}
                      className="hover:text-indigo-400 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              {[
                "Business Strategy",
                "Digital Transformation",
                "Growth Consulting",
                "Risk Management",
                "Leadership Development",
              ].map((service) => (
                <li key={service}>
                  <a
                    href="#services"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            © 2026 UKasha Consultancy. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Page Component ────────────────────────────────────
export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Results />
      <Testimonials />
      <CTASection />
      <Contact />
      <Footer />
    </main>
  );
}