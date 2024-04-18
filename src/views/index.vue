<Header v-if="state.show">
    <!-- logo -->
    <span class="logo">
      <a href="https://github.com/missxiaolin" target="_blank">
        <Icon type="logo-github" :size="30" />
      </a>
    </span>
    <!-- 导入 -->
    <import-files></import-files>
    <Divider type="vertical" />
    <import-file></import-file>
    <Divider type="vertical" />
    <!-- 标尺开关 -->
    <Tooltip :content="$t('grid')">
      <iSwitch
        v-model="state.ruler"
        size="small"
        class="switch"
        @on-change="rulerSwitch"
      ></iSwitch>
    </Tooltip>
    <Divider type="vertical" />
    <history></history>
    <div class="top-right">
      <!-- 预览 -->
      <previewCurrent />
      <waterMark />
      <save></save>
      <lang></lang>
    </div>
  </Header>





  <Content style="display: flex; height: calc(100vh - 64px)">
    <!-- 左侧菜单 -->
    <div
      v-if="state.show"
      :class="`left-bar ${state.toolsBarShow && 'show-tools-bar'}`"
    >
      <Menu
        :active-name="state.menuActive"
        accordion
        @on-select="showToolsBar"
        width="65px"
      >
        <MenuItem :name="1" class="menu-item">
          <Icon type="md-book" size="24" />
          <div>模版</div>
        </MenuItem>
        <MenuItem :name="2" class="menu-item">
          <Icon type="md-images" size="24" />
          <div>元素</div>
        </MenuItem>
        <MenuItem :name="3" class="menu-item">
          <Icon type="ios-keypad-outline" size="24" />
          <div>工具</div>
        </MenuItem>
        <MenuItem :name="4" class="menu-item">
          <Icon type="md-reorder" size="24" />
          <div>图层</div>
        </MenuItem>
      </Menu>
      <div class="content" v-show="state.toolsBarShow">
        <!-- 生成模板 -->
        <div v-show="state.menuActive === 1" class="left-panel">
          <import-tmpl></import-tmpl>
        </div>
        <!-- 常用元素 -->
        <div v-show="state.menuActive === 2" class="left-panel">
          <tools></tools>
        </div>
        <!-- 工具 -->
        <div v-show="state.menuActive === 3" class="left-panel">
          <tool />
        </div>
        <!-- 图层 -->
        <div v-show="state.menuActive === 4" class="left-panel">
          <layer></layer>
        </div>
      </div>

      <!-- 关闭按钮 -->
      <div
        class="close-btn"
        v-show="state.toolsBarShow"
        @click="hideToolsBar"
      ></div>
    </div>

    
    <!-- 画布区域 -->
    <div
      id="workspace"
      style="width: 100%; position: relative; background: #f1f1f1"
    >
      <div class="canvas-box">
        <div class="inside-shadow"></div>
        <canvas
          id="canvas"
          :class="state.ruler ? 'design-stage-grid' : ''"
        ></canvas>
        <dragMode></dragMode>
        <zoom></zoom>
      </div>
    </div>
    <!-- 属性区域 380-->
    <div class="right-bar" v-show="state.attrBarShow">
      <div v-if="state.show" style="padding-top: 10px">
        <set-size></set-size>
        <bg-bar></bg-bar>
        <group></group>
        <replaceImg></replaceImg>
        <filters></filters>
        <!-- 二维码 && 条形码 -->
        <codeInput></codeInput>
        <div class="attr-item">
          <lock></lock>
          <dele></dele>
          <clone></clone>
        </div>
        
        <!-- 组对齐方式 -->
        <align></align>
        <!-- 居中对齐 -->
        <center-align></center-align>
        <!-- 翻转 -->
        <flip></flip>
      </div>
      <attribute v-if="state.show"></attribute>
    </div>
    <!-- 右侧关闭按钮 -->
    <div
      :class="`close-btn right-btn ${
        state.attrBarShow && 'right-btn-open'
      }`"
      @click="switchAttrBar"
    ></div>
  </Content>