from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

'''
mongodb 개념

mysql : mongodb
db    : db
table : collection
row   : document
'''

# MongoDB 연결 URI
user = os.environ.get('MONGODB_USER')
password = os.environ.get('MONGODB_PASSWORD')
host = os.environ.get('MONGODB_HOST') # 탄력적ip사용해야할듯 ..
port = os.environ.get('MONGODB_PORT')
client = MongoClient(f'mongodb://{user}:{password}@{host}:{port}/?authSource=admin&retryWrites=true&w=majority')

# db 접근
db = client['lgu']

def mongodb_insert(collection, mydict):
    #collection 접근
    mycollection = db[f'{collection}']
    mycollection.insert_one(mydict)

    try : 
        print(f'{mydict} 데이터 삽입 성공!!')
    except Exception as e:
        print(f"{e} : 데이터 삽입에 실패했습니다... ㅠㅠ 확인 부탁해용")

def delect(collection, mydict):
    mycollection = db[f'{collection}']
    mycollection.delete_many(mydict)

    try : 
        print(f'{mydict} 데이터 삭제 성공!!')
    except Exception as e:
        print(f"{e} : 데이터 삭제 실패했습니다... ㅠㅠ 확인 부탁해용")

def select(collection):
    mycollection = db[f'{collection}']
    select_data = mycollection.find()

    return select_data




if __name__ == "__main__":

    collection = 'term'
    data = select (collection)
    terms = [(item['term'], item['term_description']) for item in data]
    print(terms)

    




