function validateEnv<T extends Record<string, string | undefined>>(envMap: T): { [K in keyof T]: string } {
  for (const [key, value] of Object.entries(envMap)) {
    if (!value) {
      throw new Error(
        `[Config Error] Missing required environment variable: ${key}. Please define it in your .env file.`
      );
    }
  }
  return envMap as { [K in keyof T]: string };
}

const rawConfig = {
  NEXT_PUBLIC_TELEGRAM_URL: process.env.NEXT_PUBLIC_TELEGRAM_URL,
  NEXT_PUBLIC_TELEGRAM_HANDLE: process.env.NEXT_PUBLIC_TELEGRAM_HANDLE,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
};

validateEnv(rawConfig);

export const siteConfig = {
  telegramUrl: rawConfig.NEXT_PUBLIC_TELEGRAM_URL!,
  telegramHandle: rawConfig.NEXT_PUBLIC_TELEGRAM_HANDLE!,
  siteUrl: rawConfig.NEXT_PUBLIC_SITE_URL!,
  siteName: rawConfig.NEXT_PUBLIC_SITE_NAME!,
} as const;
