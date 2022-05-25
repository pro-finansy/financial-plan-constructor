import { dynamicsObject } from "@/interfaces";

const create = (w: string, t: string, d: dynamicsObject, i: number, colors: string[]) => {
  const myLegend = document.getElementById(w + i);
  const myCanvas = document.getElementById(t + i);
  if (!myLegend || !myCanvas) return;
  myCanvas.width = 500;
  myCanvas.height = 500;
  const myVinyls = d;

  function drawPieSlice(ctx: dynamicsObject, centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number, color: string) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
  }
  class Piechart {
    options: any;
    canvas: any;
    ctx: any;
    colors: string[];

    constructor(options: any) {
      this.options = options;
      this.canvas = options.canvas;
      this.ctx = this.canvas.getContext("2d");
      this.colors = options.colors;
    }

    draw () {
      let total_value = 0;
      let color_index = 0;
      for (const categ in this.options.data) {
        total_value += Number(this.options.data[categ]);
      }

      let start_angle = 0;
      for (const categ in this.options.data) {
        const slice_angle = 2 * Math.PI * Number(this.options.data[categ]) / total_value;

        drawPieSlice(
          this.ctx,
          this.canvas.width / 2,
          this.canvas.height / 2,
          Math.min(this.canvas.width / 2, this.canvas.height / 2),
          start_angle,
          start_angle + slice_angle,
          this.colors[color_index % this.colors.length]
        );

        start_angle += slice_angle;
        color_index++;
      }

      if (this.options.doughnutHoleSize) {
        drawPieSlice(
          this.ctx,
          this.canvas.width / 2,
          this.canvas.height / 2,
          this.options.doughnutHoleSize * Math.min(this.canvas.width / 2, this.canvas.height / 2),
          0,
          2 * Math.PI,
          "#ff0000"
        );
      }
      start_angle = 0;
      for (const categ in this.options.data) {
        const slice_angle = 2 * Math.PI * Number(this.options.data[categ]) / total_value;
        const pieRadius = Math.min(this.canvas.width / 2, this.canvas.height / 2);
        let labelX = this.canvas.width / 2 + (pieRadius / 2) * Math.cos(start_angle + slice_angle / 2) - 10;
        let labelY = this.canvas.height / 2 + (pieRadius / 2) * Math.sin(start_angle + slice_angle / 2) + 5;

        if (this.options.doughnutHoleSize) {
          const offset = (pieRadius * this.options.doughnutHoleSize) / 2;
          labelX = this.canvas.width / 2 + (offset + pieRadius / 2) * Math.cos(start_angle + slice_angle / 2);
          labelY = this.canvas.height / 2 + (offset + pieRadius / 2) * Math.sin(start_angle + slice_angle / 2);
        }

        start_angle += slice_angle;
      }
      if (this.options.legend) {
        color_index = 0;
        let legendHTML = "";
        for (const categ in this.options.data) {
          if (colors.length === 2) {
            legendHTML += "<div style='margin-bottom: 5px;'><span style='display:inline-block;position:relative;top:-2px;margin-right:5px;width:12px;height:12px;border-radius:50%;background-color:" + this.colors[color_index++] + ";'>&nbsp;</span> " + categ + " " + this.options.data[categ] + "%</div>";
          } else {
            legendHTML += "<div style='display: flex; align-items: center; line-height: 6pt; margin-bottom: 5px; max-width: 100%; height: 15px; vertical-align: top; margin-right: 10px;'><div style='margin-right: 5px; min-width: 12px; width: 12px; height: 12px; border-radius: 50%; background-color:" + this.colors[color_index++] + ";'>&nbsp;</div> <div style=''>" + categ + " " + this.options.data[categ] + "%</div></div>";
          }
        }
        this.options.legend.innerHTML = legendHTML;
      }
    }
  }
  const myPiechart = new Piechart(
    {
      canvas: myCanvas,
      data: myVinyls,
      colors: colors,
      legend: myLegend
    }
  );
  myPiechart.draw();
}

const createCharts = (targets: dynamicsObject[], colors: string[]) => {
  for (const target of targets) {
    for (const portfolio of target.portfolios) {
      if (Number(target.status[portfolio.id]) === 1) {
        const test0 = portfolio.ct_percents;
        const test1 = portfolio.core.class_percents;
        const test2 = portfolio.core.country_percents;
        const test3 = portfolio.core.currency_percents;
        const test4 = portfolio.core.section_percents;
        const test5 = portfolio.core.conserv_percents;
        const test6 = portfolio.core.stock_percents;
        const test7 = portfolio.core.bond_period_percents;
        const test8 = portfolio.core.stock_risk_percents;
        const index = portfolio.core.index;
        const number = target.number;

        create(number + "myLegend", number + "myCanvas", test0, index, colors);
        create(number + "myLegend1", number + "myCanvas1", test1, index, colors);
        create(number + "myLegend2", number + "myCanvas2", test2, index, colors);
        create(number + "myLegend3", number + "myCanvas3", test3, index, colors);
        create(number + "myLegend4", number + "myCanvas4", test4, index, colors);
        create(number + "myLegend5", number + "myCanvas5", test5, index, colors);
        create(number + "myLegend6", number + "myCanvas6", test6, index, colors);
        create(number + "myLegend7", number + "myCanvas7", test7, index, colors);
        create(number + "myLegend8", number + "myCanvas8", test8, index, colors);
      }
    }
  }
};

export { create, createCharts };