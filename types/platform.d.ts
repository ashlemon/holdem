interface Window {
  Telegram?: {
    WebApp?: {
      initData?: string;
      initDataUnsafe?: {
        user?: {
          id?: number;
          username?: string;
          first_name?: string;
        };
      };
      openInvoice?: (invoiceUrl: string, callback?: (status: string) => void) => void;
      ready?: () => void;
    };
  };
  __HOLD_EM_PLATFORM__?: string;
  DISCORD_CLIENT_ID?: string;
}

declare const wx: {
  login: (options: {
    success?: (result: { code: string }) => void;
    fail?: () => void;
  }) => void;
};
