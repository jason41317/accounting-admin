import 'core-js/stable'
import Vue from 'vue'
import App from './App'
import router from './router'
import CoreuiVue from '@coreui/vue'
import { iconsSet as icons } from './assets/icons/icons.js'
import store from './store'
import { httpRequest, httpAuthRequest } from './helpers/http'
import VueSmoothScroll from 'vue2-smooth-scroll'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import VueCurrencyInput from 'vue-currency-input'
import { MonthPicker } from 'vue-month-picker'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import VueApexCharts from 'vue-apexcharts'

Vue.use(VueApexCharts)
Vue.component('ApexChart', VueApexCharts)

import { CChartLine, CChartDoughnut } from '@coreui/vue-chartjs'
Vue.component('CChartLine', CChartLine)
Vue.component('CChartDoughnut', CChartDoughnut)


import { 
    CardPlugin, 
    ButtonPlugin, 
    FormInputPlugin, 
    TablePlugin, 
    PaginationPlugin,
    ModalPlugin, 
    FormPlugin, 
    FormGroupPlugin, 
    ToastPlugin,
    DropdownPlugin, 
    FormSelectPlugin,
    FormTextareaPlugin, 
    CollapsePlugin,
    TooltipPlugin,
    FormDatepickerPlugin,
    LayoutPlugin,
    ProgressPlugin,
    BadgePlugin,
    LinkPlugin,
    FormCheckboxPlugin  } from 'bootstrap-vue'

Vue.use(CardPlugin)
Vue.use(ButtonPlugin)
Vue.use(FormInputPlugin)
Vue.use(CoreuiVue)
Vue.use(TablePlugin)
Vue.use(PaginationPlugin)
Vue.use(ModalPlugin)
Vue.use(FormPlugin)
Vue.use(FormGroupPlugin)
Vue.use(ToastPlugin)
Vue.use(DropdownPlugin)
Vue.use(FormSelectPlugin)
Vue.use(FormTextareaPlugin)
Vue.use(CollapsePlugin)
Vue.use(TooltipPlugin)
Vue.use(FormDatepickerPlugin)
Vue.use(LayoutPlugin)
Vue.use(VueSmoothScroll)
Vue.use(MonthPicker)
Vue.use(ProgressPlugin)
Vue.use(BadgePlugin)
Vue.use(LinkPlugin)
Vue.use(FormCheckboxPlugin)


import 'vue-awesome/icons/spinner'
import 'vue-awesome/icons/check'
import 'vue-awesome/icons/save'
import 'vue-awesome/icons/window-close'
import 'vue-awesome/icons/sync'
import 'vue-awesome/icons/trash'
import 'vue-awesome/icons/plus'
import 'vue-awesome/icons/plus-circle'
import 'vue-awesome/icons/pencil-alt'
import 'vue-awesome/icons/ellipsis-v'
import 'vue-awesome/icons/caret-left'
import 'vue-awesome/icons/caret-down'
import 'vue-awesome/icons/search'
import 'vue-awesome/icons/archive'
import 'vue-awesome/icons/times-circle'
import 'vue-awesome/icons/times'
import 'vue-awesome/icons/file-image'
import 'vue-awesome/icons/spinner'
import 'vue-awesome/icons/chevron-left'
import 'vue-awesome/icons/info-circle'
import 'vue-awesome/icons/rss-square'
import 'vue-awesome/icons/rss'
import 'vue-awesome/icons/user'
import 'vue-awesome/icons/calendar'
import 'vue-awesome/icons/cogs'
import 'vue-awesome/icons/address-card'

// import { MonthPickerInput } from 'vue-month-picker'

import Icon from 'vue-awesome/components/Icon'
Vue.component('v-icon', Icon)
Vue.component('v-select', vSelect)
Vue.component('v-autonumeric', require('vue-autonumeric'))
Vue.component('loading', Loading)
Vue.use(VueCurrencyInput, {
  globalOptions: {
    valueAsInteger: false,
    distractionFree: true,
    precision: 2,
    autoDecimalMode: false,
    valueRange: { min: 0 },
    allowNegative: false,
    currency: null
  },
  componentName: 'v-currency',
})

Vue.config.performance = true
Vue.prototype.$log = console.log.bind(console)
Vue.prototype.$http = httpRequest
Vue.prototype.$authHttp = httpAuthRequest

new Vue({
  el: '#app',
  router,
  store,
  icons,
  template: '<App/>',
  components: {
    App
  }
})
