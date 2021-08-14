import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { Doughnut } from "react-chartjs-2";

export const Dashboard = (props) => {
  // const data = {
  //   labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  //   datasets: [
  //     {
  //       label: "# of Votes",
  //       data: [12, 19, 3, 5, 2, 3],
  //       backgroundColor: [
  //         "rgba(255, 99, 132, 0.2)",
  //         "rgba(54, 162, 235, 0.2)",
  //         "rgba(255, 206, 86, 0.2)",
  //         "rgba(75, 192, 192, 0.2)",
  //         "rgba(153, 102, 255, 0.2)",
  //         "rgba(255, 159, 64, 0.2)",
  //       ],
  //       borderColor: [
  //         "rgba(255, 99, 132, 1)",
  //         "rgba(54, 162, 235, 1)",
  //         "rgba(255, 206, 86, 1)",
  //         "rgba(75, 192, 192, 1)",
  //         "rgba(153, 102, 255, 1)",
  //         "rgba(255, 159, 64, 1)",
  //       ],
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  const [data, setData] = useState({});

  const getColor = () => {
    const randomBetween = (min, max) =>
      min + Math.floor(Math.random() * (max - min + 1));
    const r = randomBetween(0, 255);
    const g = randomBetween(0, 255);
    const b = randomBetween(0, 255);
    return `rgb(${r},${g},${b}`;
  };

  useEffect(() => {
    var data = {
      labels: [],
      datasets: [
        {
          label: "Holdings Doughnut",
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1,
        },
      ],
    };
    console.log(data);

    var array = props.coins.slice(0, 5);
    array.forEach((coin) => {
      data.labels.push(coin.symbol);
      data.datasets[0].data.push(coin.value);
      let color = getColor();
      data.datasets[0].backgroundColor.push(color + ",0.5)");
      data.datasets[0].borderColor.push(color + ",1)");
    });
    if (props.coins.length > 5) {
      console.log(props.coins.slice(5));
      var other = 0;
      props.coins.slice(5).forEach((coin) => (other += coin.value));
      data.labels.push("other");
      data.datasets[0].data.push(other);
      data.datasets[0].backgroundColor.push(getColor());
    }
    setData(data);
  }, [props]);

  return (
    <div className="sub chart-wrapper">
      <Doughnut height="20px" width="20px" data={data} />
    </div>
  );
};
