interface BlogSectionHeaderProps {
  title: string;
  viewAllLink?: string;
  viewAllText?: string;
}

export function BlogSectionHeader({ 
  title, 
  viewAllLink = "/blogs", 
  viewAllText = "全部文章" 
}: BlogSectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase flex items-center gap-2">
        <span className="w-3.5 h-[1.5px] bg-primary"></span>
        {title}
      </span>
      <a href={viewAllLink} className="text-xs text-muted-foreground flex items-center gap-1 hover:text-primary transition-colors duration-200">
        {viewAllText}
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
    </div>
  );
}