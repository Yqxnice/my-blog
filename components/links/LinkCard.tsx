"use client";
import React from "react";

export type LinkItem = {
  id: string;
  name: string;
  url: string;
  description?: string;
  logo?: string;
  author?: string;
  tags?: string[];
};

// Plan B 方案：使用轻量的 Card 风格实现，若后续有 shadcn/ui 组件可替换为 Card/Avatar/Tag 等
export const LinkCard: React.FC<{ item: LinkItem }> = ({ item }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-start gap-4 hover:shadow-md transition-shadow">
      <img
        src={
          (item.logo && item.logo.toString().trim())
            ? item.logo.toString().trim()
            : (() => {
                try {
                  const u = new URL(item.url);
                  return u.origin.replace(/\/+$/, "") + "/favicon.ico";
                } catch {
                  return "https://via.placeholder.com/48";
                }
              })()
        }
        alt={`${item.name} logo`}
        className="w-12 h-12 rounded-md object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/48";
        }}
      />
      <div className="flex-1">
        <a href={item.url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-foreground">
          {item.name}{item.author ? ` — ${item.author}` : ''}
        </a>
        {item.description && (
          <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
        )}
        {(item.tags ?? []).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.tags!.map((t) => (
              <span key={t} className="text-xs bg-muted rounded px-2 py-0.5">{t}</span>
            ))}
          </div>
        )}
      </div>
      <a href={item.url} target="_blank" rel="noreferrer" className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-xs font-medium">
        Visit
      </a>
    </div>
  );
};

export default LinkCard;
