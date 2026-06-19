# 租赁商品部署文档

## 1. 环境准备

### 1.1 前置要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### 1.2 安装依赖

```bash
npm install
```

## 2. 商品图片配置

### 2.1 图片存储方案

本项目使用外部图片托管服务，生产环境建议使用：

- 阿里云 OSS
- 腾讯云 COS
- 七牛云存储
- AWS S3

### 2.2 开发环境图片配置

开发环境使用 Picsum Photos 提供占位图片，图片规格建议为 **400x300** 像素。

#### 推荐图片尺寸

| 用途 | 宽度 | 高度 | 格式 |
|------|------|------|------|
| 商品列表缩略图 | 200px | 150px | JPG/WebP |
| 商品详情主图 | 800px | 600px | JPG/WebP |
| 商品详情副图 | 400px | 300px | JPG/WebP |
| 移动端适配图 | 300px | 225px | JPG/WebP |

### 2.3 示例商品图片

#### 礼服类

```typescript
// 高档婚纱礼服
images: [
  'https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=400&h=300&fit=crop'
]

// 晚礼服
images: [
  'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=300&fit=crop'
]
```

#### 西装类

```typescript
// 商务西装
images: [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
]
```

#### 古装类

```typescript
// 汉服
images: [
  'https://images.unsplash.com/photo-151974583挤压-X?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-151974583挤压-X?w=400&h=300&fit=crop'
]
```

### 2.4 配置图片环境变量

创建 `.env` 文件：

```env
# 图片服务配置
VITE_IMAGE_BASE_URL=https://your-oss-endpoint.aliyuncs.com
VITE_IMAGE_CDN_URL=https://your-cdn-domain.com

# 图片压缩配置
VITE_IMAGE_QUALITY=85
VITE_IMAGE_MAX_SIZE=2048
```

### 2.5 上传图片 API 示例

```typescript
// src/api/upload.ts
import axios from 'axios'

export interface UploadResponse {
  url: string
  filename: string
  size: number
}

export const uploadImage = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await axios.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response.data.data
}
```

## 3. 规格种子数据

### 3.1 商品规格配置

#### 礼服类规格

```typescript
const礼服Specifications = {
  尺码: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  颜色: ['白色', '香槟色', '红色', '粉色', '蓝色'],
  材质: ['丝绸', '蕾丝', '缎面', '纱质']
}
```

#### 西装类规格

```typescript
const西装Specifications = {
  尺码: ['165/88A', '170/92A', '175/96A', '180/100A', '185/104A', '190/108A'],
  颜色: ['黑色', '深灰', '藏青', '棕色'],
  面料: ['羊毛', '聚酯纤维', '毛涤']
}
```

#### 古装类规格

```typescript
const古装Specifications = {
  尺码: ['S', 'M', 'L', 'XL'],
  颜色: ['红色', '蓝色', '紫色', '金色'],
  风格: ['汉服', '旗袍', '唐装']
}
```

### 3.2 完整商品种子数据

```typescript
// api/data/seeds.ts

export const seedProducts = [
  {
    id: 1,
    name: '高档婚纱礼服租赁',
    brand: '其他',
    model: 'WM-2024-001',
    category: '礼服',
    subCategory: '婚纱',
    description: '纯手工刺绣，适合婚礼、晚宴等正式场合',
    price: 299.00,
    stock: 5,
    status: 'online',
    images: [
      'https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=400&h=300&fit=crop'
    ],
    specifications: [
      { label: '尺码', value: 'S/M/L/XL' },
      { label: '颜色', value: '白色' },
      { label: '材质', value: '蕾丝+丝绸' }
    ],
    attributes: {
      origin: '中国',
      material: '蕾丝+丝绸',
      washingInstructions: '干洗',
      weight: 2.5
    },
    rentalConfig: {
      minimumQuantity: 1,
      rentalMethod: 'daily',
      minimumRentalTime: '1day',
      tieredPricingEnabled: true,
      tieredPrices: [
        { minDays: 1, maxDays: 3, pricePerDay: 299, discount: 0 },
        { minDays: 4, maxDays: 7, pricePerDay: 259, discount: 13 }
      ],
      depositConfig: {
        baseAmount: 500,
        suggestedAmount: 800,
        maxWaiveAmount: 200,
        tiers: [
          { level: 'normal', amount: 500, description: '正常押金', damageRatio: 0 },
          { level: 'minor', amount: 300, description: '轻微损坏押金', damageRatio: 0.1 },
          { level: 'moderate', amount: 800, description: '一般损坏押金', damageRatio: 0.3 }
        ]
      }
    },
    createTime: '2024-01-15T10:30:00Z',
    updateTime: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    name: '商务西装套装',
    brand: '雅戈尔',
    model: 'BS-2024-005',
    category: '西装',
    subCategory: '商务西装',
    description: '经典黑色修身剪裁，适合商务会议、面试等场合',
    price: 150.00,
    stock: 12,
    status: 'online',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
    ],
    specifications: [
      { label: '尺码', value: '170/88A' },
      { label: '颜色', value: '黑色' },
      { label: '面料', value: '羊毛' }
    ],
    rentalConfig: {
      minimumQuantity: 1,
      rentalMethod: 'daily',
      minimumRentalTime: '1day',
      tieredPricingEnabled: true,
      tieredPrices: [
        { minDays: 1, maxDays: 7, pricePerDay: 150, discount: 0 },
        { minDays: 8, maxDays: 30, pricePerDay: 120, discount: 20 }
      ],
      depositConfig: {
        baseAmount: 300,
        suggestedAmount: 500,
        maxWaiveAmount: 100,
        tiers: [
          { level: 'normal', amount: 300, description: '正常押金', damageRatio: 0 }
        ]
      }
    },
    createTime: '2024-01-14T09:20:00Z',
    updateTime: '2024-01-14T09:20:00Z'
  },
  {
    id: 3,
    name: '汉服古装租赁',
    brand: '其他',
    model: 'HF-2024-003',
    category: '古装',
    subCategory: '汉服',
    description: '传统汉服，飘逸优雅，适合古风摄影、传统文化活动',
    price: 199.00,
    stock: 8,
    status: 'pending',
    images: [
      'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=400&h=300&fit=crop'
    ],
    specifications: [
      { label: '尺码', value: 'M/L/XL' },
      { label: '颜色', value: '红色' },
      { label: '风格', value: '汉服' }
    ],
    createTime: '2024-01-13T14:45:00Z',
    updateTime: '2024-01-13T14:45:00Z'
  },
  {
    id: 4,
    name: '晚礼服租赁',
    brand: '其他',
    model: 'WF-2024-008',
    category: '礼服',
    subCategory: '晚礼服',
    description: '奢华晚礼服，闪亮耀眼，适合舞会、派对、晚宴',
    price: 399.00,
    stock: 3,
    status: 'rejected',
    rejectReason: '商品图片不符合要求，请上传清晰的实物图片，避免使用网络素材图。',
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&h=600&fit=crop'
    ],
    createTime: '2024-01-12T16:00:00Z',
    updateTime: '2024-01-12T16:00:00Z'
  },
  {
    id: 5,
    name: '运动装备套装',
    brand: '其他',
    model: 'SP-2024-012',
    category: '运动',
    subCategory: '登山装备',
    description: '专业运动装备，包括登山包、帐篷等，适合户外活动',
    price: 89.00,
    stock: 20,
    status: 'offline',
    images: [
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop'
    ],
    createTime: '2024-01-11T11:30:00Z',
    updateTime: '2024-01-11T11:30:00Z'
  },
  {
    id: 6,
    name: '儿童表演服装',
    brand: '其他',
    model: 'KT-2024-015',
    category: '儿童',
    subCategory: '表演服',
    description: '可爱卡通造型，适合幼儿园表演、节日活动',
    price: 59.00,
    stock: 15,
    status: 'online',
    images: [
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&h=600&fit=crop'
    ],
    createTime: '2024-01-10T13:15:00Z',
    updateTime: '2024-01-10T13:15:00Z'
  },
  {
    id: 7,
    name: '学位服套装',
    brand: '其他',
    model: 'XW-2024-018',
    category: '礼服',
    subCategory: '学位服',
    description: '学士、硕士、博士服，学位典礼专用',
    price: 49.00,
    stock: 50,
    status: 'pending',
    images: [
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop'
    ],
    createTime: '2024-01-09T08:00:00Z',
    updateTime: '2024-01-09T08:00:00Z'
  },
  {
    id: 8,
    name: 'cosplay服装道具套装',
    brand: '其他',
    model: 'CP-2024-020',
    category: '角色扮演',
    subCategory: '动漫服装',
    description: '热门动漫角色服装，高品质cosplay道具',
    price: 259.00,
    stock: 7,
    status: 'online',
    images: [
      'https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=800&h=600&fit=crop'
    ],
    createTime: '2024-01-08T20:30:00Z',
    updateTime: '2024-01-08T20:30:00Z'
  }
]

export const seedAuditAccounts = [
  {
    username: 'store_admin',
    password: 'Store@2024',
    role: 'store',
    level: 'store',
    name: '门店管理员',
    permissions: ['product.view', 'product.edit', 'product.audit']
  },
  {
    username: 'district_admin',
    password: 'District@2024',
    role: 'district',
    level: 'district',
    name: '区域经理',
    permissions: ['product.view', 'product.audit', 'product.reject']
  },
  {
    username: 'hq_admin',
    password: 'HQ@2024',
    role: 'headquarters',
    level: 'headquarters',
    name: '总部审核员',
    permissions: ['product.view', 'product.audit', 'product.reject', 'product.approve']
  }
]
```

### 3.3 初始化种子数据

```typescript
// api/utils/seed.ts
import { seedProducts, seedAuditAccounts } from '../data/seeds'

export const initializeDatabase = () => {
  // 初始化商品数据
  global.products = [...seedProducts]

  // 初始化审核账号
  global.auditAccounts = [...seedAuditAccounts]

  console.log('✅ 种子数据初始化完成')
  console.log(`📦 已加载 ${seedProducts.length} 个商品`)
  console.log(`👤 已加载 ${seedAuditAccounts.length} 个审核账号`)
}
```

## 4. 审核账号配置

### 4.1 账号角色说明

| 角色 | 账号 | 密码 | 权限说明 |
|------|------|------|----------|
| 门店管理员 | store_admin | Store@2024 | 商品查看、编辑、提交审核 |
| 区域经理 | district_admin | District@2024 | 商品审核、驳回 |
| 总部审核员 | hq_admin | HQ@2024 | 最终审核、批准、驳回 |

### 4.2 审核流程

```
门店员工创建商品
      ↓
门店管理员初审 (store)
      ↓
区域经理复审 (district)
      ↓
总部审核员终审 (headquarters)
      ↓
商品上架/驳回
```

### 4.3 测试账号登录

#### 门店管理员登录

```bash
# 登录请求
POST /api/auth/login
{
  "username": "store_admin",
  "password": "Store@2024",
  "role": "store"
}
```

#### 区域经理登录

```bash
POST /api/auth/login
{
  "username": "district_admin",
  "password": "District@2024",
  "role": "district"
}
```

#### 总部审核员登录

```bash
POST /api/auth/login
{
  "username": "hq_admin",
  "password": "HQ@2024",
  "role": "headquarters"
}
```

### 4.4 审核接口

#### 提交审核

```bash
POST /api/products/:id/submit-audit
Authorization: Bearer <token>
{
  "level": "store"
}
```

#### 审核操作

```bash
POST /api/products/:id/audit
Authorization: Bearer <token>
{
  "level": "store",
  "action": "approve",  // approve | reject
  "comment": "审核通过"
}
```

#### 驳回商品

```bash
POST /api/products/:id/audit
Authorization: Bearer <token>
{
  "level": "district",
  "action": "reject",
  "comment": "商品图片不符合要求，请上传清晰的实物图片"
}
```

## 5. 验收测试命令

### 5.1 启动开发服务器

#### 前端开发服务器

```bash
npm run client:dev
# 访问 http://localhost:5173
```

#### 后端 API 服务器

```bash
npm run server:dev
# 访问 http://localhost:3001
```

#### 同时启动前后端

```bash
npm run dev
```

### 5.2 运行单元测试

#### 运行所有测试

```bash
npm test
```

#### 运行特定测试文件

```bash
# 测试商品编辑功能
npm test -- tests/productEdit.test.ts

# 测试审核驳回功能
npm test -- tests/auditRejection.test.ts

# 测试押金配置功能
npm test -- tests/deposit.test.ts

# 测试租赁规则功能
npm test -- tests/rentalRules.test.ts

# 测试规格功能
npm test -- tests/specifications.test.ts
```

#### 运行测试并生成覆盖率报告

```bash
npm run test:coverage
```

#### 监听模式运行测试

```bash
npm test -- --watch
```

### 5.3 验收测试用例

#### 5.3.1 商品筛选功能测试

```bash
# 测试筛选栏组件
npm test -- tests/filterBar.test.ts

# 预期结果
✓ 应该正确显示所有状态标签
✓ 应该正确切换选中状态
✓ 应该正确筛选商品列表
```

#### 5.3.2 商品编辑功能测试

```bash
npm test -- tests/productEdit.test.ts

# 预期结果
✓ 应该正确编辑商品信息
✓ 应该正确更新商品价格
✓ 应该正确处理商品图片上传
✓ 应该正确验证必填字段
```

#### 5.3.3 审核流程测试

```bash
npm test -- tests/auditRejection.test.ts

# 预期结果
✓ 应该正确创建审核记录
✓ 应该正确显示审核状态
✓ 应该正确处理驳回操作
✓ 应该正确记录驳回原因
```

#### 5.3.4 押金配置测试

```bash
npm test -- tests/deposit.test.ts

# 预期结果
✓ 应该正确计算押金金额
✓ 应该正确应用押金减免规则
✓ 应该正确处理不同损坏程度
```

#### 5.3.5 租赁规则测试

```bash
npm test -- tests/rentalRules.test.ts

# 预期结果
✓ 应该正确计算租赁价格
✓ 应该正确应用阶梯定价
✓ 应该正确验证最小起租时间
```

#### 5.3.6 商品规格测试

```bash
npm test -- tests/specifications.test.ts

# 预期结果
✓ 应该正确添加商品规格
✓ 应该正确修改规格选项
✓ 应该正确处理规格组合
```

### 5.4 端到端验收测试

#### 5.4.1 商品创建流程

1. 登录门店管理员账号
2. 点击"新增商品"按钮
3. 填写商品基本信息
4. 上传商品图片
5. 配置商品规格
6. 设置租赁规则
7. 配置押金
8. 提交审核

#### 5.4.2 商品审核流程

1. 登录区域经理账号
2. 查看待审核商品列表
3. 点击商品查看详情
4. 进行初审操作
5. 登录总部审核员账号
6. 查看待终审商品
7. 进行终审操作
8. 商品上架成功

#### 5.4.3 驳回重提流程

1. 商品被驳回
2. 查看驳回原因
3. 修改商品信息
4. 重新上传图片
5. 再次提交审核

### 5.5 类型检查和代码规范

#### TypeScript 类型检查

```bash
npm run check
```

#### ESLint 代码检查

```bash
npm run lint
```

#### 自动修复代码规范问题

```bash
npm run lint:fix
```

### 5.6 构建生产版本

```bash
npm run build
```

### 5.7 验收检查清单

#### 功能验收

- [ ] 商品列表正常显示
- [ ] 筛选栏功能正常
- [ ] 商品编辑功能正常
- [ ] 商品图片上传正常
- [ ] 审核流程正常
- [ ] 驳回功能正常
- [ ] 批量操作正常
- [ ] 响应式布局正常

#### 测试验收

- [ ] 所有单元测试通过
- [ ] 类型检查通过
- [ ] ESLint 检查通过
- [ ] 代码覆盖率 > 80%

#### 性能验收

- [ ] 页面加载时间 < 3秒
- [ ] API 响应时间 < 500ms
- [ ] 无内存泄漏

## 6. 部署配置

### 6.1 生产环境变量

```env
# 生产环境配置
NODE_ENV=production
PORT=3001

# 数据库配置
DB_HOST=your-db-host
DB_PORT=3306
DB_NAME=rental_products
DB_USER=your-username
DB_PASSWORD=your-password

# 图片服务配置
VITE_IMAGE_BASE_URL=https://your-oss-endpoint.aliyuncs.com
VITE_IMAGE_CDN_URL=https://your-cdn-domain.com

# API 配置
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### 6.2 Docker 部署

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["node", "api/server.ts"]
```

### 6.3 Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
    restart: unless-stopped

  client:
    build: .
    ports:
      - "80:80"
    depends_on:
      - api
    restart: unless-stopped
```

## 7. 常见问题排查

### 7.1 图片加载失败

**问题**: 商品图片无法显示

**解决方案**:

1. 检查图片 URL 是否正确
2. 确认图片服务器是否可访问
3. 检查跨域配置
4. 验证图片格式和尺寸

### 7.2 审核接口 401 错误

**问题**: 审核接口返回 401 未授权

**解决方案**:

1. 检查登录状态是否过期
2. 确认 Token 是否正确传递
3. 验证账号权限是否足够

### 7.3 测试失败

**问题**: 单元测试运行失败

**解决方案**:

1. 查看详细错误信息
2. 检查测试数据是否正确
3. 确认 API 接口是否正常
4. 清理缓存重新运行: `npm test -- --clearCache`

## 8. 联系支持

如有部署问题，请联系技术支持团队。
