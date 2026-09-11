/**
 * Social media image sizes (2026 recommendations).
 *
 * Every size has a `kind` so the app can build packs:
 *   profile  → profile pictures, page logos, channel icons (square)
 *   cover    → covers, headers, banners
 *   post     → feed posts, link previews
 *   story    → stories, reels, shorts, vertical video covers
 *   thumb    → video thumbnails
 *   app      → favicons, PWA / app-store icons, feature graphics
 *
 * Dimensions are the *upload* size platforms recommend, not the displayed
 * size (e.g. Facebook shows a 170 px profile picture but wants ≥ 320 px).
 */
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaTiktok,
  FaPinterest,
  FaWhatsapp,
  FaThreads,
  FaSnapchat,
  FaTelegram,
  FaGoogle,
  FaGlobe,
  FaGooglePlay,
} from "react-icons/fa6";
import { SiX } from "react-icons/si";
import { LuRuler } from "react-icons/lu";

export const KINDS = [
  { id: "profile", name: "Profile & logo", desc: "Profile pictures, page logos, channel icons" },
  { id: "cover", name: "Cover & banner", desc: "Covers, headers, channel art" },
  { id: "post", name: "Post", desc: "Feed posts, link previews" },
  { id: "story", name: "Story & vertical", desc: "Stories, reels, shorts, status" },
  { id: "thumb", name: "Thumbnail", desc: "Video thumbnails and previews" },
  { id: "app", name: "Web & app icons", desc: "Favicons, PWA and app-store assets" },
];

export const kindById = (id) => KINDS.find((k) => k.id === id) || KINDS[0];

export const PLATFORMS = [
  {
    id: "facebook",
    name: "Facebook",
    icon: FaFacebook,
    color: "#1877F2",
    sizes: [
      { id: "profile", kind: "profile", name: "Profile picture", w: 720, h: 720, note: "Shown at 170 px on desktop and cropped to a circle — keep the logo centred." },
      { id: "page-cover", kind: "cover", name: "Page cover", w: 1640, h: 624, note: "Displays 820×312 on desktop and 640×360 on phones — keep text in the centre." },
      { id: "group-cover", kind: "cover", name: "Group cover", w: 1640, h: 856 },
      { id: "event-cover", kind: "cover", name: "Event cover", w: 1920, h: 1005 },
      { id: "post-square", kind: "post", name: "Square post", w: 1080, h: 1080 },
      { id: "post-portrait", kind: "post", name: "Portrait post", w: 1080, h: 1350 },
      { id: "post-link", kind: "post", name: "Link / landscape post", w: 1200, h: 630 },
      { id: "story", kind: "story", name: "Story & Reel", w: 1080, h: 1920 },
    ],
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: FaInstagram,
    color: "#E1306C",
    sizes: [
      { id: "profile", kind: "profile", name: "Profile picture", w: 320, h: 320, note: "Displayed as a 110 px circle." },
      { id: "post-square", kind: "post", name: "Square post", w: 1080, h: 1080 },
      { id: "post-portrait", kind: "post", name: "Portrait post", w: 1080, h: 1350, note: "Takes the most feed space." },
      { id: "post-landscape", kind: "post", name: "Landscape post", w: 1080, h: 566 },
      { id: "story", kind: "story", name: "Story & Reel", w: 1080, h: 1920, note: "Keep key content away from the top and bottom 250 px." },
    ],
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: FaYoutube,
    color: "#FF0000",
    sizes: [
      { id: "channel-icon", kind: "profile", name: "Channel icon", w: 800, h: 800 },
      { id: "banner", kind: "cover", name: "Channel banner", w: 2560, h: 1440, note: "Only the centre 1546×423 is visible on every device — keep logo and text there." },
      { id: "thumbnail", kind: "thumb", name: "Video thumbnail", w: 1280, h: 720 },
      { id: "shorts", kind: "story", name: "Shorts cover", w: 1080, h: 1920 },
      { id: "community", kind: "post", name: "Community post", w: 1080, h: 1080 },
      { id: "watermark", kind: "app", name: "Video watermark", w: 150, h: 150 },
    ],
  },
  {
    id: "x",
    name: "X (Twitter)",
    icon: SiX,
    color: "#000000",
    sizes: [
      { id: "profile", kind: "profile", name: "Profile picture", w: 400, h: 400 },
      { id: "header", kind: "cover", name: "Header", w: 1500, h: 500, note: "The profile picture covers the bottom-left corner." },
      { id: "post", kind: "post", name: "Post image", w: 1600, h: 900 },
      { id: "post-square", kind: "post", name: "Square post", w: 1080, h: 1080 },
    ],
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: FaLinkedin,
    color: "#0A66C2",
    sizes: [
      { id: "profile", kind: "profile", name: "Profile picture", w: 400, h: 400 },
      { id: "company-logo", kind: "profile", name: "Company logo", w: 300, h: 300 },
      { id: "background", kind: "cover", name: "Profile background", w: 1584, h: 396 },
      { id: "company-cover", kind: "cover", name: "Company page cover", w: 1128, h: 191 },
      { id: "post", kind: "post", name: "Post image", w: 1200, h: 627 },
      { id: "post-square", kind: "post", name: "Square post", w: 1080, h: 1080 },
    ],
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: FaTiktok,
    color: "#010101",
    sizes: [
      { id: "profile", kind: "profile", name: "Profile picture", w: 200, h: 200 },
      { id: "video-cover", kind: "story", name: "Video cover", w: 1080, h: 1920 },
    ],
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: FaWhatsapp,
    color: "#25D366",
    sizes: [
      { id: "profile", kind: "profile", name: "Profile / Business photo", w: 500, h: 500 },
      { id: "status", kind: "story", name: "Status", w: 1080, h: 1920 },
      { id: "catalog", kind: "post", name: "Catalog product photo", w: 1080, h: 1080 },
    ],
  },
  {
    id: "threads",
    name: "Threads",
    icon: FaThreads,
    color: "#000000",
    sizes: [
      { id: "profile", kind: "profile", name: "Profile picture", w: 320, h: 320 },
      { id: "post-portrait", kind: "post", name: "Portrait post", w: 1080, h: 1350 },
      { id: "post-square", kind: "post", name: "Square post", w: 1080, h: 1080 },
    ],
  },
  {
    id: "pinterest",
    name: "Pinterest",
    icon: FaPinterest,
    color: "#E60023",
    sizes: [
      { id: "profile", kind: "profile", name: "Profile picture", w: 600, h: 600, note: "Displayed as a 165 px circle." },
      { id: "profile-cover", kind: "cover", name: "Profile cover", w: 800, h: 450 },
      { id: "pin", kind: "post", name: "Standard pin", w: 1000, h: 1500 },
      { id: "pin-square", kind: "post", name: "Square pin", w: 1000, h: 1000 },
      { id: "idea-pin", kind: "story", name: "Idea pin", w: 1080, h: 1920 },
    ],
  },
  {
    id: "snapchat",
    name: "Snapchat",
    icon: FaSnapchat,
    color: "#FFFC00",
    onColor: "#111111",
    sizes: [
      { id: "profile", kind: "profile", name: "Profile picture", w: 320, h: 320 },
      { id: "story", kind: "story", name: "Story & ad", w: 1080, h: 1920 },
    ],
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: FaTelegram,
    color: "#26A5E4",
    sizes: [
      { id: "profile", kind: "profile", name: "Profile / channel picture", w: 512, h: 512 },
      { id: "post", kind: "post", name: "Post image", w: 1280, h: 720 },
    ],
  },
  {
    id: "google",
    name: "Google Business",
    icon: FaGoogle,
    color: "#4285F4",
    sizes: [
      { id: "logo", kind: "profile", name: "Business logo", w: 720, h: 720 },
      { id: "cover", kind: "cover", name: "Business cover", w: 1024, h: 576 },
      { id: "post", kind: "post", name: "Business post", w: 1200, h: 900 },
    ],
  },
  {
    id: "web",
    name: "Website",
    icon: FaGlobe,
    color: "#0F172A",
    sizes: [
      { id: "og", kind: "post", name: "Link preview (OG image)", w: 1200, h: 630, note: "Used by WhatsApp, LinkedIn, X and Facebook when your site is shared." },
      { id: "favicon-32", kind: "app", name: "Favicon", w: 32, h: 32 },
      { id: "favicon-64", kind: "app", name: "Favicon (large)", w: 64, h: 64 },
      { id: "apple-touch", kind: "app", name: "Apple touch icon", w: 180, h: 180 },
      { id: "pwa-192", kind: "app", name: "PWA icon", w: 192, h: 192 },
      { id: "pwa-512", kind: "app", name: "PWA icon (large)", w: 512, h: 512 },
    ],
  },
  {
    id: "appstores",
    name: "App stores",
    icon: FaGooglePlay,
    color: "#34A853",
    sizes: [
      { id: "play-icon", kind: "app", name: "Play Store icon", w: 512, h: 512 },
      { id: "play-feature", kind: "cover", name: "Play Store feature graphic", w: 1024, h: 500 },
      { id: "appstore-icon", kind: "app", name: "App Store icon", w: 1024, h: 1024, note: "Apple wants no transparency and no rounded corners — they add the mask." },
    ],
  },
];

export const CUSTOM_PLATFORM_ID = "custom";
export const CUSTOM_PLATFORM = { id: CUSTOM_PLATFORM_ID, name: "Custom", icon: LuRuler, color: "#0F172A", sizes: [] };

/** Turns the user's custom sizes ({ id, name, w, h }) into size objects like the built-in ones. */
export const customToSizes = (list = []) =>
  list.map((c) => ({ ...c, kind: "custom", key: `${CUSTOM_PLATFORM_ID}/${c.id}`, platform: CUSTOM_PLATFORM }));

/** Flat list of every built-in size with its platform attached. Keys are `${platformId}/${sizeId}`. */
export const ALL_SIZES = PLATFORMS.flatMap((p) => p.sizes.map((s) => ({ ...s, key: `${p.id}/${s.id}`, platform: p })));

export const sizeByKey = (key) => ALL_SIZES.find((s) => s.key === key);

/** Quick packs shown in step 2. `kinds` selects every size of those kinds. */
export const PACKS = [
  { id: "logo", name: "Logo pack", desc: "Profile pictures, page logos, favicons & app icons", kinds: ["profile", "app"] },
  { id: "banner", name: "Banner pack", desc: "Covers, headers, posts, stories & thumbnails", kinds: ["cover", "post", "story", "thumb"] },
  { id: "all", name: "Everything", desc: "Every size on every platform", kinds: KINDS.map((k) => k.id) },
];

export const keysForKinds = (kinds) => ALL_SIZES.filter((s) => kinds.includes(s.kind)).map((s) => s.key);

export const platformById = (id) => PLATFORMS.find((p) => p.id === id);

/** Guess whether an image is a logo (roughly square) or a banner (wide). */
export const guessMode = (width, height) => {
  if (!width || !height) return "logo";
  const ratio = width / height;
  return ratio > 0.8 && ratio < 1.25 ? "logo" : "banner";
};
