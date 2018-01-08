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
    PostgreSQL支持标准的SQL类型：int, smallint, real, double precision, char(N), varchar(N), date, time, timestamp,
    和 interval，还支持其它的通用类型和丰富的几何类型。    
```
    CREATE TABLE weather (
        a   smallint,               //-32768 到 +32767
        b   int,                    //-2147483648 到 +2147483647
        c   bigint,                 //-9223372036854775808 到 +9223372036854775807
        d   real,                   //6 位十进制数字精度(4 byte)
        e   double precision,       //15 位十进制数字精度(8 byte)
        f   numeric(10, 6),         //用户指定的精度,	小数点前 131072 位；小数点后 16383 位
        g   serial,                 //自增整数,1 到 2147483647(还有smallserial，bigserial)
        h   varchar(10),            //变长，有长度限制
        i   char(10),               //定长，不足补空白
        j   text,                   //变长，无长度限制
        k   date,                   //只用于日期,eg. 2018-01-08
        l   timestamp,              //毫秒级时间戳
        m   time,                   //只用于一日内时间,eg. 08:10:54
        n   boolean,                //布尔类型, 真(TRUE 't' 'true' 'y' 'yes' 'on' '1'),假(FALSE 'f' 'false' 'n' 'no' 'off' '0')
        o   mood,                   //枚举类型，需要首先创建枚举类型mood 「CREATE TYPE mood AS ENUM ('sad', 'ok', 'happy');」
        p
        q
        r
        s
        t
        u
        v
        w
        x
        y
        z
    );
```

    NUMERIC - 用户指定的精度
        语法：NUMERIC(precision, scale);
        scale(标度): 小数部分的位数;
        precision(精度): 全部数据位的数目，也就是小数点两边的位数总和;
        eg. 23.5141 的精度为 6 而标度为 4 。
        你可以认为整数的标度为零。        
        注意：如果一个要存储的数值的标度比字段声明的标度高，那么系统将尝试圆整(四舍五入)该数值到指定的小数位。
             如果小数点左边的数据位数超过了声明的精度减去声明的标度，那么将抛出一个错误。






    删除表：DROP TABLE tablename;



    