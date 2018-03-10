---
layout: blog
tool: true
comments: True
flag: Git
background: green
category: 前端
title: Git 命令
date:   2018-03-10 23:37:00 GMT+0800 (CST)
background-image: https://cdn.liaoxuefeng.com/cdn/files/attachments/001384907702917346729e9afbf4127b6dfbae9207af016000/0
tags:
- git
---
# {{ page.title }}

## Git 术语

| 术语 | 描述 |
|:--------------|:---------|
| **HEAD** | 当前活跃分支的游标指针 |
| **Index** | 暂存区，即 Stage，是指即将被下一个提交的文件集合 |
| **Working Copy** | 工作区 |

![working copy](https://cdn.liaoxuefeng.com/cdn/files/attachments/001384907702917346729e9afbf4127b6dfbae9207af016000/0)

## Git 命令

Git 常用命令有:

| 命令 | 描述 | 栗子 |
|:--------------|:---------|:---------|
| remote | 查看远程库的信息 | <code>git remote -v</code> |
| clone | 从现有仓库克隆到指定文件目录 | <code>git clone 仓库地址 文件目录</code> |
| status | 查看文件状态 | <code>git status</code> |
| add | 跟踪文件，暂存 | <code>git add README.md</code> |
| diff | 比较工作目录中当前文件和暂存区域快照之间的差异 | <code>git diff</code> |
| rm | 移除文件 | <code>git rm REANME.md</code> |
| mv | 移动文件，改名 | <code>git mv README.txt README.md</code> |
| commit | 提交到本地仓库 | <code>git commit -m 'initial commit'</code> |
| push | 推送到远端仓库 | <code>git push</code> |
| pull | 拉取自远端仓库 | <code>git pull</code> |
| log | 查看提交历史，-p 展开显示每次提交的内容差异，-2 则仅显示最近的两次更新 | <code>git log -p -2</code> |
| reflog | 查看命令历史 | <code>git reflog</code> |
| reset | 文件从暂存区回退到工作区；版本回退 | <code>git reset HEAD filename</code> |
| branch | 创建分支，-d 参数为删除分支，-D 强制删除 | <code>git branch -d branchname</code> |
| merge | 合并，--no-ff 禁用 Fast forward 合并模式 | <code>git merge branchname</code> |
| tag | 标签，版本库的一个快照 | <code>git tag v1.0.0 commitId</code> |

### commit

**commit** 命令用于提交代码到本地仓库，常用到的参数:

* **m** 参数 - 添加描述
* **a** 参数 - 跳过暂存(add)直接提交
* **amend** 参数 - 重新修正提交

```SHELL
git commit;
<!-- 参数 -m: 提交描述 -->
git commit -a -m 'add a new file'

# 三条命令最终只是产生一个提交，第二个提交命令修正了第一个的提交内容
git commit -m 'initial commit'
git add forgotten_file
git commit --amend
```

<video controls="">
    <source src="http://github.liaoxuefeng.com/sinaweibopy/video/master-branch-forward.mp4" type="video/mp4"></source>
</video>

### reset

**reset** 命令主要有两个用途:

* git reset HEAD - 文件从暂存区回退到工作区(*unstage*)，后接 filename 可指定文件
* git reset HEAD^ - 版本回退，^^ 表示回退 2 个版本，也可写作 ~2，以此类推
  * **soft** 参数 - 保留所有本地修改，仅移动 HEAD 头指针
  * **mixed** 默认参数 - 保留工作区修改并重置缓存区，移动 HEAD 头指针和保留 Working Copy，但重置 Index
  * **hard** 参数 - 丢弃所有本地修改(不包括未跟踪的文件)，移动 HEAD 头指针和重置 Working Copy

版本也可按照 commit id 进行回退，若不记得，可根据不同情况通过以下两种途径获取 commit id:
* 版本回退 - <code>git log</code> 查看提交历史
* 版本恢复 - <code>git reflog</code> 查看命令历史

<video controls="">
    <source src="http://github.liaoxuefeng.com/sinaweibopy/video/git-reset.mp4" type="video/mp4"></source>
</video>

### checkout

**checkout** 命令主要有两个用途:

* 可以丢弃工作区中已跟踪文件的修改(*discard*):
  * <code>git checkout -- filename</code> - 放弃指定文件
  * <code>git checkout .</code> - 放弃所有工作区文件

* 切换分支:
  * <code>git checkout branchname</code> - 切换至指定分支
  * <code>git checkout -b branchname</code> - 创建并切换至该分支

<video controls="">
    <source src="http://github.liaoxuefeng.com/sinaweibopy/video/master-and-dev-ff.mp4" type="video/mp4"></source>
</video>

### merge

上述视频例子的**合并(merge)**属于**快速合并(Fast forward)**，如果 master 和 feature 都有提文件，此时通过合并 feature 分支则不会产生快速合并。若有同样的文件被提交，则可能会出现**冲突(conflict)**，Git用 <code><<<<<<<，=======，>>>>>>></code> 标记出不同分支的内容，解决完冲突并提交后分支如下:

```SHELL
# 也可使用 log 命令查看，--graph 参数可以查看分支合并图
git log --graph --pretty=oneline --abbrev-commit
```

![conflict](https://cdn.liaoxuefeng.com/cdn/files/attachments/00138490913052149c4b2cd9702422aa387ac024943921b000/0)

通常合并分支时，Git 会尽可能用 Fast forward 模式，但这种模式下，删除分支后会丢掉分支信息。如果要强制禁用该模式，Git 就会在 merge 时生成一个新的 commit，这样从分支历史上就可以看出分支信息。

```SHELL
# 使用参数 --no-ff 可禁用 Fast forward 模式
git merge --no-ff -m "merge with no-ff" feature
```

![merge --no-ff](https://cdn.liaoxuefeng.com/cdn/files/attachments/001384909222841acf964ec9e6a4629a35a7a30588281bb000/0)

### stash

**stash** 可以把工作区和暂存区的未跟踪文件都“储藏”起来，等以后恢复现场后继续工作，

```SHELL
git stash
# Saved working directory and index state WIP on master: b9ffdcd fix conflict

# 参数 -u 也可以储存将未跟踪的文件
git stash -u

# 查看 stash 列表
git stash list
# stash@{0}: WIP on master: b9ffdcd fix conflict
```

执行 stash 命令后，此时有两种方式进行恢复:

* **git stash apply** - 恢复后，stash 内容并不删除，要用 <code>git stash drop</code> 来删除
* **git stash pop** - 恢复并删除 stash 内容

```SHELL
# 也可按照指定的 stash 内容进行恢复，默认是恢复最新，即 stash@{0}
git stash apply stash@{1}
```

### tag

**tag** 一般用于发布某个版本时，在版本库中打上标签便于后续查看，类似分支，都是指向某次 commit 的指针，但分支可移动，而标签不可动。

```SHELL
# 创建一个标签
git tag v1.0.0

# 根据 commit id 创建一个标签
git tag v1.0.0 b9ffdcd

# 删除某个标签
git tag -d v1.0.0
```

可以使用 show 命令查看标签具体信息:

```SHELL
# 查看所有标签
git tag
# v1.0.0

git show v1.0.0
# commit b9ffdcdeee89de1fa349609a98c733573c98419e (HEAD -> master, tag: v1.0.0, origin/master, origin/HEAD)
# Merge: 18b7e15 a1da33b
# ...
```

> Git 命令也可设置别名 <code>git config --global alias.unstage 'reset HEAD'</code>，之后可直接使用命令 <code>git unstage</code>。

## 参考链接

1. [Git](https://git-scm.com/book/zh/v2)
1. [Git 教程](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000) By 廖雪峰