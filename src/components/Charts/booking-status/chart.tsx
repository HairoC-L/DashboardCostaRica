"use client";

import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

type PropsType = {
    data: {
        series: { name: string; data: number[] }[];
        categories: string[];
        colors: string[];
    };
};

const Chart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

export function BookingStatusChart({ data }: PropsType) {
    const options: ApexOptions = {
        chart: {
            type: "bar",
            fontFamily: "inherit",
            toolbar: {
                show: false,
            },
        },
        colors: data.colors,
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: false,
                columnWidth: "40%",
                distributed: true,
            },
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        xaxis: {
            categories: data.categories,
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
    };

    return (
        <div className="-ml-4 -mr-5 h-[310px]">
            <Chart
                options={options}
                series={data.series}
                type="bar"
                height={310}
            />
        </div>
    );
}
