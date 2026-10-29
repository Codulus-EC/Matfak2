export type HeroButton = {
  label: string;
  href: string;
  variant: "primary" | "outline" | "vk";
  external?: boolean;
};

export type HeroSlide = {
  id: string;
  image: string;
  eyebrow: string;
  mode: "main" | "news";
  top: string;
  bottom: string;
  italic?: string;
  subtitle: string;
  buttons: HeroButton[];
};

export type NewsAccent = "green" | "lime" | "cyan" | "blue" | "yellow";

export type NewsItem = {
  slug: string;
  date: string;
  dateLabel: string;
  kind: string;
  title: string;
  excerpt: string;
  body?: string[];
  image: string;
  tags: string[];
  featured?: boolean;
  accent: NewsAccent;
};

export type SiteContent = {
  heroSlides: HeroSlide[];
  newsItems: NewsItem[];
};
