@echo off
echo ========================================
echo    iOS应用GitHub Actions自动构建设置
echo ========================================
echo.

REM 检查是否已经初始化Git
if not exist ".git" (
    echo [1/4] 初始化Git仓库...
    git init
    echo Git仓库初始化完成！
    echo.
) else (
    echo [1/4] Git仓库已存在，跳过初始化
    echo.
)

REM 添加所有文件
echo [2/4] 添加项目文件到Git...
git add .
echo 文件添加完成！
echo.

REM 提交代码
echo [3/4] 提交代码...
git commit -m "feat: 添加iOS自动构建支持 - 集成GitHub Actions工作流"
echo 代码提交完成！
echo.

REM 提示用户设置远程仓库
echo [4/4] 设置GitHub远程仓库
echo.
echo 请按照以下步骤完成设置：
echo.
echo 1. 在GitHub上创建新仓库（例如：translator-app）
echo 2. 复制仓库URL（例如：https://github.com/你的用户名/translator-app.git）
echo 3. 运行以下命令：
echo.
echo    git remote add origin https://github.com/你的用户名/translator-app.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo ========================================
echo 🎉 设置完成！推送后将自动开始构建iOS应用
echo ========================================
echo.
echo 📱 构建状态查看：
echo    访问你的GitHub仓库 → Actions页面
echo.
echo 📦 下载IPA文件：
echo    构建完成后在Actions页面的Artifacts中下载
echo.
echo 📖 详细说明请查看：README-iOS-Build.md
echo.
pause