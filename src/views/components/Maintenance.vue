<template>
  <div class="maintenance__main-container">
    <MaintenanceSvg class="maintenance-svg"/>
    <div class="message">
      Please bear with us, this feature is coming soon...
      <p class="text-right"> - Team JDEV </p>
    </div>
  </div>
</template>

<script>
import MaintenanceSvg from '../../assets/svg/Maintenance.svg'
export default {
  components: {
    MaintenanceSvg
  }
}
</script>

<style lang="scss" scoped>
  .maintenance__main-container {
    height: 100%;
    width: 100%;
    display: flex; 
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  
  .maintenance-svg {
    width: 65%;
    height: 65%;
  }

  .message {
    font-size: 16pt;

    p {
      font-size: 12pt;
      font-weight: bold;
    }
  }

  
</style>