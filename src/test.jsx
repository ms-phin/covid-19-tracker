import { useEffect, useState } from "react";
import "./lineGraph.css";

function LineGraph() {
  const [data, setData] = useState({});

  const buildChartData = (data, caseType = "cases") => {
    const chartData = [];
    let lastDataPoint;
    for (let date in data.cases) {
      if (lastDataPoint) {
        const newDatePoint = {
          x: date,
          y: data[caseType][date] - lastDataPoint,
        };
        chartData.push(newDatePoint);
      }
      lastDataPoint = data[caseType][data];
    }
    return chartData;
  };

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
      .then((respose) => respose.json())
      .then((data) => {
        const chartData = buildChartData(data);
        setData(chartData);
      });
  }, []);

  return (
    <div>
      lineGraph
      <Line
        data={{
          datasets: [
            {
              backgroundColor: "rgba(204, 16, 52,0.7)",
              borderColor: "#CC1034",
              data: data,
            },
          ],
        }}
      />
    </div>
  );
}

export default LineGraph;
