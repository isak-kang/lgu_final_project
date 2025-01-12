#!/bin/bash

cd /home/ubuntu/lgu_final_project/
source lgu/bin/activate


cd lgu_final
pip install --upgrade pip
pip install -r requirements.txt


echo "3" >> ../test


deactivate