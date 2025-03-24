import requests
from bs4 import BeautifulSoup
# pip install beautifulsoup4
# pip install pandas
# pip install requests
import postgres_client
HEADERS = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0'
}
links_to_parse =[
    'https://kst.by/noutbuki-i-kompjutery/noutbuki',
    'https://kst.by/noutbuki-i-kompjutery/noutbuki?page=2&',
    'https://kst.by/noutbuki-i-kompjutery/noutbuki?page=3&',
    'https://kst.by/noutbuki-i-kompjutery/noutbuki?page=4&',
    'https://kst.by/noutbuki-i-kompjutery/noutbuki?page=5&'
]
def get_noutbuk_by_link(link):
    response = requests.get(link, headers=HEADERS)
    noutbuk_data = response.text
    noutbuk_items = []
    to_parse = BeautifulSoup(noutbuk_data, 'html.parser')
    for elem in to_parse.find_all('div', class_='product-thumb transition'):
        try:
           elem_href = elem.find('a', href=True)
           elem_link = elem_href['href']
           elem_text = elem.text.strip().split('\n')
           nalichiye = elem.find('span', class_='instock').get_text()
           description = elem_text[1]
           img = elem.find('img', class_='img-responsive').get('src')
           price = elem_text[2]
           noutbuk_items.append((elem_link, nalichiye, description, img, int(price.replace('.00 р.',' '))))
        except:
            print(f'Нет в наличии')
    return noutbuk_items
def save_to_postgres(noutbuk_items):
    connection = postgres_client.get_connection()
    postgres_client.create_noutbuk_table(connection)
    for item in noutbuk_items:
        postgres_client.insertconn(connection, item[0], item[1], item[2], item[3], item[4])

def run():
    noutbuk_items = []
    for link in links_to_parse:
        noutbuk_items.extend(get_noutbuk_by_link(link))
    save_to_postgres(noutbuk_items)

run()
