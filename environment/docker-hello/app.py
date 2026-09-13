# 需要两个东西：datetime 模块拿时间，print 打印
# from datetime import datetime  ← 拿到"现在"用 datetime.now()

import time       # 标准库：买房自带的家具，不用采购

import requests   # 第三方包：清单里采购的，打印版本号 = 开箱验货

now = time.ctime()  # 拿到"现在时间"（一个字符串）

print("Hello, Docker!", now)                   # 问候语 + 时间
print("requests 版本：", requests.__version__) # 能打印 = pip 真的到货了
