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
