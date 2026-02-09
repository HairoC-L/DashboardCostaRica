"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { Tour } from "@/services/api-service";

dayjs.locale("es");

interface CalendarSchedulerProps {
    schedules: string[];
    availableDates: { date: string; schedules: string[] }[];
    onChange: (schedules: string[], availableDates: { date: string; schedules: string[] }[]) => void;
}

export default function CalendarScheduler({ schedules = [], availableDates = [], onChange }: CalendarSchedulerProps) {
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [localSchedules, setLocalSchedules] = useState<string[]>(schedules);
    const [localDates, setLocalDates] = useState(availableDates);

    // Sync with props if they change externally (optional, but good for reset)
    useEffect(() => {
        setLocalSchedules(schedules);
        setLocalDates(availableDates);
    }, [schedules, availableDates]);

    // Notify parent of changes whenever local state changes
    useEffect(() => {
        onChange(localSchedules, localDates);
    }, [localSchedules, localDates]);

    const handleAddSchedule = (val: string) => {
        const trimmed = val.trim();
        if (trimmed && !localSchedules.includes(trimmed)) {
            setLocalSchedules(prev => [...prev, trimmed].sort());
        }
    };

    const handleRemoveSchedule = (val: string) => {
        setLocalSchedules(prev => prev.filter(s => s !== val));
    };

    const toggleDate = (dateStr: string) => {
        setLocalDates(prev => {
            const exists = prev.find(d => d.date === dateStr);
            if (exists) {
                return prev.filter(d => d.date !== dateStr);
            } else {
                return [...prev, { date: dateStr, schedules: localSchedules }];
            }
        });
    };

    const toggleScheduleForDate = (dateStr: string, schedule: string) => {
        setLocalDates(prev => prev.map(d => {
            if (d.date === dateStr) {
                const isEnabled = d.schedules.includes(schedule);
                return {
                    ...d,
                    schedules: isEnabled
                        ? d.schedules.filter(s => s !== schedule)
                        : [...d.schedules, schedule]
                };
            }
            return d;
        }));
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Base Schedules (Left) */}
                <div>
                    <label className="mb-2 block font-medium text-dark dark:text-white text-sm">Horarios Base</label>
                    <p className="text-xs text-gray-500 mb-2">Defina los horarios posibles (ej: 8:00 AM). Luego asígnelos en el calendario.</p>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            className="flex-1 rounded-lg border border-stroke bg-transparent px-4 py-2 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                            placeholder="Nuevo horario (ej: 8:00 AM)"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddSchedule(e.currentTarget.value);
                                    e.currentTarget.value = "";
                                }
                            }}
                        />
                        <button
                            type="button"
                            onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                handleAddSchedule(input.value);
                                input.value = "";
                            }}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
                        >
                            Agregar
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {localSchedules.map((schedule) => (
                            <span key={schedule} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-dark dark:bg-white/10 dark:text-white">
                                {schedule}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveSchedule(schedule)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Calendar (Right) */}
                <div className="bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 rounded-lg p-3 max-w-sm w-full mx-auto md:mx-0">
                    <div className="flex justify-between items-center mb-2">
                        <button type="button" onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))} className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded">
                            &lt;
                        </button>
                        <span className="font-bold text-base capitalize text-dark dark:text-white">{currentMonth.format("MMMM YYYY")}</span>
                        <button type="button" onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))} className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded">
                            &gt;
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-1 text-center text-xs font-medium text-gray-500">
                        {["D", "L", "M", "M", "J", "V", "S"].map((d, i) => <div key={i}>{d}</div>)}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: currentMonth.startOf('month').day() }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square"></div>
                        ))}
                        {Array.from({ length: currentMonth.daysInMonth() }).map((_, i) => {
                            const date = currentMonth.date(i + 1);
                            const dateStr = date.format("YYYY-MM-DD");
                            const isSelected = localDates.some(d => d.date === dateStr);

                            return (
                                <button
                                    key={dateStr}
                                    type="button"
                                    onClick={() => toggleDate(dateStr)}
                                    className={`aspect-square rounded-full flex items-center justify-center text-xs transition-all ${isSelected
                                        ? "bg-primary text-white shadow-sm transform scale-105"
                                        : "hover:bg-gray-100 dark:hover:bg-white/5 text-dark dark:text-white"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Selected Dates Configuration */}
            {localDates.length > 0 && (
                <div className="space-y-4 border-t border-stroke dark:border-dark-3 pt-4">
                    <h4 className="font-bold text-dark dark:text-white">Fechas Activas ({localDates.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto pr-2">
                        {localDates
                            .sort((a, b) => a.date.localeCompare(b.date))
                            .map((dateObj) => (
                                <div key={dateObj.date} className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-stroke dark:border-dark-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-primary">{dayjs(dateObj.date).format("dddd, D MMMM")}</span>
                                        <button type="button" onClick={() => toggleDate(dateObj.date)} className="text-red-500 text-xs hover:underline">Quitar</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {localSchedules.map((schedule) => (
                                            <label key={schedule} className={`cursor-pointer text-xs px-2 py-1 rounded border transition-colors ${dateObj.schedules.includes(schedule)
                                                ? "bg-primary text-white border-primary"
                                                : "bg-white dark:bg-dark-2 text-gray-500 border-stroke dark:border-dark-3 opacity-50 hover:opacity-100"
                                                }`}>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={dateObj.schedules.includes(schedule)}
                                                    onChange={() => toggleScheduleForDate(dateObj.date, schedule)}
                                                />
                                                {schedule}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}
