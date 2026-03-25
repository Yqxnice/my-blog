/**
 * 功能：Supabase 客户端配置
 * 目的：提供 Supabase 数据库连接
 * 作者：Yqxnice
 */
import { createClient } from '@supabase/supabase-js';

// 环境变量检查
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// 创建 Supabase 客户端
let supabase;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // 如果环境变量缺失，创建一个假的客户端，避免应用崩溃
  console.warn('Missing Supabase environment variables. Using mock client.');
  supabase = {
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            order: () => Promise.resolve({ data: [], error: null })
          })
        })
      }),
      insert: () => ({
        select: () => Promise.resolve({ data: [{}], error: null })
      })
    })
  } as any;
}

export { supabase };
