# Holdem Client (Cocos Creator 3.8.8 + TypeScript)

德州扑克（Texas Hold'em）H5 客户端工程骨架，面向商业化落地，支持多端发布：

- H5 浏览器
- Telegram Mini App
- Discord Activity
- 微信小游戏

> 客户端仅处理渲染与输入，牌局逻辑由服务端权威执行。

## 架构图（简化）

```text
+-----------------------------+
|        Cocos Client         |
|  UI / 动画 / 输入 / 状态同步 |
+--------------+--------------+
               |
         WebSocket(JSON->PB)
               |
+--------------v--------------+
|       Authoritative Server  |
| 发牌/结算/风控/反作弊/签名校验 |
+-----------------------------+
```

## 环境要求

- Node.js 20+
- npm 10+
- **Cocos Creator 3.8.8**

## 启动步骤

1. 克隆代码
   ```bash
   git clone https://github.com/ashlemon/holdem.git
   cd holdem
   ```
2. 安装依赖
   ```bash
   npm install
   ```
3. 用 Cocos Creator 3.8.8 打开项目目录
4. 运行 `assets/scenes/Boot.scene`（挂载 `App` 组件）

## 多端构建命令（占位）

```bash
# H5
make typecheck

# Telegram Mini App
make typecheck

# Discord Activity
make typecheck

# 微信小游戏
make typecheck
```

## 目录结构简述

- `assets/scripts/core`: 启动、日志、错误处理、事件总线
- `assets/scripts/network`: WS、重连、心跳、编解码、签名
- `assets/scripts/platform`: Telegram/Discord/Wechat/H5 适配
- `assets/scripts/framework`: UI/资源/音频管理
- `assets/scripts/modules`: login/lobby/game 业务代码
- `assets/scripts/utils`: Crypto/Storage
- `assets/resources/config/default.json`: 默认运行配置

## 资源获取说明

- 扑克牌来源：Wikimedia Commons（公版/CC0），见 `assets/bundles/game/textures/cards/README.md`
- 执行下载：
  ```bash
  bash scripts/fetch-assets.sh
  ```
- 头像：DiceBear 运行时动态请求（不预下载）
- 音效：建议 freesound.org / mixkit.co（不预下载）

## 后端协议简要说明

### 消息 ID

| MsgId | 含义 |
|---|---|
| 1001 | LOGIN_REQ |
| 1002 | LOGIN_RSP |
| 1003 | HEARTBEAT_REQ |
| 1004 | HEARTBEAT_RSP |
| 1005 | RECONNECT_REQ |
| 1101 | PLAYER_ACTION |
| 2001 | PUSH_TABLE_STATE |
| 2002 | PUSH_HOLE_CARDS |
| 2003 | PUSH_DEAL |
| 2004 | PUSH_TURN |
| 2005 | PUSH_SHOWDOWN |

### Envelope 结构

```json
{
  "msgId": 1001,
  "seq": 1,
  "payload": {},
  "timestamp": 1710000000000
}
```

- 当前编码：JSON（二进制 WebSocket 传输）
- 后续可切换到 `protobufjs` 编解码
