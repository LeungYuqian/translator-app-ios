@echo off
chcp 65001 >nul
echo ========================================
echo    GitHub 远程仓库设置脚本
echo ========================================
echo.

if "%1"=="" (
    echo 使用方法: setup-remote.bat [GitHub仓库地址]
    echo 示例: setup-remote.bat https://github.com/username/translator-app-ios.git
    echo.
    echo 请先按照 CREATE-GITHUB-REPO.md 创建GitHub仓库
    echo 然后运行: npm run setup:remote [仓库地址]
    pause
    exit /b 1
)

set REPO_URL=%1

echo 正在配置远程仓库...
echo 仓库地址: %REPO_URL%
echo.

echo [1/4] 添加远程仓库...
git remote add origin %REPO_URL%
if errorlevel 1 (
    echo 远程仓库可能已存在，尝试更新...
    git remote set-url origin %REPO_URL%
)

echo [2/4] 设置主分支为 main...
git branch -M main

echo [3/4] 推送代码到GitHub...
git push -u origin main

if errorlevel 1 (
    echo.
    echo ❌ 推送失败！可能的原因：
    echo 1. 网络连接问题
    echo 2. 仓库地址错误
    echo 3. 没有推送权限
    echo 4. 需要GitHub身份验证
    echo.
    echo 请检查以上问题后重试
    pause
    exit /b 1
)

echo.
echo ✅ 成功！代码已推送到GitHub
echo.
echo [4/4] 检查GitHub Actions状态...
echo 请访问以下地址查看自动构建状态：
echo %REPO_URL:~0,-4%/actions
echo.
echo 🎉 iOS自动构建已启动！
echo 构建完成后，可在Actions页面下载IPA文件
echo.
pause