import pandas as pd

df1 = pd.read_csv('rain_all.csv', encoding='utf-8').drop(columns=['Unnamed: 0', 'Unnamed: 6'])
df2 = pd.read_csv('temp_all.csv', encoding='utf-8').drop(columns=['Unnamed: 0', 'Unnamed: 6'])

print(df1)
print(df2)

df = pd.merge(df1, df2, how='outer', on=['CityName', 'YY', 'MM', 'WGS84_Lon', 'WGS84_Lat'])

print(df)
df.to_csv('all.csv', encoding='utf-8')

df.insert(0, 'No', df.index+1)
df.to_csv('all_sql.csv', header=False, index=False, encoding='utf-8')
df.to_csv('all_sql2.csv', header=True, index=False, encoding='utf-8')