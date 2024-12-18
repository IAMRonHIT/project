import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Activity, Filter } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { MultiSelect } from './Dashboard/MultiSelect';
import { StackedBarChart } from './charts/StackedBarChart';

type TimeUnit = 'week' | 'month' | 'quarter';

const quarters: string[] = ['Q1', 'Q2', 'Q3', 'Q4'];
const months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
const weeks: string[] = Array.from({ length: 52 }, (_, i) => `Week ${i + 1}`);

export function ActiveCareJourneys() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [timeUnit, setTimeUnit] = useState<TimeUnit>('week');
    const [selectedPeriods, setSelectedPeriods] = useState<string[]>([
        'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'
    ]);
    const filterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const mockData = useMemo(() => ({
        week: weeks.reduce((acc, week) => ({
            ...acc,
            [week]: [Math.floor(45 + Math.random() * 20), Math.floor(30 + Math.random() * 15), Math.floor(25 + Math.random() * 10)]
        }), {} as Record<string, number[]>),
        month: months.reduce((acc, month, index) => ({
            ...acc,
            [month]: [45 + index, 30 + index, 25 + index]
        }), {} as Record<string, number[]>),
        quarter: quarters.reduce((acc, quarter, index) => ({
            ...acc,
            [quarter]: [45 + index * 5, 30 + index * 5, 25 + index * 5]
        }), {} as Record<string, number[]>)
    }), []);


    const filteredData = useMemo(() => {
        if (selectedPeriods.length === 0) {
            return {
                series: [],
                categories: []
            };
        }

        const series = [
            {
                name: 'Active',
                data: [] as number[],
            },
            {
                name: 'Monitoring',
                data: [] as number[]
            },
            {
                name: 'Completed',
                data: [] as number[],
            }
        ];

        selectedPeriods.forEach(period => {
            const periodData = mockData[timeUnit][period];
            series.forEach((s, index) => {
                s.data.push(periodData[index]);
            });
        });

        return {
            series,
            categories: selectedPeriods
        };
    }, [timeUnit, selectedPeriods, mockData]);

    const transformedChartData = useMemo(() => {
        console.log("Selected Periods:", selectedPeriods);
        if (selectedPeriods.length === 0) {
            return [];
        }

        const { series, categories } = filteredData;
        
        const transformedData = categories.map((category, index) => {
            return {
                label: category,
                segments: series.map((s, sIndex) => ({
                  value: s.data[index],
                  color: sIndex === 0 ? '#00F0FF' : sIndex === 1 ? '#00B8CC' : '#008299',
                  label: s.name
                })),
            };
        });

        return transformedData;
    }, [filteredData]);

    const getTimeOptions = () => {
        switch (timeUnit) {
            case 'week': return weeks;
            case 'quarter': return quarters;
            default: return months;
        }
    };

    return (
        <div className="bg-gradient-to-br from-[#2C3037] to-[#1E2024] rounded-xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-leather mix-blend-overlay"/>

            <div className="relative">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Activity className="w-6 h-6 text-[#00F0FF]"/>
                        <h2 className="text-xl font-bold text-white">Active Care Journeys</h2>
                    </div>

                    <div className="relative" ref={filterRef}>
                        <button
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-accent/20 hover:border-accent/40 transition-colors"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                        >
                            <Filter className="w-4 h-4 text-accent"/>
                            <span className="text-gray-400">Filter</span>
                            {selectedPeriods.length > 0 && (
                                <span className="px-2 py-0.5 text-xs rounded-full bg-accent/20 text-accent">
                    {selectedPeriods.length}
                  </span>
                            )}
                        </button>

                        {isFilterOpen && (
                            <div
                                className="absolute right-0 mt-2 w-72 p-4 bg-surface border border-accent/20 rounded-lg shadow-lg z-50">
                                <div className="flex flex-col gap-4">
                                    <div className="flex gap-2">
                                        {(['week', 'month', 'quarter'] as TimeUnit[]).map(unit => (
                                            <button
                                                key={unit}
                                                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                                                    timeUnit === unit
                                                        ? 'bg-accent/20 text-accent'
                                                        : 'text-gray-400 hover:bg-accent/10'
                                                }`}
                                                onClick={() => {
                                                    setTimeUnit(unit);
                                                    setSelectedPeriods([]);
                                                }}
                                            >
                                                {unit.charAt(0).toUpperCase() + unit.slice(1)}ly
                                            </button>
                                        ))}
                                    </div>

                                    <MultiSelect
                                        options={getTimeOptions()}
                                        selected={selectedPeriods}
                                        onChange={setSelectedPeriods}
                                        placeholder={`Select ${timeUnit}s`}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
               <StackedBarChart data={transformedChartData} height={350} />
            </div>
        </div>
    );
}