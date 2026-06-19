import { Router } from 'express'
import type { Request, Response } from 'express'

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  status: 'online' | 'pending' | 'rejected' | 'offline'
  images: string[]
  category: string
  createTime: string
  updateTime: string
}

const router = Router()

let products: Product[] = [
  {
    id: 1,
    name: '高档婚纱礼服租赁',
    description: '纯手工刺绣，适合婚礼、晚宴等正式场合',
    price: 299.00,
    stock: 5,
    status: 'online',
    images: ['https://picsum.photos/400/300?random=1'],
    category: '礼服',
    createTime: '2024-01-15T10:30:00Z',
    updateTime: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    name: '商务西装套装',
    description: '经典黑色修身剪裁，适合商务会议、面试等场合',
    price: 150.00,
    stock: 12,
    status: 'online',
    images: ['https://picsum.photos/400/300?random=2'],
    category: '西装',
    createTime: '2024-01-14T09:20:00Z',
    updateTime: '2024-01-14T09:20:00Z'
  },
  {
    id: 3,
    name: '汉服古装租赁',
    description: '传统汉服，飘逸优雅，适合古风摄影、传统文化活动',
    price: 199.00,
    stock: 8,
    status: 'pending',
    images: ['https://picsum.photos/400/300?random=3'],
    category: '古装',
    createTime: '2024-01-13T14:45:00Z',
    updateTime: '2024-01-13T14:45:00Z'
  },
  {
    id: 4,
    name: '晚礼服租赁',
    description: '奢华晚礼服，闪亮耀眼，适合舞会、派对、晚宴',
    price: 399.00,
    stock: 3,
    status: 'rejected',
    images: ['https://picsum.photos/400/300?random=4'],
    category: '礼服',
    createTime: '2024-01-12T16:00:00Z',
    updateTime: '2024-01-12T16:00:00Z'
  },
  {
    id: 5,
    name: '运动装备套装',
    description: '专业运动装备，包括登山包、帐篷等，适合户外活动',
    price: 89.00,
    stock: 20,
    status: 'offline',
    images: ['https://picsum.photos/400/300?random=5'],
    category: '运动',
    createTime: '2024-01-11T11:30:00Z',
    updateTime: '2024-01-11T11:30:00Z'
  },
  {
    id: 6,
    name: '儿童表演服装',
    description: '可爱卡通造型，适合幼儿园表演、节日活动',
    price: 59.00,
    stock: 15,
    status: 'online',
    images: ['https://picsum.photos/400/300?random=6'],
    category: '儿童',
    createTime: '2024-01-10T13:15:00Z',
    updateTime: '2024-01-10T13:15:00Z'
  },
  {
    id: 7,
    name: '学位服套装',
    description: '学士、硕士、博士服，学位典礼专用',
    price: 49.00,
    stock: 50,
    status: 'pending',
    images: ['https://picsum.photos/400/300?random=7'],
    category: '礼服',
    createTime: '2024-01-09T08:00:00Z',
    updateTime: '2024-01-09T08:00:00Z'
  },
  {
    id: 8,
    name: 'cosplay服装道具套装',
    description: '热门动漫角色服装，高品质cosplay道具',
    price: 259.00,
    stock: 7,
    status: 'online',
    images: ['https://picsum.photos/400/300?random=8'],
    category: '角色扮演',
    createTime: '2024-01-08T20:30:00Z',
    updateTime: '2024-01-08T20:30:00Z'
  }
]

router.get('/', (req: Request, res: Response) => {
  const { status, page = '1', pageSize = '10' } = req.query

  let filteredProducts = [...products]

  if (status && status !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.status === status)
  }

  const pageNum = parseInt(page as string)
  const size = parseInt(pageSize as string)
  const start = (pageNum - 1) * size
  const end = start + size
  const paginatedProducts = filteredProducts.slice(start, end)

  res.json({
    code: 200,
    message: 'success',
    data: {
      list: paginatedProducts,
      pagination: {
        page: pageNum,
        pageSize: size,
        total: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / size)
      }
    }
  })
})

router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params
  const product = products.find(p => p.id === parseInt(id))

  if (!product) {
    return res.status(404).json({
      code: 404,
      message: '商品不存在',
      data: null
    })
  }

  res.json({
    code: 200,
    message: 'success',
    data: product
  })
})

router.post('/', (req: Request, res: Response) => {
  const newProduct: Product = {
    id: products.length + 1,
    ...req.body,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  }

  products.push(newProduct)

  res.json({
    code: 200,
    message: '商品创建成功',
    data: newProduct
  })
})

router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params
  const index = products.findIndex(p => p.id === parseInt(id))

  if (index === -1) {
    return res.status(404).json({
      code: 404,
      message: '商品不存在',
      data: null
    })
  }

  products[index] = {
    ...products[index],
    ...req.body,
    updateTime: new Date().toISOString()
  }

  res.json({
    code: 200,
    message: '商品更新成功',
    data: products[index]
  })
})

router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params
  const index = products.findIndex(p => p.id === parseInt(id))

  if (index === -1) {
    return res.status(404).json({
      code: 404,
      message: '商品不存在',
      data: null
    })
  }

  products.splice(index, 1)

  res.json({
    code: 200,
    message: '商品删除成功',
    data: null
  })
})

router.put('/:id/status', (req: Request, res: Response) => {
  const { id } = req.params
  const { status } = req.body

  const index = products.findIndex(p => p.id === parseInt(id))

  if (index === -1) {
    return res.status(404).json({
      code: 404,
      message: '商品不存在',
      data: null
    })
  }

  if (!['online', 'offline'].includes(status)) {
    return res.status(400).json({
      code: 400,
      message: '无效的状态值',
      data: null
    })
  }

  products[index].status = status
  products[index].updateTime = new Date().toISOString()

  res.json({
    code: 200,
    message: '状态更新成功',
    data: products[index]
  })
})

router.post('/batch', (req: Request, res: Response) => {
  const { productIds, action } = req.body

  if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({
      code: 400,
      message: '请选择要操作的商品',
      data: null
    })
  }

  if (!['online', 'offline', 'delete'].includes(action)) {
    return res.status(400).json({
      code: 400,
      message: '无效的操作类型',
      data: null
    })
  }

  const results = []
  let successCount = 0
  let failCount = 0

  productIds.forEach(id => {
    const index = products.findIndex(p => p.id === id)

    if (index === -1) {
      results.push({
        productId: id,
        success: false,
        message: '商品不存在'
      })
      failCount++
      return
    }

    if (action === 'delete') {
      products.splice(index, 1)
    } else {
      products[index].status = action
      products[index].updateTime = new Date().toISOString()
    }

    results.push({
      productId: id,
      success: true
    })
    successCount++
  })

  res.json({
    code: 200,
    message: `批量操作完成，成功 ${successCount} 个，失败 ${failCount} 个`,
    data: {
      successCount,
      failCount,
      results
    }
  })
})

export default router
