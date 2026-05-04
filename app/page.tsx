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
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Home", href: "#home" },
    { label: "Services Offered", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Testimonials", href: "#testimonials" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-white/80 backdrop-blur-xl  border-b border-gray-200"
        : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <a href="#home" className="">
            <img src="/home/hero/logo.png" alt="" />
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-[20px] 2xl:gap-[30px]">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`relative text-[14px] md:text-[15px] lg:text-[16px] font-light transition-colors ${scrolled ? "text-[#000]" : "text-[#ffffff]"
                  } hover:text-[#45C4E9]`}
              >
                {link.label}

                {/* underline animation */}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#45C4E9] transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}

            {/* CTA */}
            <a
              href="#contact"
              className="ml-4 px-6 py-2.5 bg-[#45C4E9] text-white text-sm font-light rounded-full hover:bg-white border-[#45C4E9] hover:text-[#000] transition-all  "
            >
              Book Consultation
            </a>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4 ml-4">

              {!user ? (
                <>
                  {/* Login */}
                  <a
                    href="/login"
                    className={`text-[14px] md:text-[15px] lg:text-[16px] py-[5px] lg:py-[10px] px-[15px] lg:px-[20px] xl:px-[30px] border border-[#ffffff] rounded-[5px] ${scrolled ? "text-[#000]" : "text-white"
                      } hover:text-[#45C4E9]`}
                  >
                    Login
                  </a>


                </>
              ) : user.role === "admin" || user.role === "seller" ? (
                <>
                  {/* Dashboard Button */}
                  <a
                    href="/dashboard"
                    className="text-[14px] md:text-[15px] lg:text-[16px] py-[5px] lg:py-[10px] px-[15px] lg:px-[20px] xl:px-[30px] border border-[#ffffff] rounded-[5px] "
                  >
                    Dashboard
                  </a>

                  {/* Logout */}
                  <button
                    onClick={() => {
                      localStorage.removeItem("user");
                      setUser(null);
                    }}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* Profile Icon */}
                  <a
                    href="/profile"
                    className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center"
                  >
                    👤
                  </a>

                  {/* Logout */}
                  <button
                    onClick={() => {
                      localStorage.removeItem("user");
                      setUser(null);
                    }}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
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
                  className="block text-gray-800 font-medium text-base hover:text-[#45C4E9] transition"
                >
                  {link.label}
                </a>
              ))}

              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-5 py-3 bg-[#45C4E9] text-white font-medium rounded-full "
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      <div className="absolute inset-0 z-20">
        <img
          src="./home/hero/topleft.png"
          alt="Modern office"
          className="w-[346px] object-cover"
        />
      </div>
      <div className="absolute inset-0 z-10">
        <img
          src="./home/hero/herodoctor.png"
          alt="Modern office"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute bottom-0 right-[-30px] z-30">
        <img
          src="./home/hero/overlay.png"
          alt="Modern office"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative z-10 w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="grid grid-cols-2 items-center">
          <div className="col-span-1 flex flex-col items-start gap-[5px] md:gap-[10px] lg:gap-[20px]">
            <div className="w-32 h-2 bg-[#45C4E9]"></div>
            <p className="text-[#ffffff] text-[30px] md:text-[40px] lg:text-[50px] xl:text-[60px] 2xl:text-[70px] my-0 leading-tight"><span className="font-bold">ATA</span> Consultancy</p>
            <p className="text-[#B6B6B6] text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] my-0 leading-tight text-start">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis reprehenderit repudiandae optio beatae, architecto voluptate non cum eius ex fuga, cstias voluptas itaque quibusdam eius neque? Accusamus!</p>
            <button className="bg-[#45C4E9] rounded-[5px] px-[15px] lg:px-[20px] xl:px-[25px] 2xl:px-[30px] py-[10px] lg:py-[15px] font-medium text-white">Find Consultant</button>
          </div>
          <div>

          </div>
        </div>
      </div>
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
  return (
    <section id="about" className="py-24 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">

        <div className="flex flex-col items-start justify-center gap-[5px] md:gap-[10px] lg:gap-[20px]">
          <div className="w-32 h-2 bg-[#45C4E9]"></div>
          <div className="flex items-start justify-between w-full gap-[10px] lg:gap-[20px]">
            <p className="text-[20px] md:text-[25px] lg:text-[30px] xl:text-[35px] 2xl:text-[40px] my-0 font-medium leading-tight text-[#ffffff] max-w-[600px]">What Services We provide
              to our Customers</p>
            <button className="bg-[#45C4E9] rounded-[5px] px-[15px] lg:px-[20px] xl:px-[25px] 2xl:px-[30px] py-[10px] lg:py-[15px] font-medium text-white">Find Consultant</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[15px] lg:gap-[20px] xl:gap-[25px] mt-[20px] md:mt-[30px] lg:mt-[40px] xl:mt-[50px] 2xl:mt-[60px]">
          <div className="flex items-start gap-[10px] lg:gap-[15px] xl:gap-[20px] 2xl:gap-[30px]">
            <img src="./home/service/training.png" alt="" />
            <div className="flex flex-col items-start gap-[6px] lg:gap-[10px]">
              <p className="text-[18px] md:text-[20px] lg:text-[22px] 2xl:text-[25px] my-0 text-[#ffffff] font-semibold">Training</p>
              <p className="text-[14px] lg:text-[15px] 2xl:text-[16px] my-0 text-[#ffffff]">Lorem ipsum dolor sit amet, ispum ut consectetur adipiscinrtor cursus volut elementum.</p>
            </div>
          </div>
          <div className="flex items-start gap-[10px] lg:gap-[15px] xl:gap-[20px] 2xl:gap-[30px]">
            <img src="./home/service/consulting.png" alt="" />
            <div className="flex flex-col items-start gap-[6px] lg:gap-[10px]">
              <p className="text-[18px] md:text-[20px] lg:text-[22px] 2xl:text-[25px] my-0 text-[#ffffff] font-semibold">Consulting Service</p>
              <p className="text-[14px] lg:text-[15px] 2xl:text-[16px] my-0 text-[#ffffff]">Lorem ipsum dolor sit amet, ispum ut consectetur adipiscinrtor cursus volut elementum.</p>
            </div>
          </div>
          <div className="flex items-start gap-[10px] lg:gap-[15px] xl:gap-[20px] 2xl:gap-[30px]">
            <img src="./home/service/training.png" alt="" />
            <div className="flex flex-col items-start gap-[6px] lg:gap-[10px]">
              <p className="text-[18px] md:text-[20px] lg:text-[22px] 2xl:text-[25px] my-0 text-[#ffffff] font-semibold">ORGANIZATIONAL HEALTH
                RISK ASSESSMENT</p>
              <p className="text-[14px] lg:text-[15px] 2xl:text-[16px] my-0 text-[#ffffff]">Lorem ipsum dolor sit amet, ispum ut consectetur adipiscinrtor cursus volut elementum.</p>
            </div>
          </div>
          <div className="flex items-start gap-[10px] lg:gap-[15px] xl:gap-[20px] 2xl:gap-[30px]">
            <img src="./home/service/coaching.png" alt="" />
            <div className="flex flex-col items-start gap-[6px] lg:gap-[10px]">
              <p className="text-[18px] md:text-[20px] lg:text-[22px] 2xl:text-[25px] my-0 text-[#ffffff] font-semibold">Coaching</p>
              <p className="text-[14px] lg:text-[15px] 2xl:text-[16px] my-0 text-[#ffffff]">Lorem ipsum dolor sit amet, ispum ut consectetur adipiscinrtor cursus volut elementum.</p>
            </div>
          </div>
          <div className="flex items-start gap-[10px] lg:gap-[15px] xl:gap-[20px] 2xl:gap-[30px]">
            <img src="./home/service/mentoring.png" alt="" />
            <div className="flex flex-col items-start gap-[6px] lg:gap-[10px]">
              <p className="text-[18px] md:text-[20px] lg:text-[22px] 2xl:text-[25px] my-0 text-[#ffffff] font-semibold">Mentoring</p>
              <p className="text-[14px] lg:text-[15px] 2xl:text-[16px] my-0 text-[#ffffff]">Lorem ipsum dolor sit amet, ispum ut consectetur adipiscinrtor cursus volut elementum.</p>
            </div>
          </div>
          <div className="flex items-start gap-[10px] lg:gap-[15px] xl:gap-[20px] 2xl:gap-[30px]">
            <img src="./home/service/finencial.png" alt="" />
            <div className="flex flex-col items-start gap-[6px] lg:gap-[10px]">
              <p className="text-[18px] md:text-[20px] lg:text-[22px] 2xl:text-[25px] my-0 text-[#ffffff] font-semibold">Financial Advices</p>
              <p className="text-[14px] lg:text-[15px] 2xl:text-[16px] my-0 text-[#ffffff]">Lorem ipsum dolor sit amet, ispum ut consectetur adipiscinrtor cursus volut elementum.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 z-10">
        <img src="./home/service/bg.png" alt="" />
      </div>
    </section>
  );
}


// ─── About Section ──────────────────────────────────────────
function About() {
  return (
    <section id="about" className="py-24 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center z-20 relative" >

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="./home/about/whoweare.png"
                alt="Team collaboration"
                className="w-full h-[500px] object-cover"
              />

            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
          </div>
          <div className="col-span-1 flex flex-col items-start justify-center gap-[5px] md:gap-[10px] lg:gap-[20px]">
            <div className="w-32 h-2 bg-[#45C4E9]"></div>
            <p className="text-[20px] md:text-[25px] lg:text-[30px] xl:text-[35px] 2xl:text-[40px] my-0 font-medium leading-tight">WHO WE ARE</p>
            <p className="text-[#B6B6B6] text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] my-0 leading-tight text-start">ATA Consultancy comprises a team of experienced & passionate professionals invested in helping organizations preserve their competitive edge.  We believe that the sustained competitive advantage is enhanced and maintained by a strong & thriving community of staff who feel valued for their unique, authentic selves and who hold a true sense of belonging. </p>
            <p className="text-[#B6B6B6] text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] my-0 leading-tight text-start">We utilize our proprietary framework to equip organizations with the disciplines, processes, & methodology that provide them  </p>
            <button className="bg-[#45C4E9] rounded-[5px] px-[15px] lg:px-[20px] xl:px-[25px] 2xl:px-[30px] py-[10px] lg:py-[15px] font-medium text-white">Find Consultant</button>
          </div>


        </div>
      </div>
      <div className="absolute inset-0 z-10">
        <img src="./home/about/background.png" alt="" />
      </div>
    </section>
  );
}

// ─── Results / Case Studies ─────────────────────────────────
function Results() {
  return (
    <section id="about" className="py-24 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center z-20 relative" >
          <div className="col-span-1 flex flex-col items-start justify-center gap-[5px] md:gap-[10px] lg:gap-[20px]">
            <div className="w-32 h-2 bg-[#45C4E9]"></div>
            <p className="text-[20px] md:text-[25px] lg:text-[30px] xl:text-[35px] 2xl:text-[40px] my-0 font-medium leading-tight">Why Choose Us</p>
            <p className="text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] my-0 leading-tight text-start">To promote organizations' growth and sustainability through investment in staff.  We work with leaders to establish a strong, vibrant, and comitted workforce. We strongly believe that an organization's most valuable asset is its people. </p>
            <ul>
              <li className="my-0 text-[14px] lg:text-[15px] 2xl:text-[16px] font-light flex gap-[10px] items-center"> <div className="h-2 w-2 bg-[#45C4E9] rounded-full mr-[10px]"></div>Remote consulting and training sessions</li>
              <li className="my-0 text-[14px] lg:text-[15px] 2xl:text-[16px] font-light flex gap-[10px] items-center"> <div className="h-2 w-2 bg-[#45C4E9] rounded-full mr-[10px]"></div>Remote and in-person Learning sessions
              </li>
              <li className="my-0 text-[14px] lg:text-[15px] 2xl:text-[16px] font-light flex gap-[10px] items-center"> <div className="h-2 w-2 bg-[#45C4E9] rounded-full mr-[10px]"></div>Executive-focused consulting sessions
              </li>
              <li className="my-0 text-[14px] lg:text-[15px] 2xl:text-[16px] font-light flex gap-[10px] items-center"> <div className="h-2 w-2 bg-[#45C4E9] rounded-full mr-[10px]"></div>In-person large and small training
              </li>
              <li className="my-0 text-[14px] lg:text-[15px] 2xl:text-[16px] font-light flex gap-[10px] items-center"> <div className="h-2 w-2 bg-[#45C4E9] rounded-full mr-[10px]"></div>One-on-one mentoring/coaching sessions
              </li>
              <li className="my-0 text-[14px] lg:text-[15px] 2xl:text-[16px] font-light flex gap-[10px] items-center"> <div className="h-2 w-2 bg-[#45C4E9] rounded-full mr-[10px]"></div>Webinars</li>
            </ul>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="./home/whychoose/video.png"
                alt="Team collaboration"
                className="w-full object-cover"
              />

            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
          </div>

        </div>
        <div className="relative z-20 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[15px] lg:gap-[20px] xl:gap-[25px] mt-[20px] md:mt-[30px] lg:mt-[40px] xl:mt-[50px] 2xl:mt-[60px]">
          <div className="flex items-start gap-[10px] lg:gap-[15px] xl:gap-[20px] 2xl:gap-[30px] bg-[#15181D] rounded-[5px] p-[10px] lg:p-[15px] xl:p-[20px]">
            <img src="./home/whychoose/expert.png" alt="" />
            <div className="flex flex-col items-start gap-[6px] lg:gap-[10px]">
              <p className="text-[18px] md:text-[20px] lg:text-[22px] 2xl:text-[25px] my-0 text-[#ffffff] font-semibold">Expert peoples</p>
              <p className="text-[14px] lg:text-[15px] 2xl:text-[16px] my-0 text-[#ffffff]">Lorem ipsum dolor sit amet, ispum
                ut consectetur acursus voult</p>
            </div>
          </div>
          <div className="flex items-start gap-[10px] lg:gap-[15px] xl:gap-[20px] 2xl:gap-[30px] bg-[#15181D] rounded-[5px] p-[10px] lg:p-[15px] xl:p-[20px]">
            <img src="./home/whychoose/big.png" alt="" />
            <div className="flex flex-col items-start gap-[6px] lg:gap-[10px]">
              <p className="text-[18px] md:text-[20px] lg:text-[22px] 2xl:text-[25px] my-0 text-[#ffffff] font-semibold">Big experience</p>
              <p className="text-[14px] lg:text-[15px] 2xl:text-[16px] my-0 text-[#ffffff]">Lorem ipsum dolor sit amet, ispum
                ut consectetur acursus voult</p>
            </div>
          </div>
          <div className="flex items-start gap-[10px] lg:gap-[15px] xl:gap-[20px] 2xl:gap-[30px] bg-[#15181D] rounded-[5px] p-[10px] lg:p-[15px] xl:p-[20px]">
            <img src="./home/whychoose/commited.png" alt="" />
            <div className="flex flex-col items-start gap-[6px] lg:gap-[10px]">
              <p className="text-[18px] md:text-[20px] lg:text-[22px] 2xl:text-[25px] my-0 text-[#ffffff] font-semibold">Committed to quality</p>
              <p className="text-[14px] lg:text-[15px] 2xl:text-[16px] my-0 text-[#ffffff]">Lorem ipsum dolor sit amet, ispum
                ut consectetur acursus voult</p>
            </div>
          </div>


        </div>
      </div>
      <div className="absolute inset-0 z-10">
        <img src="./home/whychoose/bg.png" alt="" />
      </div>
    </section>
  );
}

function Blogs() {
  const posts = [
    {
      image: "https://api.builder.io/api/v1/image/assets/TEMP/e80c6921cb8296de5987430f8f8c7355600f76f2?width=751",
      title: "Lorem Ispum Dummy Text",
      excerpt:
        "Lorem ipsum dolor sit amet, coctetur adipiscing fermentum amet, phasellus sem nisl to massa. Enim, eget nisi quis risus malesua nulla vitae cursus vel tellus magnis accumsan morbi.",
    },
    {
      image: "https://api.builder.io/api/v1/image/assets/TEMP/2b0ea09afbca84a4634176a174bfb50a27911efd?width=751",
      title: "Lorem Ispum Dummy Text",
      excerpt:
        "Lorem ipsum dolor sit amet, coctetur adipiscing fermentum amet, phasellus sem nisl to massa. Enim, eget nisi quis risus malesua nulla vitae cursus vel tellus magnis accumsan morbi.",
    },
    {
      image: "https://api.builder.io/api/v1/image/assets/TEMP/0afb0e43bc6fc52a9ef703f0a21eb754ea19158b?width=751",
      title: "Lorem Ispum Dummy Text",
      excerpt:
        "Lorem ipsum dolor sit amet, coctetur adipiscing fermentum amet, phasellus sem nisl to massa. Enim, eget nisi quis risus malesua nulla vitae cursus vel tellus magnis accumsan morbi.",
    },
  ];

  const [activeDot, setActiveDot] = useState(1);

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/6bba1b6e612952d782e328aefaf063c75796f0c5?width=3840"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="relative z-10 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {/* Heading */}
          <div className="flex flex-col items-center mb-14">
            <div className="w-16 h-0.5 bg-brand-cyan mb-3" />
            <h2 className="font-poppins font-semibold text-4xl text-[#0A0A0A]">
              Latest Blog Post
            </h2>
          </div>

          {/* Decorative cross */}
          <div className="relative">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/8f999d96e055fed3d40aa12fde518d924f50698f?width=127"
              alt=""
              className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/2 w-10 h-[72px] pointer-events-none z-10"
            />

            {/* Blog cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
              {posts.map((post, i) => (
                <div
                  key={i}
                  className="rounded-[14px] overflow-hidden shadow-[0_10px_20px_rgba(0,0,0,0.10)] bg-white flex flex-col"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full aspect-[359/239] object-cover rounded-t-[14px]"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-7 flex flex-col flex-1">
                    <h3 className="font-poppins font-semibold text-[18px] text-[#252525] capitalize mb-3">
                      {post.title}
                    </h3>
                    <p className="font-poppins font-normal text-[13px] text-[#91969B] leading-[176.5%] lowercase flex-1">
                      {post.excerpt}
                    </p>
                    <div className="mt-6">
                      <span className="font-poppins font-medium text-[14px] text-brand-cyan cursor-pointer hover:opacity-80 transition-opacity">
                        Read More
                      </span>
                      <div className="h-px w-[74px] bg-brand-cyan mt-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slider dots */}
          <div className="flex justify-center items-center gap-3 mt-10">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setActiveDot(i)}
                className={`h-1 rounded-full transition-all duration-300 ${i === activeDot
                  ? "w-10 bg-brand-cyan"
                  : "w-7 bg-brand-cyan/50 hover:bg-brand-cyan/70"
                  }`}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>
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
        "Ukasha  transformed our approach to market expansion. Their strategic insights were invaluable, and the team's dedication to our success was evident in every interaction.",
    },
    {
      name: "James Chen",
      role: "COO, Meridian Health",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
      content:
        "The digital transformation roadmap Ukasha  developed reduced our operational costs by 40% while significantly improving patient outcomes. Truly exceptional work.",
    },
    {
      name: "Amara Okafor",
      role: "Founder, Elevate Retail",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
      content:
        "Working with Ukasha  felt like gaining a strategic partner, not just a consultant. They understood our vision and helped us achieve 3x growth in under two years.",
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-indigo-50 text-[#45C4E9] text-sm font-semibold rounded-full mb-4">
            Client Stories
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Trusted by <span className="text-[#45C4E9]">Leaders</span>
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
      <div className="absolute inset-0 bg-gradient-to-br from-[#45C4E9] to-purple-700" />
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
            how Ukasha  Consultancy can accelerate your growth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#contact"
              className="group px-8 py-4 bg-white text-[#45C4E9] font-bold rounded-full transition-all hover:shadow-xl hover:scale-105 flex items-center gap-2"
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
            <span className="inline-block px-4 py-1.5 bg-indigo-50 text-[#45C4E9] text-sm font-semibold rounded-full mb-4">
              Get In Touch
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Let's Start a <span className="text-[#45C4E9]">Conversation</span>
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
                  value: "hello@Ukasha consultancy.com",
                },
                {
                  icon: MapPin,
                  label: "Address",
                  value: "123 Business Avenue, New York, NY 10001",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <item.icon className="text-[#45C4E9]" size={20} />
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
                className="w-full py-4 bg-[#45C4E9] hover:bg-indigo-700 text-white font-bold rounded-xl transition-all  hover:shadow-indigo-500/25"
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
    <footer className="bg-[#0F1014] text-[#ffffff] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
           <a href="#home" className="">
            <img src="/home/hero/logo.png" alt="" />
          </a>

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
           Copyrights © 2026 Ukasha  Consultancy. All rights reserved.
          </p>
          
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
      <About />
      <Services />
      <Results />
      <Testimonials /> 
      <Blogs />
      <CTASection />
      <Contact />
      <Footer />
    </main>
  );
}