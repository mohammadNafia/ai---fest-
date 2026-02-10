import { Rocket, Award, Mic, Store, Users, Handshake, Megaphone, Brain, Building2, Cpu, Radio } from 'lucide-react';

export const SPEAKERS = [
  { id: 1, name: "Dr. Amira Al-Baghdadi", role: "Chief AI Scientist", company: "Future Iraq Tech", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" },
  { id: 2, name: "Prof. John Neural", role: "Director of Robotics", company: "Global AI Systems", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" },
  { id: 3, name: "Layla Hassan", role: "Founder", company: "Tigris Valley Ventures", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400" },
  { id: 4, name: "Tariq Jameel", role: "Ethical AI Lead", company: "OpenMinds", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
  { id: 5, name: "Sarah Chen", role: "VP Engineering", company: "DataFlow", image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=400" },
  { id: 6, name: "Omar Farooq", role: "CEO", company: "Baghdad CyberSec", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400" }
];

export const AGENDA_ITEMS = [
  { time: "09:00 AM", title: "Registration & Networking", desc: "Welcome breakfast at the Grand Hall", type: "Logistics" },
  { time: "10:00 AM", title: "Opening Keynote: The New Era", desc: "How Baghdad is reclaiming its title as a center of wisdom.", type: "Keynote" },
  { time: "11:30 AM", title: "Panel: AI Infrastructure", desc: "Building the backbone of the digital Middle East.", type: "Panel" },
  { time: "02:00 PM", title: "Workshop: Generative AI", desc: "Practical applications for local businesses.", type: "Workshop" },
  { time: "04:00 PM", title: "Startup Pitch Battle", desc: "10 Startups, 1 Winner, $50k Prize.", type: "Competition" },
];

export const PARTNERS = [
  { name: "Babel AI", category: "Startup", icon: Rocket, color: "text-blue-400" },
  { name: "TechCorp", category: "Sponsor", icon: Award, color: "text-purple-400" },
  { name: "Baghdad Post", category: "Media", icon: Megaphone, color: "text-pink-400" },
  { name: "Tigris VC", category: "Investor", icon: Handshake, color: "text-green-400" },
  { name: "Ur Data", category: "Startup", icon: Brain, color: "text-blue-400" },
  { name: "Future Iraq", category: "Sponsor", icon: Building2, color: "text-purple-400" },
  { name: "Cloud Sys", category: "Exhibitor", icon: Store, color: "text-orange-400" },
  { name: "Sumer Robotics", category: "Startup", icon: Cpu, color: "text-blue-400" },
  { name: "Euphrates Cap", category: "Investor", icon: Handshake, color: "text-green-400" },
  { name: "Tech News ME", category: "Media", icon: Radio, color: "text-pink-400" },
];

