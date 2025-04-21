
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				nft: {
					purple: {
						DEFAULT: '#8B5CF6',
						dark: '#6D28D9',
						light: '#A78BFA'
					},
					background: {
						light: '#F9FAFB',
						dark: '#1F2937'
					}
				},
				game: {
					primary: "#92ecfd",
					accent: "#845aff",
					"accent-light": "#a694fa",
					neon: "#00f7ff",
					warning: "#ffdf8e",
					land: "#9ef79f",
					npc: "#ffd900",
					player: "#7ec6ff",
					bg: "#16151a",
					card: "#27222e"
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'pulse-light': {
					'0%, 100%': {
						boxShadow: '0 0 0 0 rgba(139, 92, 246, 0.4)'
					},
					'50%': {
						boxShadow: '0 0 0 12px rgba(139, 92, 246, 0)'
					}
				},
				'shimmer': {
					'0%': {
						backgroundPosition: '-1000px 0',
					},
					'100%': {
						backgroundPosition: '1000px 0',
					},
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.4s ease-out',
				'pulse-light': 'pulse-light 2s infinite',
				'shimmer': 'shimmer 2s infinite linear'
			},
			boxShadow: {
				card: '0 10px 15px -3px rgba(0, 0, 0, 0.12), 0 4px 10px -2px rgba(134,86,232, 0.09)',
				'card-hover': '0 20px 25px -5px rgba(0, 255, 255, 0.09), 0 10px 24px -5px rgba(140, 136, 255, 0.11)',
				'glass': '0 4px 15px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(255, 255, 255, 0.05)'
			},
			backgroundImage: {
				"game-gradient": "linear-gradient(105deg, #214b7c 2%, #2d2248 63%, #7a43c6 100%)",
				"game-card": "linear-gradient(145deg, rgba(18,30,49,.98) 0%, rgba(19,6,32,.91) 100%)"
			},
			transitionProperty: {
				'height': 'height',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
