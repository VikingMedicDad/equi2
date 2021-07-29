
export type PageContent = {
  name: string;
  title: string;
  subTitle: string;
  message: string;
  logo: string;
};

type PageContentOptions = {
  [key: string]: PageContent;
};

export const DEFAULT_PAGE_SOURCE = "default";

export const SIGN_IN_PAGE_CONTENT: PageContentOptions = {
  rc: {
    name: "Recast",
    title: "Convert your excel sheet into Node.js app",
    subTitle: "",
    logo: '',
    message: "Recast is built on and powered by Amplication.",
  },
  [DEFAULT_PAGE_SOURCE]: {
    name: "Amplication",
    title: "Instantly generate quality Node.js apps",
    subTitle: "Just code what matters.",
    logo: '',
    message: "",
  },
};
