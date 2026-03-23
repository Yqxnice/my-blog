/**
 * 功能：404页面
 * 目的：当用户访问不存在的页面时显示
 * 作者：Yqxnice
 */
import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">页面不存在</h2>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        抱歉，您访问的页面不存在或已被删除。
      </p>
      <Link
        href="/"
        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors duration-200"
      >
        返回首页
      </Link>
    </div>
  );
};

export default NotFoundPage;
