/**
 * 功能：Umami分析类型定义
 * 目的：扩展Window接口，添加umami方法类型
 * 作者：Yqxnice
 */
interface Window {
  umami?: (event: string, ...args: any[]) => void;
}
