export interface SeedScene {
  scene_number: number;
  visual_description: string;
  voiceover_line: string;
  duration_seconds: number;
  image_url: string;
  timestamp: string;
  chapter_title: string;
}

export interface SeedCampaign {
  id: string;
  product_name: string;
  category: string;
  tagline: string;
  brief: string;
  video_url: string;
  thumbnail_url: string;
  accent_color: string;
  scenes: SeedScene[];
}

export const SEED_CAMPAIGNS: SeedCampaign[] = [
  {
    id: "aura-hydrate",
    product_name: "Aura Hydrate",
    category: "⚡ Energy & Electrolyte Water",
    tagline: "Ultra-crisp cellular hydration without the sugar crash",
    brief: "Sparkling electrolyte water that boosts afternoon focus and mental clarity without sugar",
    video_url: "/seed_ads/aura-hydrate.mp4",
    thumbnail_url: "/seed_ads/aura-hydrate_scene_1.jpg",
    accent_color: "#e8a33d",
    scenes: [
      {
        scene_number: 1,
        chapter_title: "The Hook",
        timestamp: "00:00",
        visual_description: "Cinematic macro shot of sleek electric-cyan aluminium can of Aura Hydrate with glistening condensation droplets and golden backlight",
        voiceover_line: "Exhausted by mid-day energy crashes? Meet Aura Hydrate.",
        duration_seconds: 4.5,
        image_url: "/seed_ads/aura-hydrate_scene_1.jpg",
      },
      {
        scene_number: 2,
        chapter_title: "The Solution",
        timestamp: "00:04",
        visual_description: "Dynamic slow motion splash of sparkling electrolyte water with fresh sliced organic limes and crystal bubbles on dark stone",
        voiceover_line: "Clean electrolytes engineered to supercharge mental focus without any sugar.",
        duration_seconds: 5.0,
        image_url: "/seed_ads/aura-hydrate_scene_2.jpg",
      },
      {
        scene_number: 3,
        chapter_title: "Key Benefit",
        timestamp: "00:09",
        visual_description: "Close up of ice-cold sparkling beverage pouring into a frosted glass with effervescent bubbles rising in golden hour sun",
        voiceover_line: "Every single sip delivers ultra-refreshing flavor and immediate cellular hydration.",
        duration_seconds: 5.0,
        image_url: "/seed_ads/aura-hydrate_scene_3.jpg",
      },
      {
        scene_number: 4,
        chapter_title: "Call to Action",
        timestamp: "00:14",
        visual_description: "Hero commercial packshot of Aura Hydrate can on glowing pedestal with studio lighting and bold Refresh Your Energy text",
        voiceover_line: "Upgrade your daily performance today. Tap below to order Aura Hydrate now.",
        duration_seconds: 5.0,
        image_url: "/seed_ads/aura-hydrate_scene_4.jpg",
      },
    ],
  },
  {
    id: "velvet-noir",
    product_name: "Velvet Noir",
    category: "🌙 Luxury Evening Fragrance",
    tagline: "Seductive smoky cedar & midnight vanilla orchid",
    brief: "Smoky cedar and midnight vanilla fragrance designed for seductive evening rooftop scenes",
    video_url: "/seed_ads/velvet-noir.mp4",
    thumbnail_url: "/seed_ads/velvet-noir_scene_1.jpg",
    accent_color: "#e8a33d",
    scenes: [
      {
        scene_number: 1,
        chapter_title: "The Hook",
        timestamp: "00:00",
        visual_description: "Luxurious obsidian glass perfume bottle Velvet Noir with golden typography resting on polished black marble with subtle smoke mist",
        voiceover_line: "Step into the night with unforgettable allure and magnetic confidence.",
        duration_seconds: 4.5,
        image_url: "/seed_ads/velvet-noir_scene_1.jpg",
      },
      {
        scene_number: 2,
        chapter_title: "The Essence",
        timestamp: "00:04",
        visual_description: "Midnight vanilla orchid blossom and smoky cedarwood botanicals bathed in warm sunset rooftop amber lighting",
        voiceover_line: "Crafted with rare evening botanicals for a seductive, long-lasting luxury aura.",
        duration_seconds: 5.0,
        image_url: "/seed_ads/velvet-noir_scene_2.jpg",
      },
      {
        scene_number: 3,
        chapter_title: "The Emotion",
        timestamp: "00:09",
        visual_description: "Cinematic slow motion golden mist spray floating through beams of moonlight in a modern penthouse",
        voiceover_line: "A sophisticated statement of elegance that captivates every room you enter.",
        duration_seconds: 5.0,
        image_url: "/seed_ads/velvet-noir_scene_3.jpg",
      },
      {
        scene_number: 4,
        chapter_title: "Prestige CTA",
        timestamp: "00:14",
        visual_description: "Center prestige shot of Velvet Noir fragrance bottle on illuminated obsidian plinth with velvet background and gold trim",
        voiceover_line: "Discover your signature evening scent. Experience Velvet Noir tonight.",
        duration_seconds: 5.0,
        image_url: "/seed_ads/velvet-noir_scene_4.jpg",
      },
    ],
  },
  {
    id: "aeropulse-cloud",
    product_name: "AeroPulse Cloud",
    category: "👟 Performance Marathon Runners",
    tagline: "Carbon-plate propulsion with zero-gravity energy return",
    brief: "Carbon-plate running sneakers engineered for marathon speed and zero-gravity road feel",
    video_url: "/seed_ads/aeropulse-cloud.mp4",
    thumbnail_url: "/seed_ads/aeropulse-cloud_scene_1.jpg",
    accent_color: "#2dd4bf",
    scenes: [
      {
        scene_number: 1,
        chapter_title: "The Barrier",
        timestamp: "00:00",
        visual_description: "Close-up of futuristic carbon-fiber running shoe AeroPulse touching wet city asphalt with neon reflection and speed blur",
        voiceover_line: "Heavy running shoes holding you back from your fastest personal record?",
        duration_seconds: 4.5,
        image_url: "/seed_ads/aeropulse-cloud_scene_1.jpg",
      },
      {
        scene_number: 2,
        chapter_title: "Zero-Gravity Tech",
        timestamp: "00:04",
        visual_description: "High-tech nitrogen-infused foam midsole compressing and propelling forward with explosive kinetic energy particles",
        voiceover_line: "AeroPulse Cloud delivers zero-gravity cushion and explosive energy return.",
        duration_seconds: 5.0,
        image_url: "/seed_ads/aeropulse-cloud_scene_2.jpg",
      },
      {
        scene_number: 3,
        chapter_title: "Marathon Speed",
        timestamp: "00:09",
        visual_description: "Marathon athlete sprinting at dawn through city bridge with morning fog and sleek aerodynamic silhouette",
        voiceover_line: "Engineered for marathon durability, featherlight speed, and peak performance.",
        duration_seconds: 5.0,
        image_url: "/seed_ads/aeropulse-cloud_scene_3.jpg",
      },
      {
        scene_number: 4,
        chapter_title: "Defy Gravity CTA",
        timestamp: "00:14",
        visual_description: "Dynamic floating sneaker shot of AeroPulse Cloud in mid-air with carbon plate highlight and Defy Gravity slogan",
        voiceover_line: "Break your limits on every run. Order your AeroPulse Cloud pair today.",
        duration_seconds: 5.0,
        image_url: "/seed_ads/aeropulse-cloud_scene_4.jpg",
      },
    ],
  },
  {
    id: "chronoflow",
    product_name: "ChronoFlow",
    category: "💻 Autonomous AI Workflow App",
    tagline: "Autonomous project orchestrator for high-velocity teams",
    brief: "Autonomous task orchestrator that turns chaotic project schedules into synchronized timeline maps",
    video_url: "/seed_ads/chronoflow.mp4",
    thumbnail_url: "/seed_ads/chronoflow_scene_1.jpg",
    accent_color: "#60a5fa",
    scenes: [
      {
        scene_number: 1,
        chapter_title: "Chaotic Friction",
        timestamp: "00:00",
        visual_description: "Modern creative director working late at glowing ultra-wide monitor surrounded by complex scattered project deadlines",
        voiceover_line: "Drowning in chaotic schedules and missed deadlines every single week?",
        duration_seconds: 4.5,
        image_url: "/seed_ads/chronoflow_scene_1.jpg",
      },
      {
        scene_number: 2,
        chapter_title: "Autonomous Sync",
        timestamp: "00:04",
        visual_description: "Futuristic 3D holographic timeline map automatically synchronizing chaotic tasks into smooth connected glowing nodes",
        voiceover_line: "ChronoFlow autonomously orchestrates your entire team workflow in real-time.",
        duration_seconds: 5.0,
        image_url: "/seed_ads/chronoflow_scene_2.jpg",
      },
      {
        scene_number: 3,
        chapter_title: "Velocity Multiplier",
        timestamp: "00:09",
        visual_description: "Clean glassmorphic dark mode productivity analytics dashboard with 10x speed multiplier and completed milestones",
        voiceover_line: "Eliminate busywork and save fifteen hours every week with AI automation.",
        duration_seconds: 5.0,
        image_url: "/seed_ads/chronoflow_scene_3.jpg",
      },
      {
        scene_number: 4,
        chapter_title: "14-Day Trial CTA",
        timestamp: "00:14",
        visual_description: "Sleek glowing ChronoFlow application interface centered with Start 14-Day Free Trial call-to-action button",
        voiceover_line: "Reclaim your creative focus today. Start your free ChronoFlow trial now.",
        duration_seconds: 5.0,
        image_url: "/seed_ads/chronoflow_scene_4.jpg",
      },
    ],
  },
];
