<template>
  <canvas :id="`${option.id}`" width="250" height="250"></canvas>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi';
import Chart from 'chart.js/auto';

export default defineComponent({
  name: "CommonChart",
  props: {
    option: {
      type: Object,
      required: true,
    },
    colors: {
      type: Array as PropType<string[]>,
      required: true,
    },
    portfolioId: {
      type: String,
      required: true,
    }
  },
  updated() {
    this.chart();
  },
  mounted() {
    this.chart();
  },
  methods: {
    chart() {
      const ctx = document.getElementById(this.option.id) as HTMLCanvasElement;
      new Chart(ctx, {
        type: "pie",
        data: {
          labels: Object.entries(this.option.data).map(a => a[0]),
          datasets: [
            {
              data: Object.entries(this.option.data).map(a => a[1]),
              backgroundColor: this.colors,
              borderWidth: 1,
              hoverOffset: 8,
            },
          ],
        },
        options: {
          responsive: false,
          layout: {
            padding: 5
          },
          plugins: {
            legend: {
              display: false,
            }
          },
          scales: {
            y: {
              display: false,
              beginAtZero: false,
            },
          },
        },
      });
    },
  },
});
</script>