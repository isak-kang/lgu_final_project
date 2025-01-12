#!/bin/bash


cd /home/ubuntu/lgu_final_project/lgu_final/frontend

# React 의존성 설치 및 빌드
npm install
npm run build

# 빌드된 파일을 Nginx 루트 디렉토리로 복사
sudo rm -rf /var/www/html/*
sudo cp -r build/* /var/www/html/

echo "React build completed" >> /home/ubuntu/lgu_final_project/test