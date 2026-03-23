/**
 * 模态框相关的自定义 hooks 集合
 * 功能：提供模态框状态管理、滚动锁定、焦点陷阱和ESC键关闭功能
 * 目的：为模态框组件提供完整的交互体验和可访问性支持
 * 作者：Yqxnice
 */
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * 管理模态框状态的自定义 hook
 * @param initialState - 初始状态
 * @returns [isOpen, open, close, toggle]
 */
export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return { isOpen, open, close, toggle, setIsOpen } as const;
}

/**
 * 锁定 body 滚动的 hook
 * @param isLocked - 是否锁定滚动
 */
export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    // 保存原始样式
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalPaddingRight = window.getComputedStyle(document.body).paddingRight;

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
    };
  }, [isLocked]);
}

/**
 * 焦点陷阱 hook - 确保焦点保持在模态框内
 * @param containerRef - 容器 ref
 * @param isActive - 是否激活焦点陷阱
 */
export function useFocusTrap(containerRef: React.RefObject<HTMLElement | null>, isActive: boolean) {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // 保存当前焦点元素
    previousActiveElement.current = document.activeElement as HTMLElement;

    // 获取所有可聚焦元素
    const getFocusableElements = () => {
      const elements = containerRef.current?.querySelectorAll<HTMLElement>(
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
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // 恢复之前的焦点
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isActive, containerRef]);
}

/**
 * ESC 键关闭 hook
 * @param onClose - 关闭回调
 * @param isActive - 是否激活
 */
export function useEscapeKey(onClose: () => void, isActive: boolean) {
  useEffect(() => {
    if (!isActive) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose, isActive]);
}