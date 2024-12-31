export interface FooterData {
  about: {
    logo: {
      gray: string;
      white: string;
      link: string;
    };
    links: Array<{
      title: string;
      url: string;
    }>;
  };
  social: Record<string, {
    icon: string;
    link: string;
    qrCode?: string;
  }>;
  legal: {
    links: Array<{
      title: string;
      url: string;
    }>;
    feedback: {
      text: string;
      url: string;
    };
    copyright: string;
    record: {
      text: string;
      url: string;
    };
    adDisclaimer: string;
  };
  localeSelector: {
    currentLocale: {
      text: string;
      icon: string;
    };
  };
}