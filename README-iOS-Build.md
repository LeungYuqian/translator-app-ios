# iOS应用自动化构建指南

本项目已配置GitHub Actions来自动化构建iOS应用，无需本地Xcode环境。

## 🚀 快速开始

### 1. 推送代码到GitHub

首先将项目推送到GitHub仓库：

```bash
# 初始化Git仓库（如果还没有）
git init
git add .
git commit -m "Initial commit: Ionic translator app"

# 添加远程仓库并推送
git remote add origin https://github.com/你的用户名/translator-app.git
git branch -M main
git push -u origin main
```

### 2. 自动构建触发

构建会在以下情况自动触发：
- 推送代码到 `main` 分支
- 创建Pull Request到 `main` 分支
- 手动触发（在GitHub Actions页面）

## 📱 构建类型

### Debug构建（无需证书）
- **用途**：开发测试
- **触发**：任何推送或PR
- **输出**：调试版本的构建文件
- **无需配置**：开箱即用

### Release构建（需要证书）
- **用途**：App Store发布
- **触发**：推送到main分支
- **输出**：签名的IPA文件
- **需要配置**：Apple开发者证书和配置文件

## 🔐 配置发布构建（可选）

如果需要生成可发布的IPA文件，需要在GitHub仓库中配置以下Secrets：

### 必需的Secrets

在GitHub仓库的 `Settings > Secrets and variables > Actions` 中添加：

| Secret名称 | 描述 | 获取方式 |
|-----------|------|----------|
| `CERTIFICATE_P12` | 开发者证书（Base64编码） | 从Keychain导出.p12文件并转换为Base64 |
| `P12_PASSWORD` | 证书密码 | 导出证书时设置的密码 |
| `PROVISIONING_PROFILE` | 配置文件（Base64编码） | 从Apple Developer下载.mobileprovision文件并转换为Base64 |
| `PROVISIONING_PROFILE_UUID` | 配置文件UUID | 在配置文件中查找UUID |
| `CODE_SIGN_IDENTITY` | 代码签名身份 | 通常是"iPhone Distribution: 你的团队名称" |
| `TEAM_ID` | Apple开发者团队ID | 在Apple Developer账户中查找 |

### 获取证书和配置文件的步骤

#### 1. 创建App ID
- 登录 [Apple Developer](https://developer.apple.com)
- 进入 `Certificates, Identifiers & Profiles`
- 创建新的App ID，Bundle ID设置为：`com.translator.app`

#### 2. 创建证书
- 在`Certificates`部分创建`iOS Distribution`证书
- 下载证书并安装到Keychain
- 从Keychain导出为.p12文件

#### 3. 创建配置文件
- 在`Profiles`部分创建`App Store`配置文件
- 选择刚创建的App ID和证书
- 下载.mobileprovision文件

#### 4. 转换为Base64
```bash
# 转换证书
base64 -i certificate.p12 -o certificate_base64.txt

# 转换配置文件
base64 -i profile.mobileprovision -o profile_base64.txt
```

## 📦 构建产物

### Debug构建
- **位置**：Actions页面的Artifacts
- **文件名**：`ios-build-debug`
- **内容**：Xcode构建文件

### Release构建
- **位置**：Actions页面的Artifacts
- **文件名**：`ios-app-release`
- **内容**：签名的IPA文件
- **保留时间**：90天

## 🔧 自定义配置

### 修改应用信息

编辑 `capacitor.config.ts`：
```typescript
const config: CapacitorConfig = {
  appId: 'com.yourcompany.translator',  // 修改为你的Bundle ID
  appName: 'Your Translator App',       // 修改应用名称
  // ...
};
```

### 修改构建配置

编辑 `.github/workflows/ios-build.yml` 来自定义构建流程。

## 🚨 常见问题

### Q: 构建失败怎么办？
A: 查看GitHub Actions的日志，常见问题：
- Node.js依赖安装失败：检查package.json
- iOS构建失败：检查Capacitor配置
- 签名失败：检查证书和配置文件

### Q: 如何下载IPA文件？
A: 
1. 进入GitHub仓库的Actions页面
2. 点击最新的成功构建
3. 在Artifacts部分下载IPA文件

### Q: 可以不配置证书吗？
A: 可以！Debug构建不需要证书，可以用于开发测试。只有发布到App Store才需要配置证书。

### Q: 构建需要多长时间？
A: 通常5-15分钟，取决于项目大小和GitHub Actions的队列情况。

## 📱 测试应用

### 使用iOS模拟器
```bash
# 本地运行（需要macOS）
npx cap run ios
```

### 使用浏览器预览
```bash
# 启动开发服务器
ionic serve
```

## 🎯 下一步

1. **推送代码**：将项目推送到GitHub
2. **查看构建**：在Actions页面查看自动构建
3. **配置证书**：如需发布，配置Apple开发者证书
4. **下载IPA**：从Artifacts下载构建好的应用

---

## 📞 支持

如果遇到问题，可以：
- 查看GitHub Actions的构建日志
- 检查Capacitor和Ionic的官方文档
- 确认Apple开发者账户配置正确

**祝你构建成功！** 🎉