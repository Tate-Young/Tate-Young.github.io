---
layout: blog
tool: true
comments: True
flag: Git
background: green
category: 前端
title: Git 命令
date:   2018-03-11 12:03:00 GMT+0800 (CST)
background-image: https://i.loli.net/2018/03/11/5aa49b6c003a8.gif

tags:
- git
---
# {{ page.title }}

## Git 术语

| 术语 | 描述 |
|:--------------|:---------|
| **HEAD** | 指向当前分支，分支指向当前提交 |
| **Index** | 暂存区，即 Stage，是指即将被下一个提交的文件集合 |
| **Working Copy** | 工作区 |

![git-working-copy.jpg]( {{page.background-image}} )

## Git 命令

### 命令一览

| 常用命令 | 描述 | 栗子 |
|:--------------|:---------|:---------|
| remote | 查看远程库的信息 | <code>git remote -v</code> |
| clone | 从现有仓库克隆到指定文件目录 | <code>git clone 仓库地址 文件目录</code> |
| status | 查看文件状态 | <code>git status</code> |
| add | 跟踪文件，暂存 | <code>git add README.md</code> |
| diff | 比较工作区中当前文件和暂存区域快照之间的差异 | <code>git diff</code> |
| branch | 创建分支，-d 参数为删除分支，-D 强制删除 | <code>git branch -d branchname</code> |
| merge | 合并，--no-ff 禁用 Fast forward 合并模式 | <code>git merge branchname</code> |
| rebase | 衍合，改变 commit 序列的基础点，本质上是线性化的自动 cherry-pick | <code>git rebase branchname</code> |
| commit | 提交到本地仓库 | <code>git commit -m 'initial commit'</code> |
| reset | 文件从暂存区回退到工作区；版本回退 | <code>git reset HEAD filename</code> |
| revert | 回滚并创建一个新的提交 | <code>git revert HEAD^</code> |
| push | 推送到远端仓库，--force 参数为强制推送，缩写 -f | <code>git push --force</code> |
| pull | 拉取自远端仓库 | <code>git pull</code> |
| log | 查看提交历史，-p 展开显示每次提交的内容差异，-2 则仅显示最近的两次更新 | <code>git log -p -2</code> |
| reflog | 查看命令历史 | <code>git reflog</code> |
| tag | 标签，版本库的一个快照 | <code>git tag v1.0.0 commitId</code> |
| cherry-pick | 选择某一个分支中的一个或几个 commit 来进行操作 | <code>git cherry-pick commitId</code> |

> Git 命令也可设置别名 <code>git config --global alias.unstage 'reset HEAD'</code>，之后可直接使用命令 <code>git unstage</code>。

### commit

**commit** 命令用于提交代码到本地仓库，常用到的参数:

* **m** 参数 - 添加描述
* **a** 参数 - 跳过暂存(除开未跟踪文件)直接提交
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
* git reset HEAD^ - 版本回退，会重写当前分支的历史，^^ 表示回退 2 个版本，也可写作 ~2，以此类推
  * **soft** 参数 - 保留所有本地修改，仅移动 HEAD 头指针
  * **mixed** 默认参数 - 保留工作区修改并重置缓存区，移动 HEAD 头指针和保留 Working Copy，但重置 Index
  * **hard** 参数 - 丢弃所有本地修改(不包括未跟踪的文件)，移动 HEAD 头指针和重置 Working Copy

版本也可按照 commit id 进行回退，若不记得，可根据不同情况通过以下两种途径获取 commit id:
* 版本回退 - <code>git log</code> 查看提交历史
* 版本恢复 - <code>git reflog</code> 查看命令历史

<video controls="">
    <source src="http://github.liaoxuefeng.com/sinaweibopy/video/git-reset.mp4" type="video/mp4"></source>
</video>

### revert

**revert** 一般用于公共分支，回滚时不会像 reset 那样重写提交历史，且 revert 只有在提交层面才有回滚操作，在回滚一个提交的同时会创建一个新的提交。请注意 HEAD 后参数的用法:

```SHELL
# 回滚到最近 一 个提交
git revert HEAD

# 撤销最近 一 个提交，回滚到倒数第 二 个提交
git revert HEAD^
gut revert HEAD~1
```

### checkout

**checkout** 命令主要有三个用途:

* 可以丢弃工作区中已跟踪文件的修改(*discard*):
  * <code>git checkout -- filename</code> - 放弃指定文件
  * <code>git checkout .</code> - 放弃所有工作区文件

* 切换分支:
  * <code>git checkout branchname</code> - 切换至指定分支
  * <code>git checkout -b branchname</code> - 创建并切换至该分支

* 把 HEAD 移动到特定的提交:
  * <code>git checkout HEAD~2</code> - 移动至指定分支，对于快速查看项目旧版本来说非常有用
  * **detached HEAD**: 当前的 HEAD 没有任何分支引用会造成 HEAD 分离。若此时添加新的提交，然后切换到别的分支之后就没办法回到之前添加的这些提交。因此，在为 detached HEAD 添加新的提交时应该创建一个新的分支。

<video controls="">
    <source src="http://github.liaoxuefeng.com/sinaweibopy/video/master-and-dev-ff.mp4" type="video/mp4"></source>
</video>

### merge

上述视频例子的**合并(merge)**属于**快速合并(Fast forward)**，如果 master 和 feature 都有提文件，此时通过合并 feature 分支则不会产生快速合并。若有同样的文件被提交，则可能会出现**冲突(conflict)**，Git用 <code><<<<<<<，=======，>>>>>>></code> 标记出不同分支的内容，解决完冲突并提交后分支如下:

```SHELL
# 也可使用 log 命令查看，--graph 参数可以查看分支合并图
git log --graph --pretty=oneline --abbrev-commit
```

![git-merge.png](https://i.loli.net/2018/03/11/5aa481bc48cdd.png)

通常合并分支时，Git 会尽可能用 Fast forward 模式，但这种模式下，删除分支后会丢掉分支信息。如果要强制禁用该模式，Git 就会在 merge 时生成一个新的 commit，这样从分支历史上就可以看出分支信息。

```SHELL
# 使用参数 --no-ff 可禁用 Fast forward 模式
git merge --no-ff -m "merge with no-ff" feature
```

![git-merge-no-ff.png](https://i.loli.net/2018/03/11/5aa481bc41c5a.png)

### rebase

**rebase** 和 merge 都可以进行合并，rebase 会对 commit 序列重新设置基础点，不会产生和 merge 一样的分叉，保持整个项目的清洁。

假设现处于 branch1 分支，需将 branch1 分支合并到 master

* **merge 的实现流程**

```SHELL
# merge 将两个分支合并进行一次提交，提交历史不是线性的
git checkout master
git merge branch1
```

![git-merge.gif](https://i.loli.net/2018/03/11/5aa49b65a03e2.gif)

* **rebase 的实现流程**

```SHELL
# 在需要合并的分支上进行 rebase
# rebase 在当前分支上重演另一个分支的历史，提交历史是线性的
git rebase master

# rebase 后需要到主分支上进行 Fast forward 模式的 merge
git checkout master
git merge branch1
```

![git-rebase.gif](https://i.loli.net/2018/03/11/5aa49b6c003a8.gif)

rebase 的黄金法则是绝不要在公共的分支上使用。倘若在 master 分支使用了 rebase，会出现以下情况，如果这两个 commit 之前已经在中央仓库存在，这就会导致没法 push 了:

![git-rebase-error.gif](https://i.loli.net/2018/03/11/5aa49b6796eb8.gif)

### cherry-pick

**cherry-pick** 可以选择某一个分支中的一个或几个 commit 来进行操作，rebase 实质上就是线性的自动的 cherry-pick 操作:

```SHELL
git checkout master
git cherry-pick 2c33a
```

![cherry-pick](https://marklodato.github.io/visual-git-guide/cherry-pick.svg)

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

## 参考链接

1. [Git](https://git-scm.com/book/zh/v2)
1. [Git 教程](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000) By 廖雪峰
1. [掘金 - Git 原理详解及实用指南](https://juejin.im/book/5a124b29f265da431d3c472e) By 抛物线
1. [图解 Git](https://marklodato.github.io/visual-git-guide/index-zh-cn.html) By marklodato
1. [atlassian - Resetting, Checking Out & Reverting](https://www.atlassian.com/git/tutorials/resetting-checking-out-and-reverting)