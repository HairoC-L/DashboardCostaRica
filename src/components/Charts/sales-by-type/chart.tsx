"use client";

import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

type PropsType = {
    data: {
        series: number[];
        labels: string[];
    };
};

const Chart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

export function SalesByTypeChart({ data }: PropsType) {
    const options: ApexOptions = {
        chart: {
            type: "donut",
            fontFamily: "inherit",
        },
        labels: data.labels,
        colors: ["#5750F1", "#0ABEF9", "#80CAEE"],
        legend: {
            show: true,
            position: "bottom",
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "65%",
                    background: "transparent",
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        responsive: [
            {
                breakpoint: 640,
                options: {
                    chart: {
                        width: 200,
                    },
                },
            },
        ],
    };

    return (
        <div className="flex justify-center">
            <Chart
                options={options}
                series={data.series}
                type="donut"
                height={350}
                width={"100%"}
            />
        </div>
    );
}
