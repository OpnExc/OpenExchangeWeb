import { 
  BiBook, 
  BiDesktop, 
  BiFridge, 
  BiChair, 
} from 'react-icons/bi';
import { FaLightbulb, FaBoxOpen, FaPizzaSlice } from 'react-icons/fa'; // Using FontAwesome for missing icons

export const categories = [
  { id: 1, name: "Books & Study Materials", icon: BiBook },
  { id: 2, name: "Electronics", icon: BiDesktop },
  { id: 5, name: "Packed Foods and Drinks", icon: FaPizzaSlice }, // Replaced with FontAwesome icon
  { id: 6, name: "Accessories", icon: FaBoxOpen }, // Replaced with FontAwesome icon
];
