<template>
  <div class="navtab__main-container"
    :class="{ active: $route.path.includes(to)}"
    @click="onNavClick(to)">
    <!-- <router-link :to="to">{{ label }}</router-link> -->
    <span>{{ label }}</span>
    <b-badge v-if="showBadge" variant="info" class="ml-2 custom-badge" >{{ count }}</b-badge>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String
    },
    count: {
      type: Number,
      default: 0
    },
    to: {
      type: String
    },
    showBadge: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onNavClick(path) {
      if (this.$route.path !== path) this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
  .navtab__main-container {
    // border: solid 1px;
    margin-right: 5px;
    border-radius: 5px;
    display: flex;
    padding: 5px 10px;
    justify-content: space-between;
    // justify-content: center;
    align-items: center;

    &:hover {
      cursor: pointer;
      background-color: rgb(216, 239, 247);
    }

    &.active {
      background-color: lightblue;
      color: white;
      font-weight: bold;
    }
  }

  
</style>