# Dodo Payments 训练包买断接入

## 当前范围

现有 /sudoku-practice 提供买断流程。开启付费配置时，裸单、隐单和区块排除各提供 1 道免费练习，服务端确认购买后开放全部 12 道。默认模式保留当前的 12 道免费练习。没有新增公开页面或改动站点地图。

支付使用 Dodo 托管结账。购买者用 Supabase 验证邮箱验证码，同一邮箱可跨设备恢复。训练包原始题目已存在历史提交中，付费控制的是站内训练访问。过去公开的题目不能视为具有内容保密性。

## 测试环境配置

1. 在 Dodo Payments 测试模式建一个单次付款商品，填写测试价格和币种，记录商品 ID。结账使用这个商品的后台价格。
2. 在测试 Supabase 项目的 SQL Editor 执行 scripts/sudoku-training-payments.sql。启用邮箱登录，在验证码邮件模板中包含 {{ .Token }}。真实公开发送前配置邮件投递服务并验证送达。
3. 为测试部署设置下列变量。API 密钥、签名密钥和 Supabase 服务角色密钥仅填写在部署平台的服务端环境变量中。

| 变量 | 测试值或来源 |
| --- | --- |
| DODO_TRAINING_MODE | test_mode。未设置或设为 disabled 时沿用免费训练。 |
| DODO_PAYMENTS_API_KEY | Dodo 测试 API Key |
| DODO_TRAINING_PRODUCT_ID | pdt_0NsLi4yQTx8wyPcfz3fv8（站主提供的测试商品 ID） |
| DODO_WEBHOOK_KEY | Dodo 测试 Webhook 签名密钥 |
| SUDOKU_SITE_URL | 可公开访问的测试站点源地址，用于回跳 |
| NEXT_PUBLIC_SUPABASE_URL | 测试 Supabase 项目 URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | 同一项目公开的匿名或发布密钥，需在构建前配置 |
| SUPABASE_SERVICE_ROLE_KEY | 同一项目服务端服务角色密钥 |

4. 在 Dodo 测试后台添加 Webhook，地址为测试站点加 /api/webhooks/dodo。订阅 payment.succeeded、refund.succeeded、dispute.accepted、dispute.lost。用同一模式的签名密钥。部署后测试访客、验证码、取消、完成支付、刷新解锁、第二台设备恢复和全额退款。
5. 测试通过后，再用独立的正式商品、密钥、Webhook 与正式站点配置切换 live_mode。测试订单权限与正式订单资料按模式隔离。已开出的结账链接可能与并行标签页中的链接同时存在，正式收费前应验证并补上同一账号的并行结账去重。

## 验收

### 双入口测试

测试环境增加 `/pricing`，练习页的购买区继续提供结账入口。计划售价为 US$6.90，实际测试扣款金额由 Dodo 后台测试商品决定。现阶段解锁现有 12 道测试题，正式 90 道付费题仍待完成。

1. 价格页从未验证邮箱开始。提交验证码后进入 Dodo，付款成功或取消后回到价格页购买区。
2. 在练习页切到第二种技巧再购买。支付成功或取消后应回到这一组题。回来早于付款通知时显示等待，并允许刷新权限。
3. 购买成功后重新打开价格页。应显示开始训练入口。用无痕窗口和原邮箱测试恢复，确认恢复操作不会发起结账。
4. 使用测试订单全额退款，验证原邮箱刷新后付费内容重新锁定，再验证同一账号可以创建新结账。

### 并行结账防重

部署防重版本前，先在对应 Supabase 项目的 SQL Editor 执行 `scripts/sudoku-training-checkout-lock.sql`。它只新增结账表，可以重复执行。已有购买记录保留。未建表时新结账会失败。

用同一个未购买账号在价格页和练习页同时点购买。验收时只打开结账，先别提交卡片。两次请求最多创建一个 Dodo 结账。第二个请求可能收到正在创建的提示，稍后再试会复用已生成的链接。复用时沿用第一次创建时的回跳位置。确认拒付、取消或全额退款后，可创建新的结账。

如果 Dodo 创建请求超时或创建成功后本地未能保存，系统保留占位记录。管理员需在同一模式核对该账号、训练包和创建时间，确认没有仍可付款的结账后再清理相应记录。单凭超时不能判断结账是否已创建。此防护覆盖部署后通过本接口创建的结账，部署前已发出的链接需另行核对。


- Passed — node scripts/verify-training-payments.cjs 在模拟订单接口和数据库下，用 Dodo SDK 实际校验签名。覆盖默认免费、未登录拒绝结账、测试订单隔离、取消、成功、重复通知、部分退款、全额撤销和延迟成功通知。
- Passed — TypeScript、生产构建、标准数独 300 盘和 12 道训练题回归。
- Not run — Dodo 测试后台的真实结账、订单通知投递、Supabase SQL 执行、邮箱实际收码和跨设备恢复。正式收费尚未启用。

参考 Dodo 官方开发入口 https://docs.dodopayments.com/developer-resources/build-with-ai-coding-agents
参考 Supabase 邮箱验证码 https://supabase.com/docs/guides/auth/auth-email-passwordless

本地生产 HTTP 已验证默认模式返回 12 道题，结账和 Webhook 返回未启用状态。
