import pyodbc

index = 0
with open('all_sql.csv', 'r', encoding='utf-8') as f:
    while True:
        index += 1
        line = f.readline()
        if not line:
            break
        line = line.rstrip()
        print(line)
        # try:
        cnxn = pyodbc.connect("DRIVER={MySql ODBC 8.0 Unicode Driver};SERVER=exodus.tw; PORT=3306;DATABASE=dvva_project;UID=dvva_project_appuser;PASSWORD=mWu7nHTSn^N9Wrd5gELhUP66GyEtxT$X@H9SUAMVLJLQvpaK6&ahcFUxp*5n^b7zRV#CGGXeNRwVv*VD")
        cursor = cnxn.cursor()
        cursor.execute(f'INSERT INTO weather3 (No,CityName,YY,MM,Lon,Lat,RainValue,TempValue) VALUES ({line});')
        cnxn.commit()
        # except:
        #     print(f'[ERROR] Failed at {index}. Exited.')
        # finally:
        #     cursor.close()

print('Done.')