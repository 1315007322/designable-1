import React, { useMemo, useState } from 'react'
import ReactDOM from 'react-dom'
import {
  Designer,
  IconWidget,
  ToolbarWidget,
  Workspace,
  Viewport,
  OutlineTreeWidget,
  DragSourceWidget,
  MainPanel,
  CompositePanel,
  WorkspacePanel,
  ToolbarPanel,
  ViewportPanel,
  SettingsPanel,
} from '@designable/react'
import { SettingsForm } from '@designable/react-settings-form'
import { createEngine, registry } from '@designable/core'
import { Content } from './content'
import { Space, Button } from 'antd'
//import { Sandbox } from '@designable/react-sandbox'
import 'antd/dist/antd.less'
import './theme.less'

registry.registerDesignerProps({
  Root: {
    title: '表单',
  },
  Field: {
    draggable: true,
    inlineLayout: true,
    propsSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          title: '标题',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        'style.width': {
          type: 'string',
          title: '宽度',
          'x-decorator': 'FormItem',
          'x-component': 'SizeInput',
        },
        'style.height': {
          type: 'string',
          title: '高度',
          'x-decorator': 'FormItem',
          'x-component': 'SizeInput',
        },
        'style.color': {
          type: 'string',
          title: '文本颜色',
          'x-decorator': 'FormItem',
          'x-component': 'ColorInput',
        },
        'style.background': {
          type: 'string',
          title: '背景图片',
          'x-decorator': 'FormItem',
          'x-component': 'BackgroundImageInput',
        },
        hidden: {
          type: 'string',
          title: '是否隐藏',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
        },
        default: {
          title: '默认值',
          'x-decorator': 'FormItem',
          'x-component': 'ValueInput',
        },
        'style.margin': {
          title: 'Margin',
          'x-component': 'BoxStyleSetter',
        },
        'style.padding': {
          title: 'Padding',
          'x-component': 'BoxStyleSetter',
        },
      },
    },
  },
  Card: {
    title: '卡片',
    droppable: true,
    icon: 'Container',
    inlineChildrenLayout: true,
    allowAppend: (target, sources) =>
      sources.every((node) => node.componentName === 'Field'),
  },
})

registry.registerSourcesByGroup('form', [
  {
    componentName: 'Field',
    props: {
      title: '输入框',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
  },
  {
    componentName: 'Card',
    props: {
      title: '卡片',
      type: 'void',
      'x-decorator': 'FormItem',
      'x-component': 'Card',
    },
  },
])

const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', fontSize: 14 }}>
    <IconWidget
      infer="Logo"
      style={{ margin: 10, height: 24, width: 'auto' }}
    />
  </div>
)

const Actions = () => (
  <Space style={{ marginRight: 10 }}>
    <Button>保存</Button>
    <Button type="primary">发布</Button>
  </Space>
)

const App = () => {
  const [view, setView] = useState('design')
  const engine = useMemo(
    () =>
      createEngine({
        defaultComponentTree: [
          {
            componentName: 'Field',
            props: {
              title: '输入框',
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
          },
        ],
      }),
    []
  )

  return (
    <Designer engine={engine}>
      <MainPanel logo={<Logo />} actions={<Actions />}>
        <CompositePanel>
          <CompositePanel.Item
            title="组件"
            icon={<IconWidget infer="Component" />}
          >
            <DragSourceWidget title="输入控件" name="form" />
            <DragSourceWidget title="展示控件" name="form" />
            <DragSourceWidget title="反馈控件" name="form" />
          </CompositePanel.Item>
          <CompositePanel.Item
            title="大纲树"
            icon={<IconWidget infer="Outline" />}
          >
            <OutlineTreeWidget />
          </CompositePanel.Item>
        </CompositePanel>
        <Workspace id="form">
          <WorkspacePanel>
            <ToolbarPanel>
              <ToolbarWidget />
              <Button.Group>
                <Button
                  disabled={view === 'design'}
                  onClick={() => {
                    setView('design')
                  }}
                  size="small"
                >
                  <IconWidget infer="Design" />
                </Button>
                <Button
                  disabled={view === 'json'}
                  onClick={() => {
                    setView('json')
                  }}
                  size="small"
                >
                  <IconWidget infer="JSON" />
                </Button>
                <Button
                  disabled={view === 'code'}
                  onClick={() => {
                    setView('code')
                  }}
                  size="small"
                >
                  <IconWidget infer="Code" />
                </Button>
              </Button.Group>
            </ToolbarPanel>
            <ViewportPanel>
              {view === 'json' && <div>JSON 输入</div>}
              {view === 'design' && (
                <Viewport>
                  {/* <Sandbox
                    jsAssets={['./runtime.bundle.js', './sandbox.bundle.js']}
                  /> */}
                  <Content />
                </Viewport>
              )}
            </ViewportPanel>
          </WorkspacePanel>
        </Workspace>
        <SettingsPanel title="属性配置">
          <SettingsForm uploadAction="https://www.mocky.io/v2/5cc8019d300000980a055e76" />
        </SettingsPanel>
      </MainPanel>
    </Designer>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
