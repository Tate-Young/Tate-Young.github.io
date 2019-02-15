---
layout: blog
back: true
comments: True
flag: Oracle
background: gray
category: 后端
title: SQL 语法
date:   2019-02-14 22:19:00 GMT+0800 (CST)
background-image: https://i.loli.net/2018/04/13/5ad0695146748.jpg
tags:
- Oracle
- sql
---
# {{ page.title }}

## 什么是 SQL

**SQL** 是一种结构化查询语言，用来管理[**关系型数据库**](https://zh.wikipedia.org/wiki/關聯式資料庫管理系統)。可以把 SQL 分为两个部分:

* **数据操作语言(DML)** - 查询和更新指令
  * **SELECT** - 从数据库表中获取数据
  * **UPDATE** - 更新数据库表中的数据
  * **DELETE** - 从数据库表中删除数据
  * **INSERT INTO** - 向数据库表中插入数据
* **数据定义语言(DDL)** - 创建或删除表格
  * **CREATE TABLE** - 创建新表
  * **ALTER TABLE** - 变更(改变)数据库表
  * **DROP TABLE** - 删除表

> 上面只是列出我常用的，以前接触的比较多，主要是因为做数据可视化，用的是报表工具[帆软(FineReport)](http://www.finereport.com)，都是直连数据库的，可惜之前写的都没有保存下来 😭。

## SQL 基本语法

以下基于 Oracle 数据库介绍基本语法，可直接参照 [w3school 的教程](http://www.w3school.com.cn/sql/index.asp)了，给出一个大家都熟悉的栗子 🌰:

```SQL
-- 对大小写不敏感
SELECT LastName,FirstName AS aliasName FROM Persons
```

### distinct

**distinct** 可以过滤掉重复的值:

```SQL
-- 只会列出不同值的 Company 字段
SELECT DISTINCT Company FROM Orders
```

### where

**where** 可以在查询时增加条件，操作符如下:

| 操作符 | 描述 |
|:--------------|:---------|
| = | 等于 |
| <> | 不等于 |
| > | 大于 |
| < | 小于 |
| >= | 大于等于 |
| <= | 小于等于 |
| BETWEEN | 在某个范围内 |
| LIKE | 搜索某种模式 |
| IN | 规定多个值 |

```SQL
SELECT 列名称 FROM 表名称 WHERE 列 运算符 值

SELECT * FROM Persons WHERE City='Shenzhen'
-- 表的列可以存放 NULL 值
SELECT LastName,FirstName,Address FROM Persons WHERE Address IS NOT NULL
-- rownum 这里表示表的行数
SELECT * FROM Persons WHERE ROWNUM <= 5
```

**like** 可以与一些通配符搭配使用，通配符如下:

| 通配符 | 描述 |
|:--------------|:---------|
| **%** | 替代一个或多个字符 |
| **_** | 仅替代一个字符 |
| [charlist] | 字符列中的任何单一字符 |
| [^charlist] 或者 [!charlist] | 不在字符列中的任何单一字符 |

```SQL
-- 列出以 N 开头的城市名称
SELECT * FROM Persons WHERE City LIKE 'N%'
-- 列出以 A 或 L 或 N 开头的城市名称
SELECT * FROM Persons WHERE City LIKE '[ALN]%'
-- 列出名字的第一个字符之后是 "eorge" 的人
SELECT * FROM Persons WHERE FirstName LIKE '_eorge'
```

**in** 可以规定多个值:

```SQL
SELECT * FROM Person WHERE LastName IN ('Adams','Carter')
```

**AND** 和 **OR** 可在 WHERE 子语句中把两个或多个条件结合起来:

```SQL
SELECT * FROM Persons WHERE (FirstName='Thomas' OR FirstName='William') AND LastName='Carter'
```

### Order By

**Order By** 可以根据指定的列对结果集进行排序。默认为升序，即 **ASC**，也可以使用 **DESC** 关键字降序:

```SQL
-- 依次按照 Company、OrderNumber 排序
SELECT Company, OrderNumber FROM Orders ORDER BY Company, OrderNumber
-- 分别使用升序及降序
SELECT Company, OrderNumber FROM Orders ORDER BY Company DESC, OrderNumber ASC
```

还可以结合 **nlssort** 函数进行对拼音或笔划等的排序:

```SQL
SELECT * FROM TEAM ORDER BY NLSSORT(排序字段名,'NLS_SORT = SCHINESE_PINYIN_M') -- 拼音
SELECT * FROM TEAM ORDER BY NLSSORT(排序字段名,'NLS_SORT = SCHINESE_STROKE_M') -- 笔划
SELECT * FROM TEAM ORDER BY NLSSORT(排序字段名,'NLS_SORT = SCHINESE_RADICAL_M') -- 部首
```

还可以配合 **decode** 函数按照序号自定义排序:

```SQL
SELECT * FROM table_name ORDER BY DECODE(条件,值1,返回值1,值2,返回值2,...值n,返回值n);
```

### union

**union** 可以合并两个或多个 SELECT 语句的结果集:

```SQL
-- UNION 命令会过滤相同的值
SELECT E_Name FROM Employees_China
UNION
SELECT E_Name FROM Employees_USA
```

### exists

**exists** 可以进行联表查询，用于检查子查询返回行的存在性。在这种情况下相对于 IN(没有走索引)，使用 EXISTS(或 NOT EXISTS)通常将提高查询的效率。

```SQL
-- 低效
SELECT * FROM emp WHERE sal > 1000 AND deptno IN (SELECT deptno FROM dept WHERE loc = 'DALLAS')
-- 高效
SELECT * FROM emp WHERE sal > 1000 AND EXISTS (SELECT 1 FROM dept WHERE deptno = emp.deptno AND loc = 'DALLAS')
```

### join

**join** 可以进行联表查询，数据库中的表可通过键将彼此联系起来。**主键(Primary Key)**是一个列，在这个列中的每一行的值都是唯一的。在表中，每个主键的值都是唯一的。

* **INNER JOIN** - 内连接，同 **JOIN** 在表中存在至少一个匹配时，则返回行。
* **LEFT JOIN** - 即使右表中没有匹配，也从左表返回所有的行
* **RIGHT JOIN** - 即使左表中没有匹配，也从右表返回所有的行
* **FULL JOIN** - 只要其中一个表中存在匹配，就返回行

```SQL
SELECT p.LastName, p.FirstName, o.OrderNo FROM Persons AS p, Orders AS o WHERE p.Id_P = o.Id_P

SELECT * FROM Persons,Orders WHERE Persons.Id_P = Orders.Id_P
-- 等价于
SELECT * FROM Persons INNER JOIN Orders ON Persons.Id_P = Orders.Id_P
```

```SQL
-- LEFT JOIN 关键字会从左表(Persons)那里返回所有的行，即使在右表(Orders)中没有匹配的行。RIGHT JOIN 反之。FULL JOIN 则都返回
SELECT Persons.LastName, Persons.FirstName, Orders.OrderNo FROM Persons LEFT JOIN Orders ON Persons.Id_P = Orders.Id_P
```

### case when

**case when** 可以进行条件的选择，并给出对应的值:

```SQL
CASE sex
WHEN '1' THEN '男'
WHEN '2' THEN '女'
ELSE '其他' END

-- 等价于
CASE
WHEN sex = '1' THEN '男'
WHEN sex = '2' THEN '女'
ELSE '其他' END
```

```SQL
SELECT u.id,u.name,u.sex,
  (CASE u.sex
    WHEN 1 THEN '男'
    WHEN 2 THEN '女'
    ELSE '人妖'
    END
   ) 性别
FROM users u;
```

### 连接符 ||

**\|\|** 表示拼接，如 `'a'||'b'` 等价于 `'ab'`，当然不同数据库中的字符串连接符可能也不同，比如 SQL Server 中的 "+"。而 [MySQL](http://www.runoob.com/mysql/mysql-tutorial.html) 则用的 concat 函数。

### update 等更新指令

1、**update** 可以更新数据库表中的数据:

```SQL
UPDATE 表名称 SET 列名称 = 新值 WHERE 列名称 = 某值

UPDATE Person SET FirstName = 'Fred' WHERE LastName = 'Wilson'
```

2、**delete** 可以从数据库表中删除某行数据或者整个表数据:

```SQL
DELETE FROM 表名称 WHERE 列名称 = 值
DELETE 表名称 -- 删除整张表数据

DELETE FROM Person WHERE LastName = 'Wilson'
```

这里介绍一下与 **truncate** 的区别，使用 truncate 语句是删除表中的所有记录，但只支持 table 而不支持视图:

```SQL
TRUNCATE [TABLE] 表名称
```

由于 delete 语句删除记录时候，记录是逐条删除的，而 truncate 语句删除数据时不产生回退信息。所以如果需要删除大量数据的时候使用 delete 则占用较多的系统资源，而如果使用 truncate 则会快的多。

3、**insert into** 可以向数据库表中插入数据:

```SQL
INSERT INTO table_name (列1, 列2,...) VALUES (值1, 值2,....)

INSERT INTO Persons (LastName, Address) VALUES ('Wilson', 'Champs-Elysees')
```

## SQL 函数

SQL 拥有很多可用于计数和计算的内建函数，以下列出一些常用的:

| 模块 | 描述 |
|:--------------|:---------|
| AVG(column) | 返回某列的平均值 |
| COUNT(column) | 返回某列的行数(不包括 NULL 值) |
| COUNT(*) | 返回被选行数 |
| MAX(column) | 返回某列的最高值 |
| MIN(column) | 返回某列的最低值 |
| SUM(column) | 返回某列的总和 |

```SQL
SELECT Customer FROM Orders WHERE OrderPrice > (SELECT AVG(OrderPrice) FROM Orders)

SELECT COUNT(DISTINCT column_name) AS names FROM table_name
```

### Group By

**GROUP BY** 语句用于结合合计函数(如 SUM)，根据一个或多个列对结果集进行分组:

```SQL
SELECT Customer,SUM(OrderPrice) FROM Orders GROUP BY Customer
```

该语句后面还可以接 **ROLLUP** 或 **CUBE**、**GROUPING SETS** 等辅助函数，这里只简单介绍下 ROLLUP，可以检索出更多的分组聚合信息，以下栗子摘自这里:

```SHELL
SELECT dep,pos,AVG(sal) FROM employee GROUP BY dep,pos;
+------+------+-----------+
| dep | pos | avg(sal) |
+------+------+-----------+
| 01 | 01 | 1500.0000 |
| 01 | 02 | 1950.0000 |
| 02 | 01 | 1500.0000 |
| 02 | 02 | 2450.0000 |
| 03 | 01 | 2500.0000 |
| 03 | 02 | 2550.0000 |
+------+------+-----------+
6 rows in set (0.02 sec)
```

```SHELL
SELECT dep,pos,AVG(sal) FROM employee GROUP BY rollup(dep,pos);
+------+------+-----------+
| dep | pos | avg(sal) |
+------+------+-----------+
| 01 | 01 | 1500.0000 |
| 01 | 02 | 1950.0000 |
| 01 | NULL | 1725.0000 |
| 02 | 01 | 1500.0000 |
| 02 | 02 | 2450.0000 |
| 02 | NULL | 2133.3333 |
| 03 | 01 | 2500.0000 |
| 03 | 02 | 2550.0000 |
| 03 | NULL | 2533.3333 |
| NULL | NULL | 2090.0000 |
+------+------+-----------+
10 rows in set (0.00 sec)
```

| 模块 | 描述 |
|:--------------|:---------|
| **ROLLUP** | GROUP BY ROLLUP(A,B,C) | 首先对(A,B,C)进行分组，然后对(A,B)进行分组，然后是(A)进行分组， 最后对全表进行分组操作 |
| **CUBE** | GROUP BY CUBE(A,B,C) | 首先对(A,B,C)进行分组，然后依次对(A,B)、(A,C)、(A)、(B,C)、(B)、(C)进行分组，最后对全表进行分组操作 |
| **GROUPING SETS** | GROUP BY GROUPING SETS(A,B,C) |  依次对(C)、(B)、(A)进行分组 |

### Having

在 SQL 中增加 **HAVING** 子句原因是，WHERE 关键字无法与合计函数一起使用:

```SQL
-- 查找订单总金额少于 2000 的客户
SELECT Customer,SUM(OrderPrice) FROM Orders GROUP BY Customer HAVING SUM(OrderPrice) < 2000
```

### decode

**decode** 函数与一系列嵌套的 `IF-THEN-ELSE` 语句相似，有以下两种用法:

```SQL
decode(条件,值1,返回值1,值2,返回值2,...值n,返回值n,缺省值)
-- 当字段或字段的运算的值等于值1时，该函数返回值2，否则返回值3
decode(字段或字段的运算，值1，值2，值3)
```

以上第二种用法和函数 **nvl** 有点类似:

* NVL(E1, E2) - 如果 E1 为 NULL，则函数返回 E2
* NVL2(E1, E2, E3) - 如果 E1 为 NULL，则函数返回 E3，否则返回 E2

### greatest

**greatest** 可以用来求多列的最大值，反之 **least** 可以求最小值:

```SQL
SELECT chinese, math, english, GREATEST(chinese, math, english) As max, LEAST(chinese, math, english) As min FROM score
```

### to_char

**to_char** 主要有以下两种用途:

* to_char(date,'格式') - 日期转换
* to_char(number,'格式') - 数字转换

```SQL
SELECT TO_CHAR(sysdate,'yyyy-MM-dd HH24:mi:ss') FROM dual
-- 获取今年的年份
SELECT TO_CHAR(sysdate,'yyyy') FROM dual
-- 获取当前的月份 01-12
SELECT TO_CHAR(sysdate,'MM') FROM dual
-- 如上，如果获取的月份不需要前面留 0，则可以使用 FM 修饰符(填充模式)。 1-12
SELECT TO_CHAR(sysdate,'FMMM') FROM dual


-- 返回 2,333
SELECT TO_CHAR(2333,'9,999') FROM dual
```

### to_date 日期转换

**to_date** 可以用来做日期转换，常用的一些格式如下:

| 格式 | 描述 | 栗子 |
|:--------------|:---------|:---------|
| yy | 两位年 | 显示值 19 |
| yyy | 三位年 | 显示值 019 |
| yyyy | 四位年 | 显示值 2019 |
| mm | 两位月 | 显示值 02 |
| mon | 字符集表示(简) | 显示值 02月，英文版为 Feb |
| month | 字符集表示 | 显示值 02月，英文版为 Febrary |
| dd | 当月第几天 | 显示值 02 |
| ddd | 当年第几天 | 显示值 250 |
| dy | 当周第几天(简) | 显示值 星期五，英文版为 Fri |
| day | 当周第几天 | 显示值 星期五，英文版为 Friday |
| hh | 12 小时制 | 显示值 01 |
| hh24 | 24 小时制 | 显示值 13 |
| Q | 季度 | 显示值 4 |
| W | 当月第几周 | 显示值 1 |
| WW | 当年第几周 | 显示值 20 |

```SQL
SELECT TO_DATE('2019-02-14 13:14:52','yyyy-MM-dd HH24:mi:ss') FROM dual;
```

另外提一个日期时分秒为 0 时的简写:

```SQL
SELECT * FROM t2001 WHERE flight_date = TO_DATE('2010-10-01','yyyy-MM-dd')
SELECT * FROM t2001 WHERE flight_date = date'2010-10-01'
```

### trunc

**trunc** 函数主要有以下两种用途:

* trunc(date[, fmt]) - 截断日期
* trunc(number,num_digits) - 返回处理后的数值, Num_digits 用于指定取整精度的数字，默认值为 0

```SQL
-- 今天是 2019-02-04
SELECT trunc(sysdate) FROM dual
-- 返回当月第一天 2019-02-01
SELECT trunc(sysdate, 'mm') FROM dual
```

```SQL
SELECT trunc(123.458) FROM dual --123
SELECT trunc(123.458,-1) FROM dual --120
SELECT trunc(123.458,1) FROM dual --123.4
```

### add_months

**add_months(time,months)** 函数可以得到某一时间之前或之后 n 个月的时间，符号 "-" 表示之前的时间:

```SQL
-- 该查询的结果是当前时间半年前的时间
-- dual 表示 Oracle 提供的最小的工作表，只有一行一列，具有某些特殊功用
SELECT ADD_MONTHS(sysdate,-6) FROM dual
-- 找出今年的天数
SELECT ADD_MONTHS(TRUNC(sysdate,'year'), 12) - TRUNC(sysdate,'year') FROM dual
```

### compute

**compute** 子句能够观察"查询结果"的数据细节或统计各列数据，返回结果由 select 列表和 compute 统计结果组成。

```SHELL
SELECT * FROM A WHERE 数量>8 COMPUTE max(数量),min(数量),avg(数量)
+------+------+-----------+
| 类别 | 数量 |
+------+------+-----------+
| a | 11 | test1 |
| a | 11 | test2 |
| b | 11 | test3 |
| c | 9 | test4 |
| c | 9 | test5 |
| b | 10 | test6 |
+------+------+-----------+
| max | min | avg |
| 11 | 9 | 10 |
```

## 参考链接

1. [SQL 基础教程 - w3school](http://www.w3school.com.cn/sql/index.asp)
2. [Oracle group by 高级用法对比效果(ROLLUP、GROUPING SETS、CUBE)](https://blog.csdn.net/suyishuai/article/details/22042333) By suyishuai
3. [使用 GROUP BY WITH ROLLUP 改善统计性能](https://blog.csdn.net/id19870510/article/details/6254358) By -droidcoffee-
4. [SQL 中 Group By 的使用](http://www.cnblogs.com/rainman/archive/2013/05/01/3053703.html) By Rain Man
5. [sql 中 drop、truncate 和 delete 的区别](https://www.cnblogs.com/dekevin/archive/2012/07/22/2604049.html) By dekevin
6. [SQL 中 EXISTS 的用法](https://www.cnblogs.com/netserver/archive/2008/12/25/1362615.html) By Dsw
7. [高效 SQL 语句必杀技](https://blog.csdn.net/leshami/article/details/7406672) By Leshami
8. [EXISTS、IN 与  JOIN性能分析](https://blog.csdn.net/caomiao2006/article/details/52099450) By caomiao2006
