import os
import urllib.parse
import urllib.request
import json
import sys
import datetime
import time
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import requests

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from DB.db_mongodb import mongodb_insert,mongo_delete

load_dotenv()

naver_client_id = os.environ.get('NAVER_ID')
naver_client_secret = os.environ.get('NAVER_PASSWORD')

def get_article_image(news_url):
    try:
        # 뉴스 URL로 HTTP GET 요청
        response = requests.get(news_url, headers={'User-Agent': 'Mozilla/5.0'})
        response.raise_for_status()

        # HTML 파싱
        soup = BeautifulSoup(response.text, 'html.parser')

        # 이미지 태그 추출
        img_tag = soup.find('meta', property='og:image')  # Open Graph 이미지 태그
        if img_tag and img_tag.get('content'):
            return img_tag['content']
        else:
            print("이미지를 찾을 수 없습니다.")
            return None

    except Exception as e:
        print(f"이미지 가져오기 중 오류 발생: {e}")
        return None

def naver_news_crawling():
    # 검색할 키워드 설정 (UTF-8 인코딩)
    encText = urllib.parse.quote("청약")

    # 뉴스 검색 API URL 설정 (날짜순 정렬, 10개의 기사 요청)
    url = "https://openapi.naver.com/v1/search/news?query=" + encText + "&display=10&sort=sim"  # 정확도순, 10개의 기사


    # API 요청 설정
    request = urllib.request.Request(url)
    request.add_header("X-Naver-Client-Id", naver_client_id)
    request.add_header("X-Naver-Client-Secret", naver_client_secret)

    # API 호출 및 응답 처리
    response = urllib.request.urlopen(request)
    rescode = response.getcode()

    if rescode == 200:
        response_body = response.read().decode('utf-8')

        # JSON 데이터를 파싱
        news_data = json.loads(response_body)

        # 각 뉴스 아이템에서 필요한 정보를 추출하고 출력
        for item in news_data['items']:
            title = item['title'].replace('<b>', '').replace('</b>', '')  # HTML 태그 제거
            link = item['link']
            description = item['description'].replace('<b>', '').replace('</b>', '')
            pubDate = item['pubDate']

            # 뉴스 상세 페이지에서 이미지 URL 추출
            image_url = get_article_image(link)

            # MongoDB에 저장할 데이터
            mydict = {
                "title": title,
                "link": link,
                "description": description,
                "pubDate": pubDate,
                "image": image_url
            }

            # MongoDB에 데이터 삽입
            collection = "news"
                        mongo_delete(collection)
            mongodb_insert(collection, mydict)

            # 출력
            print(f"Title: {title}")
            print(f"Link: {link}")
            print(f"Description: {description}")
            print(f"Published Date: {pubDate}")
            print(f"Image: {image_url}")
            print("\n")
    else:
        print("Error Code:" + str(rescode))







if __name__ == "__main__":
    naver_news_crawling()
    pass