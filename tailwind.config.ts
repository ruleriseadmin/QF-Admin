import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			navcolor: '#FFFFFF',
  			navfont: '#282828',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			outfit: [
  				'var(--font-outfit)',
  				'sans-serif'
  			],
  			comic: [
  				'var(--font-comic)',
  				'sans-serif'
  			],
  			patrick: [
  				'var(--font-patrick)',
  				'sans-serif'
  			],
  			kumbh: [
  				'var(--font-kumbh)',
  				'sans-serif'
  			],
  			roboto: [
  				'var(--font-roboto)',
  				'sans-serif'
  			],
  			montserrat: [
  				'var(--font-montserrat)',
  				'sans-serif'
  			],
  			euclid: 
  				'var(--font-euclid)',
  			poppins: [
  				'var(--font-poppins)',
  				'sans-serif'
  			]
  		},
  		gridTemplateColumns: {
  			'70/30': '70% 28%'
  		},
  		lineHeight: {
  			'35': '35.28px',
  			'70': '70px',
  			'80': '80px'
  		},
  		backgroundImage: {
  			'text-gradient': 'linear-gradient(101.65deg, #58E427 -11.07%, #4D8A28 76.56%)',
  			gradient2: 'linear-gradient(101.65deg, #F97870 -11.07%, #B57C0F 76.56%)',
  			gradient3: 'linear-gradient(101.65deg, #CBC6C5 -11.07%, #464542 76.56%)',
  			gradient4: 'linear-gradient(304.63deg, #46A4B5 17.17%, #13171D 76.96%)',
  			gradient6: 'linear-gradient(274.94deg, #46A4B5 60.47%, #13171D 95.86%)',
  			gradient7: 'linear-gradient(272.62deg, #3F1A6B -12.06%, #E76229 102.84%)',
  			gradient8: 'linear-gradient(279.76deg, #2A2F2D 0%, #4F040C 51.24%, rgba(0, 0, 0, 0.92) 109.32%)',
  			gradient9: 'linear-gradient(279.76deg, #424DB1 0%, rgba(66, 77, 177, 0.9625) 51.24%, rgba(66, 77, 177, 0.92) 109.32%)'
  		},
  		borderRadius: {
  			circle: '50%',
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		boxShadow: {
  			custom1: '0px 4px 10px 0px #0000000D',
  			custom2: ' 0px 0px 20px 0px #0000001A',
  			custom3: '0px 4px 4px 0px #00000040',
  			customshadow4: '0px 0px 4px 0px #0000000D',
  			customshadow5: '0px 0px 3px 0px #00000014',
  			customshadow6: '0px 1px 2px 0px #1018280D',
  			customshadow7: '0px 0px 5px 0px #0000001A',
  			customshadow8: '0px 0px 8px 0px #00000026',
			pieshadow:'0px 0px 30px 0px #00000040 inset, 0px 0px 15px 0px #0000004D',
			blacklist:'0px 1px 2px 0px #1018280D'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
