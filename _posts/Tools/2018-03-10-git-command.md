---
layout: blog
front: true
comments: True
flag: Git
background: green
category: 前端
title: Git 命令
date:   2018-03-11 12:03:00 GMT+0800 (CST)
update: 2020-06-16 11:01:00 GMT+0800 (CST)
background-image: /style/images/smms/github.png

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

![git-working-copy.jpg]( {{site.url}}/style/images/smms/git-working-copy.jpg )

## Git 命令

### 命令一览

| 常用命令 | 描述 | 栗子 |
|:--------------|:---------|:---------|
| remote | 查看远程库的信息 | `git remote -v` |
| clone | 从现有仓库克隆到指定文件目录 | `git clone 仓库地址 文件目录` |
| status | 查看文件状态 | `git status` |
| add | 跟踪文件，暂存 | `git add README.md` |
| diff | 比较工作区中当前文件和暂存区域快照之间的差异 | `git diff [filename]` |
| branch | 创建分支，-d 参数为删除分支，-D 强制删除 | `git branch -d branchname` |
| merge | 合并，--no-ff 禁用 Fast forward 合并模式 | `git merge branchname` |
| rebase | 衍合，改变 commit 序列的基础点，本质上是线性化的自动 cherry-pick | `git rebase branchname` |
| commit | 提交到本地仓库 | `git commit -m 'initial commit'` |
| reset | 文件从暂存区回退到工作区；版本回退 | `git reset HEAD filename` |
| revert | 回滚并创建一个新的提交 | `git revert HEAD^` |
| push | 推送到远端仓库，--force 参数为强制推送，缩写 -f | `git push --force` |
| pull | 从远端拉取新的代码并合并，相当于 fetch + merge | `git pull` |
| log | 查看提交历史，-p 展开显示每次提交的内容差异，-2 则仅显示最近的两次更新 | `git log -p -2` |
| reflog | 查看命令历史 | `git reflog` |
| tag | 标签，版本库的一个快照 | `git tag v1.0.0 commit_id` |
| cherry-pick | 选择某一个分支中的一个或几个 commit 来进行操作 | `git cherry-pick commit_id` |

### config

**config** 命令也可设置别名:

* `git config` - 仅针对当前仓库起作用，配置文件位于 `.git/config` 文件中
* `git config --global` - 针对当前用户起作用，配置文件位于 `~/.gitconfig` 文件中

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
# 1 - 通过 set-url 修改
git remote set-url origin [url] # 修改已存在的
git remote set-url --add origin [url] # or --delete
# With --push, push URLs are manipulated instead of fetch URLs.
git remote set-url --add --push origin [url] # --add --push 操作后，代码可以推送到不同的两个远端
git remote -v # 查看远程库的信息
# origin xxx.git (fetch)
# origin xxx.git (push)
# origin xxx (push)
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

# 查看分支最新一次提交
git branch -v
#  iss53   93b412c fix javascript issue
#* master  7a98805 Merge branch 'iss53'
#  testing 782fd34 add scott to the author list in the readmes

# 查看哪些分支已被并入当前分支，反之为 --no-merged
git branch --merged
```

```SHELL
# 强制删除本地分支
git branch -D branchname

# 删除远端不存在的分支
git branch -r -d origin/branchname
# 或者
git push origin :branchname
```

> Use -r together with -d to delete remote-tracking branches. Note, that it only makes sense to delete remote-tracking branches if they no longer exist in the remote repository or if git fetch was configured not to fetch them again.

如果想要批量删除分支，可以根据查询结果进行过滤，最常用的写法如下，即删掉除 master 的所有本地分支:

```SHELL
# xargs 命令是给其他命令传递参数的一个过滤器
git branch | grep -v 'master' | xargs git branch -D
# zsh alias 只会删除合并到当前分支的其他分支
gbda='git branch --no-color --merged | command grep -vE "^(\*|\s*(master|develop|dev)\s*$)" | command xargs -n 1 git branch -d'

# 批量删除远端分支
# cut -b 10- 是为了去除 origin/ 的前缀
gbr --merged origin/master | command grep -vE "(\*|\s*(master|develop|dev)\s*$)"  | cut -b 10- | xargs git push --delete origin
```

有时候缓存的原因，当你删掉远端一些分支时，别人还能查得到，这时候需要用以下命令来去除缓存:

```SHELL
git remote prune origin
# or git fetch --prune
git fetch -p
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

> `gc --amend --no-edit` 可以直接采用上个提交的描述，跳过编辑步骤，更方便 nice

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

> `git pull --rebase` 可以使用 rebase 代替 merge

有时候拉取代码都要输入账号密码进行验证，比较麻烦，因此有几种方法可以设置缓存:

```SHELL
# 默认，15 分钟
git config --global credential.helper cache
# 自定义，1 小时
git config credential.helper 'cache --timeout=3600'
# 永久
git config --global credential.helper store
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

* `git reset HEAD` - 文件从暂存区回退到工作区(*unstage*)，后接 filename 可指定文件
* `git reset HEAD^` - 版本回退，会重写当前分支的历史，^^ 表示回退 2 个版本，也可写作 ~2，以此类推
  * **soft** 参数 - 保留所有本地修改，仅移动 HEAD 头指针
  * **mixed** 默认参数 - 保留工作区修改并重置缓存区，移动 HEAD 头指针和保留 Working Copy，但重置 Index
  * **hard** 参数 - 丢弃所有本地修改(不包括未跟踪的文件)，移动 HEAD 头指针和重置 Working Copy

版本也可按照 commit id 进行回退，若不记得，可根据不同情况通过以下两种途径获取 commit id:

* 版本回退 - `git log` 查看提交历史
* 版本恢复 - `git reflog` 查看命令历史

![git reset --soft](https://res.cloudinary.com/practicaldev/image/fetch/s---GveiZe---/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/je5240aqa5uw9d8j3ibb.gif)

![git reset --hard](https://res.cloudinary.com/practicaldev/image/fetch/s--GqjwnYkF--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/hlh0kowt3hov1xhcku38.gif)

### reflog

![reflog](https://res.cloudinary.com/practicaldev/image/fetch/s--A1UMM2AH--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/9z9rhtbw7mrigp0miijz.gif)

### revert

**revert** 一般用于公共分支，回滚时不会像 reset 那样重写提交历史，且 revert 只有在提交层面才有回滚操作，在回滚一个提交的同时会创建一个新的提交。请注意 HEAD 后参数的用法:

```SHELL
# 回滚到最近 一 个提交
git revert HEAD

# 撤销最近 一 个提交，回滚到倒数第 二 个提交
git revert HEAD^
git revert HEAD~1

# 还是推荐使用 commit id
git revert bb0aa8b

# 回滚时不自动创建新的提交
git revert xxx --no-commit
# 回滚时采用默认提交描述
git revert xxx --no-edit
```

![git revert](https://res.cloudinary.com/practicaldev/image/fetch/s--eckmvr2M--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/3kkd2ahn41zixs12xgpf.gif)

revert 撤销一个合并提交时，如果除了 commit id 而不加任何其他参数，git 将会提示错误:

```TEXT
error: Commit xx is a merge but no -m option was given.
```

原因是在你合并两个分支并试图撤销时，Git 并不知道你到底需要保留哪一个分支上所做的修改。从 Git 的角度来看，master 分支和 dev 在地位上是完全平等的。因此需要通过 **m** 或 **mainline** 参数来指定「主线」，m 参数的值可以是 1 或者 2，对应着 parent 在 merge commit 信息中的顺序:

```SHELL
# 从特性分支合并到 master(主线为 1)
# bb0aa8b 为合并提交的 commit id
git revert -m 1 bb0aa8b
```

### checkout

**checkout** 命令主要有四个用途:

* 可以丢弃工作区中已跟踪文件的修改(*discard*):
  * `git checkout -- filename` - 放弃指定文件
  * `git checkout .` - 放弃所有工作区文件

* 切换分支:
  * `git checkout branchname` - 切换至指定分支
  * `git checkout -b branchname` - 创建并切换至该分支
  * `git checkout -b branchname origin/branchname` - 从远端拉取到本地并切换至该分支
  * `git checkout origin/branchname -b branchname` - 同上，推荐上面写法

* 把 HEAD 移动到特定的提交:
  * `git checkout HEAD~2` - 移动至指定分支，对于快速查看项目旧版本来说非常有用。也可以跟 commit id
  * **detached HEAD**: 当前的 HEAD 没有任何分支引用会造成 HEAD 分离。若此时添加新的提交，然后切换到别的分支之后就没办法回到之前添加的这些提交。因此，在为 detached HEAD 添加新的提交时应该创建一个新的分支。

* 快捷解决冲突
  * `git checkout --ours filename` - 使用本地代码
  * `git checkout --theirs filename` - 使用他人代码

<video controls="">
  <source src="http://liaoxuefeng.gitee.io/git-resources/master-and-dev-ff.mp4" type="video/mp4"></source>
</video>

如上，checkout 来放弃工作区文件时，并不会对为忽略的未追踪文件生效，因此可以用 `clean` 命令来清除，具体可[查看这里](https://git-scm.com/book/zh/v2/Git-工具-储藏与清理#r_git_stashing):

```SHELL
git clean
```

> 当使用 `git checkout branchname` 切换分支时，本地无此分支且远端存在同名分支的话，等价于"从远端拉取到本地并切换至该分支"，[详情戳这里](https://git-scm.com/docs/git-checkout) 👈

### merge

上述视频例子的**合并(merge)**属于**快速合并(Fast forward)**，如果 master 和 feature 都有提文件，此时通过合并 feature 分支则不会产生快速合并。若有同样的文件被提交，则可能会出现**冲突(conflict)**，Git用 `<<<<<<<，=======，>>>>>>>` 标记出不同分支的内容，解决完冲突并提交后分支如下:

```SHELL
# 也可使用 log 命令查看，--graph 参数可以查看分支合并图
git log --graph --pretty=oneline --abbrev-commit
```

![git-merge.png](https://res.cloudinary.com/practicaldev/image/fetch/s--cT4TSe48--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/894znjv4oo9agqiz4dql.gif)

通常合并分支时，Git 会尽可能用 Fast forward 模式，但这种模式下，删除分支后会丢掉分支信息。如果要强制禁用该模式，Git 就会在 merge 时生成一个新的 commit，这样从分支历史上就可以看出分支信息。

```SHELL
# 使用参数 --no-ff 可禁用 Fast forward 模式
git merge --no-ff -m "merge with no-ff" feature
```

> Fast forward 仅仅只用做指针的移动

![git-merge-no-ff.png](https://res.cloudinary.com/practicaldev/image/fetch/s--zRZ0x2Vc--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/rf1o2b6eduboqwkigg3w.gif)

### rebase

[**rebase(变基)**](https://git-scm.com/book/zh/v2/Git-分支-变基) 一般来说有两种操作:

1. 分支合并，类似 merge
2. 合并多次提交

一、分支合并

rebase 和 merge 都可以进行合并，rebase 会对 commit 序列重新设置基础点，不会产生和 merge 一样的分叉，保持整个项目的清洁。想必我们不想看到这样的提交历史:

![merge](https://image-static.segmentfault.com/219/761/2197618497-58e86f5cda2dd_articlex)

假设现处于 branch1 分支，需将 branch1 分支合并到 master:

* **merge 的实现流程**

```SHELL
# merge 将两个分支合并进行一次提交，提交历史不是线性的
git checkout master
git merge branch1
```

![git-merge.gif]( {{site.url}}/style/images/smms/git-merge.gif )

* **rebase 的实现流程**

```SHELL
# 在需要合并的分支上进行 rebase
# rebase 在当前分支上重演另一个分支的历史，提交历史是线性的
git rebase master
# 当然也可以不用切分支直接执行，basebranch 在这里即 master 分支
git rebase [basebranch] [topicbranch]

# rebase 后需要到主分支上进行 Fast forward 模式的 merge
git checkout master
git merge branch1
```

![git-rebase.gif]( {{site.url}}/style/images/smms/git-rebase.gif )

我们再进行图解下:

```TEXT
          A---B---C topic
         /
    D---E---F---G master

        ⬇️
                  A'--B'--C' topic
                 /
    D---E---F---G master
```

当上游分支(upstream branch)包含了节点的修改时，会直接跳过这个节点，比如:

```TEXT
          A---B---C topic
         /
    D---E---A'---F master

        ⬇️
                       B'---C' topic
                  /
    D---E---A'---F master
```

> 使用 rebase 的黄金法则，只对尚未推送或分享给别人的本地修改执行变基操作清理历史，从不对已推送至别处的提交执行变基操作，这样，你才能享受到两种方式带来的便利。很好的栗子可以[参考这篇文章](https://segmentfault.com/a/1190000005937408)

另外，在 rebase 的过程中，也许会出现冲突 conflict。在这种情况，git 会停止 rebase 并会让你去解决冲突。在解决完冲突后，用 git add 命令去更新这些内容:

```SHELL
git add .
# 无需 git commit, git 会继续应用余下的 patch 补丁文件
git rebase --continue
```

在任何时候，我们都可以用 `--abort` 参数来终止 rebase 的行动，并且分支会回到 rebase 开始前的状态:

```SHELL
git rebase --abort
```

另外这里在介绍一下 `--onto` 参数的用法，比如我们有如下的分支结构:

```TEXT
    o---o---o---o---o  master
         \
          o---o---o---o---o  next
                           \
                            o---o---o  topic
```

我们要想只把 topic 分支做出的修改变基到 master，这时候就可以用以下命令:

```SHELL
git rebase --onto master next topic
```

```TEXT
<!-- 经过 onto 转变之后 -->
    o---o---o---o---o  master
        |            \
        |             o'--o'--o'  topic
         \
          o---o---o---o---o  next
```

二、合并多次提交

合并多次提交的命令有以下两种:

```SHELL
# -i 表示交互式， endpoint 省略即为最新提交
# 注意不包含 startpoint，左开右闭
git rebase -i  [startpoint]  [endpoint]

git rebase -i HEAD~n # n 次提交
```

举个栗子，比如之前提交历史如下:

```TEXT
* 2e18a4f - (HEAD -> master) feat: third commit (3 seconds ago) <Tate>
* b2f89a4 - feat: second commit (29 seconds ago) <Tate>
* 3672ae7 - test: first commit (52 seconds ago) <Tate>
```

执行命令 `git rebase -i HEAD~3` 之后我们会看到以下界面:

```TEXT
pick 3672ae7 test: first commit
pick b2f89a4 feat: second commit
pick 2e18a4f feat: third commit

# Rebase 80d0581..2e18a4f onto 80d0581 (3 commands)
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup <commit> = like "squash", but discard this commit's log message
# x, exec <command> = run command (the rest of the line) using shell
# d, drop <commit> = remove commit
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
# m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
# .       create a merge commit using the original merge commit's
# .       message (or the oneline, if no original merge commit was
# .       specified). Use -c <commit> to reword the commit message.
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
#       However, if you remove everything, the rebase will be aborted.
#
#
# Note that empty commits are commented out
```

我们可以看到 git 提供了以下这些命令去编辑:

* pick - 保留该 commit（p）
* reword - 保留该 commit ，但我需要修改该 commit 的注释（r）
* edit - 保留该 commit, 但我要停下来修改该提交(不仅仅修改注释)（e）
* squash - 将该 commit 和前一个 commit 合并（s）
* fixup - 将该 commit 和前一个 commit 合并，但我不要保留该提交的注释信息（f）
* exec - 执行 shell 命令（x）
* drop - 我要丢弃该 commit（d）

根据我们的需求，我们将 commit 内容编辑如下:

```TEXT
pick 3672ae7 test: first commit
s b2f89a4 feat: second commit
s 2e18a4f feat: third commit
```

保存后会继续弹出默认的注释修改页面:

```TEXT
# This is a combination of 3 commits.
# This is the 1st commit message:

test: first commit

# This is the commit message #2:

feat: second commit

# This is the commit message #3:

feat: third commit

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# Date:      Tue Aug 6 21:01:09 2019 +0800
#
# interactive rebase in progress; onto 80d0581
# Last commands done (3 commands done):
#    squash b2f89a4 feat: second commit
#    squash 2e18a4f feat: third commit
# No commands remaining.
# You are currently rebasing branch 'master' on '80d0581'.
#
# Changes to be committed:
#       modified:   src/common/HOC.js
```

我们可以自己改下提交注释为 `test: combine 3 commits`，然后再次保存即可:

```TEXT
* 9b30b34 - (HEAD -> master) test: combine 3 commits (84 seconds ago) <Tate>
# 可以看到以下三条原记录被干掉啦
# * 2e18a4f - (HEAD -> master) feat: third commit (3 seconds ago) <Tate>
# * b2f89a4 - feat: second commit (29 seconds ago) <Tate>
# * 3672ae7 - test: first commit (52 seconds ago) <Tate>
```

![git rebase -i](https://res.cloudinary.com/practicaldev/image/fetch/s--VSQt4g1V--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/bc1r460xx1i0blu0lnnm.gif)

### cherry-pick

**cherry-pick** 可以选择某一个分支中的一个或几个 commit 来进行操作，rebase 实质上就是线性的自动的 cherry-pick 操作:

```SHELL
git checkout master
# 多个提交用空格隔开
git cherry-pick 2c33a a1953
# 指定范围内的多个提交用 .. 隔开，注意是左开右闭，可理解为 (start_commit, end_commit]
git cherry-pick 2c33a..a1953
# 同上，通过符号 ^ 可实现左右闭合，可理解为 [start_commit, end_commit]
git cherry-pick 2c33a^..a1953
# 只挑选该分支最顶端的一次提交
git cherry-pick branchname
```

另外对于 cherry-pick 处理多个提交时，遇到冲突的操作控制命令有以下三个:

```SHELL
git cherry-pick --continue  // 继续下个操作
git cherry-pick --quit // 退出，不会影响冲突之前所处理的提交
git cherry-pick --abort // 停止本次操作，回到解放前
```

![cherry-pick](https://res.cloudinary.com/practicaldev/image/fetch/s--9vWP_K4S--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/2dkjx4yeaal10xyvj29v.gif)

> 注意，当处理多个提交时，期间有一个若有冲突，解决完后必须执行 `--continue` 才能自动处理下一个提交。

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

* **git stash apply** - 恢复后，stash 内容并不删除，要用 `git stash drop` 来删除
* **git stash pop** - 恢复并删除 stash 内容

```SHELL
# 也可按照指定的 stash 内容进行恢复，默认是恢复最新，即 stash@{0}
git stash apply stash@{1}
```

### tag

**tag** 一般用于发布某个版本时，在版本库中打上标签便于后续查看，类似分支，都是指向某次 commit 的指针，但分支可移动，而标签不可动，可以[参考语义化规范](https://semver.org/lang/zh-CN/)。

```SHELL
# 创建一个标签
git tag v1.0.0
git tag -a v1.0.0 -m "附注信息"

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

推送 tag 到远端的方法:

```SHELL
# 单个标签
git push origin <tagname>
# 多个标签
git push (origin) --tags
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

查看某个文件的提交历史:

```SHELL
git log filename

# 查看具体修改
git show commit_id
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

> 在线学习 git 操作，[直接点击这里](https://learngitbranching.js.org) 👈

## 参考链接

1. [CS Visualized: Useful Git Commands](https://dev.to/lydiahallie/cs-visualized-useful-git-commands-37p1) By Lydia Hallie
