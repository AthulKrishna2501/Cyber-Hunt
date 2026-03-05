"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Home() {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const yHeroText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityHeroText = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section ref={targetRef} className="relative grid-bg pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex items-center">
          <div className="mx-auto max-w-7xl px-6 relative z-10 w-full">
            <div className="flex flex-col items-center justify-center">
              <motion.div
                style={{ y: yHeroText, opacity: opacityHeroText }}
                className="flex flex-col items-center text-center gap-8 max-w-4xl"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest w-fit"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Transmission Active
                </motion.div>

                <div className="flex flex-col gap-4 overflow-visible py-2">
                  <motion.h1
                    initial={{ y: 80, opacity: 0, rotateX: -80 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                    transition={{ duration: 0.9, type: "spring", bounce: 0.4, delay: 0.1 }}
                    style={{ transformPerspective: 1200 }}
                    className="text-6xl sm:text-7xl lg:text-8xl xl:text-[6rem] font-black leading-[1.1] tracking-tighter text-slate-900 dark:text-white drop-shadow-sm"
                  >
                    Cyber Hunt <br /> <span className="text-primary tracking-tight">Portal Edition</span>
                  </motion.h1>
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed"
                >
                  A dedicated vulnerability discovery challenge to promote secure coding awareness and ethical hacking practices within the institution.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, type: "spring", bounce: 0.5, delay: 0.6 }}
                  className="flex flex-wrap justify-center gap-6 mt-4"
                >
                  <Link href="/register" className="bg-primary hover:bg-primary/90 text-white px-10 py-5 rounded-2xl text-lg font-bold transition-all flex items-center gap-3 group shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1">
                    Initialize Hunt
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">terminal</span>
                  </Link>
                  <Link href="/dashboard" className="border-2 border-slate-300 dark:border-primary/30 hover:border-primary px-10 py-5 rounded-2xl text-lg font-bold transition-all text-slate-900 dark:text-white backdrop-blur-md hover:-translate-y-1">
                    View Intel
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Highlight Stats */}
        <section className="py-12 bg-slate-50 dark:bg-primary/5 overflow-hidden">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                className="flex flex-col gap-2 rounded-xl p-8 bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/10 shadow-sm"
              >
                <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Top Prize</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black text-slate-900 dark:text-white">₹5,000</p>
                </div>
                <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-primary/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-primary"
                  ></motion.div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col gap-2 rounded-xl p-8 bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/10 shadow-sm"
              >
                <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Top Performers</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black text-slate-900 dark:text-white">Top 5</p>
                  <p className="text-green-500 text-sm font-bold">Recognized</p>
                </div>
                <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-primary/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="h-full bg-primary"
                  ></motion.div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col gap-2 rounded-xl p-8 bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/10 shadow-sm"
              >
                <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Special Awards</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black text-slate-900 dark:text-white">3</p>
                  <p className="text-green-500 text-sm font-bold">Categories</p>
                </div>
                <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-primary/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-primary"
                  ></motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Info Blocks */}
        <section id="about" className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-4 mb-16"
            >
              <h2 className="text-primary font-bold uppercase tracking-widest text-sm">Rules of Engagement</h2>
              <h3 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white">About the Challenge</h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg">Test your skills responsibly. Identify vulnerabilities in our provided Test Portal environment and learn secure coding practices.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                className="group flex flex-col gap-6 rounded-2xl border border-slate-200 dark:border-primary/10 bg-white dark:bg-background-dark/50 p-8 hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/5"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">gavel</span>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">Strictly Test Environment</h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">All vulnerability testing must be performed <strong>only</strong> on the provided Test Portal. Testing against live institutional systems is strictly prohibited.</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="group flex flex-col gap-6 rounded-2xl border border-slate-200 dark:border-primary/10 bg-white dark:bg-background-dark/50 p-8 hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/5"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">description</span>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">Detailed Reporting</h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Submit a clear Vulnerability Report (PDF) that includes the issue description, steps to reproduce, screenshots, impact, and a suggested fix.</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="group flex flex-col gap-6 rounded-2xl border border-slate-200 dark:border-primary/10 bg-white dark:bg-background-dark/50 p-8 hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/5"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">military_tech</span>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">Fair Judging Criteria</h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Evaluations are based on the severity of the vulnerability, technical accuracy, report clarity, issue reproducibility, and responsible disclosure.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Prizes Section */}
        <section id="prizes" className="py-24 bg-slate-50 dark:bg-primary/5">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-4 mb-16 items-center text-center"
            >
              <h2 className="text-primary font-bold uppercase tracking-widest text-sm">Rewards</h2>
              <h3 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white">Prize Pool</h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg">Massive rewards for the best exploits, patches, and architectures.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col gap-6 rounded-2xl border-2 border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark p-8 relative overflow-hidden text-center justify-center transform md:translate-y-4"
              >
                <div className="text-xl font-bold text-slate-500 dark:text-slate-400">Top 5 Researchers</div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">Certificates</div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Certificate of Achievement and recognition as Top Security Researchers.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                className="flex flex-col gap-6 rounded-2xl border-2 border-primary bg-primary/5 dark:bg-primary/10 p-8 relative overflow-hidden text-center transform md:-translate-y-4 shadow-2xl shadow-primary/20 justify-center z-10"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                <div className="text-primary font-black uppercase tracking-widest text-sm flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-sm">workspace_premium</span> First Prize
                </div>
                <div className="text-5xl font-black text-slate-900 dark:text-white">₹5,000</div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Cash Prize, Certificate of Excellence, and Special Department Recognition.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col gap-6 rounded-2xl border-2 border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark p-8 relative overflow-hidden text-center justify-center transform md:translate-y-4"
              >
                <div className="text-xl font-bold text-slate-500 dark:text-slate-400">Special Awards</div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">Recognition</div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">For Best Discovery, Best Report, and Responsible Hacker.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24">
          <div className="mx-auto max-w-3xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-4 mb-16 text-center"
            >
              <h2 className="text-primary font-bold uppercase tracking-widest text-sm">Support</h2>
              <h3 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Need intel? We&apos;ve got answers.</p>
            </motion.div>
            <div className="flex flex-col gap-4">
              {[
                { q: "Who can participate?", a: "Students of the institution who want to improve their secure coding awareness and learn ethical hacking." },
                { q: "Can we test the live institution portal?", a: "NO. Testing against the live institutional systems or real student accounts is strictly prohibited. You must use the provided Test Portal environment." },
                { q: "What should the Vulnerability Report contain?", a: "Title, Description, Steps to Reproduce, Screenshots/Proof of Concept, Impact, and a Suggested Fix." },
                { q: "What if multiple people report the same bug?", a: "Duplicate vulnerability submissions will only be rewarded once to the first valid report submitted." }
              ].map((faq, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  key={i}
                  className="group rounded-xl border border-slate-200 dark:border-primary/10 bg-white dark:bg-background-dark/50 p-6 hover:border-primary/30 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-center gap-4">
                    <h4 className="font-bold text-slate-900 dark:text-white text-lg">{faq.q}</h4>
                    <span className="material-symbols-outlined text-primary group-hover:rotate-180 transition-transform">keyboard_arrow_down</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mt-4 leading-relaxed border-t border-slate-100 dark:border-primary/10 pt-4">
                    {faq.a}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-16 bg-primary/5 border border-primary/20 rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center justify-between"
            >
              <div className="flex flex-col gap-2">
                <h4 className="text-2xl font-bold flex items-center gap-2"><span className="material-symbols-outlined text-primary">support_agent</span> Need more intel?</h4>
                <p className="text-slate-600 dark:text-slate-400">Reach out to our event coordinators for specific doubts or clarification.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="tel:+918888888888" className="flex items-center gap-3 bg-white dark:bg-background-dark p-4 rounded-xl border border-slate-200 dark:border-primary/10 hover:border-primary/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Coordinator</p>
                    <p className="font-mono font-bold">+91 88888 88888</p>
                  </div>
                </a>
                <a href="tel:+919999999999" className="flex items-center gap-3 bg-white dark:bg-background-dark p-4 rounded-xl border border-slate-200 dark:border-primary/10 hover:border-primary/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Coordinator</p>
                    <p className="font-mono font-bold">+91 99999 99999</p>
                  </div>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-2xl bg-primary px-8 py-16 text-center text-white shadow-2xl shadow-primary/40"
          >
            <div className="absolute inset-0 bg-black opacity-10 mix-blend-overlay"></div>
            <div className="relative z-10 flex flex-col items-center gap-8">
              <h2 className="text-3xl lg:text-5xl font-black">Ready to breach the perimeter?</h2>
              <p className="max-w-xl text-primary-100/90 text-lg text-white/90">Registration closes in 48 hours. Secure your spot in the most prestigious security event of the year.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/register" className="bg-white text-primary hover:bg-slate-100 px-10 py-4 rounded-xl text-lg font-bold transition-all">
                  Join Now
                </Link>
                <a href="/Rulebook.pdf" target="_blank" rel="noopener noreferrer" className="bg-black/20 border border-white/30 backdrop-blur-sm hover:bg-white/10 px-10 py-4 rounded-xl text-lg font-bold transition-all text-white">
                  Download Rulebook
                </a>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-slate-200 dark:border-primary/10 py-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-primary grayscale opacity-70">
            <span className="material-symbols-outlined text-2xl">shield_with_heart</span>
            <h2 className="text-lg font-bold uppercase">Cyber Hunt</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">© 2026 Cyber Hunt Hackathon. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">share</span></Link>
            <Link href="#" className="text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">mail</span></Link>
            <Link href="#" className="text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">hub</span></Link>
          </div>
        </div>
      </footer>
    </>
  );
}
