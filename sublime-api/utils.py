import random

# temporarily put get the currency rate here, in the future, we will get it from the external gateway
CURRENCY_RATE = {
    'USD': 1,
    'GBP': 1.27,
    'EUR': 1.13,
    'CHF': 1.01,
    'JPY': 0.0092,
    'CNY': 0.14
}


def generate_random_string(characters):
    eligible_characters = "2346789abcdefghjlmnpqrtuvwxyz";
    random_string = ''
    i = 0
    while i < characters:
        random_string += eligible_characters[int(random.random() * len(eligible_characters))]
        i += 1

    return random_string


def get_currency_exchange_rate(source, dest):
    return float(CURRENCY_RATE.get(source, 1) / CURRENCY_RATE.get(dest, 1))
