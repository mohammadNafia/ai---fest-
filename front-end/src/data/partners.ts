import { Partner } from '@/types';
import { Rocket, Award, Megaphone, Handshake, Brain, Building2, Store, Cpu, Radio } from 'lucide-react';

// Partners data for Baghdad AI Summit 2026
export const PARTNERS: Partner[] = [
  { id: 1, name: "Babel AI", category: "Startup", icon: Rocket, color: "text-blue-400" },
  { id: 2, name: "TechCorp", category: "Sponsor", icon: Award, color: "text-purple-400" },
  { id: 3, name: "Baghdad Post", category: "Media", icon: Megaphone, color: "text-pink-400" },
  { id: 4, name: "Tigris VC", category: "Investor", icon: Handshake, color: "text-green-400" },
  { id: 5, name: "Ur Data", category: "Startup", icon: Brain, color: "text-blue-400" },
  { id: 6, name: "Future Iraq", category: "Sponsor", icon: Building2, color: "text-purple-400" },
  { id: 7, name: "Cloud Sys", category: "Exhibitor", icon: Store, color: "text-orange-400" },
  { id: 8, name: "Sumer Robotics", category: "Startup", icon: Cpu, color: "text-blue-400" },
  { id: 9, name: "Euphrates Cap", category: "Investor", icon: Handshake, color: "text-green-400" },
  { id: 10, name: "Tech News ME", category: "Media", icon: Radio, color: "text-pink-400" },
];

