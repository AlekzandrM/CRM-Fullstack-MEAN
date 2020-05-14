import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Filter} from "../../shared/interfaces";

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.scss']
})
export class HistoryFilterComponent implements OnInit {
  @Output() onFilter = new EventEmitter<Filter>()

  order: number

  constructor() {
  }

  ngOnInit(): void {
  }

  submitFilter() {
    const filter: Filter = {}

    if (this.order) {
      filter.order = this.order
    }

    this.onFilter.emit(filter)
  }

}
