# 使用 Python 建立 Telegram Bot
## 學習目的
* 建立 Python 虛擬環境
* 建立 Telegram Bot
* Bot 接收、發送訊息

## 環境準備
* Visual Studio Code
* Python 3.6.8
* virtualenv 16.7.9

## 建立 Python 虛擬環境
在 bash 底下建立虛擬環境 **env**
```bash=
virtualenv env
```

啟用虛擬環境
```bash=
source env/scripts/activate
```

## 安裝相關套件
```bash=
pip install telepot # Telegram package
pip install pprint  # 文字排版
```

## 取得 Telegram Bot Token
在 Telegram Search **BotFather**，對話輸入 **/newbot**，接著輸入 bot 要顯示的名稱、bot ID。  
bot ID 不可重複，必須為英數組合(含底線)，結尾必須為 **bot**。  
完成後記下 Token。

## 建立 Telegram Bot
### 測試連線
```python=
import telepot as tel
bot = tel.Bot('TOKEN')
print(bot.getMe())
```
![](https://i.imgur.com/9ZfLHNf.png)

### 接收訊息
```python=
import telepot as tel
import time
from pprint import pprint
from telepot.loop import MessageLoop
bot = tel.Bot('TOKEN')


def on_recive_message(msg):
    pprint(msg)


MessageLoop(bot, on_recive_message).run_as_thread()
print('bot is listening...')

while True:
    time.sleep(5)
```
bot 收到的訊息格式如下：  
![](https://i.imgur.com/LmuaVIh.png)

### 發送訊息
指定 chat ID 回覆, 1:1 交談 chat ID=from ID
```python=import telepot as tel
import time
from pprint import pprint
from telepot.loop import MessageLoop
bot = tel.Bot('TOKEN')


def on_recive_message(msg):
    chat_id = msg['chat']['id']
    from_id = msg['from']['id']
    text = msg['text']
    print('chat_id:', chat_id, ',from_id:', from_id, ',text:', text)

    bot.sendMessage(chat_id, 'bot reply: ' + text)


MessageLoop(bot, on_recive_message).run_as_thread()
print('bot is listening...')

while True:
    time.sleep(5)
```

## 參考資料
* [官方 Telegram Bot API](https://core.telegram.org/bots/api)
* [用 Python 打造自己的 Telegram Bot!](https://oscarada87.github.io/2019/05/25/%E7%94%A8-Python-%E6%89%93%E9%80%A0%E8%87%AA%E5%B7%B1%E7%9A%84-Telegram-Bot/?fbclid=IwAR26vs_AENFZDbUZ5E_aVRvTweGtqvv1oim6TiGvy5qcmsNqitExn5T0_xs)
