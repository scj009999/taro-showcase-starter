import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useMemo, useState } from 'react'
import { categories, items } from '../../data/items'
import './index.scss'

export default function Index () {
  const [active, setActive] = useState('全部')

  const list = useMemo(
    () => (active === '全部' ? items : items.filter((item) => item.category === active)),
    [active]
  )

  const goDetail = (id: string) => {
    Taro.navigateTo({ url: `/pages/detail/index?id=${id}` })
  }

  return (
    <View className='page'>
      {/* 头部横幅：改这里的文案换掉首屏印象 */}
      <View className='hero'>
        <View className='hero-glow' />
        <View className='hero-inner'>
          <Text className='hero-eyebrow'>你的名字 · 作品集</Text>
          <Text className='hero-title'>作品橱窗</Text>
          <Text className='hero-desc'>
            这里放一句总述，说明这个展窗收的是什么。下面每张卡片是一个项目，点进去看详情。
          </Text>
          <View className='hero-pills'>
            <Text className='hero-pill'>小程序</Text>
            <Text className='hero-pill'>前端</Text>
            <Text className='hero-pill'>课程项目</Text>
          </View>
        </View>
      </View>

      <View className='wrap'>
        {/* 分类标签：值来自 src/data/items.ts 的 categories */}
        <View className='tabs'>
          {categories.map((item) => (
            <Text
              key={item}
              className={`tab ${active === item ? 'tab-on' : ''}`}
              onClick={() => setActive(item)}
            >
              {item}
            </Text>
          ))}
        </View>

        <View className='section-head'>
          <Text className='section-title'>全部作品</Text>
          <Text className='section-sub'>{list.length} 个</Text>
        </View>

        {/* 卡片列表 */}
        <View className='list'>
          {list.map((item) => (
            <View key={item.id} className='card item' onClick={() => goDetail(item.id)}>
              <View
                className='item-icon'
                style={{ background: `linear-gradient(135deg, ${item.from}, ${item.to})` }}
              >
                <Text className='item-icon-text'>{item.badge}</Text>
              </View>
              <View className='item-main'>
                <View className='item-top'>
                  <Text className='item-name'>{item.title}</Text>
                  <Text className='item-arrow'>›</Text>
                </View>
                <Text className='item-sub'>{item.subtitle}</Text>
                <View className='item-tags'>
                  {item.tags.map((tag) => (
                    <Text key={tag} className='item-tag'>
                      {tag}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* 关于入口 */}
        <View className='about-entry' onClick={() => Taro.navigateTo({ url: '/pages/about/index' })}>
          <View>
            <Text className='about-title'>关于与联系</Text>
            <Text className='about-sub'>我是谁 · 怎么找到我</Text>
          </View>
          <Text className='about-arrow'>›</Text>
        </View>

        <Text className='footer'>
          本页为模板示例内容，改 src/data/items.ts 即可全部替换。
        </Text>
      </View>
    </View>
  )
}
