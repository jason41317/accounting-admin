<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
  // Import Main styles for this application
  @import 'assets/scss/style';

  // body {
  //   overflow: auto!important;;
  // }

  .breadcrumb {
    background-color: white!important;
  }

  .card-header,.card-footer {
    background-color: white!important;
    // border-color:  rgb(94, 93, 93)!important;
  }

  .card {
    -webkit-box-shadow: 0px 0px 8px 0.5px #757575;
    box-shadow: 0px 0px 8px 0.5px #757575;
  }


  .custom-table > table {
    thead tr th {
      height: 45px!important;
      text-transform: uppercase;
      color: rgb(94, 93, 93);
    }

    td {
      font-size: 11pt;
    }
  }

  .icon-tooltip {
    height: 14px;
    width: 14px;
    color: rgb(68, 185, 224);
    margin: 0 0 -1px 4px;
  }

  .custom-tooltip {
    z-index: 999999!important;
  }

  .custom-tooltip > .tooltip-inner{
    /* Removes the default max-width */
    max-width: none;
    
    padding: 10px;
  }

  .invalid-feedback {
    font-size: 9pt!important;
  }


  .vs__dropdown-menu {
    z-index: 999999!important;
    // top: 0;
    // left: 0;
    // position: sticky;
  }

  .v-select.drop-up.vs--open .vs__dropdown-toggle {
    border-radius: 0 0 4px 4px!important;
    border-top-color: transparent!important;
    border-bottom-color: rgba(60, 60, 60, 0.26)!important;
  }

  [data-popper-placement='top'] {
    border-radius: 4px 4px 0 0!important;
    border-top-style: solid!important;
    border-bottom-style: none!important;
    box-shadow: 0 -3px 6px rgba(0, 0, 0, 0.15)!important;
  }
</style>
