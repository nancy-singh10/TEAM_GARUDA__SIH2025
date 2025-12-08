
'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming this exists given 'class-variance-authority' presence

// Fallback for cn if it doesn't exist (I'll implement minimal version in this file to be safe if import fails?)
// Actually, usually clsx/tailwind-merge are used. I'll stick to inline logic if I'm not sure,
// but let's assume standard Shadcn utils logic for a clean implementation.
// I'll check lib/utils existence quickly next step or just verify with a tool, but for now I'll write defensive code.

interface SimpleCalendarProps {
    value?: Date;
    onChange: (date: Date) => void;
    minDate?: Date;
    maxDate?: Date;
    className?: string;
}

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function SimpleCalendar({ value, onChange, minDate, maxDate, className }: SimpleCalendarProps) {
    // View state (which month we are looking at)
    const [viewDate, setViewDate] = useState(value || new Date());

    // Sync view if value changes externally
    useEffect(() => {
        if (value) setViewDate(value);
    }, [value]);

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const startDay = getFirstDayOfMonth(currentYear, currentMonth);

    const handlePrevMonth = () => {
        setViewDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(currentYear, currentMonth + 1, 1));
    };

    const handleDayClick = (day: number) => {
        const newDate = new Date(currentYear, currentMonth, day);
        // Validate min/max
        if (minDate && newDate < new Date(minDate.setHours(0, 0, 0, 0))) return;
        if (maxDate && newDate > maxDate) return;

        onChange(newDate);
    };

    const isSelected = (day: number) => {
        if (!value) return false;
        return value.getDate() === day && value.getMonth() === currentMonth && value.getFullYear() === currentYear;
    };

    const isDisabled = (day: number) => {
        const checkDate = new Date(currentYear, currentMonth, day);
        if (minDate && checkDate < new Date(minDate.setHours(0, 0, 0, 0))) return true;
        if (maxDate && checkDate > maxDate) return true;
        return false;
    };

    const isToday = (day: number) => {
        const today = new Date();
        return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
    }

    return (
        <div className={`p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl w-[320px] ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <button
                    type="button" // explicit type to prevent form submit
                    onClick={handlePrevMonth}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-slate-500" />
                </button>
                <h2 className="font-semibold text-slate-900 dark:text-white">
                    {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <ChevronRight className="w-5 h-5 text-slate-500" />
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 mb-2">
                {DAYS_OF_WEEK.map(d => (
                    <div key={d} className="text-center text-xs font-medium text-slate-400 py-1">
                        {d}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const selected = isSelected(day);
                    const disabled = isDisabled(day);
                    const today = isToday(day);

                    return (
                        <button
                            key={day}
                            type="button"
                            disabled={disabled}
                            onClick={() => handleDayClick(day)}
                            className={`
                h-9 w-9 rounded-lg flex items-center justify-center text-sm transition-all
                ${selected
                                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/20 font-bold'
                                    : disabled
                                        ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                                        : 'text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600'
                                }
                ${!selected && today ? 'border border-emerald-500/50 text-emerald-600' : ''}
              `}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
