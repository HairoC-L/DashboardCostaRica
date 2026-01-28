import { IncomeOverview } from "@/components/Charts/income-chart";
import { SalesByType } from "@/components/Charts/sales-by-type";
import { BookingStatus } from "@/components/Charts/booking-status";
import { NewUsersOverview } from "@/components/Charts/new-users-chart";
import { TopPerformers } from "@/components/Tables/top-performers";
import { RecentBookings } from "@/components/Tables/recent-bookings";
import { Suspense } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";

export default function Home() {
  return (
    <>
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup />
      </Suspense>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">

        <IncomeOverview className="col-span-12 xl:col-span-8" />

        <div className="col-span-12 grid gap-4 xl:col-span-4">
          <BookingStatus className="h-full" />
        </div>

        <NewUsersOverview className="col-span-12 xl:col-span-8" />

        <SalesByType className="col-span-12 xl:col-span-4" />

        <TopPerformers className="col-span-12" />

        <RecentBookings className="col-span-12" />

      </div>
    </>
  );
}
