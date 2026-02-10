'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi2';

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 transition-colors animate-pulse">
                <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
        );
    }

    const isDark = theme === 'dark';

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
            aria-label="Toggle Night Mode"
        >
            {isDark ? (
                <HiOutlineSun className="w-5 h-5" />
            ) : (
                <HiOutlineMoon className="w-5 h-5" />
            )}
        </button>
    );
}
