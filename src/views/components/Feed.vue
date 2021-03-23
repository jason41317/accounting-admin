<template>
  <div class="feed__main-container">
    <div class="feed__info-container">
      <Avatar 
        :text="feed.user.name.charAt(0)" 
        :avatarId="feed.user.id" 
        :width="48" 
        :height="48"
        class="feed__avatar"
        :textSize="14" />
      <div class="feed__info">
        <div class="feed__description">{{ feed.description }}</div>
        <div class="feed__sub-info">
          <div class="feed__sub-info-user"><v-icon name="user" height="8px" /> {{ feed.user.name }}</div>
          <div class="feed__sub-info-time"><v-icon name="calendar"  height="8px" />  {{ $options.format(new Date(feed.txnDate), 'EEE, MMM dd yyyy HH:mm aa') }}</div>
        </div>
        
      </div>
    </div>
    

    <div class="divider"></div>
  </div>
</template>

<script>
import Avatar from "./Avatar";
import { format } from "date-fns";
export default {
  format,
  props: {
    feed: Object
  },
  components: {
    Avatar
  }
}
</script>

<style lang="scss" scoped>
  .feed__main-container {
    width: 100%;
    height: auto;
  }
  
  .feed__info-container {
    display: flex;
    align-items: center;
  }

  .divider {
    border-bottom: dotted 1px rgb(180, 177, 177);
    margin: 10px 0;
  }

  .feed__avatar {
    min-width: 50px;
    min-height: 50px;
  }

  .feed__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 8px;
    
  
    .feed__description {
      font-size: 8pt;
    }

    .feed__sub-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7pt;
      color: rgb(136, 134, 134);
      width: 100%;
      margin-top: 5px;
      
      .feed__sub-info-user {
        text-align: left;
      }
      
      .feed__sub-info-time {
        text-align: right;
      }

    }

    
  }
</style>