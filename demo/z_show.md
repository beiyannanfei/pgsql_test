# PostgreSQL

### 1.安装
    brew install postgresql
![安装-MAC](https://raw.githubusercontent.com/beiyannanfei/pgsql_test/master/demo/pic/01.jpg)
----

### 2.启动
    pg_ctl -D /usr/local/var/postgres start

### 3.基本操作
```
    createdb demo_db    //创建数据库
    dropdb demo_db      //删除数据库
    psql -U dbuser -d exampledb -h 127.0.0.1 -p 5432    //连接数据库
```
> 注意: 上述命令执行无须连接数据库(连接本机无密码时使用: psql demo_db);

```
    \h：查看SQL命令的解释，比如\h select。
    \?：查看psql命令列表。
    \l：列出所有数据库。
    \c [database_name]：连接其他数据库。
    \d：列出当前数据库的所有表格。
    \d [table_name]：列出某一张表格的结构。
    \du：列出所有用户。
    \e：打开文本编辑器。
    \conninfo：列出当前数据库和连接的信息。
    select version();  查看版本
```
    
可视化客户端[pgadmin](https://www.postgresql.org/ftp/pgadmin/pgadmin4/v2.0/macos/)
    
    
    
        







# 1
## 2
### 3
#### 4
##### 5
###### 6

----

```
    {
      "A": 123
    }
```

----

> 引用AAAAAAAAAA

----

Joi使用方法参考[API Reference.](https://github.com/hapijs/joi/blob/v10.5.0/API.md)

----

- 1
- 2
- 3

----

- [x] AAA
    - [x] A1
    - [x] A2
- [ ] BBB
- [ ] CCC

----

![github](http://7xvi3w.com1.z0.glb.clouddn.com/gitnest1.png)

----

- list1
    - list1.1
    - list1.2
- list2
- list3
    
----

1. listA
    1. listA.1
    2. listA.2
2. listB
3. listC

----

| item | value | qty |
| :--- | :---- | :-- |
| aa | bb | cc |
| aa | bb | cc |

----

[有道云笔记官网](http://note.youdao.com/)

----

下边是一个分割线
***
上边是一个分割线

