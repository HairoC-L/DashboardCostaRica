"use client";

import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

type PropsType = {
    data: {
        series: { name: string; data: number[] }[];
        categories: string[];
    };
};

const Chart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

export function NewUsersChart({ data }: PropsType) {
    const options: ApexOptions = {
        chart: {
            type: "bar",
            fontFamily: "inherit",
            toolbar: {
                show: false,
            },
        },
        colors: ["#3C50E0"],
        plotOptions: {
            bar: {
                borderRadius: 2,
                columnWidth: "60%",
            },
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: data.categories,
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            tooltip: {
                enabled: false,
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
