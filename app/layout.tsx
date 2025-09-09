'use client'
import "@/assets/styles/globals.css";
import { Outfit, Comic_Neue, Patrick_Hand_SC,Roboto ,Kumbh_Sans, Montserrat, Poppins } from 'next/font/google';
import { config } from '@fortawesome/fontawesome-svg-core';
import localFont from '@next/font/local'
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

// Initialize fonts
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', weight: ['300', '400', '500', '600', '700'],display: "swap", });
const comic = Comic_Neue({ subsets: ['latin'], variable: '--font-comic', weight: ['400', '700'] ,display: "swap"});
const patrick = Patrick_Hand_SC({ subsets: ['latin'], variable: '--font-patrick', weight: ['400'],display: "swap", });
const kumbh = Kumbh_Sans({ subsets: ['latin'], variable: '--font-kumbh', weight: ['300', '400', '500', '600', '700'],display: "swap", });
const roboto = Roboto({ subsets: ['latin'], variable: '--font-roboto', weight: ['300', '400', '500', '700'],display: "swap", });
const montserrat = Montserrat({ 
  subsets: ['latin'], 
  variable: '--font-montserrat', 
  weight: ['300', '400', '500', '600', '700'],
  display: "swap",
  adjustFontFallback: false,
 });
const poppins = Poppins({ subsets: ['latin'], variable: '--font-poppins', weight: ['300', '400', '500', '600', '700'],display: "swap", });
const euclid = localFont({
  src: [
    { path: '../public/fonts/euclid/Euclid Circular A Regular.ttf', weight: '400' },
    { path: '../public/fonts/euclid/Euclid Circular A Medium.ttf', weight: '500' },
    
    { path: '../public/fonts/euclid/Euclid Circular A Bold.ttf', weight: '700' },
  ],
  variable: '--font-euclid',
  display: 'swap',
});



export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`bg-background ${outfit.variable} ${comic.variable} ${patrick.variable} ${kumbh.variable} ${roboto.variable} ${montserrat.variable} ${poppins.variable} ${euclid.variable}`}>
      <body >
        {children}
      </body>
    </html>
  );
}
