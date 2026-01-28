import { compactFormat } from "@/lib/format-number";
import { getOverviewData } from "../../fetch";
import { OverviewCard } from "./card";
import * as icons from "./icons";

export async function OverviewCardsGroup() {
  const { views, profit, products, ingresos } = await getOverviewData();

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        label="Ventas Totales"
        data={{
          ...views,
          value: "$" + compactFormat(views.value),
        }}
        Icon={icons.Sales}
      />

      <OverviewCard
        label="Reservas Totales"
        data={{
          ...profit,
          value: compactFormat(profit.value),
        }}
        Icon={icons.Reservations}
      />

      <OverviewCard
        label="Clientes Registrados"
        data={{
          ...products,
          value: compactFormat(products.value),
        }}
        Icon={icons.Users}
      />

      <OverviewCard
        label="Ingresos (Mes Actual)"
        data={{
          ...ingresos,
          value: "$" + compactFormat(ingresos.value),
        }}
        Icon={icons.Profit}
      />
    </div>
  );
}
