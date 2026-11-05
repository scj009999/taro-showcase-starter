import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { site } from '../../data/site'
import './index.scss'

export default function About () {
  const copy = (value: string) => {
    if (!value || value === '待填写') {
      Taro.showToast({ title: '联系方式尚未填写', icon: 'none' })
      return
    }
    Taro.setClipboardData({ data: value })
  }

  return (
    <View className='about'>
      <View className='profile'>
        <View className='profile-glow' />
        <View className='avatar'>
          <Text className='avatar-text'>{site.owner.slice(-2)}</Text>
        </View>
        <Text className='profile-name'>{site.owner}</Text>
        <Text className='profile-role'>
          {site.role} · {site.city}
        </Text>
      </View>

      <View className='wrap'>
        <View className='card intro-card'>
          <Text className='intro-text'>{site.intro}</Text>
        </View>

        <View className='section-head'>
          <Text className='section-title'>我能做什么</Text>
        </View>
        <View className='services'>
          {site.services.map((item, index) => (
            <View key={item.title} className='card service'>
              <Text className='service-no'>{`0${index + 1}`.slice(-2)}</Text>
              <View className='service-main'>
                <Text className='service-title'>{item.title}</Text>
                <Text className='service-desc'>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View className='section-head'>
          <Text className='section-title'>联系方式</Text>
          <Text className='section-sub'>点一下复制</Text>
        </View>
        <View className='card contacts'>
          {site.contacts.map((item, index) => (
            <View
              key={item.label}
              className={`contact ${index === 0 ? 'contact-first' : ''}`}
              onClick={() => copy(item.value)}
            >
              <Text className='contact-label'>{item.label}</Text>
              <View className='contact-right'>
                <Text className={`contact-value ${item.value === '待填写' ? 'contact-empty' : ''}`}>
                  {item.value}
                </Text>
                <Text className='contact-copy'>复制</Text>
              </View>
            </View>
          ))}
        </View>

        <Text className='about-tip'>
          这里可以放一句补充说明：比如你现在找什么样的机会、希望什么样的合作，或者项目演示和技术细节怎么聊。
        </Text>

        <View className='back' onClick={() => Taro.navigateBack()}>
          <Text className='back-text'>返回</Text>
        </View>
      </View>
    </View>
  )
}
