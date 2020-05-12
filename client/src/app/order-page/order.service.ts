import {Injectable} from "@angular/core";
import {OrderPosition, Position} from "../shared/interfaces";

// Локальный сервис для заказа, только на фронте
@Injectable()
export class OrderService {

  public list: OrderPosition[] = []
  public price = 0

  add(position: Position) {
    const orderPosition: OrderPosition = Object.assign({}, {
      name: position.name,
      cost: position.cost,
      quantity: position.quantity,
      _id: position._id
    })
    this.list.push(orderPosition)
  }

  remove() {}

  clear() {}
}
