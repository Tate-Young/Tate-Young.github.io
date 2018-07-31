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

![git-working-copy.jpg](https://i.loli.net/2018/03/11/5aa481bc4da98.jpg)

## Git 命令

### 命令一览

| 常用命令 | 描述 | 栗子 |
|:--------------|:---------|:---------|
| remote | 查看远程库的信息 | <code>git remote -v</code> |
| clone | 从现有仓库克隆到指定文件目录 | <code>git clone 仓库地址 文件目录</code> |
| status | 查看文件状态 | <code>git status</code> |
| add | 跟踪文件，暂存 | <code>git add README.md</code> |
| diff | 比较工作区中当前文件和暂存区域快照之间的差异 | <code>git diff [filename]</code> |
| branch | 创建分支，-d 参数为删除分支，-D 强制删除 | <code>git branch -d branchname</code> |
| merge | 合并，--no-ff 禁用 Fast forward 合并模式 | <code>git merge branchname</code> |
| rebase | 衍合，改变 commit 序列的基础点，本质上是线性化的自动 cherry-pick | <code>git rebase branchname</code> |
| commit | 提交到本地仓库 | <code>git commit -m 'initial commit'</code> |
| reset | 文件从暂存区回退到工作区；版本回退 | <code>git reset HEAD filename</code> |
| revert | 回滚并创建一个新的提交 | <code>git revert HEAD^</code> |
| push | 推送到远端仓库，--force 参数为强制推送，缩写 -f | <code>git push --force</code> |
| pull | 从远端拉取新的代码并合并，相当于 fetch + merge | <code>git pull</code> |
| log | 查看提交历史，-p 展开显示每次提交的内容差异，-2 则仅显示最近的两次更新 | <code>git log -p -2</code> |
| reflog | 查看命令历史 | <code>git reflog</code> |
| tag | 标签，版本库的一个快照 | <code>git tag v1.0.0 commit_id</code> |
| cherry-pick | 选择某一个分支中的一个或几个 commit 来进行操作 | <code>git cherry-pick commit_id</code> |

### config

**config** 命令也可设置别名:

* git config - 仅针对当前仓库起作用，配置文件位于 <code>.git/config</code> 文件中
* git config --global - 针对当前用户起作用，配置文件位于 <code>.gitconfig</code> 文件中

```SHELL
# git unstage
git config --global alias.unstage 'reset HEAD'

# git graph
git config --global alias.graph "log --color --graph --pretty=format:'%Cgreen%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```

若要删除别名，则找到对应配置文件，删除 [alias] 下的命令即可:

```TEXT
[alias]
  unstage = reset HEAD
  discard = checkout --
  graph = log --color --graph --pretty=format:'%Cgreen%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
```

### remote

使用 remote 修改远端仓库地址的三种方法:

```SHELL
# 1 - 修改
git remote set-url origin [url]
# 2 - 删除和添加
git remote rm origin
git remote add origin [url]

# 3 - 修改本地配置
[remote "origin"]
  url = https://github.com/Tate-Young/gitignore-test.git
```

### branch

**branch** 用来查看和创建分支，-d 参数为删除分支，-D 强制删除:

```SHELL
# 查看本地分支
git branch

# 查看远端分支
git branch -r
```

```SHELL
# 强制删除本地分支
git branch -D branchname

# 删除远端分支
git branch -r -d origin/branchname
# 或者
git push origin :branchname
```

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

### pull

**pull** 命令从远端拉取新的代码并合并，相当于 "fetch + merge"，如果当前分支与远程分支存在追踪关系，git pull 就可以省略远程分支名。

```SHELL
# 完整写法
git pull <远程主机名> <远程分支名>:<本地分支名>
```

```SHELL
# 手动建立追踪关系，指定 master 分支追踪 origin/branchname 分支
git branch --set-upstream master origin/branchname

# 当前分支自动与唯一一个追踪分支进行合并
git pull
```

### push

**push** 命令用于将本地分支的更新，推送到远程主机，格式类似于 pull:

```SHELL
# 完整写法
git push <远程主机名> <本地分支名>:<远程分支名>

# 将本地的 master 分支推送到 origin 主机的 master 分支。若不存在则会被新建
git push origin master

# Push the new branch, set local branch to track the new remote
git push --set-upstream origin new_branch
```

如果省略本地分支名，则表示删除指定的远程分支，因为这等同于推送一个空的本地分支到远程分支:

```SHELL
# 删除远程分支
git push origin :master
# 等同于
git push origin --delete master
```

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

**checkout** 命令主要有四个用途:

* 可以丢弃工作区中已跟踪文件的修改(*discard*):
  * <code>git checkout -- filename</code> - 放弃指定文件
  * <code>git checkout .</code> - 放弃所有工作区文件

* 切换分支:
  * <code>git checkout branchname</code> - 切换至指定分支
  * <code>git checkout -b branchname</code> - 创建并切换至该分支
  * <code>git checkout -b branchname orgin/branchname</code> - 从远端拉取到本地并切换至该分支
  * <code>git checkout orgin/branchname -b branchname</code> - 同上，推荐上面写法

* 把 HEAD 移动到特定的提交:
  * <code>git checkout HEAD~2</code> - 移动至指定分支，对于快速查看项目旧版本来说非常有用。也可以跟 commit id
  * **detached HEAD**: 当前的 HEAD 没有任何分支引用会造成 HEAD 分离。若此时添加新的提交，然后切换到别的分支之后就没办法回到之前添加的这些提交。因此，在为 detached HEAD 添加新的提交时应该创建一个新的分支。

* 快捷解决冲突
  * <code>git checkout --ours filename</code> - 使用本地代码
  * <code>git checkout --theirs filename</code> - 使用他人代码

<video controls="">
  <source src="http://liaoxuefeng.gitee.io/git-resources/master-and-dev-ff.mp4" type="video/mp4"></source>
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

### log

**log** 一般用于查看提交历史，具体可以[参考官方文档](https://git-scm.com/book/zh/v1/Git-%E5%9F%BA%E7%A1%80-%E6%9F%A5%E7%9C%8B%E6%8F%90%E4%BA%A4%E5%8E%86%E5%8F%B2)，更多详细用法可[参考这里](https://github.com/geeeeeeeeek/git-recipes/wiki/5.3-Git-log-%E9%AB%98%E7%BA%A7%E7%94%A8%E6%B3%95)。常用的几个参数如下:

|选项 | 说明 |
|:-------|:-------|
| -p | 按补丁格式显示每个更新之间的差异 |
| --word-diff | 按 word diff 格式显示差异 |
| --stat | 显示每次更新的文件修改统计信息 |
| --shortstat | 只显示 --stat 中最后的行数修改添加移除统计 |
| --name-only | 仅在提交信息后显示已修改的文件清单 |
| --name-status | 显示新增、修改、删除的文件清单 |
| --abbrev-commit | 仅显示 SHA-1 的前几个字符，而非所有的 40 个字符 |
| --graph | 显示 ASCII 图形表示的分支合并历史 |
| --pretty | 使用其他格式显示历史提交信息。可用的选项包括 oneline，short，full，fuller 和 format（后跟指定格式） |
| --oneline | --pretty=oneline --abbrev-commit 的简化用法 |

```SHELL
git log --pretty=format:"%h %s" --graph
* 2d3acf9 ignore errors from SIGCHLD on trap
*  5e3ee11 Merge branch 'master' of git://github.com/dustin/grit
|\
| * 420eac9 Added a method for getting the current branch.
* | 30e367c timeout code and tests
* | 5a09431 add timeout protection to grit
* | e1193f8 support for heads with slashes in them
|/
* d6016bc require time for xmlschema
*  11d191e Merge branch 'defunkt' into local
```

```SHELL
git log --graph --pretty=oneline --abbrev-commit
# 简写 git log --oneline
* 4b2a457c (HEAD -> master, origin/master, origin/HEAD) gitignore
* 3966c325 delete node_modules
* 1bac16f5 delete
* dd0d3981 404
* e3a6c29d delete
* 8b0287d5 update
```

```SHELL
# 查看本地分支的提交历史
git log (branchname)

# 查看指定远程分支的提交历史
git log origin/branchname
```

### diff

**diff** 一般用来比较文件差异，下面是常见的一些用法:

```SHELL
git diff # 工作区和暂存区域快照(index)之间的差异
git diff <filename> # 当前文件工作区和暂存区差异

git diff <commit> <commit> # 比较两次提交之间的差异
git diff <commit> <filename> # 比较当前文件工作区与另一次提交之间的差异

git diff <branch> <branch> # 在两个分支之间比较
git diff <branch> <filename> # 比较当前文件工作区与指定分支之间的差异

git diff HEAD # 比较工作区和上次提交时的快照之间(HEAD)差异
git diff HEAD HEAD^ # 比较上次和上上次提交时的快照之间差异
git diff --staged # 比较暂存区和上次提交时的快照之间(HEAD)差异
git diff --cached

git diff --stat # 仅仅比较统计信息
```

## 参考链接

1. [Git - book](https://git-scm.com/book/zh/v2)
2. [Git 教程](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000) By 廖雪峰
3. [掘金 - Git 原理详解及实用指南](https://juejin.im/book/5a124b29f265da431d3c472e) By 抛物线
4. [图解 Git](https://marklodato.github.io/visual-git-guide/index-zh-cn.html) By marklodato
5. [atlassian - Resetting, Checking Out & Reverting](https://www.atlassian.com/git/tutorials/resetting-checking-out-and-reverting)
6. [易百教程 - Git](https://www.yiibai.com/git/git_pull.html) By 初生不惑
7. [Github - git-recipes](https://github.com/geeeeeeeeek/git-recipes/wiki) By geeeeeeeeek
