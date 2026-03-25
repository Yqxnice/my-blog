/**
 * 功能：模态框组件
 * 目的：提供通用的模态框功能，支持焦点陷阱、ESC键关闭等特性
 * 作者：Yqxnice
 */
'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ModalProps {
  /** 是否打开模态框 */
  isOpen: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 子元素 */
  children: React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 点击背景是否关闭 */
  closeOnBackdropClick?: boolean;
  /** 最大宽度 */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  /** 是否启用焦点陷阱 */
  enableFocusTrap?: boolean;
  /** 模态框标题 (用于无障碍) */
  title?: string;
  /** ARIA 描述 */
  ariaDescription?: string;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  full: 'max-w-full',
};

export function Modal({
  isOpen,
  onClose,
  children,
  className,
  closeOnBackdropClick = true,
  maxWidth = '2xl',
  enableFocusTrap = true,
  title,
  ariaDescription,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // 锁定 body 滚动
  useEffect(() => {
    if (!isOpen) return;

    // 保存当前焦点元素
    previousActiveElement.current = document.activeElement as HTMLElement;

    // 保存原始样式
    const originalStyle = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // 计算滚动条宽度
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // 锁定滚动
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      // 恢复原始样式
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = originalPaddingRight;

      // 恢复焦点
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen]);

  // 焦点陷阱
  useEffect(() => {
    if (!isOpen || !enableFocusTrap || !modalRef.current) return;

    const getFocusableElements = () => {
      const elements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      return elements ? Array.from(elements) : [];
    };

    // 设置初始焦点
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      const firstInput = focusableElements.find(el => el.tagName === 'INPUT');
      (firstInput || focusableElements[0])?.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, enableFocusTrap]);

  // ESC 键关闭
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // 阻止内容区域点击冒泡
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-999999 flex items-center justify-center p-4"
      role="presentation"
      onClick={() => {
        if (closeOnBackdropClick) {
          onClose();
        }
      }}
    >
      {/* 模态框内容 */}
      <div
        ref={modalRef}
        onClick={handleContentClick}
        className={cn(
          'relative w-full bg-background rounded-2xl shadow-2xl border border-border modal-animate-content flex flex-col max-h-[90vh]',
          'sm:max-h-[80vh]',
          maxWidthClasses[maxWidth],
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={ariaDescription ? 'modal-description' : undefined}
      >
        {title && (
          <h2 id="modal-title" className="sr-only">
            {title}
          </h2>
        )}
        {ariaDescription && (
          <p id="modal-description" className="sr-only">
            {ariaDescription}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
