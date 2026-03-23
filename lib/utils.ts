/**
 * 功能：通用工具函数
 * 目的：提供项目中使用的通用工具函数，如类名合并等
 * 作者：Yqxnice
 */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
