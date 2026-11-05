import { View, Text } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { useEffect } from 'react'
import { getItem } from '../../data/items'
import './index.scss'

export default function Detail () {
  const router = useRouter()
  const item = getItem(router.params.id || '')

  // 把导航栏标题改成当前条目的名字
  useEffect(() => {
    if (item) {
      Taro.setNavigationBarTitle({ title: item.title })
    }
  }, [item])

  // 找不到数据时给一个兜底页，避免白屏
  if (!item) {
    return (
      <View className='empty'>
        <Text className='empty-text'>没有找到这个条目</Text>
        <Text className='empty-btn' onClick={() => Taro.navigateBack()}>
          返回
        </Text>
      </View>
    )
  }

  return (
    <View className='detail'>
      {/* 头部：图标 + 标题 + 标签 */}
      <View className='head'>
        <View className='head-glow' />
        <View className='head-top'>
          <View
            className='head-icon'
            style={{ background: `linear-gradient(135deg, ${item.from}, ${item.to})` }}
          >
            <Text className='head-icon-text'>{item.badge}</Text>
          </View>
          <View className='head-info'>
            <Text className='head-name'>{item.title}</Text>
            <Text className='head-sub'>{item.subtitle}</Text>
          </View>
        </View>
        <View className='head-tags'>
          {item.tags.map((tag) => (
            <Text key={tag} className='head-tag'>
              {tag}
            </Text>
          ))}
        </View>
      </View>

      <View className='wrap'>
        <Text className='intro'>{item.summary}</Text>

        {/* 核心亮点。
            注意序号写法：`0${index + 1}`.slice(-2)
            小程序端不支持 String.prototype.padStart，用 slice(-2) 取末两位是等价写法。 */}
        <View className='section-head'>
          <Text className='section-title'>核心亮点</Text>
        </View>
        <View className='card points'>
          {item.highlights.map((text, index) => (
            <View key={text} className='point'>
              <Text className='point-no'>{`0${index + 1}`.slice(-2)}</Text>
              <Text className='point-text'>{text}</Text>
            </View>
          ))}
        </View>

        {/* 内容模块，双列排版 */}
        <View className='section-head'>
          <Text className='section-title'>内容模块</Text>
          <Text className='section-sub'>{item.sections.length} 项</Text>
        </View>
        <View className='grid'>
          {item.sections.map((section) => (
            <View key={section.title} className='card feature'>
              <Text className='feature-title'>{section.title}</Text>
              <Text className='feature-desc'>{section.desc}</Text>
            </View>
          ))}
        </View>

        {/* 适用场景 */}
        <View className='section-head'>
          <Text className='section-title'>适用场景</Text>
        </View>
        <View className='scenes'>
          {item.usages.map((usage) => (
            <Text key={usage} className='scene'>
              {usage}
            </Text>
          ))}
        </View>

        {/* 详细信息 */}
        <View className='section-head'>
          <Text className='section-title'>详细信息</Text>
        </View>
        <View className='card specs'>
          {item.details.map((row, index) => (
            <View key={row.label} className={`spec ${index === 0 ? 'spec-first' : ''}`}>
              <Text className='spec-label'>{row.label}</Text>
              <Text className='spec-value'>{row.value}</Text>
            </View>
          ))}
        </View>

        <Text className='tip'>想了解这个项目的实现思路？在「关于与联系」里找我。</Text>
      </View>

      {/* 底部固定操作条 */}
      <View className='bar'>
        <View className='bar-btn' onClick={() => Taro.navigateBack()}>
          <Text className='bar-btn-text'>返回</Text>
        </View>
        <View
          className='bar-btn bar-btn-primary'
          onClick={() => Taro.navigateTo({ url: '/pages/about/index' })}
        >
          <Text className='bar-btn-text'>联系我</Text>
        </View>
      </View>
    </View>
  )
}
