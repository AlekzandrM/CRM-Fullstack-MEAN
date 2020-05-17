import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnalyticsService} from "../shared/services/analytics.service";
import {AnalyticsPage} from "../shared/interfaces";
import {Subscription} from "rxjs";
import {Chart} from 'chart.js'

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gain') gainRef: ElementRef
  @ViewChild('order') orderRef: ElementRef
  aSub: Subscription

  average: number
  pending = true

  constructor(private service: AnalyticsService) {
  }

  ngAfterViewInit(): void {
    const gainConfig: any = {
      label: 'Выручка',
      color: 'rgb(255, 99, 132)'
    }

    this.aSub = this.service.getAnalytics().subscribe((res: AnalyticsPage) => {
      this.average = res.average

      gainConfig.labels = res.chart.map(item => item.date)
      gainConfig.data = res.chart.map(item => item.gain)

      // Получаем контекст канваса
      const gainCtx = this.gainRef.nativeElement.getContext('2d')
      gainCtx.canvas.height = '300px'

      // Создаем
      new Chart(gainCtx, createCharConfig(gainConfig))

      this.pending = false
    })
  }

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }

}

// Ф-я конфигурации всего графика
function createCharConfig({labels, data, label, color}) {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label, data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  }
}
