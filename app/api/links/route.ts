/**
 * 功能：友情链接 API 路由
 * 目的：提供友情链接数据
 * 作者：Yqxnice
 */
import { NextResponse } from 'next/server';

type LinkItem = {
  id: string;
  name: string;
  url: string;
  description?: string;
  logo?: string;
  author?: string;
  tags?: string[];
};

const links: LinkItem[] = [
  {
    id: "fm",
    name: "Frontend Master",
    url: "https://frontendmaster.example",
    description: "Frontend Master 提供高质量前端教程与资源",
    logo: "https://dummyimage.com/60x60/111/fff.png&text=FM",
    author: "Frontend Master Team",
    tags: ["frontend","javascript"]
  },
  {
    id: "uux",
    name: "UI UX Pro Max",
    url: "https://uiuxpromax.example",
    description: "UI/UX 设计资源和案例集",
    logo: "https://dummyimage.com/60x60/111/fff.png&text=UX",
    author: "UI UX Pro Max Team",
    tags: ["ui","ux","design"]
  }
];

export async function GET() {
  return NextResponse.json(links);
}
