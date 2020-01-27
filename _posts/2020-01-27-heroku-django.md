# 使用 Heroku 架設 Django web site

# 建立 Django Web Site
## 環境設定
* python 3.6.8
* virtualenv 16.7.9

## 建立虛擬環境
```bash=
virtualenv env
```

## 安裝 python 套件
建立 requirements.txt:
```=
asgiref==3.2.3
astroid==2.3.3
colorama==0.4.3
dj-database-url==0.5.0
dj-static==0.0.6
Django==3.0.2
gunicorn==20.0.4
isort==4.3.21
lazy-object-proxy==1.4.3
mccabe==0.6.1
psycopg2==2.8.4
pycodestyle==2.5.0
pytz==2019.3
six==1.14.0
sqlparse==0.3.0
static3==0.7.0
typed-ast==1.4.1
whitenoise==5.0.1
wrapt==1.11.2
```

安裝:
```bash=
pip -r requirements.txt
```

## 建立 Django project
安裝 Django 之後會在 Scripts 底下增加 django-admin.py，可用來建立網站。  
建立專案名稱 mysite:
```bash=
django-admin.py startproject mysite
```

檔案結構:
```
mysite/
├── manage.py
└── mysite
    ├── __init__.py
    ├── settings.py
    ├── urls.py
    └── wsgi.py
```

接下來的操作皆會在 mysite(project) 底下進行，切換至 mysite(project)下:
```bash=
cd mysite
```

mysite/manage.py 可用來管理 db, app，指令查詢:
```bash=
python manage.py -h
```

查 runserver:
```bash=
python manage.py runserver -h
```

## 啟動 web site
```bash=
python manage.py runserver
```
預設網址: http://localhost:8000/  
輸入 Ctrl+C 取消啟動

## 建立 application(app)
建立應用程式 **trips**，可自訂名稱、或多組服務:
```bash=
python manage.py startapp trips
```

檔案結構:
```
mysite/
└── trips/
    ├── __init__.py
    ├── admin.py
    ├── migrations
    ├── models.py
    ├── tests.py
    └── views.py
```

## 將 app 加入設定
在 mysite/settings.py **INSTALLED_APPS** 增加 trips(app):
```
INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'trips',
)
```
app 之間有先後順序關係，先將自訂的 trips 加在最後。  
Django 已將常用 app 設定在 INSTALLED_APPS。例如 auth(使用者認證)、admin(管理後台)等等。

## settings 區分 local/production
mysite 底下建立 settings 目錄放置設定檔，mysite/settings.py 移動並重新命名 mysite/settings/base.py:
```bash=
mkdir mysite/settings
mv mysite/settings.py mysite/settings/base.py
```
在 mysite/settings 新增 local.py, production.py  
local.py:
```python=
import dj_database_url

from .base import *

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
```

production.py
```python=
import dj_database_url

from .base import *

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASES = {
    'default': dj_database_url.config()
}

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# Honor the 'X-Forwarded-Proto' header for request.is_secure().
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Allow all host headers.
ALLOWED_HOSTS = ['*']
```

base.py 放通用的設定，local.py 放本機開發使用的設定，production 放 Heroku 上線使用的設定。

## 同步資料庫
先執行 makemigrations 指令，會依 Model 建立新的 migration 檔案在 mysite/trips/migrations 目錄下:
```bash=
python manage.py makemigrations
```

接著執行 migrate 指令寫入資料庫:
```bash=
python manage.py migrate
```

migrate 會依據 **INSTALLED_APPS** 設定按 app 順序建立或更新資料表。

## 設定管理後台
使用預設值

### 建立 superuser
使用 **createsuperuser** 建立 superuser:
```bash=
python manage.py createsuperuser
```
依提示輸入帳號、e-mail、密碼。

### 註冊 Model
要讓 Django 知道哪些 Model 可在後台進行管理。  
修改 trips(app) 裡的 admin.py:
```python=
from django.contrib import admin

from .models import Post

# Register your models here.


admin.site.register(Post)
```

# 申請 Heroku 帳號
[Heroku home](https://www.heroku.com/home) > sign on

# 安裝 Heroku CLI 執行工具
[Download and install](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)

# 使用 SSH 登入
## 建立 SSH private/public key
未輸入檔案名稱會以 **id_rsa** 命名，可自訂。密碼(passphrase)可忽略(不確定用途)。
```shell=
ssh-keygen -t rsa
```
完成後會產生 **id_rsa** & **id_rsa.pub** 兩個檔案在目前目錄下。  
id_rsa 為 private key 存放在 local(~/.ssh/)，id_rsa.pub 則上傳至 remote(Heroku)。  
個人習慣會將這兩個檔案都放在 local(~/.ssh/)。  

## 上傳 SSH public key
未輸入檔案名稱預設為 id_rsa.pub  
若檔案不在 ~/.ssh/ 下可輸入完整路徑
```shell=
heroku keys:add
```

確認 keys
```shell=
heroku keys
```

測試連線
```shell=
ssh -v git@heroku.com
```

如果出現:
```
Permission denied (publickey).
```

可在 ~/.ssh/config 增加:
```
Host heroku.com
  HostName heroku.com
  IdentityFile ~/.ssh/id_rsa
  IdentitiesOnly yes
```

## 指定 Heroku 使用 settings
```bash=
heroku config:set DJANGO_SETTINGS_MODULE=mysite.settings.production
```

## 第一次建立程式
將程式上傳
```bash=
git push heroku master
```

告知 Heroku 需要一台機器(dyno)
```bash=
heroku ps:scale web=1
```

初始化 db
```bash=
heroku run python mysite/manage.py makemigrations
heroku run python mysite/manage.py migrate
```

為後台建立使用者(管理者)
```bash=
heroku run python mysite/manage.py createsuperuser
```

## 程式更新
```bash=
git push heroku master
```

## addons add PostgreSQL
**hobby-dev** 為免費版本
```bash=
heroku addons:create heroku-postgresql:hobby-dev
```

安裝後會自動增加環境變數 **DATABASE_URL**

# Error
## staticfile
```
Error while running '$ python mysite/manage.py collectstatic --noinput'.
```
這訊息說明未找到 **staticfiles** 設定，在 **mysite/settings/base.py** 內未設定 **STATIC_ROOT**，或 **mysite/staticfiles** 目錄不存在。

mysite/settings/base.py 內容增加:
```python=
# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.9/howto/static-files/
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/static/'
```

heroku 需另外安裝 whitenoise:
```bash=
pip install whitenoise
```

myiste/wsgi.py add:
```python=
from django.core.wsgi import get_wsgi_application
from whitenoise import WhiteNoise

application = get_wsgi_application()
application = WhiteNoise(application)
```

mysite/urls.py add:
```python=
urlpatterns = [
    path('', hello_world),
    path('admin/', admin.site.urls),
    url('^hello/$', hello_world),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
```

mysite/settings/base.py add:
```python=
MIDDLEWARE = [
    ...,
    'whitenoise.middleware.WhiteNoiseMiddleware',
]
```


mysite/staticfiles 目錄不存在，執行 collectstatic 會產生 admin 需要的檔案，同時建立 staticfiles 目錄:
```bash=
python manage.py collectstatic
```

ref:
* [Error with collectstatic while deploying Django app to Heroku](https://stackoverflow.com/a/44097552)
* [Django and Static Assets](https://devcenter.heroku.com/articles/django-assets)
* [WhiteNoise](http://whitenoise.evans.io/en/stable/)

## no such table: auth_user
Heroku 不可使用 sqlite3，可改用 PostgresSQL

ref:
* [“no such table” error on Heroku after django syncdb passed](https://stackoverflow.com/a/29767527)

## settings.DATABASES is improperly configured
Heroku 使用 PostgresSQL，需要額外建立 addons for PostgresSQL，可參考 [addons add PostgreSQL](#addons-add-PostgreSQL)

# 參考資料
* [用 Heroku 部署網站](https://djangogirlstaipei.herokuapp.com/tutorials/deploy-to-heroku/?os=windows)
* [Managing Your SSH Keys](https://devcenter.heroku.com/articles/keys)
* [Django Girls 學習指南](https://djangogirlstaipei.gitbooks.io/django-girls-taipei-tutorial/)

