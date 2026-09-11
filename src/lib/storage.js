/** Remembers the user's settings (selected sizes, fit, format…) between visits. */
const KEY = "aitechies-social-sizes-v1";

export const loadSettings = () => {
  try {
    const raw = localStorage.getItem(KEY);
    const s = raw ? JSON.parse(raw) : null;
    return s && typeof s === "object" ? s : null;
  } catch {
    return null;
  }
};

export const saveSettings = (settings) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    /* private mode / quota — ignore */
  }
};

export const clearSettings = () => {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
};
