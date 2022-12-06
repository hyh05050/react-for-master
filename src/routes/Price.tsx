import { useQuery } from "react-query";
import { fetchCoinHistory, fetchCoinHistoryTest } from "../api";
import ApexCharts from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atom";

interface PriceProps {
  coinId: string;
}

interface HistoryData {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

interface PriceProps {
  coinId: string;
}

function Price({ coinId }: PriceProps) {
  const isDark = useRecoilValue(isDarkAtom);
  const { isLoading, data } = useQuery<HistoryData[]>(["history", coinId], () =>
    fetchCoinHistoryTest(coinId!)
  );

  return (
    <div>
      {isLoading ? (
        "Loading Chart..."
      ) : (
        <ApexCharts
          type="candlestick"
          series={[
            {
              name: "Price List",
              data:
                data?.map((price) => {
                  return [
                    price.time_open,
                    parseFloat(price.open),
                    parseFloat(price.high),
                    parseFloat(price.low),
                    parseFloat(price.close),
                  ];
                }) ?? [],
            },
          ]}
          options={{
            theme: { mode: isDark ? "dark" : "light" },
            chart: {
              height: 500,
              width: 500,
              toolbar: { show: false },
            },
            stroke: {
              curve: "smooth",
              width: 1,
            },
            grid: {
              show: true,
            },
            yaxis: {
              show: true,
            },
            xaxis: {
              axisBorder: { show: false },
              axisTicks: { show: true },
              labels: { show: true },
              type: "datetime",
              categories: data?.map((price) => price.time_close) ?? [],
            },
            plotOptions: {
              candlestick: {
                colors: {
                  downward: "#3C90EB",
                  upward: "#DF7D46",
                },
              },
            },
            tooltip: {
              y: {
                formatter: (value) => `$ ${value.toFixed(3)}`,
              },
            },
          }}
        ></ApexCharts>
      )}
    </div>
  );
}

export default Price;
