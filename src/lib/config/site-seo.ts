import { Metadata } from "next";
// import logoImg from "@public/Blue_Logo.png";
import { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";

enum MODE {
  DARK = "dark",
  LIGHT = "light",
}

export const siteSeo = {
  title: "Costria Rental - Admin Portal",
  description: `Costria Rental - Admin Portal`,
  // logo: logoImg,
  icon: "/favicon.ico",
  mode: MODE.LIGHT,
};

export const metaObject = (
  title?: string,
  openGraph?: OpenGraph,
  description: string = siteSeo.description,
): Metadata => {
  return {
    title: title
      ? `${title} - Costria Rental - Admin Portal`
      : siteSeo.title,
    description,
    openGraph: openGraph ?? {
      title: title ? `${title} - Costria Rental - Admin Portal` : title,
      description,
      siteName: "Costria Rental - Admin Portal",
      locale: "en_US",
      type: "website",
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
};
