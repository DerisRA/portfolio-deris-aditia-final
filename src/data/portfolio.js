import {
  FaInstagram,
  FaEnvelope,
  FaWhatsapp,
  FaLinkedin,
  FaGithub,
  FaPalette,
  FaPenNib,
  FaFont,
  FaLayerGroup,
  FaImage,
  FaBullhorn,
  FaLaptopCode,
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaGitAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";

export const profile = {
  name: "Deris Rizki Aditia",
  shortName: "Deris",
  role: "Graphic Designer & Motion Graphics",
  description:
    "I am a graphic designer focused on brand identity, logo design, visual systems, motion graphics and social media content. I help brands build modern, consistent, and recognizable visual identities.",
  location: "Indonesia",
  email: "lilpopme69@gmail.com",
  whatsapp: "6281284507565",
  cvUrl:
    "https://drive.google.com/uc?export=download&id=1V5yTMoTiXgVmzNmAaxSts-gWqyAQfGe2",
};

export const navLinks = [
  {
    label: "Home",
    href: "#home",
  },
  {
    label: "About",
    href: "#about",
  },
  {
    label: "Skills",
    href: "#skills",
  },
  {
    label: "Projects",
    href: "#projects",
  },
  {
    label: "Experience",
    href: "#experience",
  },
  {
    label: "Contact",
    href: "#contact",
  },
];

export const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com/derisrizkiaditia",
    icon: FaInstagram,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/deris-rizki-aditia-886813388/",
    icon: FaLinkedin,
  },
  {
    label: "GitHub",
    href: "https://github.com/DerisRA",
    icon: FaGithub,
  },
  {
    label: "Email",
    href: "mailto:lilpopme69@gmail.com",
    icon: FaEnvelope,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/6281284507565",
    icon: FaWhatsapp,
  },
];

export const about = {
  title: "About Me",
  description:
    "Hello, I'm Deris Rizki Aditia, a graphic designer with a strong focus on Social Media Design, Branding, Motion Graphics, and Poster Design. I believe that design is not just about aesthetics; it is a strategic tool to help brands clearly communicate their message, personality, and core values. As a creative, hard-working, and highly organized professional, I take pride in being a fast learner who is always eager to grow. Above all, I believe that regular communication is important in any collaboration to ensure the final output aligns perfectly with the client's vision.",
  highlights: [
    "Focused on Social Media Design, Branding, Motion Graphics, and Poster Design.",
    "Dedicated to helping brands clearly communicate their message, personality, and values.",
    "A creative, hard-working, organized professional and a fast learner eager to grow.",
    "Prioritizes regular communication to ensure the final output aligns with the client's vision.",
  ],
};

export const skills = [
  {
    title: "Brand Identity",
    description:
      "Creating consistent visual identities including logos, colors, typography, and brand direction.",
    icon: FaPalette,
  },
  {
    title: "Logo Design",
    description:
      "Designing simple, memorable, and meaningful logos that match the brand personality.",
    icon: FaPenNib,
  },
  {
    title: "Typography",
    description:
      "Selecting and arranging typefaces to make brand visuals professional, readable, and distinctive.",
    icon: FaFont,
  },
  {
    title: "Motion Graphics",
    description:
      "Creating dynamic visual elements for animations, videos, and interactive experiences.",
    icon: FaLayerGroup,
  },
  {
    title: "Social Media Design",
    description:
      "Creating clean, attractive, and promotional Instagram content for brands and products.",
    icon: FaImage,
  },
  {
    title: "Content Visual",
    description:
      "Transforming promotional messages into clear and engaging visual communication.",
    icon: FaBullhorn,
  },
];

export const projects = [
  {
    title: "TOSERBA TERLARIS.ID",
    category: "Brand Guideline",
    type: "pdf",
    pdfUrl: "/projects/toserba/brand-guideline.pdf",
    description:
      "A complete brand guideline for TOSERBA TERLARIS.ID, a dynamic Indonesian snack brand specializing in the most popular contemporary treats (cemilan kekinian), covering logo identity, visual system, color palette, typography, and brand application.",
    details: [
      "Created the main logo identity.",
      "Designed secondary logo variations.",
      "Built brand icon and supporting visual assets.",
      "Defined color palette and typography system.",
      "Prepared a complete brand guideline document.",
    ],
    technologies: [
      "Brand Identity",
      "Logo Design",
      "Mockup Design",
      "Typography",
      "Color System",
    ],
    demoUrl: "/projects/toserba/brand-guideline.pdf",
    githubUrl: "#",
    icon: FaExternalLinkAlt,
  },
  {
    title: "ROTIAN",
    category: "Brand Guideline",
    type: "pdf",
    pdfUrl: "/projects/rotian/brand-guideline.pdf",
    description:
      "A complete brand guideline for ROTIAN, a professional bakery manufacturer that harmonizes authentic flavors with high health standards. a bakery brand identity project designed to feel warm, clean, trustworthy, and premium.",
    details: [
      "Designed logo and supporting brand marks.",
      "Created bakery-inspired visual identity.",
      "Defined brand colors and typography direction.",
      "Built a warm and premium brand appearance.",
      "Prepared a structured brand guideline document.",
    ],
    technologies: [
      "Brand Identity",
      "Logo Design",
      "Mockup Design",
      "Visual System",
      "Typography",
    ],
    demoUrl: "/projects/rotian/brand-guideline.pdf",
    githubUrl: "#",
    icon: FaExternalLinkAlt,
  },
  {
    title: "Harvies Coffee",
    category: "Social Media Design",
    type: "images",
    images: [
      "/projects/harvies/1.jpg",
      "/projects/harvies/2.jpg",
      "/projects/harvies/3.jpg",
      "/projects/harvies/4.jpg",
    ],
    description:
      "Social media design project for Harvies Coffee, a modern lifestyle cafe serves as the perfect destination for those seeking trendy atmosphere to relax, work, or socialize in professional environment. Specializing in artisanal donuts and signature coffee, delivering premium flavors at accessible prices. By combining high-quality treats with a budget-friendly approach, ensure a memorable experience that balance style with great value. focusing on beverage promotion, Instagram content, and modern coffee shop visual communication. Designed to meet the demand for comfortable, clean and aesthetically pleasing social spaces.",
    details: [
      "Designed Instagram content for beverage promotion.",
      "Created visuals aligned with coffee shop branding.",
      "Highlighted product messages clearly.",
      "Built mobile-friendly social media layouts.",
    ],
    technologies: [
      "Social Media Design",
      "Instagram Content",
      "Product Promotion",
      "Visual Layout",
    ],
    demoUrl: "#",
    githubUrl: "#",
    icon: FaInstagram,
  },
  {
    title: "Lacoco.id",
    category: "Social Media Design",
    type: "images",
    images: [
      "/projects/lacoco/1.jpg",
      "/projects/lacoco/2.jpg",
      "/projects/lacoco/3.jpg",
      "/projects/lacoco/4.jpg",
    ],
    description:
      "A clean and elegant social media design project for Lacoco.id, a premium Indonesian beauty brand founded in 2007. dedicated to providing high-quality skincare solutions. Through elegance and innovation. Lacoco has become a trusted leader in beauty industry. focusing on beauty, skincare, confidence, delivering visible results, ensuring that luxury, nature-based skincare is accessible to everyone who value professional quality and premium visual presentation.",
    details: [
      "Created social media visuals for a skincare brand.",
      "Built a clean and modern visual concept.",
      "Aligned design with beauty and confidence messaging.",
      "Improved visual composition and product presentation.",
    ],
    technologies: [
      "Social Media Design",
      "Beauty Brand",
      "Instagram Content",
      "Clean Visual",
    ],
    demoUrl: "#",
    githubUrl: "#",
    icon: FaInstagram,
  },

  {
  title: "Poster Design Collection",
  category: "Poster Design",
  type: "posters",
  images: [
    "/projects/posters/1.jpg",
    "/projects/posters/2.jpg",
    "/projects/posters/3.jpg",
    "/projects/posters/4.jpg",
    "/projects/posters/5.jpg",
    "/projects/posters/6.jpg",
    "/projects/posters/7.jpg",
    "/projects/posters/8.jpg",
  ],
  description:
    "These designs focus on striking visual composition, precise typographic selection, and clear information hierarchy to effectively communicate the urgency of wildlife protection to the audience. By blending high-impact imagery with meticulous layout execution, each poster transforms critical advocacy data into a compelling visual narrative that commands attention and drives meaningful engagement.",
  details: [
    "Created poster visuals with striking visual composition and layout.",
    "Utilized precise typographic selection and clear information hierarchy.",
    "Designed to effectively communicate the urgency of wildlife protection to the audience.",
    "Built a consistent graphic direction across both promotional and editorial poster formats.",
  ],
  technologies: [
    "Poster Design",
    "Graphic Design",
    "Typography",
    "Visual Layout",
    "Creative Direction",
  ],
  demoUrl: "#",
  githubUrl: "#",
  icon: FaImage,
},
];

export const experiences = [
  {
    role: "Freelance",
    company: "Freelance",
    period: "2018 - Present",
    description:
      "Worked as a Freelance Graphic Designer, providing creative design solutions for various clients and projects. Responsible for creating social media content, promotional materials, branding assets, and digital advertisements tailored to client needs and target audiences. Managed multiple projects independently, communicated directly with clients, and ensured timely delivery of high-quality visual designs while maintaining strong attention to detail and brand consistency..",
  },
  {
    role: "Graphic Designer",
    company: "Harvies Coffee",
    period: "2019 - 2020",
    description:
      "Worked as a Graphic Designer at Harvies Coffee, responsible for creating visually engaging content to support branding and marketing initiatives. Designed promotional materials for social media, menus, packaging, and in-store visuals while ensuring consistency with the brand identity. Collaborated with the marketing team to develop creative concepts for campaigns, enhance customer engagement, and strengthen brand presence through compelling and cohesive visual communication..",
  },
  {
    role: "Civil Servant and Graphic Designer",
    company: "Dinas Peternakan dan Kesehatan Hewan Kabupaten Simeulue",
    period: "2021 - Present",
    description:
      "Serving as a Civil Servant (PNS) and Livestock Seed Quality Supervisor (Wasbitnak) at the Department of Plantation, Livestock, and Animal Health, Simeulue Regency, responsible for supervising livestock breeding quality standards, conducting field inspections and technical evaluations, verifying certification requirements, providing technical guidance to farmers, and preparing official monitoring reports. Additionally, contributed to designing visual materials and graphic content for educational campaigns, public information, and departmental communication activities.",
  },
];

export const footer = {
  text: "Designed and developed by Deris Rizki Aditia",
};