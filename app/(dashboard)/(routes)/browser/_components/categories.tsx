"use client";

import { Category } from "@prisma/client";
import {
    FaCode,           // Programming
    FaPaintBrush,     // Design
    FaBullhorn,       // Marketing
    FaBriefcase,      // Business
    FaCamera,         // Photography
    FaMusic,          // Music
    FaHeartbeat,      // Health
    FaFlask,          // Science
    FaBookOpen,       // Education
    FaUserAlt,        // Lifestyle
    FaPlane,          // Travel
    FaUtensils,       // Food
    FaRunning,        // Sports
    FaGamepad,        // Gaming
    FaMoneyBillWave   // Finance
  } from "react-icons/fa";
      
import { IconType } from "react-icons";
import { CategoryItem } from "./category-item";


interface CategoriesProps {
    items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
    "Programming": FaCode,
    "Design": FaPaintBrush,
    "Marketing": FaBullhorn,
    "Business": FaBriefcase,
    "Photography": FaCamera,
    "Music": FaMusic,
    "Health": FaHeartbeat,
    "Science": FaFlask,
    "Education": FaBookOpen,
    "Lifestyle": FaUserAlt,
    "Travel": FaPlane,
    "Food": FaUtensils,
    "Sports": FaRunning,
    "Gaming": FaGamepad,
    "Finance": FaMoneyBillWave,
  };

export const Categories = ({
    items,
 }: CategoriesProps) => {
    return (
    <div className="flex items-center gap-x-2 overflow-auto pb-2">
 {items.map((items)=>(
    <CategoryItem
    key={items.id}
    label={items.name}
    icon={iconMap[items.name]}
    value={items.id}
    />
 ))}
    </div>
    )
    }
