"use client";

import React, { FormEvent, useMemo, useState } from "react";
import { LinkCard, LinkItem } from "../../components/links/LinkCard";
import remoteLinksJson from "../../data/friends.json";

const remoteLinksFromJson: LinkItem[] = (Array.isArray(remoteLinksJson) ? remoteLinksJson : []).map(
  (raw, idx) => {
    const f = (raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {}) as Record<
      string,
      unknown
    >;
    return {
      id: `remote-${idx}`,
      name: String(f.name ?? ""),
      url: String(f.url ?? ""),
      description: String(f.description ?? ""),
      logo: String(f.logo ?? ""),
      author: String(f.author ?? ""),
    };
  },
);

export default function LinksPage() {
  const [links, setLinks] = useState<LinkItem[]>(remoteLinksFromJson);
  const [draft, setDraft] = useState<{ name: string; url: string; description?: string; logo?: string; author?: string }>({
    name: "",
    url: "",
    description: "",
    logo: "",
    author: "",
  });
  const [showAdd, setShowAdd] = useState(false);

  const filteredLinks = useMemo(() => links, [links]);

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.name.trim() || !draft.url.trim()) return;
    const newLink: LinkItem = {
      id: `custom-${Date.now()}`,
      name: draft.name.trim(),
      url: draft.url.trim(),
      description: draft.description?.trim(),
      logo: draft.logo,
      author: draft.author?.trim(),
    };
    setLinks(prev => [newLink, ...prev]);
    setDraft({ name: "", url: "", description: "", logo: "", author: "" });
    setShowAdd(false);
  };

  return (
    <div className="w-full py-12 max-w-6xl mx-auto px-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">友情链接</h1>
      </div>

      <div className="mb-4">
        <button onClick={()=>setShowAdd(v => !v)} className="px-4 py-2 bg-primary text-primary-foreground rounded-md">添加友链</button>
      </div>
      {showAdd && (
        <section className="mt-2">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3">添加友链</h3>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="名称" value={draft.name} onChange={(e) => setDraft(d => ({ ...d, name: e.target.value }))} className="px-3 py-2 border rounded" />
              <input placeholder="作者" value={draft.author ?? ''} onChange={(e) => setDraft(d => ({ ...d, author: e.target.value }))} className="px-3 py-2 border rounded" />
              <input placeholder="网址" value={draft.url} onChange={(e) => setDraft(d => ({ ...d, url: e.target.value }))} className="px-3 py-2 border rounded" />
              <input placeholder="描述" value={draft.description ?? ''} onChange={(e) => setDraft(d => ({ ...d, description: e.target.value }))} className="px-3 py-2 border rounded" />
              <input placeholder="Logo URL (可选)" value={draft.logo ?? ''} onChange={(e) => setDraft(d => ({ ...d, logo: e.target.value }))} className="px-3 py-2 border rounded" />
              <div className="md:col-span-2 flex items-center justify-end">
                <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-md">添加</button>
              </div>
            </form>
          </div>
        </section>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {filteredLinks.map((item) => (
          <LinkCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

