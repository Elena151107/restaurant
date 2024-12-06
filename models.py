import json
from datetime import datetime
from operator import index


class Dish:
    def __init__(self, name, price, description):
        self.name = name
        self.price = price
        self.description = description

    def to_dict(self):
        return {'name': self.name,
                'price': self.price,
                'description': self.description}

class Order:
    def __init__(self, user_id):
        self.user_id = user_id
        self.items = [] # (dish, guantity)
        self.time = datetime.now()
        self.status = 'in progress' # готовится блюдо/доставлен (preparing/delivered

    def add_item(self, dish, guantity):
        self.items.append({'dish': dish, 'guantity': guantity})

    def total_price(self):
        return sum(item['dish'].price * item['guantity'] for item in self.items)

    def remove_item(self, dish):
        for item in self.items:
            if item['dish'] == dish:
                self.items.remove(item)

    def remove_item_guantity(self):
        pass

    def to_dict_order(self):
        return {'user_id': self.user_id,
                'items': [{'dish': item['dish'].to_dict(),
                           'guantity': item['guantity']} for item in self.items],
                'status': self.status,
                'created_at': self.time,
                'total': self.total_price(),
                           }

class DataStore():  # хранилище
    def __init__(self, filename='data.json'):
        self.filename = filename
        self.data = {'dishes': [], 'orders': []}
        self.load_data()

    def load_data(self):
        try:
            with open(self.filename, 'r') as f:
                self.data = json.load(f)
        except FileNotFoundError:
            self.save_data()

    def save_data(self):
        with open(self.filename, 'w') as f:
            json.dump(self.data, f, indent=4)

    def add_dish(self, dish):
        self.data['dishes'].append(dish.to_dict())
        self.save_data()

    def add_oder(self, order):
        self.data['orders'].append(order.to_dict_order())
        self.save_data()