<template>
  <CSidebar 
    fixed 
    :minimize="minimize"
    :show="show"
    @update:show="(value) => $store.commit('set', ['sidebarShow', value])"
  >
    <CSidebarBrand class="d-md-down-none" to="/">
    <div class="c-sidebar-brand-full">
      <img class="logo" :src="`${basePath}logo.png`" />
      SMS Professionals
    </div>
    <img class="c-sidebar-brand-minimized logo" :src="`${basePath}logo.png`" />
      <!-- <CIcon 
        class="c-sidebar-brand-full" 
        name="logo" 
        size="custom-size" 
        :height="35" 
        viewBox="0 0 556 134"
      />
      <CIcon 
        class="c-sidebar-brand-minimized" 
        name="logo" 
        size="custom-size" 
        :height="35" 
        viewBox="0 0 110 134"
      /> -->
    </CSidebarBrand>

    <CRenderFunction flat :content-to-render="navItems"/>
    <CSidebarMinimizer
      class="d-md-down-none"
      @click.native="$store.commit('set', ['sidebarMinimize', !minimize])"
    />
  </CSidebar>
</template>

<script>
import Access from '../mixins/utils/Access'
import nav from './_nav'

export default {
  name: 'TheSidebar',
  nav,
  mixins: [Access],
  computed: {
    show () {
      return this.$store.state.sidebarShow 
    },
    minimize () {
      return this.$store.state.sidebarMinimize 
    },
    navItems() {
      // const nav = this.$options.nav
      const navItems = this.$options.nav.map(n => {
        const { _children, ...data } = n
        const children = _children.map(c => {
          let child = []
          const { items, ...data } = c
          // console.log(data)
          if (data.permissionIds) {
            if (this.isAccessible(data.permissionIds)) {
              child = data
            } else {
              child = []
            }
          } else {
            child = data
          }
          if (items) {
            const newItems = items.map(i => {
              if (i.permissionIds) {
                if (this.isAccessible(i.permissionIds)) {
                  return i
                }
                return []
              }
              return i
            })
            return {
              ...child,
              items: newItems
            }
          }
          return {
            ...child
          }
        })
        return {
          ...data,
          _children: children
        }
      })
      return navItems
    }
  },
  data() {
    return {
      basePath: process.env.VUE_APP_PUBLIC_PHOTO_URL
    }
  }
}
</script>

<style scoped>
  .logo {
    width: 50px;
    height: 50px;
  }
</style>