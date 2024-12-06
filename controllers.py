from models import Dish, Order, DataStore
## • Controller (Контроллер): Логика для добавления блюда в заказ, изменения количества, оформление заказа и генерация счета.

class RestaurantController():
    def __init__(self):
        self.store = DataStore()  # хранилище данных по блюдам и по заказам

    def add_dish(self, name, price, description):
        dish = Dish(name, price, description)
        self.store.add_dish(dish)

    def get_data(self, key):
        return self.store.data.get(key, [])

    def update_order(self, user_id, items, status):
        orders = self.get_data('orders')
        # order - ищем по user_id
        order = {}
        if order:
            order['items'] = items
            if status:
                order['status'] = status
        else:
            orders.append({'user_id': user_id, 'items': items, 'status': status})
        self.store.save_data()




