<template>
  <div class="approval__main-container">
    <div class="approval__header">
      <NavTab
        v-if="isAccessible($options.ApprovalPermissions.CONTRACT.id)"
        label="CONTRACTS" 
        to="/approvals/contracts"
        :count="10"
        :showBadge="false"/>
      <NavTab 
        v-if="isAccessible($options.ApprovalPermissions.DISBURSEMENT.id)"
        to="/approvals/disbursements"
        label="DISBURSEMENT" 
        :count="15" 
        :showBadge="false"/>
      <NavTab 
        v-if="isAccessible($options.ApprovalPermissions.COLLECTION.id)"
        to="/approvals/collections"
        label="COLLECTIONS" 
        :count="12" 
        :showBadge="false"/>
    </div>
    <div class="approval__content">
      <router-view></router-view>
    </div>
  </div>
</template>


<script>
import NavTab from '../components/NavTab'
import { ApprovalPermissions } from '../../helpers/enum'
import Access from '../../mixins/utils/Access'
export default {
  components: {
    NavTab
  },
  mixins: [Access],
  ApprovalPermissions,
  data() {
    return  {
      navActiveIndex: 0
    }
  },
  methods: {
    navClick(event, path) {
      console.log(event)
      this.navActiveIndex = event
      //this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
  .approval__main-container {
    width: 100%;
    min-height: 100%;
    border: solid 1px gray;
    display: flex;
    flex-direction: column;
    background-color: white;
  }

  .approval__header {
    height: 60px;
    border-bottom: solid 1px gray;
    display: flex;
    width: 100%;
    align-items: center;
    padding: 0 10px;
  }
  
  .approval__content {
    height: 100%;
    padding: 10px;
    // flex: 1;
  }

</style>