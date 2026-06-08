import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Clock3, QrCode, Sparkles, Utensils } from "lucide-react";

import Button from "../components/Button";
import Header from "../components/Header";
import MotionSection from "../components/MotionSection";

const BounceCards = lazy(() => import("../components/BounceCards"));
const Silk = lazy(() => import("../components/Silk"));
const InfiniteMenu = lazy(() => import("../components/InfiniteMenu"));






const features = [
  {
    icon: QrCode,
    title: "Table QR menus",
    text: "Guests scan, browse, and order from a refined mobile menu.",
  },
  {
    icon: Clock3,
    title: "Live order flow",
    text: "New orders, table context, and statuses stay visible for staff.",
  },
  {
    icon: Sparkles,
    title: "Premium presence",
    text: "A calm luxury interface that feels at home in fine dining.",
  },
];
      const items = [
  {
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop',
    link: '#',
    title: 'Luxury Pasta',
    description: 'Handmade pasta with premium ingredients'
  },
  {
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop',
    link: '#',
    title: 'Fresh Salad',
    description: 'Seasonal greens with gourmet dressing'
  },
  {
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop',
    link: '#',
    title: 'Fine Dining',
    description: 'Elegant restaurant experience'
  },
  {
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop',
    link: '#',
    title: 'Chef Specials',
    description: 'Curated dishes from our kitchen'
  }
];
function LandingPage() {


  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0f0606] text-white">
      <div className="fixed left-0 top-0 z-50 w-full px-3 pt-4 sm:px-6 sm:pt-6">
      <Header
          position="static"
          surface="dark"
          brandLight
          navClassName="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-xl sm:px-6 sm:py-4"
          actions={
            <>
              <Link
                to="/menu/99820794-fced-4e75-8e57-81471e1ae069?table=1"
                className="hidden sm:inline-flex"
              >
                <Button variant="secondary">Try Menu</Button>
              </Link>

              <Link to="/admin/login">
                <Button variant="accent">Admin</Button>
              </Link>
            </>
          }
        >
        <a
          href="#features"
          className="text-white/78 transition duration-300 hover:text-white"
        >
          Features
        </a>

        <a
          href="#how"
          className="text-white/78 transition duration-300 hover:text-white"
        >
          How it works
        </a>

        <a
          href="#menu-preview"
          className="text-white/78 transition duration-300 hover:text-white"
        >
          Menu
        </a>
      </Header>
      </div>

      {/* HERO SECTION */}

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#18120f]">

  {/* SILK BACKGROUND */}
<div className="absolute inset-0 overflow-hidden">
  <div
    style={{
      width: "100%",
      height: "100%",
      position: "relative",
    }}
  >
    <Suspense fallback={null}>
      <Silk
        speed={9}
        scale={0.8}
        color="#441212"
        noiseIntensity={0.4}
        rotation={0.7}
      />
    </Suspense>
  </div>
</div>

{/* DARK OVERLAY */}
<div className="absolute inset-0 bg-black/45" />

  {/* BOUNCE CARDS */}
  <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 pt-28 sm:px-6 sm:pt-24">
    <div className="hidden md:block">
      <Suspense fallback={null}>
        <BounceCards
          className="custom-bounceCards"
          images={[
            "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop"
          ]}
          containerWidth={700}
          containerHeight={420}
          animationDelay={0.4}
          animationStagger={0.08}
          easeType="elastic.out(1, 0.5)"
          transformStyles={[
            "rotate(-10deg) translate(-220px)",
            "rotate(-5deg) translate(-110px)",
            "rotate(0deg) translate(0px)",
            "rotate(5deg) translate(110px)",
            "rotate(10deg) translate(220px)"
          ]}
          enableHover={true}
        />
      </Suspense>
    </div>

    <div className="mt-16 max-w-4xl text-center">
      <p className="text-sm uppercase tracking-[0.35em] text-[#C96A4A]">
        Smart Dining Experience
      </p>

      <h1 className="mt-6 text-5xl font-bold leading-tight sm:text-7xl">
        Scan. Order. Experience luxury.
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">
        Elegant QR ordering, premium restaurant menus,
        seamless payments, and a modern dining experience
        crafted for cafés and fine dining spaces.
      </p>
    </div>

  </div>

</section>

      {/* FEATURES */}

      <MotionSection
        id="features"
        className="page-shell py-24 sm:py-32"
      >
        <div className="max-w-2xl">
          <p className="section-kicker">
            Built for graceful service
          </p>

          <h2 className="mt-4 font-serif-display text-4xl leading-tight text-white sm:text-6xl">
            Premium tools without operational clutter.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                whileHover={{ y: -8 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 24,
                }}
                className="luxury-card rounded-2xl p-7"
              >
                <span className="grid h-12 w-12 place-items-center rounded-full bg-[#1F1A17]/7">
                  <Icon className="h-6 w-6 text-[#C96A4A]" />
                </span>

                <h3 className="mt-7 font-serif-display text-3xl text-[#1F1A17]">
                  {feature.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-[#1F1A17]/62">
                  {feature.text}
                </p>
              </motion.article>
            );
          })}
        </div>
      </MotionSection>

      {/* HOW IT WORKS */}

      <MotionSection
        id="how"
        className="bg-[#FFFDF9]/70 py-24 sm:py-32"
      >
        <div className="page-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="section-kicker">
              How it works
            </p>

            <h2 className="mt-4 font-serif-display text-4xl text-[#1F1A17] sm:text-6xl">
              From table scan to kitchen queue.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              "Generate a table QR",
              "Guest adds dishes",
              "Admin accepts orders",
            ].map((step, index) => (
              <div
                key={step}
                className="rounded-2xl border border-[#1F1A17]/10 bg-[#F6F4EE]/70 p-6 shadow-sm"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#1F1A17] text-sm font-bold text-white">
                  {index + 1}
                </span>

                <p className="mt-6 font-serif-display text-2xl text-[#1F1A17]">
                  {step}
                </p>

                <CheckCircle2 className="mt-4 h-5 w-5 text-[#C96A4A]" />
              </div>
            ))}
          </div>
        </div>
      </MotionSection>

      {/* MENU PREVIEW */}

      <MotionSection
        id="menu-preview"
        className="page-shell overflow-hidden py-24 sm:py-32"
      >
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="section-kicker">
              Sample menu preview
            </p>

            <h2 className="mt-4 font-serif-display text-4xl text-white sm:text-6xl">
              A menu that feels curated.
            </h2>
          </div>

          <Utensils className="hidden h-10 w-10 text-[#1F1A17]/30 sm:block" />
        </div>

        <div className="relative h-[420px] sm:h-[520px] lg:h-[600px]">
          <Suspense fallback={null}>
            <InfiniteMenu
              items={items}
              scale={1.4}
            />
          </Suspense>
        </div>
        
      </MotionSection>
    </div>
  );
}

export default LandingPage;
