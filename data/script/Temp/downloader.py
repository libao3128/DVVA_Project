import pandas as pd
import requests
import os

csvpath = 'csvfiles'

if not os.path.exists(csvpath):
    os.makedirs(csvpath)

df = pd.read_csv('460_1.csv', encoding='utf-8')

df_all = pd.DataFrame()

for index, row in df.iterrows():
    url = row['資料下載網址']
    print(url)
    r = requests.get(url)
    ifname = os.path.join(csvpath , url.split('/')[-1] + '.tmp')
    ofname = os.path.join(csvpath , url.split('/')[-1] + '.csv')

    with open(ifname, 'wb') as f:
        f.write(r.content)
    with open(ifname, 'r', encoding='big5') as ifile, open(ofname, 'w', encoding='utf-8') as ofile:
        ofile.write(ifile.read())
    os.remove(ifname)

    df_tmp = pd.read_csv(ofname, encoding='utf-8')
    if df_all.shape[0] == 0:
        df_all = df_tmp
    else:
        df_all = pd.concat([df_all, df_tmp])

df_all.to_csv(os.path.join(csvpath , 'all.csv'), encoding='utf-8')

