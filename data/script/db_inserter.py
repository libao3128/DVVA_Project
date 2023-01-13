import pyodbc
import pandas as pd

df = pd.read_csv('all_sql2.csv', encoding='utf-8')

cnxn = pyodbc.connect("DRIVER={MySql ODBC 8.0 Unicode Driver};SERVER=exodus.tw; PORT=3306;DATABASE=dvva_project;UID=dvva_project_appuser;PASSWORD=mWu7nHTSn^N9Wrd5gELhUP66GyEtxT$X@H9SUAMVLJLQvpaK6&ahcFUxp*5n^b7zRV#CGGXeNRwVv*VD")
cursor = cnxn.cursor()

cmd = ''
for index, row in df.iterrows():
    line = f"{row['No']},'{row['CityName']}',{row['YY']},{row['MM']},{row['WGS84_Lon']},{row['WGS84_Lat']},{row['RainValue']},{row['TempValue']}"
    cmd = f'INSERT INTO weather4 (No,CityName,YY,MM,Lon,Lat,RainValue,TempValue) VALUES ({line});'
    cursor.execute(cmd)
    cnxn.commit()
    if (index+1) % 10000 == 0:
        print(f'Pass {index+1}')

cursor.close()
print('Done.')