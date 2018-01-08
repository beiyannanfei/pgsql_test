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
    \q：退出qsql。
    select version();  查看版本
```
> 注意: 上述命令需访问具体数据后执行;
    
可视化客户端[pgadmin](https://www.postgresql.org/ftp/pgadmin/pgadmin4/v2.0/macos/)
![pgadmin](https://raw.githubusercontent.com/beiyannanfei/pgsql_test/master/demo/pic/02.jpg)    
----

### 4.js库
    npm install pg
----

### 5.表
    可以通过声明表的名字和所有字段的名字及其类型来创建表：
    PostgreSQL支持标准的SQL类型： int, smallint, real, double precision, char(N), varchar(N), date, time, timestamp,和 interval，还支持其它的通用类型和丰富的几何类型。    
```
    CREATE TABLE weather (
        a   varchar(80),
        b   int,          
        c   real,         
        d   date
    );
```
    删除表：DROP TABLE tablename;



    