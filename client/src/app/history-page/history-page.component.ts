import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";
import {OrdersService} from "../shared/services/orders.service";
import {Subscription} from "rxjs";
import {Filter, Order} from "../shared/interfaces";

const STEP = 2

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {

  isFilterVisible = false
  @ViewChild('tooltip') tooltipRef: ElementRef
  tooltip: MaterialInstance
  oSub: Subscription
  orders: Order[] = []

  offset = 0
  limit = STEP

  loading = false //для подгрузки заказов
  reloading = false // для перезагр заказов(фильтры)
  noMoreOrders = false //блокировка btn Загр еще

  constructor(private ordersService: OrdersService) {
  }

  ngOnInit() {
    this.reloading = true
    this.fetch()
  }

  private fetch() {
    const params = {
      offset: this.offset,
      limit: this.limit
    }
    this.oSub = this.ordersService.fetch(params).subscribe(orders => {
      this.orders = this.orders.concat(orders)
      this.noMoreOrders = orders.length < STEP
      this.loading = false
      this.reloading = false
    })
  }

  loadMore() {
    this.offset += STEP
    this.loading = true
    this.fetch()
  }

  ngOnDestroy() {
    this.tooltip.destroy()
    this.oSub.unsubscribe()
  }

  ngAfterViewInit() {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef)
  }

  applyFilter(filter: Filter) {
    console.log(filter)
  }

}
